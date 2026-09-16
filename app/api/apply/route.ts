import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const naam = String(formData.get("naam") || "").trim();
    const telefoon = String(formData.get("telefoon") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const ervaring = String(formData.get("ervaring") || "").trim();
    const bericht = String(formData.get("bericht") || "").trim();

    if (!naam || !telefoon || !email || !ervaring || !bericht) {
      return NextResponse.json(
        {
          error: "Vul alle verplichte velden in.",
        },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          error: "Supabase configuratie ontbreekt.",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseKey
    );

    const { error: databaseError } = await supabase
      .from("applications")
      .insert({
        full_name: naam,
        phone: telefoon,
        email: email,
        experience: ervaring,
        message: bericht,
        status: "new",
      });

    if (databaseError) {
      console.error("SUPABASE ERROR:", databaseError);

      return NextResponse.json(
        {
          error:
            "Aanvraag kon niet worden opgeslagen: " +
            databaseError.message,
        },
        { status: 500 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      const safeNaam = escapeHtml(naam);
      const safeTelefoon = escapeHtml(telefoon);
      const safeEmail = escapeHtml(email);
      const safeErvaring = escapeHtml(ervaring);
      const safeBericht = escapeHtml(bericht);

      const { error: emailError } = await resend.emails.send({
        from: "Imperial Cabs <info@imperialcabs.nl>",
        to: ["info@imperialcabs.nl"],
        replyTo: email,
        subject: `Nieuwe chauffeur-aanvraag: ${naam}`,
        html: `
          <h2>Nieuwe chauffeur-aanvraag</h2>

          <p><strong>Naam:</strong> ${safeNaam}</p>
          <p><strong>Telefoon:</strong> ${safeTelefoon}</p>
          <p><strong>E-mail:</strong> ${safeEmail}</p>
          <p><strong>Taxi-ervaring:</strong> ${safeErvaring}</p>

          <h3>Bericht</h3>
          <p>${safeBericht}</p>
        `,
      });

      if (emailError) {
        console.error("RESEND ERROR:", emailError);
      }
    }

    return NextResponse.redirect(
      new URL("/bedankt", request.url),
      303
    );

  } catch (error) {
    console.error("APPLICATION ERROR:", error);

    return NextResponse.json(
      {
        error:
          "Er is een onverwachte fout opgetreden bij het verwerken van je aanvraag.",
      },
      { status: 500 }
    );
  }
}
