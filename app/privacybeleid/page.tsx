import Link from "next/link";

export default function PrivacybeleidPage() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <Link href="/" className="legal-back">
          ← Terug naar Imperial Cabs
        </Link>

<div className="footer-column">
  <small>BEDRIJF</small>

  <span>Imperial Cabs B.V.</span>

  <span>KVK: 99325330</span>

  <span>Taxi Fleet Management</span>

  <span>Amsterdam &amp; omgeving</span>

  <Link href="/privacybeleid">
    Privacybeleid
  </Link>

  <Link href="/algemene-voorwaarden">
    Algemene voorwaarden
  </Link>
</div>

        <h1>
          Privacy<span>beleid.</span>
        </h1>

        <p className="legal-intro">
          Bij Imperial Cabs B.V. vinden wij het belangrijk dat zorgvuldig
          wordt omgegaan met jouw persoonsgegevens.
        </p>

        <section>
          <h2>1. Wie zijn wij?</h2>
          <p>
            Imperial Cabs B.V. is een taxi fleet management bedrijf dat
            professionele taxi-auto&apos;s en ondersteuning biedt aan
            chauffeurs in Amsterdam en omgeving.
          </p>
        </section>

        <section>
          <h2>2. Welke gegevens verzamelen wij?</h2>
          <p>
            Wanneer je contact met ons opneemt of je aanmeldt als chauffeur,
            kunnen wij onder andere je naam, telefoonnummer, e-mailadres en
            informatie die je zelf in je bericht verstrekt verwerken.
          </p>
        </section>

        <section>
          <h2>3. Waarvoor gebruiken wij deze gegevens?</h2>
          <p>
            Wij gebruiken deze gegevens om contact met je op te nemen,
            je aanvraag te beoordelen en informatie te verstrekken over
            de mogelijkheden van Imperial Cabs.
          </p>
        </section>

        <section>
          <h2>4. Hoe lang bewaren wij gegevens?</h2>
          <p>
            Wij bewaren persoonsgegevens niet langer dan noodzakelijk is
            voor het doel waarvoor deze zijn verzameld, tenzij een langere
            bewaartermijn wettelijk verplicht is.
          </p>
        </section>

        <section>
          <h2>5. Delen van gegevens</h2>
          <p>
            Wij delen persoonsgegevens niet zomaar met derden. Wanneer
            externe dienstverleners worden gebruikt voor bijvoorbeeld
            communicatie of technische verwerking, gebeurt dit alleen
            wanneer dit noodzakelijk is voor onze dienstverlening en
            volgens de toepasselijke regels.
          </p>
        </section>

        <section>
          <h2>6. Jouw rechten</h2>
          <p>
            Je hebt onder andere het recht om inzage te vragen in je
            persoonsgegevens, deze te laten corrigeren of onder bepaalde
            omstandigheden te laten verwijderen.
          </p>
        </section>

        <section>
          <h2>7. Contact</h2>
          <p>
            Heb je vragen over dit privacybeleid of over de verwerking
            van je persoonsgegevens? Neem dan contact met ons op via:
          </p>

          <p>
            <strong>info@imperialcabs.nl</strong>
            <br />
            <strong>+31 6 24562388</strong>
          </p>
        </section>

        <div className="legal-footer">
          <span>© 2026 Imperial Cabs B.V.</span>

          <Link href="/algemene-voorwaarden">
            Algemene voorwaarden →
          </Link>
        </div>
      </div>
    </main>
  );
}
