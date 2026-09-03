import Link from "next/link";

const platforms = ["Uber", "Bolt", "Staxi", "Welcome Pickups"];

const benefits = [
  {
    number: "01",
    title: "Een goede taxi-auto",
    text: "Rijd met een comfortabele Kia e-Niro die geschikt is voor professioneel taxivervoer.",
  },
  {
    number: "02",
    title: "Alles goed geregeld",
    text: "Wij ondersteunen je rondom het voertuig, zodat jij je kunt richten op het rijden.",
  },
  {
    number: "03",
    title: "Meerdere platforms",
    text: "Vergroot je mogelijkheden door actief te zijn op verschillende rijplatforms.",
  },
  {
    number: "04",
    title: "Persoonlijke ondersteuning",
    text: "Heb je een vraag of loop je ergens tegenaan? Wij zijn bereikbaar om je te helpen.",
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
    title: "Regel je auto",
    text: "Wanneer alles akkoord is, plannen we de overdracht van je Kia e-Niro.",
  },
  {
    number: "04",
    title: "Start met rijden",
    text: "Je ontvangt de benodigde informatie en kunt professioneel aan de slag.",
  },
];

const faqs = [
  {
    question: "Met welke platforms kan ik rijden?",
    answer:
      "Je kunt onder andere rijden via Uber, Bolt, Staxi en Welcome Pickups, afhankelijk van je situatie en de voorwaarden van de betreffende platforms.",
  },
  {
    question: "Welke auto biedt Imperial Cabs aan?",
    answer:
      "We starten voornamelijk met de Kia e-Niro: een volledig elektrische, comfortabele en praktische auto voor professioneel taxivervoer.",
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

          <Link href="#aanmelden" className="nav-button">
            Word chauffeur
          </Link>
        </div>
      </nav>

      {/* HERO */}
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
              Professionele taxi-auto&apos;s en ondersteuning voor chauffeurs
              in Amsterdam &amp; omgeving.
            </p>

            <div className="hero-buttons">
              <Link href="#aanmelden" className="button gold-button">
                Word chauffeur →
              </Link>

              <Link href="#hoe-het-werkt" className="button outline-button">
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
              src="https://commons.wikimedia.org/wiki/Special:FilePath/Kia%20e-Niro%20(front).jpg"
              alt="Kia e-Niro"
            />

            <div className="image-caption">
              <span>KIA e-NIRO</span>
              <span>VOLLEDIG ELEKTRISCH</span>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORMS */}
      <section className="platforms">
        <div className="container">
          <p className="small-heading">
            RIJ OP DE PLATFORMS DIE BIJ JOU PASSEN
          </p>

          <div className="platform-list">
            {platforms.map((platform) => (
              <div key={platform} className="platform">
                {platform}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
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

      {/* FLEET */}
      <section className="section fleet" id="wagenpark">
        <div className="container fleet-layout">
          <div className="fleet-text">
            <div className="eyebrow">ONS WAGENPARK</div>

            <h2>
              Kia e-Niro.
              <br />
              <span>Elektrisch &amp; betrouwbaar.</span>
            </h2>

            <p>
              We starten voornamelijk met de Kia e-Niro. Een ruime en
              comfortabele elektrische auto die geschikt is voor dagelijks
              professioneel taxivervoer.
            </p>

            <Link href="#aanmelden" className="button outline-button">
              Interesse? Meld je aan →
            </Link>
          </div>

          <div className="fleet-image">
            <img
              src="https://commons.wikimedia.org/wiki/Special:FilePath/Kia%20e-Niro%20(front).jpg"
              alt="Kia e-Niro"
            />

            <div className="fleet-info">
              <div>
                <strong>100%</strong>
                <span>Elektrisch</span>
              </div>

              <div>
                <strong>Automaat</strong>
                <span>Comfortabel rijden</span>
              </div>

              <div>
                <strong>Kia</strong>
                <span>e-Niro</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
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

      {/* CTA */}
      <section className="cta">
        <div className="container cta-inner">
          <div>
            <div className="eyebrow dark-eyebrow">IMPERIAL CABS</div>

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

      {/* APPLICATION */}
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

      {/* FAQ */}
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

      {/* FOOTER */}
      <footer>
        <div className="container footer-main">
          <div>
            <Link href="/" className="footer-logo">
              IMPERIAL<span>CABS</span>
            </Link>

            <p>
              Taxi fleet management voor professionele chauffeurs in Amsterdam
              &amp; omgeving.
            </p>
          </div>

          <div className="footer-column">
            <small>MENU</small>
            <Link href="#voordelen">Voordelen</Link>
            <Link href="#wagenpark">Wagenpark</Link>
            <Link href="#hoe-het-werkt">Hoe het werkt</Link>
            <Link href="#faq">FAQ</Link>
          </div>

          <div className="footer-column">
            <small>CONTACT</small>
            <a href="mailto:info@imperialcabs.nl">
              info@imperialcabs.nl
            </a>
            <span>Amsterdam &amp; omgeving</span>
          </div>
        </div>

        <div className="footer-bottom container">
          <span>© 2026 Imperial Cabs B.V.</span>
          <span>Rijd slimmer. Verdien meer.</span>
        </div>

        <div className="image-credit container">
          Kia e-Niro photo: Fiver, der Hellseher / Wikimedia Commons · CC BY-SA
          4.0
        </div>
      </footer>
    </main>
  );
}
