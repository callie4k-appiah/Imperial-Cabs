import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "RESEND_API_KEY ontbreekt.",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const formData = await request.formData();

    const naam = formData.get("naam")?.toString() || "";
    const telefoon = formData.get("telefoon")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const ervaring = formData.get("ervaring")?.toString() || "";
    const bericht = formData.get("bericht")?.toString() || "";

    const { error } = await resend.emails.send({
      from: "Imperial Cabs <info@imperialcabs.nl>",
      to: ["info@imperialcabs.nl"],
      replyTo: email,
      subject: `Nieuwe chauffeur aanvraag - ${naam}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Nieuwe chauffeur aanvraag</h2>

          <p><strong>Naam:</strong> ${naam}</p>
          <p><strong>Telefoon:</strong> ${telefoon}</p>
          <p><strong>E-mailadres:</strong> ${email}</p>
          <p><strong>Taxi-ervaring:</strong> ${ervaring}</p>

          <h3>Bericht</h3>
          <p>${bericht || "Geen bericht ingevuld."}</p>

          <hr />

          <p>
            Deze aanvraag is verstuurd via het chauffeurformulier
            van Imperial Cabs.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "De aanvraag kon niet worden verzonden.",
        },
        { status: 500 }
      );
    }

    return NextResponse.redirect(
      new URL("/bedankt", request.url),
      303
    );
  } catch (error) {
    console.error("Application error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Er is iets misgegaan bij het versturen.",
      },
      { status: 500 }
    );
  }
}
