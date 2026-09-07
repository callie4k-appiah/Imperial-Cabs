import Link from "next/link";

export default function BedanktPage() {
  return (
    <main className="thank-you-page">
      <div className="thank-you-card">
        <div className="thank-you-logo">
          IMPERIAL <span>CABS</span>
        </div>

        <div className="thank-you-check">✓</div>

        <p className="thank-you-label">AANVRAAG ONTVANGEN</p>

        <h1>
          Bedankt voor je
          <span> aanvraag.</span>
        </h1>

        <p className="thank-you-text">
          We hebben je aanvraag goed ontvangen. Een medewerker van
          Imperial Cabs neemt zo snel mogelijk contact met je op.
        </p>

        <Link href="/" className="thank-you-button">
          Terug naar de website →
        </Link>
      </div>
    </main>
  );
}
