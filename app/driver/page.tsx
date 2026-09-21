"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Driver = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  status: string | null;
  start_date: string | null;
  chauffeurskaart_number: string | null;
};

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
  year: number | null;
  status: string | null;
};

type Payment = {
  id: string;
  amount: number;
  status: string;
  due_date: string | null;
};

type Document = {
  id: string;
  document_type: string;
  status: string;
  expiry_date: string | null;
};

type Message = {
  id: string;
  message: string;
  sender_type: string;
  is_read: boolean;
  created_at: string;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
};

export default function DriverDashboard() {
  const router = useRouter();

  const [driver, setDriver] = useState<Driver | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/driver/login");
      return;
    }

    /*
     * We zoeken de chauffeur op basis van het e-mailadres
     * waarmee hij is ingelogd.
     */
    const { data: driverData, error: driverError } = await supabase
      .from("driver")
      .select("*")
      .ilike("email", user.email ?? "")
.single();
    if (driverError || !driverData) {
      setError(
        "Er is nog geen chauffeursprofiel gekoppeld aan dit account."
      );
      setLoading(false);
      return;
    }

    setDriver(driverData);

    /*
     * Voertuig
     */
    const { data: vehicleData } = await supabase
      .from("vehicle")
      .select("*")
      .eq("assigned_driver_id", driverData.id)
      .maybeSingle();

    setVehicle(vehicleData);

    /*
     * Betalingen
     */
    const { data: paymentData } = await supabase
      .from("payments")
      .select("*")
      .eq("driver_id", driverData.id)
      .order("created_at", { ascending: false });

    setPayments(paymentData || []);

    /*
     * Documenten
     */
    const { data: documentData } = await supabase
      .from("documents")
      .select("*")
      .eq("driver_id", driverData.id)
      .order("created_at", { ascending: false });

    setDocuments(documentData || []);

    /*
     * Berichten
     */
    const { data: messageData } = await supabase
      .from("messages")
      .select("*")
      .eq("driver_id", driverData.id)
      .order("created_at", { ascending: false })
      .limit(5);

    setMessages(messageData || []);

    /*
     * Notificaties
     */
    const { data: notificationData } = await supabase
      .from("notifications")
      .select("*")
      .eq("driver_id", driverData.id)
      .order("created_at", { ascending: false })
      .limit(5);

    setNotifications(notificationData || []);

    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/driver/login");
  }

  function formatDate(date: string | null) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatAmount(amount: number) {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  }

  function statusLabel(status: string | null) {
    if (!status) return "-";

    const labels: Record<string, string> = {
      approved: "Goedgekeurd",
      active: "Actief",
      available: "Beschikbaar",
      in_use: "In gebruik",
      maintenance: "Onderhoud",
      open: "Open",
      paid: "Betaald",
      pending: "In behandeling",
      overdue: "Achterstallig",
      approved_document: "Goedgekeurd",
      rejected: "Afgekeurd",
      expired: "Verlopen",
      missing: "Ontbreekt",
    };

    return labels[status] || status;
  }

  if (loading) {
    return (
      <main className="page">
        <div className="loading">
          <div className="logo-small">♛</div>
          <p>Chauffeuromgeving laden...</p>
        </div>

        <style jsx>{`
          .page {
            min-height: 100vh;
            background: #f7f6f3;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .loading {
            text-align: center;
            color: #777;
          }

          .logo-small {
            color: #b38a32;
            font-size: 42px;
            margin-bottom: 10px;
          }
        `}</style>
      </main>
    );
  }

  if (error || !driver) {
    return (
      <main className="page">
        <div className="error-card">
          <div className="crown">♛</div>
          <h1>Chauffeursprofiel niet gevonden</h1>
          <p>{error}</p>

          <button onClick={logout}>Uitloggen</button>
        </div>

        <style jsx>{`
          .page {
            min-height: 100vh;
            background: #f7f6f3;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 25px;
          }

          .error-card {
            width: 100%;
            max-width: 500px;
            background: white;
            border: 1px solid #e4e1da;
            border-radius: 22px;
            padding: 40px;
            text-align: center;
          }

          .crown {
            color: #b38a32;
            font-size: 45px;
          }

          h1 {
            color: #151515;
          }

          p {
            color: #777;
            line-height: 1.6;
          }

          button {
            margin-top: 15px;
            border: none;
            background: #181818;
            color: white;
            padding: 13px 22px;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
          }
        `}</style>
      </main>
    );
  }

  const openPayments = payments.filter(
    (payment) =>
      payment.status === "open" ||
      payment.status === "pending" ||
      payment.status === "overdue"
  );

  const unreadMessages = messages.filter(
    (message) => !message.is_read
  ).length;

  const unreadNotifications = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <main className="page">
      <div className="container">

        {/* HEADER */}
        <header className="topbar">
          <div className="brand">
            <div className="crown">♛</div>

            <div>
              <div className="brand-name">IMPERIAL CABS</div>
              <div className="brand-subtitle">CHAUFFEUR PORTAL</div>
            </div>
          </div>

          <button className="logout" onClick={logout}>
            Uitloggen
          </button>
        </header>

        {/* WELCOME */}
        <section className="welcome">
          <div>
            <div className="eyebrow">CHAUFFEUR PORTAL</div>

            <h1>
              Welkom, {driver.full_name.split(" ")[0]}.
            </h1>

            <p>
              Beheer hier jouw voertuig, betalingen, documenten en
              communicatie met Imperial Cabs.
            </p>
          </div>

          <div className="driver-status">
            <span className="status-dot"></span>
            {statusLabel(driver.status)}
          </div>
        </section>

        {/* QUICK STATS */}
        <section className="stats">

          <div className="stat-card">
            <span>VOERTUIG</span>
            <strong>
              {vehicle ? vehicle.model : "Geen voertuig"}
            </strong>
            <small>
              {vehicle?.license_plate || "Nog niet toegewezen"}
            </small>
          </div>

          <div className="stat-card">
            <span>OPENSTAAND</span>
            <strong>
              {formatAmount(
                openPayments.reduce(
                  (total, payment) => total + Number(payment.amount),
                  0
                )
              )}
            </strong>
            <small>{openPayments.length} betaling(en)</small>
          </div>

          <div className="stat-card">
            <span>BERICHTEN</span>
            <strong>{unreadMessages}</strong>
            <small>ongelezen</small>
          </div>

          <div className="stat-card">
            <span>MELDINGEN</span>
            <strong>{unreadNotifications}</strong>
            <small>ongelezen</small>
          </div>

        </section>

        {/* MAIN GRID */}
        <section className="grid">

          {/* VEHICLE */}
          <Link href="/driver/vehicle" className="card black-card">
            <div className="card-top">
              <span className="card-label">MIJN VOERTUIG</span>
              <span className="arrow">→</span>
            </div>

            {vehicle ? (
              <>
                <h2>
                  {vehicle.brand} {vehicle.model}
                </h2>

                <div className="plate">
                  {vehicle.license_plate}
                </div>

                <p>
                  {vehicle.year || "-"} ·{" "}
                  {statusLabel(vehicle.status)}
                </p>
              </>
            ) : (
              <>
                <h2>Geen voertuig</h2>
                <p>Er is nog geen voertuig aan jou gekoppeld.</p>
              </>
            )}
          </Link>

          {/* PAYMENTS */}
          <Link href="/driver/payments" className="card">
            <div className="card-top">
              <span className="card-label">BETALINGEN</span>
              <span className="arrow gold-arrow">→</span>
            </div>

            <h2>
              {openPayments.length > 0
                ? formatAmount(
                    openPayments.reduce(
                      (total, payment) =>
                        total + Number(payment.amount),
                      0
                    )
                  )
                : "€0,00"}
            </h2>

            <p>
              {openPayments.length > 0
                ? `${openPayments.length} openstaande betaling(en)`
                : "Geen openstaande betalingen"}
            </p>
          </Link>

          {/* DOCUMENTS */}
          <Link href="/driver/documents" className="card">
            <div className="card-top">
              <span className="card-label">DOCUMENTEN</span>
              <span className="arrow gold-arrow">→</span>
            </div>

            <h2>{documents.length}</h2>

            <p>
              document{documents.length === 1 ? "" : "en"} geregistreerd
            </p>
          </Link>

          {/* DAMAGE */}
          <Link href="/driver/damage" className="card">
            <div className="card-top">
              <span className="card-label">SCHADE MELDEN</span>
              <span className="arrow gold-arrow">→</span>
            </div>

            <h2>Nieuwe schade</h2>

            <p>
              Meld schade aan je voertuig en voeg foto's toe.
            </p>
          </Link>

          {/* MAINTENANCE */}
          <Link href="/driver/maintenance" className="card">
            <div className="card-top">
              <span className="card-label">ONDERHOUD</span>
              <span className="arrow gold-arrow">→</span>
            </div>

            <h2>Onderhoud</h2>

            <p>
              Bekijk onderhoud en geplande werkzaamheden.
            </p>
          </Link>

          {/* CONTRACT */}
          <Link href="/driver/contract" className="card">
            <div className="card-top">
              <span className="card-label">CONTRACT</span>
              <span className="arrow gold-arrow">→</span>
            </div>

            <h2>Mijn contract</h2>

            <p>
              Bekijk jouw contractgegevens.
            </p>
          </Link>

        </section>

        {/* COMMUNICATION */}
        <section className="communication">

          <div className="section-heading">
            <div>
              <div className="eyebrow">COMMUNICATIE</div>
              <h2>Contact met Imperial Cabs</h2>
            </div>
          </div>

          <div className="communication-grid">

            <Link
              href="/driver/messages"
              className="communication-card"
            >
              <div>
                <span className="communication-label">
                  BERICHTEN
                </span>

                <h3>Mijn berichten</h3>

                <p>
                  Bekijk je communicatie met Imperial Cabs.
                </p>
              </div>

              <div className="communication-bottom">
                <strong>{unreadMessages}</strong>
                <span>ongelezen →</span>
              </div>
            </Link>

            <Link
              href="/driver/notifications"
              className="communication-card"
            >
              <div>
                <span className="communication-label">
                  MELDINGEN
                </span>

                <h3>Mijn notificaties</h3>

                <p>
                  Belangrijke updates en meldingen.
                </p>
              </div>

              <div className="communication-bottom">
                <strong>{unreadNotifications}</strong>
                <span>ongelezen →</span>
              </div>
            </Link>

          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section className="recent">

          <div className="section-heading">
            <div>
              <div className="eyebrow">RECENT</div>
              <h2>Laatste activiteit</h2>
            </div>
          </div>

          {messages.length === 0 &&
          notifications.length === 0 &&
          payments.length === 0 ? (
            <div className="empty">
              Nog geen recente activiteit.
            </div>
          ) : (
            <div className="activity-list">

              {messages.slice(0, 3).map((message) => (
                <div className="activity" key={`message-${message.id}`}>
                  <div className="activity-icon">M</div>

                  <div className="activity-content">
                    <strong>Nieuw bericht</strong>

                    <p>
                      {message.message.length > 90
                        ? `${message.message.slice(0, 90)}...`
                        : message.message}
                    </p>
                  </div>

                  <span>
                    {formatDate(message.created_at)}
                  </span>
                </div>
              ))}

              {notifications.slice(0, 3).map((notification) => (
                <div
                  className="activity"
                  key={`notification-${notification.id}`}
                >
                  <div className="activity-icon gold-icon">!</div>

                  <div className="activity-content">
                    <strong>{notification.title}</strong>

                    <p>
                      {notification.message.length > 90
                        ? `${notification.message.slice(0, 90)}...`
                        : notification.message}
                    </p>
                  </div>

                  <span>
                    {formatDate(notification.created_at)}
                  </span>
                </div>
              ))}

            </div>
          )}

        </section>

        {/* FOOTER */}
        <footer>
          <strong>IMPERIAL CABS B.V.</strong>
          <span>KVK 99325330</span>
          <span>Amsterdam & omgeving</span>
        </footer>

      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f7f6f3;
          color: #181818;
          padding: 35px 25px 60px;
        }

        .container {
          max-width: 1250px;
          margin: 0 auto;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 60px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .crown {
          color: #b38a32;
          font-size: 35px;
          line-height: 1;
        }

        .brand-name {
          font-size: 21px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .brand-subtitle {
          color: #9b7427;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-top: 3px;
        }

        .logout {
          border: none;
          background: #181818;
          color: white;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
        }

        .logout:hover {
          background: #000;
        }

        .welcome {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-bottom: 35px;
        }

        .eyebrow {
          color: #b38a32;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 3px;
          margin-bottom: 9px;
        }

        .welcome h1 {
          margin: 0;
          font-size: 48px;
          letter-spacing: -1.8px;
        }

        .welcome p {
          color: #777;
          max-width: 650px;
          font-size: 17px;
          line-height: 1.6;
          margin: 12px 0 0;
        }

        .driver-status {
          background: white;
          border: 1px solid #e4e1da;
          padding: 12px 17px;
          border-radius: 30px;
          font-weight: 700;
          white-space: nowrap;
        }

        .status-dot {
          display: inline-block;
          width: 9px;
          height: 9px;
          background: #5a8d5c;
          border-radius: 50%;
          margin-right: 8px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 25px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e4e1da;
          border-radius: 17px;
          padding: 22px;
        }

        .stat-card span {
          display: block;
          color: #888;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 9px;
        }

        .stat-card strong {
          display: block;
          color: #b38a32;
          font-size: 28px;
        }

        .stat-card small {
          color: #999;
          display: block;
          margin-top: 4px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .card {
          display: block;
          min-height: 205px;
          box-sizing: border-box;
          background: white;
          border: 1px solid #e4e1da;
          border-radius: 20px;
          padding: 26px;
          text-decoration: none;
          color: #181818;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.07);
        }

        .black-card {
          background: #181818;
          border-color: #181818;
          color: white;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-label {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 2px;
          color: #888;
        }

        .black-card .card-label {
          color: #b38a32;
        }

        .arrow {
          font-size: 23px;
          color: #b38a32;
        }

        .card h2 {
          font-size: 26px;
          margin: 38px 0 8px;
        }

        .card p {
          color: #888;
          line-height: 1.5;
          margin: 0;
        }

        .black-card p {
          color: #aaa;
        }

        .plate {
          display: inline-block;
          background: #f5d34f;
          color: #111;
          border: 2px solid #111;
          border-radius: 5px;
          padding: 5px 12px;
          font-weight: 800;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }

        .communication,
        .recent {
          margin-top: 60px;
        }

        .section-heading {
          margin-bottom: 20px;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 30px;
          letter-spacing: -0.8px;
        }

        .communication-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .communication-card {
          min-height: 190px;
          background: #181818;
          color: white;
          border-radius: 20px;
          padding: 28px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.18s ease;
        }

        .communication-card:hover {
          transform: translateY(-3px);
        }

        .communication-label {
          color: #b38a32;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .communication-card h3 {
          font-size: 25px;
          margin: 15px 0 7px;
        }

        .communication-card p {
          color: #aaa;
          margin: 0;
        }

        .communication-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 25px;
        }

        .communication-bottom strong {
          color: #b38a32;
          font-size: 30px;
        }

        .communication-bottom span {
          color: #ddd;
          font-weight: 700;
        }

        .activity-list {
          background: white;
          border: 1px solid #e4e1da;
          border-radius: 20px;
          overflow: hidden;
        }

        .activity {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          border-bottom: 1px solid #ece9e2;
        }

        .activity:last-child {
          border-bottom: none;
        }

        .activity-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #181818;
          color: #b38a32;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
        }

        .gold-icon {
          background: #f1ecdf;
          color: #9b7427;
        }

        .activity-content {
          flex: 1;
        }

        .activity-content strong {
          display: block;
          margin-bottom: 4px;
        }

        .activity-content p {
          margin: 0;
          color: #777;
        }

        .activity > span {
          color: #999;
          font-size: 13px;
          white-space: nowrap;
        }

        .empty {
          background: white;
          border: 1px solid #e4e1da;
          border-radius: 20px;
          padding: 35px;
          color: #888;
          text-align: center;
        }

        footer {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-top: 70px;
          padding-top: 25px;
          border-top: 1px solid #ddd8ce;
          color: #999;
          font-size: 13px;
        }

        footer strong {
          color: #555;
        }

        @media (max-width: 900px) {
          .stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .welcome h1 {
            font-size: 40px;
          }
        }

        @media (max-width: 650px) {
          .page {
            padding: 22px 15px 45px;
          }

          .topbar {
            margin-bottom: 40px;
          }

          .welcome {
            align-items: flex-start;
            flex-direction: column;
          }

          .welcome h1 {
            font-size: 35px;
          }

          .stats,
          .grid,
          .communication-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            padding: 19px;
          }

          .card {
            min-height: 180px;
          }

          .activity {
            align-items: flex-start;
          }

          .activity > span {
            display: none;
          }

          footer {
            flex-direction: column;
            align-items: center;
            gap: 7px;
          }
        }
      `}</style>
    </main>
  );
}
