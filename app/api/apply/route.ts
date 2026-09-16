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

    /* =========================
       SUPABASE
    ========================= */

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

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
      console.error(
        "SUPABASE ERROR:",
        databaseError
      );

      return NextResponse.json(
        {
          error:
            "Aanvraag kon niet worden opgeslagen: " +
            databaseError.message,
        },
        { status: 500 }
      );
    }

    /* =========================
       RESEND
    ========================= */

    const resendApiKey =
      process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const resend = new Resend(
        resendApiKey
      );

      const safeNaam = escapeHtml(naam);
      const safeTelefoon =
        escapeHtml(telefoon);
      const safeEmail =
        escapeHtml(email);
      const safeErvaring =
        escapeHtml(
          ervaring === "ja"
            ? "Ja"
            : ervaring === "nee"
            ? "Nee"
            : ervaring
        );
      const safeBericht =
        escapeHtml(bericht);

      const { error: emailError } =
        await resend.emails.send({
          from:
            "Imperial Cabs <info@imperialcabs.nl>",

          to: [
            "info@imperialcabs.nl",
          ],

          replyTo: email,

          subject:
            `Nieuwe chauffeur-aanvraag: ${naam}`,

          html: `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Nieuwe chauffeur-aanvraag</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#111111;
    font-family:Arial,Helvetica,sans-serif;
    color:#ffffff;
  "
>

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background:#111111;padding:40px 20px;"
  >

    <tr>
      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width:680px;
            background:#1a1a1a;
            border:1px solid #b8902f;
          "
        >

          <!-- HEADER -->

          <tr>
            <td
              style="
                padding:42px 40px 32px;
                text-align:center;
                border-bottom:1px solid #333333;
              "
            >

              <div
                style="
                  font-size:30px;
                  font-weight:700;
                  letter-spacing:2px;
                "
              >
                <span style="color:#ffffff;">
                  IMPERIAL
                </span>

                <span style="color:#d9a72f;">
                  CABS
                </span>
              </div>

              <div
                style="
                  margin-top:14px;
                  color:#d9a72f;
                  font-size:13px;
                  font-weight:700;
                  letter-spacing:3px;
                  text-transform:uppercase;
                "
              >
                Nieuwe chauffeur aanvraag
              </div>

            </td>
          </tr>

          <!-- CONTENT -->

          <tr>
            <td
              style="
                padding:40px;
              "
            >

              <!-- NAAM -->

              <div
                style="
                  margin-bottom:28px;
                "
              >
                <div
                  style="
                    color:#d9a72f;
                    font-size:13px;
                    font-weight:700;
                    letter-spacing:1px;
                    text-transform:uppercase;
                    margin-bottom:7px;
                  "
                >
                  Naam
                </div>

                <div
                  style="
                    color:#ffffff;
                    font-size:19px;
                    font-weight:600;
                  "
                >
                  ${safeNaam}
                </div>
              </div>

              <!-- TELEFOON -->

              <div
                style="
                  margin-bottom:28px;
                "
              >
                <div
                  style="
                    color:#d9a72f;
                    font-size:13px;
                    font-weight:700;
                    letter-spacing:1px;
                    text-transform:uppercase;
                    margin-bottom:7px;
                  "
                >
                  Telefoonnummer
                </div>

                <a
                  href="tel:${safeTelefoon}"
                  style="
                    color:#ffffff;
                    font-size:17px;
                    text-decoration:none;
                  "
                >
                  ${safeTelefoon}
                </a>
              </div>

              <!-- EMAIL -->

              <div
                style="
                  margin-bottom:28px;
                "
              >
                <div
                  style="
                    color:#d9a72f;
                    font-size:13px;
                    font-weight:700;
                    letter-spacing:1px;
                    text-transform:uppercase;
                    margin-bottom:7px;
                  "
                >
                  E-mailadres
                </div>

                <a
                  href="mailto:${safeEmail}"
                  style="
                    color:#ffffff;
                    font-size:17px;
                    text-decoration:none;
                    word-break:break-word;
                  "
                >
                  ${safeEmail}
                </a>
              </div>

              <!-- ERVARING -->

              <div
                style="
                  margin-bottom:32px;
                "
              >
                <div
                  style="
                    color:#d9a72f;
                    font-size:13px;
                    font-weight:700;
                    letter-spacing:1px;
                    text-transform:uppercase;
                    margin-bottom:7px;
                  "
                >
                  Taxi-ervaring
                </div>

                <div
                  style="
                    color:#ffffff;
                    font-size:17px;
                  "
                >
                  ${safeErvaring}
                </div>
              </div>

              <!-- BERICHT -->

              <div
                style="
                  border-top:1px solid #333333;
                  padding-top:28px;
                "
              >

                <div
                  style="
                    color:#d9a72f;
                    font-size:13px;
                    font-weight:700;
                    letter-spacing:1px;
                    text-transform:uppercase;
                    margin-bottom:14px;
                  "
                >
                  Bericht
                </div>

                <div
                  style="
                    color:#eeeeee;
                    font-size:16px;
                    line-height:1.7;
                    white-space:pre-wrap;
                  "
                >
                  ${safeBericht}
                </div>

              </div>

            </td>
          </tr>

          <!-- FOOTER -->

          <tr>
            <td
              style="
                padding:25px 40px;
                border-top:1px solid #333333;
                text-align:center;
              "
            >

              <div
                style="
                  color:#888888;
                  font-size:13px;
                  line-height:1.6;
                "
              >
                Deze aanvraag is automatisch opgeslagen
                in het Imperial Cabs Admin Dashboard.
              </div>

              <div
                style="
                  margin-top:10px;
                  color:#666666;
                  font-size:12px;
                "
              >
                Imperial Cabs B.V. · Amsterdam &amp; omgeving
              </div>

            </td>
          </tr>

        </table>

      </td>
    </tr>

  </table>

</body>
</html>
          `,
        });

      if (emailError) {
        console.error(
          "RESEND ERROR:",
          emailError
        );
      }
    }

    /* =========================
       SUCCESS
    ========================= */

    return NextResponse.redirect(
      new URL(
        "/bedankt",
        request.url
      ),
      303
    );

  } catch (error) {
    console.error(
      "APPLICATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Er is een onverwachte fout opgetreden bij het verwerken van je aanvraag.",
      },
      { status: 500 }
    );
  }
}
