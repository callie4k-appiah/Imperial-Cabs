import { NextResponse } from "next/server";
import { Resend } from "resend";

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
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "RESEND_API_KEY ontbreekt in Vercel.",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const formData = await request.formData();

    const naam = formData.get("naam")?.toString().trim() || "";
    const telefoon = formData.get("telefoon")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const ervaring = formData.get("ervaring")?.toString().trim() || "";
    const bericht = formData.get("bericht")?.toString().trim() || "";

    if (!naam || !telefoon || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Vul alle verplichte velden in.",
        },
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: "Imperial Cabs <info@imperialcabs.nl>",
      to: ["info@imperialcabs.nl"],
      replyTo: email,
      subject: `Nieuwe chauffeur aanvraag - ${naam}`,

      html: `
        <!DOCTYPE html>
        <html lang="nl">
          <head>
            <meta charset="UTF-8" />
            <title>Nieuwe chauffeur aanvraag</title>
          </head>

          <body
            style="
              margin: 0;
              padding: 40px 20px;
              background: #f3f3f3;
              font-family: Arial, Helvetica, sans-serif;
              color: #111111;
            "
          >
            <div
              style="
                max-width: 650px;
                margin: 0 auto;
                background: #ffffff;
                padding: 40px;
                border-radius: 8px;
              "
            >
              <h1
                style="
                  margin: 0 0 10px;
                  font-size: 26px;
                "
              >
                Imperial <span style="color: #d4a63a;">Cabs</span>
              </h1>

              <p
                style="
                  margin: 0 0 30px;
                  color: #777777;
                  font-size: 14px;
                "
              >
                Nieuwe chauffeur aanvraag
              </p>

              <hr
                style="
                  border: 0;
                  border-top: 1px solid #eeeeee;
                  margin-bottom: 30px;
                "
              />

              <p>
                <strong>Naam</strong><br />
                ${escapeHtml(naam)}
              </p>

              <p>
                <strong>Telefoonnummer</strong><br />
                ${escapeHtml(telefoon)}
              </p>

              <p>
                <strong>E-mailadres</strong><br />
                ${escapeHtml(email)}
              </p>

              <p>
                <strong>Taxi-ervaring</strong><br />
                ${escapeHtml(ervaring || "Niet ingevuld")}
              </p>

              <p>
                <strong>Bericht</strong><br />
                ${
                  bericht
                    ? escapeHtml(bericht).replace(/\n/g, "<br />")
                    : "Geen bericht ingevuld."
                }
              </p>

              <hr
                style="
                  border: 0;
                  border-top: 1px solid #eeeeee;
                  margin: 30px 0;
                "
              />

              <p
                style="
                  margin: 0;
                  color: #888888;
                  font-size: 12px;
                "
              >
                Deze aanvraag is verstuurd via het chauffeurformulier
                van Imperial Cabs.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          message: "De aanvraag kon niet worden verzonden.",
          error: error.message || "Onbekende Resend-fout.",
        },
        { status: 500 }
      );
    }

    return NextResponse.redirect(
      new URL("/bedankt", request.url),
      303
    );
  } catch (error) {
    console.error("APPLICATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Er is iets misgegaan bij het versturen.",
        error:
          error instanceof Error
            ? error.message
            : "Onbekende fout.",
      },
      { status: 500 }
    );
  }
}
