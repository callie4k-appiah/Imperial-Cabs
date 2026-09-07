"use client";

import Link from "next/link";

const platforms = ["Uber", "Bolt", "Staxi", "Welcome Pickups"];

const benefits = [
  {
    number: "01",
    title: "Elektrische taxi-auto's",
    text: "Moderne elektrische auto's die geschikt zijn voor professioneel taxivervoer.",
  },
  {
    number: "02",
    title: "Alles goed geregeld",
    text: "Ondersteuning rondom het voertuig, zodat jij je kunt richten op het rijden.",
  },
  {
    number: "03",
    title: "Meerdere platforms",
    text: "Vergroot je mogelijkheden door actief te zijn op verschillende rijplatforms.",
  },
  {
    number: "04",
    title: "Persoonlijke ondersteuning",
    text: "Heb je een vraag of loop je ergens tegenaan? Wij staan voor je klaar.",
  },
];

const vehicles = [
  {
    name: "Kia e-Niro",
    image: "/kia-e-niro.jpg",
  },
  {
    name: "Hyundai IONIQ 5",
    image: "/hyundai-ioniq-5.jpg",
  },
  {
    name: "BYD ATTO 3",
    image: "/byd-atto-3.jpg",
  },
  {
    name: "Tesla Model Y",
    image: "/tesla-model-y.jpg",
  },
];

const steps = [
  {
    number: "01",
    title: "Meld je aan",
    text: "Vul het formulier in en vertel ons kort iets over jezelf.",
  },
  {
    number: "02",
    title: "Wij nemen contact op",
    text: "We bespreken je situatie en bekijken samen de mogelijkheden.",
  },
  {
    number: "03",
    title: "Kies je auto",
    text: "We bekijken welke elektrische auto het beste bij jou past.",
  },
  {
    number: "04",
    title: "Start met rijden",
    text: "Wanneer alles geregeld is, kun je professioneel aan de slag.",
  },
];

const faqs = [
  {
    question: "Met welke platforms kan ik rijden?",
    answer:
      "Je kunt onder andere rijden via Uber, Bolt, Staxi, Welcome Pickups en andere rijplatforms, afhankelijk van je situatie en de voorwaarden van de betreffende platforms.",
  },
  {
    question: "Welke auto's biedt Imperial Cabs aan?",
    answer:
      "Wij bieden verschillende elektrische auto's die geschikt zijn voor professioneel taxivervoer. Het aanbod kan variëren.",
  },
  {
    question: "Zijn de auto's op de website altijd beschikbaar?",
    answer:
      "Nee. De auto's op de website geven een indruk van de modellen die mogelijk beschikbaar zijn. Modellen en beschikbaarheid kunnen variëren.",
  },
  {
    question: "Waar zijn jullie actief?",
    answer:
      "Imperial Cabs richt zich momenteel op Amsterdam en omgeving.",
  },
  {
    question: "Kan ik mij aanmelden zonder taxi-ervaring?",
    answer:
      "Je kunt altijd je gegevens achterlaten. We bekijken vervolgens samen wat er nodig is om professioneel te kunnen starten.",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="site-nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            IMPERIAL<span>CABS</span>
          </Link>

          <div className="nav-links">
            <Link href="#voordelen">Voordelen</Link>
            <Link href="#wagenpark">Wagenpark</Link>
            <Link href="#hoe-het-werkt">Hoe het werkt</Link>
            <Link href="#faq">FAQ</Link>
          </div>

          <Link href="#aanmelden" className="nav-button">
            Word chauffeur
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <div className="eyebrow">TAXI FLEET MANAGEMENT</div>

            <h1>
              Rijd slimmer.
              <br />
              <span>Verdien meer.</span>
            </h1>

            <p>
              Professionele elektrische taxi-auto&apos;s en ondersteuning
              voor chauffeurs in Amsterdam &amp; omgeving.
            </p>

            <div className="hero-buttons">
              <Link href="#aanmelden" className="button gold-button">
                Word chauffeur →
              </Link>

              <Link
                href="#hoe-het-werkt"
                className="button outline-button"
              >
                Hoe het werkt
              </Link>
            </div>

            <div className="hero-status">
              <span>●</span>
              Nu chauffeurs gezocht in Amsterdam &amp; omgeving
            </div>
          </div>

          <div className="hero-image">
            <img
              src="/kia-e-niro.jpg"
              alt="Elektrische taxi-auto"
            />

            <div className="image-caption">
              <span>ELEKTRISCHE MOBILITEIT</span>
              <span>TAXI FLEET</span>
            </div>
          </div>
        </div>
      </section>

      <section className="platforms">
        <div className="container">
          <p className="small-heading">
            RIJ OP DE PLATFORMS DIE BIJ JOU PASSEN
          </p>

          <div className="platform-list">
            {platforms.map((platform) => (
              <div className="platform" key={platform}>
                {platform}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark" id="voordelen">
        <div className="container">
          <div className="section-intro">
            <div className="eyebrow">WAAROM IMPERIAL CABS?</div>

            <h2>
              Meer focus op
              <br />
              <span>jouw rit.</span>
            </h2>

            <p>
              Wij zorgen voor ondersteuning rondom je voertuig, zodat jij je
              kunt focussen op professioneel rijden.
            </p>
          </div>

          <div className="benefits">
            {benefits.map((benefit) => (
              <div className="benefit" key={benefit.number}>
                <span className="number">{benefit.number}</span>

                <h3>{benefit.title}</h3>

                <p>{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section fleet" id="wagenpark">
        <div className="container fleet-layout">
          <div className="fleet-text">
            <div className="eyebrow">ONS WAGENPARK</div>

            <h2>
              Elektrisch.
              <br />
              <span>Comfortabel &amp; betrouwbaar.</span>
            </h2>

            <p>
              Wij bieden verschillende elektrische auto&apos;s die geschikt
              zijn voor professioneel taxivervoer. Het beschikbare aanbod kan
              variëren, zodat we kunnen inspelen op de wensen en mogelijkheden
              van onze chauffeurs.
            </p>

            <Link href="#aanmelden" className="button black-button">
              Bekijk de mogelijkheden →
            </Link>
          </div>

          <div className="vehicle-area">
            <div className="vehicle-carousel">
              {vehicles.map((vehicle, index) => (
                <div className="vehicle-card" key={vehicle.name}>
                  <div className="vehicle-photo">
                    <img src={vehicle.image} alt={vehicle.name} />
                  </div>

                  <div className="vehicle-info">
                    <div>
                      <div className="vehicle-line" />

                      <h3>{vehicle.name}</h3>

                      <p>Volledig elektrisch</p>
                    </div>

                    <span>0{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="vehicle-navigation">
              <div className="vehicle-dots">
                {vehicles.map((vehicle, index) => (
                  <span
                    key={vehicle.name}
                    className={
                      index === 0
                        ? "vehicle-dot active"
                        : "vehicle-dot"
                    }
                  />
                ))}
              </div>

              <p>
                Modellen en beschikbaarheid kunnen variëren. Vraag ons naar de
                actuele mogelijkheden.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section dark" id="hoe-het-werkt">
        <div className="container">
          <div className="section-intro">
            <div className="eyebrow">ZO WERKT HET</div>

            <h2>
              Van aanvraag
              <br />
              naar <span>start.</span>
            </h2>
          </div>

          <div className="steps">
            {steps.map((step) => (
              <div className="step" key={step.number}>
                <span className="step-number">{step.number}</span>

                <h3>{step.title}</h3>

                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta-inner">
          <div>
            <div className="eyebrow dark-eyebrow">
              IMPERIAL CABS
            </div>

            <h2>
              Klaar om
              <br />
              <span>te starten?</span>
            </h2>

            <p>
              Laat je gegevens achter en ontdek wat Imperial Cabs voor jou kan
              betekenen.
            </p>
          </div>

          <Link href="#aanmelden" className="button black-button">
            Word chauffeur →
          </Link>
        </div>
      </section>

      <section className="section application" id="aanmelden">
        <div className="container application-layout">
          <div>
            <div className="eyebrow">CHAUFFEUR AANMELDEN</div>

            <h2>
              Klaar om
              <br />
              <span>te rijden?</span>
            </h2>

            <p>
              Laat je gegevens achter. Wij nemen contact met je op om de
              mogelijkheden te bespreken.
            </p>

            <div className="contact-details">
              <div>
                <small>TELEFOON</small>
                <strong>+31 6 24562388</strong>
              </div>

              <div>
                <small>EMAIL</small>
                <strong>info@imperialcabs.nl</strong>
              </div>

              <div>
                <small>REGIO</small>
                <strong>Amsterdam &amp; omgeving</strong>
              </div>
            </div>
          </div>

          <form
            className="application-form"
            action="mailto:info@imperialcabs.nl"
            method="post"
            encType="text/plain"
          >
            <div className="form-row">
              <input
                type="text"
                name="naam"
                placeholder="Volledige naam"
                required
              />

              <input
                type="tel"
                name="telefoon"
                placeholder="Telefoonnummer"
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="E-mailadres"
              required
            />

            <select name="ervaring" defaultValue="">
              <option value="" disabled>
                Heb je taxi-ervaring?
              </option>

              <option value="ja">Ja</option>
              <option value="nee">Nee</option>
            </select>

            <textarea
              name="bericht"
              placeholder="Vertel ons kort iets over jezelf..."
            />

            <button type="submit">
              Aanvraag versturen →
            </button>

            <small>
              Wij gebruiken je gegevens alleen om contact met je op te nemen
              over je aanvraag.
            </small>
          </form>
        </div>
      </section>

      <section className="section dark" id="faq">
        <div className="container">
          <div className="section-intro">
            <div className="eyebrow">FAQ</div>

            <h2>
              Veelgestelde
              <br />
              <span>vragen.</span>
            </h2>
          </div>

          <div className="faq">
            {faqs.map((faq) => (
              <div className="faq-item" key={faq.question}>
                <h3>{faq.question}</h3>

                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-main">
          <div>
            <Link href="/" className="footer-logo">
              IMPERIAL<span>CABS</span>
            </Link>

            <p>
              Taxi fleet management voor professionele chauffeurs in
              Amsterdam &amp; omgeving.
            </p>
          </div>

          <div className="footer-column">
            <small>MENU</small>

            <Link href="#voordelen">Voordelen</Link>
            <Link href="#wagenpark">Wagenpark</Link>
            <Link href="#hoe-het-werkt">
              Hoe het werkt
            </Link>
            <Link href="#faq">FAQ</Link>
          </div>

          <div className="footer-column">
            <small>CONTACT</small>

            <a href="tel:+31624562388">
              +31 6 24562388
            </a>

            <a href="mailto:info@imperialcabs.nl">
              info@imperialcabs.nl
            </a>

            <a
              href="https://www.imperialcabs.nl"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.imperialcabs.nl
            </a>

            <span>Amsterdam &amp; omgeving</span>
          </div>
        </div>

        <div className="footer-bottom container">
          <span>© 2026 Imperial Cabs B.V.</span>

          <span>Rijd slimmer. Verdien meer.</span>
        </div>
      </footer>
    </main>
  );
}
