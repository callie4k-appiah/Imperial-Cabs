import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "../../../lib/supabase";

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

    // Controleer verplichte velden
    if (!naam || !telefoon || !email || !ervaring || !bericht) {
      return NextResponse.json(
        {
          error: "Vul alle verplichte velden in.",
        },
        { status: 400 }
      );
    }

    // 1. Aanvraag opslaan in Supabase
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
      console.error("Supabase application error:", databaseError);

      return NextResponse.json(
        {
          error:
            "De aanvraag kon niet worden opgeslagen. Probeer het opnieuw.",
        },
        { status: 500 }
      );
    }

    // 2. E-mail versturen via Resend
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error("RESEND_API_KEY ontbreekt.");
      return NextResponse.json(
        {
          error: "E-mailservice is niet ingesteld.",
        },
        { status: 500 }
      );
    }

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
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Nieuwe chauffeur-aanvraag</h2>

          <p><strong>Naam:</strong> ${safeNaam}</p>
          <p><strong>Telefoon:</strong> ${safeTelefoon}</p>
          <p><strong>E-mail:</strong> ${safeEmail}</p>
          <p><strong>Taxi-ervaring:</strong> ${safeErvaring}</p>

          <h3>Bericht</h3>
          <p>${safeBericht}</p>

          <hr />

          <p>
            Deze aanvraag is automatisch opgeslagen in het
            Imperial Cabs Admin Dashboard.
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend error:", emailError);

      // De aanvraag staat al in Supabase.
      // We geven toch een succesvolle redirect,
      // zodat de chauffeur niet opnieuw hoeft in te dienen.
    }

    // 3. Naar bedankpagina
    return NextResponse.redirect(
      new URL("/bedankt", request.url)
    );
  } catch (error) {
    console.error("Application error:", error);

    return NextResponse.json(
      {
        error: "Er is iets misgegaan. Probeer het opnieuw.",
      },
      { status: 500 }
    );
  }
}
