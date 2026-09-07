import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const experience = formData.get("experience")?.toString() || "";
    const message = formData.get("message")?.toString() || "";

    const { error } = await resend.emails.send({
      from: "Imperial Cabs <info@imperialcabs.nl>",
      to: ["info@imperialcabs.nl"],
      replyTo: email,
      subject: `Nieuwe chauffeur aanvraag - ${name}`,
      html: `
        <h2>Nieuwe chauffeur aanvraag</h2>

        <p><strong>Naam:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefoon:</strong> ${phone}</p>
        <p><strong>Ervaring:</strong> ${experience}</p>

        <h3>Bericht</h3>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          success: false,
          message: "E-mail kon niet worden verzonden.",
        },
        { status: 500 }
      );
    }

    return NextResponse.redirect(
      new URL("/bedankt", request.url),
      303
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Er is iets misgegaan.",
      },
      { status: 500 }
    );
  }
}
