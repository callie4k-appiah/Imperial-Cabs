import Link from "next/link";

export default function AlgemeneVoorwaardenPage() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <Link href="/" className="legal-back">
          ← Terug naar Imperial Cabs
        </Link>

        <div className="eyebrow">IMPERIAL CABS B.V.</div>

        <h1>
          Algemene <span>voorwaarden.</span>
        </h1>

        <p className="legal-intro">
          Deze algemene voorwaarden zijn van toepassing op de diensten
          en overeenkomsten van Imperial Cabs B.V.
        </p>

        <section>
          <h2>1. Algemeen</h2>
          <p>
            Imperial Cabs B.V. richt zich op taxi fleet management en het
            aanbieden van professionele taxi-auto&apos;s en bijbehorende
            ondersteuning aan chauffeurs.
          </p>
        </section>

        <section>
          <h2>2. Aanmelding</h2>
          <p>
            Een aanmelding via de website is een aanvraag en vormt niet
            automatisch een overeenkomst. Imperial Cabs beoordeelt iedere
            aanvraag afzonderlijk.
          </p>
        </section>

        <section>
          <h2>3. Voertuigen</h2>
          <p>
            Het beschikbare wagenpark en de beschikbaarheid van specifieke
            voertuigen kunnen variëren. De voorwaarden voor het gebruik van
            een voertuig worden vastgelegd in de overeenkomst die met de
            chauffeur wordt gesloten.
          </p>
        </section>

        <section>
          <h2>4. Verantwoordelijkheid van de chauffeur</h2>
          <p>
            De chauffeur is verantwoordelijk voor het naleven van de
            toepasselijke wet- en regelgeving en de voorwaarden van de
            platformen waarop hij of zij rijdt.
          </p>
        </section>

        <section>
          <h2>5. Platformen</h2>
          <p>
            Imperial Cabs is niet verantwoordelijk voor de voorwaarden,
            tarieven, beschikbaarheid of beslissingen van externe
            rijplatformen zoals Uber, Bolt of andere platformen.
          </p>
        </section>

        <section>
          <h2>6. Overeenkomst</h2>
          <p>
            Specifieke afspraken over het voertuig, gebruik, betalingen,
            verantwoordelijkheden en overige voorwaarden worden vastgelegd
            in de overeenkomst tussen Imperial Cabs B.V. en de chauffeur.
          </p>
        </section>

        <section>
          <h2>7. Wijzigingen</h2>
          <p>
            Imperial Cabs B.V. kan deze algemene voorwaarden wijzigen
            wanneer dit noodzakelijk is. De meest actuele versie wordt
            op deze pagina gepubliceerd.
          </p>
        </section>

        <section>
          <h2>8. Contact</h2>
          <p>
            Voor vragen over deze voorwaarden kun je contact opnemen met:
          </p>

          <p>
            <strong>Imperial Cabs B.V.</strong>
            <br />
            Amsterdam &amp; omgeving
            <br />
            info@imperialcabs.nl
            <br />
            +31 6 24562388
          </p>
        </section>

        <div className="legal-footer">
          <span>© 2026 Imperial Cabs B.V.</span>

          <Link href="/privacybeleid">
            Privacybeleid →
          </Link>
        </div>
      </div>
    </main>
  );
}
