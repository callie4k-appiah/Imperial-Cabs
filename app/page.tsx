import Link from "next/link";

const benefits = [
  {
    number: "01",
    title: "Professionele taxi-auto",
    text: "Rijd in een moderne auto die geschikt is voor professioneel taxivervoer.",
  },
  {
    number: "02",
    title: "All-in ondersteuning",
    text: "Wij regelen de belangrijke zaken rondom je voertuig, zodat jij kunt focussen op rijden.",
  },
  {
    number: "03",
    title: "Meerdere rijplatforms",
    text: "Vergroot je mogelijkheden met Uber, Bolt, Staxi en Welcome Pickups.",
  },
  {
    number: "04",
    title: "24/7 ondersteuning",
    text: "Je staat er niet alleen voor. Imperial Cabs is er voor onze chauffeurs.",
  },
];

const platforms = ["UBER", "BOLT", "STAXI", "WELCOME PICKUPS"];

const steps = [
  {
    number: "01",
    title: "Meld je aan",
    text: "Laat je gegevens achter en vertel ons meer over jezelf.",
  },
  {
    number: "02",
    title: "We controleren je gegevens",
    text: "Samen zorgen we dat alle benodigde documenten en voorwaarden op orde zijn.",
  },
  {
    number: "03",
    title: "Kies je voertuig",
    text: "Bekijk de beschikbare voertuigen en kies wat bij jou past.",
  },
  {
    number: "04",
    title: "Start met rijden",
    text: "Alles geregeld? Dan ben je klaar om professioneel te gaan rijden.",
  },
];

export default function Home() {
  return (
    <main>
      {/* NAVIGATION */}
      <header className="navbar">
        <div className="nav-container">
          <Link href="/" className="logo">
            IMPERIAL<span>CABS</span>
          </Link>

          <nav className="desktop-nav">
            <Link href="#voordelen">Voordelen</Link>
            <Link href="#wagenpark">Wagenpark</Link>
            <Link href="#hoe-het-werkt">Hoe het werkt</Link>
            <Link href="#faq">FAQ</Link>
          </nav>

          <Link href="#aanmelden" className="nav-cta">
            Word chauffeur
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid">

          <div className="hero-copy">
            <div className="eyebrow">
              TAXI FLEET MANAGEMENT
            </div>

            <h1>
              Rijd slimmer.
              <br />
              <span>Verdien meer.</span>
            </h1>

            <p className="hero-description">
              Professionele taxi-auto's en ondersteuning voor
              chauffeurs in Amsterdam & omgeving.
            </p>

            <div className="hero-actions">
              <Link href="#aanmelden" className="button button-primary">
                Word chauffeur
                <span>→</span>
              </Link>

              <Link href="#hoe-het-werkt" className="button button-outline">
                Hoe het werkt
              </Link>
            </div>

            <div className="hero-note">
              <span className="status-dot" />
              Nu chauffeurs gezocht in Amsterdam & omgeving
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image">
              <div className="image-overlay" />

              <div className="vehicle-content">
                <div className="vehicle-label">
                  IMPERIAL CABS
                </div>

                <div className="vehicle-shape">
                  <div className="vehicle-roof" />
                  <div className="vehicle-body" />
                  <div className="wheel wheel-left" />
                  <div className="wheel wheel-right" />
                </div>
              </div>

              <div className="hero-badge">
                <span>01</span>
                <div>
                  <strong>Professioneel rijden</strong>
                  <small>Amsterdam & omgeving</small>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PLATFORMS */}
      <section className="platform-section">
        <div className="container">
          <p className="platform-label">
            MEER MOGELIJKHEDEN OM TE RIJDEN
          </p>

          <div className="platforms">
            {platforms.map((platform) => (
              <div key={platform} className="platform">
                {platform}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="voordelen" className="section">
        <div className="container">

          <div className="section-header">
            <div>
              <p className="eyebrow">WAAROM IMPERIAL CABS</p>

              <h2>
                Jij focust op
                <br />
                <span>de rit.</span>
              </h2>
            </div>

            <p>
              Wij zorgen voor de ondersteuning rondom jouw
              voertuig en helpen je om professioneel te kunnen
              rijden.
            </p>
          </div>

          <div className="benefit-grid">
            {benefits.map((benefit) => (
              <article className="benefit-card" key={benefit.number}>
                <span className="card-number">
                  {benefit.number}
                </span>

                <div className="benefit-icon">
                  +
                </div>

                <h3>{benefit.title}</h3>

                <p>{benefit.text}</p>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* FLEET */}
      <section id="wagenpark" className="fleet-section">
        <div className="container">

          <div className="section-header fleet-header">
            <div>
              <p className="eyebrow dark-eyebrow">
                ONS WAGENPARK
              </p>

              <h2>
                Klaar om
                <br />
                <span>te rijden.</span>
              </h2>
            </div>

            <p>
              Wij bouwen aan een modern en efficiënt wagenpark
              voor professionele chauffeurs.
            </p>
          </div>

          <div className="fleet-card">

            <div className="fleet-info">
              <span className="vehicle-category">
                ELECTRIC TAXI
              </span>

              <h3>
                Moderne elektrische
                <br />
                voertuigen.
              </h3>

              <p>
                Comfortabel voor passagiers. Efficiënt voor
                chauffeurs. Ontwikkeld voor professioneel
                gebruik.
              </p>

              <Link href="#aanmelden" className="dark-button">
                Beschikbaarheid aanvragen →
              </Link>
            </div>

            <div className="fleet-visual">
              <div className="large-car">
                <div className="large-car-roof" />
                <div className="large-car-body" />
                <div className="large-wheel wheel-left" />
                <div className="large-wheel wheel-right" />
              </div>

              <div className="fleet-glow" />
            </div>

          </div>

        </div>
      </section>

      {/* PROCESS */}
      <section id="hoe-het-werkt" className="section">
        <div className="container">

          <div className="process-heading">
            <p className="eyebrow">HOE HET WERKT</p>

            <h2>
              Van aanmelden
              <br />
              <span>naar rijden.</span>
            </h2>
          </div>

          <div className="steps">
            {steps.map((step) => (
              <div className="step" key={step.number}>

                <div className="step-top">
                  <span>{step.number}</span>
                  <div className="step-line" />
                </div>

                <h3>{step.title}</h3>

                <p>{step.text}</p>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-content">

          <p className="eyebrow">
            IMPERIAL CABS
          </p>

          <h2>
            Klaar om
            <br />
            <span>te starten?</span>
          </h2>

          <p>
            Meld je aan als chauffeur en ontdek de mogelijkheden
            bij Imperial Cabs.
          </p>

          <Link href="#aanmelden" className="button button-primary">
            Word chauffeur →
          </Link>

        </div>
      </section>

      {/* APPLICATION */}
      <section id="aanmelden" className="application-section">
        <div className="container application-grid">

          <div className="application-copy">
            <p className="eyebrow">CHAUFFEUR WORDEN</p>

            <h2>
              Jouw volgende
              <br />
              <span>rit begint hier.</span>
            </h2>

            <p>
              Laat je gegevens achter. Ons team neemt contact
              met je op om de mogelijkheden te bespreken.
            </p>

            <div className="contact-details">
              <div>
                <small>EMAIL</small>
                <a href="mailto:info@imperialcabs.nl">
                  info@imperialcabs.nl
                </a>
              </div>

              <div>
                <small>REGIO</small>
                <span>Amsterdam & omgeving</span>
              </div>
            </div>
          </div>

          <form className="application-form">

            <div className="form-row">
              <input
                type="text"
                placeholder="Voor- en achternaam"
                required
              />

              <input
                type="tel"
                placeholder="Telefoonnummer"
                required
              />
            </div>

            <input
              type="email"
              placeholder="E-mailadres"
              required
            />

            <select required defaultValue="">
              <option value="" disabled>
                Heb je taxi-ervaring?
              </option>
              <option value="yes">Ja</option>
              <option value="no">Nee</option>
            </select>

            <textarea
              placeholder="Vertel ons kort iets over jezelf..."
              rows={5}
            />

            <button
              type="submit"
              className="button button-primary form-button"
            >
              Aanvraag versturen →
            </button>

            <small className="form-disclaimer">
              Door dit formulier te versturen ga je akkoord
              met het verwerken van je gegevens voor het
              beantwoorden van je aanvraag.
            </small>

          </form>

        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section faq-section">
        <div className="container">

          <div className="process-heading">
            <p className="eyebrow">FAQ</p>

            <h2>
              Veelgestelde
              <br />
              <span>vragen.</span>
            </h2>
          </div>

          <div className="faq-list">

            <details>
              <summary>
                Welke platforms kan ik gebruiken?
                <span>+</span>
              </summary>

              <p>
                Imperial Cabs richt zich op meerdere
                rijmogelijkheden, waaronder Uber, Bolt,
                Staxi en Welcome Pickups, afhankelijk van
                de voorwaarden die voor jou en het voertuig
                gelden.
              </p>
            </details>

            <details>
              <summary>
                Wat is inbegrepen?
                <span>+</span>
              </summary>

              <p>
                Onze oplossing is gericht op het bieden van
                een professionele taxi-auto en ondersteuning
                rondom het voertuig. De exacte voorwaarden
                worden vooraf met je besproken.
              </p>
            </details>

            <details>
              <summary>
                In welke regio zijn jullie actief?
                <span>+</span>
              </summary>

              <p>
                Imperial Cabs richt zich momenteel op
                Amsterdam en omgeving.
              </p>
            </details>

            <details>
              <summary>
                Hoe kan ik chauffeur worden?
                <span>+</span>
              </summary>

              <p>
                Vul het aanvraagformulier in. Ons team neemt
                vervolgens contact met je op om je situatie,
                documenten en beschikbare voertuigen te
                bespreken.
              </p>
            </details>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">

        <div className="container footer-grid">

          <div>
            <Link href="/" className="logo">
              IMPERIAL<span>CABS</span>
            </Link>

            <p>
              Professioneel wagenparkbeheer
              voor taxi-chauffeurs.
            </p>
          </div>

          <div>
            <h4>Navigatie</h4>

            <Link href="#voordelen">Voordelen</Link>
            <Link href="#wagenpark">Wagenpark</Link>
            <Link href="#hoe-het-werkt">Hoe het werkt</Link>
            <Link href="#faq">FAQ</Link>
          </div>

          <div>
            <h4>Contact</h4>

            <a href="mailto:info@imperialcabs.nl">
              info@imperialcabs.nl
            </a>

            <span>Amsterdam & omgeving</span>
          </div>

        </div>

        <div className="footer-bottom">
          <div className="container">
            © 2026 Imperial Cabs B.V. · Alle rechten voorbehouden.
          </div>
        </div>

      </footer>

    </main>
  );
}
