"use client";

import Link from "next/link";
import { useRef, useState } from "react";

const platforms = ["Uber", "Bolt", "Staxi", "Welcome Pickups"];

const benefits = [
  {
    number: "01",
    title: "Professionele taxi-auto",
    text: "Een elektrische auto die geschikt is voor dagelijks professioneel taxivervoer.",
  },
  {
    number: "02",
    title: "Alles geregeld",
    text: "Wij ondersteunen je rondom het voertuig, zodat jij je kunt focussen op je ritten.",
  },
  {
    number: "03",
    title: "Meerdere platforms",
    text: "De mogelijkheid om te rijden via verschillende platformen, afhankelijk van je situatie.",
  },
  {
    number: "04",
    title: "Persoonlijke ondersteuning",
    text: "Korte lijnen en persoonlijke begeleiding wanneer je die nodig hebt.",
  },
];

const steps = [
  {
    number: "01",
    title: "Meld je aan",
    text: "Laat je gegevens achter via het formulier.",
  },
  {
    number: "02",
    title: "Wij nemen contact op",
    text: "We bespreken jouw situatie en de mogelijkheden.",
  },
  {
    number: "03",
    title: "Regel je auto",
    text: "Samen bekijken we welke elektrische taxi-auto bij jou past.",
  },
  {
    number: "04",
    title: "Start met rijden",
    text: "Je bent klaar om professioneel je ritten te rijden.",
  },
];

const vehicles = [
  {
    name: "KIA e-NIRO",
    image: "/kia-e-niro.jpg",
  },
  {
    name: "HYUNDAI IONIQ 5",
    image: "/hyundai-ioniq-5.jpg",
  },
  {
    name: "BYD ATTO 3",
    image: "/byd-atto-3.jpg",
  },
  {
    name: "TESLA MODEL Y",
    image: "/tesla-model-y.jpg",
  },
];

const faqs = [
  {
    question: "Met welke platforms kan ik rijden?",
    answer:
      "Je kunt onder andere rijden via Uber, Bolt, Staxi en Welcome Pickups, afhankelijk van je situatie en de voorwaarden van de betreffende platforms.",
  },
  {
    question: "Welke auto's biedt Imperial Cabs aan?",
    answer:
      "Wij richten ons op verschillende elektrische auto's die geschikt zijn voor professioneel taxivervoer. Het beschikbare aanbod kan variëren.",
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeVehicle, setActiveVehicle] = useState(0);

  /*
   * Berekent automatisch de breedte van één kaart + de ruimte
   * tussen de kaarten. Hierdoor gaat iedere pijl exact één
   * voertuig vooruit of achteruit.
   */
  const getVehicleStep = () => {
    const container = carouselRef.current;

    if (!container) {
      return 0;
    }

    const card = container.querySelector(
      ".vehicle-card"
    ) as HTMLElement | null;

    if (!card) {
      return 0;
    }

    const styles = window.getComputedStyle(container);

    const gap = parseFloat(
      styles.columnGap || styles.gap || "0"
    );

    return card.offsetWidth + gap;
  };

  const scrollToVehicle = (index: number) => {
    const container = carouselRef.current;

    if (!container) {
      return;
    }

    /*
     * Zorgt ervoor dat bij de eerste auto → terug naar de laatste
     * gaat en bij de laatste auto → terug naar de eerste.
     */
    const safeIndex =
      ((index % vehicles.length) + vehicles.length) %
      vehicles.length;

    const step = getVehicleStep();

    if (!step) {
      return;
    }

    container.scrollTo({
      left: safeIndex * step,
      behavior: "smooth",
    });

    setActiveVehicle(safeIndex);
  };

  const nextVehicle = () => {
    scrollToVehicle(activeVehicle + 1);
  };

  const previousVehicle = () => {
    scrollToVehicle(activeVehicle - 1);
  };

  /*
   * Wanneer iemand met zijn vinger swipet, wordt automatisch
   * bepaald welke auto het dichtst bij de positie staat.
   */
  const handleScroll = () => {
    const container = carouselRef.current;

    if (!container) {
      return;
    }

    const step = getVehicleStep();

    if (!step) {
      return;
    }

    const index = Math.round(
      container.scrollLeft / step
    );

    const safeIndex = Math.max(
      0,
      Math.min(index, vehicles.length - 1)
    );

    if (safeIndex !== activeVehicle) {
      setActiveVehicle(safeIndex);
    }
  };

  return (
    <main>
      {/* =========================
          NAVIGATION
      ========================== */}
      <nav className="site-nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            IMPERIAL<span>CABS</span>
          </Link>

          <div className="nav-links">
            <Link href="#voordelen">
              Voordelen
            </Link>

            <Link href="#wagenpark">
              Wagenpark
            </Link>

            <Link href="#hoe-het-werkt">
              Hoe het werkt
            </Link>

            <Link href="#faq">
              FAQ
            </Link>
          </div>

          <Link
            href="#aanmelden"
            className="nav-button"
          >
            Word chauffeur
          </Link>
        </div>
      </nav>

      {/* =========================
          HERO
      ========================== */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <div className="eyebrow">
              TAXI FLEET MANAGEMENT
            </div>

            <h1>
              Rijd slimmer.
              <br />
              <span>Verdien meer.</span>
            </h1>

            <p>
              Professionele elektrische taxi-auto&apos;s en
              ondersteuning voor chauffeurs in Amsterdam
              &amp; omgeving.
            </p>

            <div className="hero-buttons">
              <Link
                href="#aanmelden"
                className="button gold-button"
              >
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
              Nu chauffeurs gezocht in Amsterdam &amp;
              omgeving
            </div>
          </div>

          <div className="hero-image">
            <img
              src="/kia-e-niro.jpg"
              alt="Kia e-Niro - Imperial Cabs"
            />

            <div className="image-caption">
              <span>KIA e-NIRO</span>
              <span>VOLLEDIG ELEKTRISCH</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          PLATFORMS
      ========================== */}
      <section className="platforms">
        <div className="container">
          <p className="small-heading">
            RIJ OP DE PLATFORMS DIE BIJ JOU PASSEN
          </p>

          <div className="platform-list">
            {platforms.map((platform) => (
              <div
                key={platform}
                className="platform"
              >
                {platform}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          BENEFITS
      ========================== */}
      <section
        className="section dark"
        id="voordelen"
      >
        <div className="container">
          <div className="section-intro">
            <div className="eyebrow">
              WAAROM IMPERIAL CABS?
            </div>

            <h2>
              Meer focus op
              <br />
              <span>jouw rit.</span>
            </h2>

            <p>
              Wij zorgen voor ondersteuning rondom je
              voertuig, zodat jij je kunt focussen op
              professioneel rijden.
            </p>
          </div>

          <div className="benefits">
            {benefits.map((benefit) => (
              <div
                className="benefit"
                key={benefit.number}
              >
                <span className="number">
                  {benefit.number}
                </span>

                <h3>{benefit.title}</h3>

                <p>{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          FLEET
      ========================== */}
      <section
        className="section fleet"
        id="wagenpark"
      >
        <div className="container fleet-layout">
          <div className="fleet-text">
            <div className="eyebrow">
              ONS WAGENPARK
            </div>

            <h2>
              Elektrisch.
              <br />
              <span>
                Comfortabel &amp; betrouwbaar.
              </span>
            </h2>

            <p>
              Wij bieden verschillende elektrische
              auto&apos;s die geschikt zijn voor professioneel
              taxivervoer. Het beschikbare aanbod kan
              variëren.
            </p>

            <Link
              href="#aanmelden"
              className="button outline-button"
            >
              Interesse? Meld je aan →
            </Link>
          </div>

          {/* =========================
              IMPROVED VEHICLE CAROUSEL
          ========================== */}
          <div className="fleet-carousel-wrapper">
            <div
              ref={carouselRef}
              className="fleet-carousel"
              onScroll={handleScroll}
            >
              {vehicles.map((vehicle) => (
                <article
                  className="vehicle-card"
                  key={vehicle.name}
                >
                  <div className="vehicle-image">
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.name} - Imperial Cabs`}
                      draggable="false"
                    />
                  </div>

                  <div className="vehicle-info">
                    <div>
                      <span className="vehicle-label">
                        IMPERIAL CABS
                      </span>

                      <h3>{vehicle.name}</h3>
                    </div>

                    <span className="vehicle-electric">
                      VOLLEDIG ELEKTRISCH
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {/* CONTROLS */}
            <div className="carousel-controls">
              <button
                type="button"
                onClick={previousVehicle}
                aria-label="Vorige auto"
                className="carousel-button"
              >
                ←
              </button>

              <div className="carousel-dots">
                {vehicles.map((vehicle, index) => (
                  <button
                    key={vehicle.name}
                    type="button"
                    onClick={() =>
                      scrollToVehicle(index)
                    }
                    aria-label={`Bekijk ${vehicle.name}`}
                    className={`carousel-dot ${
                      activeVehicle === index
                        ? "active"
                        : ""
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextVehicle}
                aria-label="Volgende auto"
                className="carousel-button"
              >
                →
              </button>
            </div>

            <div className="carousel-caption">
              <span>←</span>
              Swipe om meer auto&apos;s te bekijken
              <span>→</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          HOW IT WORKS
      ========================== */}
      <section
        className="section dark"
        id="hoe-het-werkt"
      >
        <div className="container">
          <div className="section-intro">
            <div className="eyebrow">
              ZO WERKT HET
            </div>

            <h2>
              Van aanvraag
              <br />
              naar <span>start.</span>
            </h2>
          </div>

          <div className="steps">
            {steps.map((step) => (
              <div
                className="step"
                key={step.number}
              >
                <span className="step-number">
                  {step.number}
                </span>

                <h3>{step.title}</h3>

                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          CTA
      ========================== */}
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
              Laat je gegevens achter en ontdek wat
              Imperial Cabs voor jou kan betekenen.
            </p>
          </div>

          <Link
            href="#aanmelden"
            className="button black-button"
          >
            Word chauffeur →
          </Link>
        </div>
      </section>

      {/* =========================
          APPLICATION
      ========================== */}
      <section
        className="section application"
        id="aanmelden"
      >
        <div className="container application-layout">
          <div>
            <div className="eyebrow">
              CHAUFFEUR AANMELDEN
            </div>

            <h2>
              Klaar om
              <br />
              <span>te rijden?</span>
            </h2>

            <p>
              Laat je gegevens achter. Wij nemen contact
              met je op om de mogelijkheden te bespreken.
            </p>

            <div className="contact-details">
              <div>
                <small>EMAIL</small>

                <strong>
                  info@imperialcabs.nl
                </strong>
              </div>

              <div>
                <small>TELEFOON</small>

                <strong>
                  +31 6 24562388
                </strong>
              </div>

              <div>
                <small>REGIO</small>

                <strong>
                  Amsterdam &amp; omgeving
                </strong>
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

            <select
              name="ervaring"
              defaultValue=""
            >
              <option
                value=""
                disabled
              >
                Heb je taxi-ervaring?
              </option>

              <option value="ja">
                Ja
              </option>

              <option value="nee">
                Nee
              </option>
            </select>

            <textarea
              name="bericht"
              placeholder="Vertel ons kort iets over jezelf..."
            />

            <button type="submit">
              Aanvraag versturen →
            </button>

            <small>
              Wij gebruiken je gegevens alleen om contact
              met je op te nemen over je aanvraag.
            </small>
          </form>
        </div>
      </section>

      {/* =========================
          FAQ
      ========================== */}
      <section
        className="section dark"
        id="faq"
      >
        <div className="container">
          <div className="section-intro">
            <div className="eyebrow">
              FAQ
            </div>

            <h2>
              Veelgestelde
              <br />
              <span>vragen.</span>
            </h2>
          </div>

          <div className="faq">
            {faqs.map((faq) => (
              <div
                className="faq-item"
                key={faq.question}
              >
                <h3>{faq.question}</h3>

                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}
      <footer>
        <div className="container footer-main">
          <div>
            <Link
              href="/"
              className="footer-logo"
            >
              IMPERIAL<span>CABS</span>
            </Link>

            <p>
              Taxi fleet management voor professionele
              chauffeurs in Amsterdam &amp; omgeving.
            </p>
          </div>

          <div className="footer-column">
            <small>MENU</small>

            <Link href="#voordelen">
              Voordelen
            </Link>

            <Link href="#wagenpark">
              Wagenpark
            </Link>

            <Link href="#hoe-het-werkt">
              Hoe het werkt
            </Link>

            <Link href="#faq">
              FAQ
            </Link>
          </div>

          <div className="footer-column">
            <small>CONTACT</small>

            <a href="mailto:info@imperialcabs.nl">
              info@imperialcabs.nl
            </a>

            <a href="tel:+31624562388">
              +31 6 24562388
            </a>

            <span>
              Amsterdam &amp; omgeving
            </span>
          </div>
        </div>

        <div className="footer-bottom container">
          <span>
            © 2026 Imperial Cabs B.V.
          </span>

          <span>
            Rijd slimmer. Verdien meer.
          </span>
        </div>
      </footer>

      {/* =========================
          CAROUSEL STYLING
      ========================== */}
      <style>{`
        .fleet-carousel-wrapper {
          position: relative;
          width: 100%;
          min-width: 0;
        }

        .fleet-carousel {
          display: flex;
          gap: 20px;

          width: 100%;

          overflow-x: auto;
          overflow-y: hidden;

          scroll-snap-type: x mandatory;
          scroll-snap-stop: always;

          scrollbar-width: none;

          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;

          overscroll-behavior-x: contain;

          touch-action: pan-x;

          padding: 5px 0 10px;
        }

        .fleet-carousel::-webkit-scrollbar {
          display: none;
        }

        .vehicle-card {
          flex: 0 0 calc(100% - 76px);
          width: calc(100% - 76px);

          scroll-snap-align: start;
          scroll-snap-stop: always;

          background: #0c0c0c;

          border: 1px solid rgba(212, 175, 55, 0.28);

          overflow: hidden;

          border-radius: 2px;

          user-select: none;
        }

        .vehicle-image {
          width: 100%;

          aspect-ratio: 16 / 10;

          overflow: hidden;

          background: #111;
        }

        .vehicle-image img {
          display: block;

          width: 100%;
          height: 100%;

          object-fit: cover;

          user-select: none;
          -webkit-user-drag: none;

          transition: transform 0.5s ease;
        }

        .vehicle-card:hover .vehicle-image img {
          transform: scale(1.025);
        }

        .vehicle-info {
          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          gap: 20px;

          padding: 20px 22px 22px;
        }

        .vehicle-label {
          display: block;

          margin-bottom: 6px;

          color: #777;

          font-size: 9px;

          font-weight: 700;

          letter-spacing: 0.18em;
        }

        .vehicle-info h3 {
          margin: 0;

          color: #fff;

          font-size: 23px;

          line-height: 1.1;

          letter-spacing: 0.01em;
        }

        .vehicle-electric {
          flex-shrink: 0;

          color: #c9a94a;

          font-size: 9px;

          font-weight: 800;

          letter-spacing: 0.12em;

          white-space: nowrap;
        }

        .carousel-controls {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 24px;

          margin-top: 20px;
        }

        .carousel-button {
          display: flex;

          align-items: center;

          justify-content: center;

          width: 46px;
          height: 46px;

          padding: 0;

          border: 1px solid rgba(212, 175, 55, 0.45);

          border-radius: 50%;

          background: #0d0d0d;

          color: #c9a94a;

          font-size: 20px;

          line-height: 1;

          cursor: pointer;

          transition:
            transform 0.2s ease,
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease;
        }

        .carousel-button:hover {
          transform: translateY(-2px);

          background: #c9a94a;

          color: #080808;

          border-color: #c9a94a;
        }

        .carousel-button:active {
          transform: scale(0.94);
        }

        .carousel-dots {
          display: flex;

          align-items: center;

          gap: 8px;
        }

        .carousel-dot {
          width: 7px;
          height: 7px;

          padding: 0;

          border: 0;

          border-radius: 50%;

          background: #555;

          cursor: pointer;

          transition:
            width 0.2s ease,
            background 0.2s ease;
        }

        .carousel-dot.active {
          width: 24px;

          border-radius: 10px;

          background: #c9a94a;
        }

        .carousel-caption {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 10px;

          margin-top: 12px;

          color: #777;

          font-size: 10px;

          letter-spacing: 0.08em;

          text-transform: uppercase;
        }

        .carousel-caption span {
          color: #c9a94a;

          font-size: 16px;
        }

        @media (min-width: 901px) {
          .fleet-carousel {
            padding-right: 0;
          }

          .vehicle-card {
            flex: 0 0 calc(100% - 76px);
            width: calc(100% - 76px);
          }
        }

        @media (max-width: 900px) {
          .fleet-carousel {
            gap: 14px;

            padding-right: 8%;
          }

          .vehicle-card {
            flex: 0 0 92%;

            width: 92%;
          }

          .vehicle-info {
            flex-direction: column;

            align-items: flex-start;

            gap: 12px;
          }
        }

        @media (max-width: 600px) {
          .fleet-carousel {
            gap: 12px;
          }

          .vehicle-card {
            flex: 0 0 92%;

            width: 92%;
          }

          .vehicle-image {
            aspect-ratio: 4 / 3;
          }

          .vehicle-info {
            padding: 17px 18px 19px;
          }

          .vehicle-info h3 {
            font-size: 20px;
          }

          .carousel-controls {
            gap: 18px;
          }

          .carousel-button {
            width: 40px;
            height: 40px;

            font-size: 18px;
          }
        }
      `}</style>
    </main>
  );
}
