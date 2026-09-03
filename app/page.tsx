import Link from "next/link";

const platforms = ["UBER", "BOLT", "STAXI", "WELCOME PICKUPS"];

const benefits = [
  {
    number: "01",
    title: "Professionele taxi-auto",
    text: "Rijd met een moderne, representatieve auto die klaar is voor professioneel taxivervoer.",
  },
  {
    number: "02",
    title: "All-in ondersteuning",
    text: "Wij regelen het beheer rondom je voertuig, zodat jij je kunt focussen op rijden.",
  },
  {
    number: "03",
    title: "Meerdere platforms",
    text: "Combineer verschillende rijplatforms en creëer meer mogelijkheden om omzet te maken.",
  },
  {
    number: "04",
    title: "Persoonlijke support",
    text: "Van onboarding tot dagelijkse vragen: Imperial Cabs staat voor je klaar.",
  },
];

const steps = [
  {
    number: "01",
    title: "Meld je aan",
    text: "Laat je gegevens achter en vertel ons meer over jouw ervaring als chauffeur.",
  },
  {
    number: "02",
    title: "Wij controleren",
    text: "We nemen je aanvraag door en bespreken samen de mogelijkheden.",
  },
  {
    number: "03",
    title: "Kies je voertuig",
    text: "Kies een beschikbare taxi-auto die past bij jouw manier van rijden.",
  },
  {
    number: "04",
    title: "Start met rijden",
    text: "Je ontvangt de benodigde informatie en kunt professioneel aan de slag.",
  },
];

const faqs = [
  {
    question: "Voor welke platforms kan ik rijden?",
    answer:
      "Imperial Cabs richt zich op chauffeurs die actief zijn of willen worden op onder andere Uber, Bolt, Staxi en Welcome Pickups.",
  },
  {
    question: "Wat regelt Imperial Cabs?",
    answer:
      "Wij richten ons op het leveren en beheren van taxi-voertuigen en ondersteuning voor chauffeurs. De exacte inhoud van een pakket wordt tijdens de onboarding besproken.",
  },
  {
    question: "In welke regio zijn jullie actief?",
    answer:
      "Momenteel richten wij ons op Amsterdam en omgeving.",
  },
  {
    question: "Kan ik mij aanmelden als ik nog geen chauffeur ben?",
    answer:
      "Ja. Laat je gegevens achter via het aanvraagformulier. We kunnen vervolgens bespreken wat je nodig hebt om te starten.",
  },
];

export default function Home() {
  return (
    <main>
      {/* NAVIGATION */}
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

          <Link href="#aanmelden" className="nav-cta">
            Word chauffeur
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              TAXI FLEET MANAGEMENT
            </div>

            <h1>
              Rijd slimmer.
              <br />
              <span>Verdien meer.</span>
            </h1>

            <p className="hero-description">
              Professionele taxi-auto&apos;s en ondersteuning voor chauffeurs
              in Amsterdam &amp; omgeving.
            </p>

            <div className="hero-actions">
              <Link href="#aanmelden" className="button button-primary">
                Word chauffeur
                <span>→</span>
              </Link>

              <Link href="#hoe-het-werkt" className="button button-secondary">
                Hoe het werkt
              </Link>
            </div>

            <div className="hero-note">
              <span>●</span>
              Nu chauffeurs gezocht in Amsterdam &amp; omgeving
            </div>
          </div>

          {/* HERO VEHICLE VISUAL */}
          <div className="hero-visual">
            <div className="visual-glow" />
            <div className="visual-label">IMPERIAL FLEET</div>

            <div className="car">
              <div className="car-roof" />
              <div className="car-window car-window-left" />
              <div className="car-window car-window-right" />

              <div className="car-body">
                <div className="car-light car-light-left" />
                <div className="car-light car-light-right" />
              </div>

              <div className="car-wheel car-wheel-left" />
              <div className="car-wheel car-wheel-right" />
            </div>

            <div className="visual-bottom">
              <span>MODERN</span>
              <span>•</span>
              <span>ELECTRIC</span>
              <span>•</span>
              <span>PROFESSIONAL</span>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORMS */}
      <section className="platform-section">
        <div className="section-container">
          <div className="platform-intro">
            <p>RIJ OP DE PLATFORMS DIE BIJ JOU PASSEN</p>
          </div>

          <div className="platform-grid">
            {platforms.map((platform) => (
              <div className="platform-card" key={platform}>
                {platform}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="dark-section" id="voordelen">
        <div className="section-container">
          <div className="section-heading">
            <div className="eyebrow">WAAROM IMPERIAL CABS</div>

            <h2>
              Meer focus op
              <br />
              <span>jouw rit.</span>
            </h2>

            <p>
              Wij nemen het voertuigbeheer en de ondersteuning uit handen,
              zodat jij je kunt richten op wat belangrijk is: rijden.
            </p>
          </div>

          <div className="benefit-grid">
            {benefits.map((benefit) => (
              <div className="benefit-card" key={benefit.number}>
                <div className="benefit-number">{benefit.number}</div>

                <h3>{benefit.title}</h3>

                <p>{benefit.text}</p>

                <div className="card-arrow">↗</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLEET */}
      <section className="fleet-section" id="wagenpark">
        <div className="section-container">
          <div className="fleet-grid">
            <div>
              <div className="eyebrow">IMPERIAL FLEET</div>

              <h2>
                Moderne
                <br />
                <span>elektrische</span>
                <br />
                voertuigen.
              </h2>

              <p className="fleet-description">
                Een professionele uitstraling begint bij een professioneel
                voertuig. Ons wagenpark is gericht op moderne elektrische
                taxi&apos;s voor dagelijks professioneel gebruik.
              </p>

              <Link href="#aanmelden" className="button button-dark">
                Bekijk mogelijkheden <span>→</span>
              </Link>
            </div>

            <div className="fleet-card">
              <div className="fleet-card-top">
                <span>IMPERIAL CABS</span>
                <span>EV FLEET</span>
              </div>

              <div className="fleet-car">
                <div className="fleet-car-window" />
                <div className="fleet-car-body">
                  <div className="fleet-light left" />
                  <div className="fleet-light right" />
                </div>

                <div className="fleet-wheel left" />
                <div className="fleet-wheel right" />
              </div>

              <div className="fleet-card-bottom">
                <strong>READY TO DRIVE</strong>
                <span>AMSTERDAM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="dark-section" id="hoe-het-werkt">
        <div className="section-container">
          <div className="section-heading">
            <div className="eyebrow">ZO WERKT HET</div>

            <h2>
              Van aanvraag
              <br />
              naar <span>start.</span>
            </h2>
          </div>

          <div className="steps-grid">
            {steps.map((step) => (
              <div className="step-card" key={step.number}>
                <div className="step-top">
                  <span>{step.number}</span>
                  <div />
                </div>

                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BIG CTA */}
      <section className="lime-section">
        <div className="cta-container">
          <div>
            <div className="eyebrow dark-eyebrow">READY TO DRIVE?</div>

            <h2>
              Klaar om
              <br />
              <span>te starten?</span>
            </h2>

            <p>
              Sluit je aan bij Imperial Cabs en ontdek de mogelijkheden voor
              professioneel rijden in Amsterdam.
            </p>
          </div>

          <Link href="#aanmelden" className="button button-black">
            Word chauffeur <span>→</span>
          </Link>
        </div>
      </section>

      {/* APPLICATION */}
      <section className="application-section" id="aanmelden">
        <div className="section-container">
          <div className="application-grid">
            <div className="application-intro">
              <div className="eyebrow">CHAUFFEUR AANMELDEN</div>

              <h2>
                Klaar om
                <br />
                <span>te rijden?</span>
              </h2>

              <p>
                Laat je gegevens achter. We nemen contact met je op om jouw
                mogelijkheden bij Imperial Cabs te bespreken.
              </p>

              <div className="contact-info">
                <div>
                  <span>EMAIL</span>
                  <strong>info@imperialcabs.nl</strong>
                </div>

                <div>
                  <span>REGIO</span>
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

              <button type="submit" className="form-button">
                Aanvraag versturen <span>→</span>
              </button>

              <small>
                Door je aanvraag te versturen, geef je toestemming dat
                Imperial Cabs contact met je opneemt.
              </small>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="dark-section" id="faq">
        <div className="section-container">
          <div className="section-heading faq-heading">
            <div className="eyebrow">FAQ</div>

            <h2>
              Veelgestelde
              <br />
              <span>vragen.</span>
            </h2>
          </div>

          <div className="faq-grid">
            {faqs.map((faq) => (
              <div className="faq-item" key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-main">
            <div>
              <Link href="/" className="footer-logo">
                IMPERIAL<span>CABS</span>
              </Link>

              <p>
                Taxi fleet management voor professionele chauffeurs in
                Amsterdam &amp; omgeving.
              </p>
            </div>

            <div className="footer-links">
              <div>
                <span>MENU</span>
                <Link href="#voordelen">Voordelen</Link>
                <Link href="#wagenpark">Wagenpark</Link>
                <Link href="#hoe-het-werkt">Hoe het werkt</Link>
                <Link href="#faq">FAQ</Link>
              </div>

              <div>
                <span>CONTACT</span>
                <a href="mailto:info@imperialcabs.nl">
                  info@imperialcabs.nl
                </a>
                <p>Amsterdam &amp; omgeving</p>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Imperial Cabs B.V.</span>
            <span>Rijd slimmer. Verdien meer.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
