"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Counts = {
  drivers: number;
  vehicles: number;
  applications: number;
  payments: number;
  damages: number;
  maintenance: number;
  unreadMessages: number;
  unreadNotifications: number;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [counts, setCounts] = useState<Counts>({
    drivers: 0,
    vehicles: 0,
    applications: 0,
    payments: 0,
    damages: 0,
    maintenance: 0,
    unreadMessages: 0,
    unreadNotifications: 0,
  });

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
      router.push("/admin/login");
      return;
    }

    const [
      drivers,
      vehicles,
      applications,
      payments,
      damages,
      maintenance,
      messages,
      notifications,
    ] = await Promise.all([
      supabase.from("driver").select("id", {
        count: "exact",
        head: true,
      }),

      supabase.from("vehicle").select("id", {
        count: "exact",
        head: true,
      }),

      supabase.from("applications").select("id", {
        count: "exact",
        head: true,
      }),

      supabase
        .from("payments")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("status", "open"),

      supabase
        .from("damage_reports")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("status", "open"),

      supabase
        .from("maintenance")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("status", "open"),

      supabase
        .from("messages")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("is_read", false),

      supabase
        .from("notifications")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("is_read", false),
    ]);

    const hasError = [
      drivers.error,
      vehicles.error,
      applications.error,
      payments.error,
      damages.error,
      maintenance.error,
      messages.error,
      notifications.error,
    ].some(Boolean);

    if (hasError) {
      setError("Een deel van het dashboard kon niet worden geladen.");
    }

    setCounts({
      drivers: drivers.count || 0,
      vehicles: vehicles.count || 0,
      applications: applications.count || 0,
      payments: payments.count || 0,
      damages: damages.count || 0,
      maintenance: maintenance.count || 0,
      unreadMessages: messages.count || 0,
      unreadNotifications: notifications.count || 0,
    });

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="dashboard">
        <div className="loading">Dashboard laden...</div>

        <style jsx>{`
          .dashboard {
            min-height: 100vh;
            background: #0a0a0a;
            color: white;
            padding: 50px;
          }

          .loading {
            color: #d2ad5b;
            font-size: 18px;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <div className="dashboard-container">

        {/* HEADER */}

        <header className="header">

          <div>
            <div className="brand">
              IMPERIAL CABS
            </div>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Beheer je volledige taxi fleet vanuit één omgeving.
            </p>
          </div>

          <div className="system-status">
            <span />
            Systeem actief
          </div>

        </header>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {/* COMMUNICATION */}

        <section className="section">

          <div className="section-header">

            <div>
              <div className="section-label">
                COMMUNICATIE
              </div>

              <h2>
                Berichten & notificaties
              </h2>

              <p>
                Nieuwe communicatie die aandacht nodig heeft.
              </p>
            </div>

          </div>

          <div className="communication-grid">

            <Link
              href="/admin/messages"
              className="communication-card"
            >

              <div className="communication-icon">
                💬
              </div>

              <div className="communication-text">

                <span>
                  Ongelezen berichten
                </span>

                <strong>
                  {counts.unreadMessages}
                </strong>

                <small>
                  Bekijk alle berichten
                </small>

              </div>

              <div className="card-arrow">
                →
              </div>

            </Link>

            <Link
              href="/admin/notifications"
              className="communication-card"
            >

              <div className="communication-icon">
                🔔
              </div>

              <div className="communication-text">

                <span>
                  Ongelezen notificaties
                </span>

                <strong>
                  {counts.unreadNotifications}
                </strong>

                <small>
                  Bekijk alle notificaties
                </small>

              </div>

              <div className="card-arrow">
                →
              </div>

            </Link>

          </div>

        </section>

        {/* FLEET */}

        <section className="section">

          <div className="section-header">

            <div>
              <div className="section-label">
                FLEET MANAGEMENT
              </div>

              <h2>
                Overzicht
              </h2>

              <p>
                Belangrijkste onderdelen van Imperial Cabs.
              </p>
            </div>

          </div>

          <div className="fleet-grid">

            <DashboardCard
              href="/admin/drivers"
              icon="👤"
              title="Chauffeurs"
              count={counts.drivers}
              text="Geregistreerde chauffeurs"
            />

            <DashboardCard
              href="/admin/vehicle"
              icon="🚗"
              title="Voertuigen"
              count={counts.vehicles}
              text="Voertuigen in systeem"
            />

            <DashboardCard
              href="/admin/applications"
              icon="📋"
              title="Aanvragen"
              count={counts.applications}
              text="Chauffeursaanvragen"
            />

            <DashboardCard
              href="/admin/payments"
              icon="€"
              title="Open betalingen"
              count={counts.payments}
              text="Betalingen open"
            />

            <DashboardCard
              href="/admin/damage-reports"
              icon="⚠️"
              title="Open schades"
              count={counts.damages}
              text="Schademeldingen"
            />

            <DashboardCard
              href="/admin/maintenance"
              icon="🔧"
              title="Onderhoud"
              count={counts.maintenance}
              text="Open onderhoud"
            />

          </div>

        </section>

        {/* QUICK ACTIONS */}

        <section className="section">

          <div className="section-header">

            <div>
              <div className="section-label">
                SNEL ACTIE
              </div>

              <h2>
                Snelle acties
              </h2>

              <p>
                Veelgebruikte acties direct openen.
              </p>
            </div>

          </div>

          <div className="actions">

            <ActionButton
              href="/admin/drivers/new"
              icon="+"
              text="Nieuwe chauffeur"
            />

            <ActionButton
              href="/admin/vehicle/new"
              icon="+"
              text="Nieuw voertuig"
            />

            <ActionButton
              href="/admin/applications"
              icon="📋"
              text="Aanvragen bekijken"
            />

            <ActionButton
              href="/admin/messages/new"
              icon="💬"
              text="Nieuw bericht"
            />

            <ActionButton
              href="/admin/notifications/new"
              icon="🔔"
              text="Nieuwe notificatie"
            />

          </div>

        </section>

        {/* FOOTER */}

        <footer className="footer">

          <div>
            <strong>
              IMPERIAL CABS
            </strong>

            <span>
              Taxi Fleet Management
            </span>
          </div>

          <span>
            Amsterdam & omgeving
          </span>

        </footer>

      </div>

      <style jsx>{`

        /* =========================
           PAGE
        ========================= */

        .dashboard {
          min-height: 100vh;
          background: #0a0a0a;
          color: #ffffff;
          padding: 50px;
        }

        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* =========================
           HEADER
        ========================= */

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 30px;
          margin-bottom: 65px;
        }

        .brand {
          color: #d2ad5b;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 4px;
          margin-bottom: 15px;
        }

        h1 {
          margin: 0;
          font-size: 54px;
          line-height: 1;
          letter-spacing: -2px;
          color: #ffffff;
        }

        .header p {
          margin: 15px 0 0;
          color: #888888;
          font-size: 17px;
        }

        .system-status {
          display: flex;
          align-items: center;
          gap: 9px;
          background: #151515;
          border: 1px solid #363636;
          border-radius: 30px;
          padding: 12px 17px;
          color: #bdbdbd;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
        }

        .system-status span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d2ad5b;
          box-shadow: 0 0 12px rgba(210, 173, 91, 0.7);
        }

        /* =========================
           SECTIONS
        ========================= */

        .section {
          margin-top: 60px;
        }

        .section:first-of-type {
          margin-top: 0;
        }

        .section-header {
          margin-bottom: 25px;
        }

        .section-label {
          color: #d2ad5b;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 3px;
          margin-bottom: 8px;
        }

        .section-header h2 {
          margin: 0;
          font-size: 27px;
          color: #ffffff;
        }

        .section-header p {
          margin: 7px 0 0;
          color: #777777;
          font-size: 15px;
        }

        /* =========================
           COMMUNICATION
        ========================= */

        .communication-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .communication-card {
          display: flex;
          align-items: center;
          gap: 20px;

          min-height: 125px;

          padding: 25px;

          background: #151515;
          border: 1px solid #3a3a3a;
          border-radius: 20px;

          color: white;
          text-decoration: none;

          transition: all 0.2s ease;
        }

        .communication-card:hover {
          background: #1b1b1b;
          border-color: #d2ad5b;
          transform: translateY(-3px);

          box-shadow:
            0 15px 35px rgba(0, 0, 0, 0.4),
            0 0 25px rgba(210, 173, 91, 0.08);
        }

        .communication-icon {
          width: 58px;
          height: 58px;
          min-width: 58px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #211d14;
          border: 1px solid #5c4923;
          border-radius: 15px;

          font-size: 24px;
        }

        .communication-text {
          flex: 1;
        }

        .communication-text span {
          display: block;
          color: #999999;
          font-size: 13px;
          margin-bottom: 5px;
        }

        .communication-text strong {
          display: block;
          color: #d2ad5b;
          font-size: 36px;
          line-height: 1;
          margin-bottom: 7px;
        }

        .communication-text small {
          color: #777777;
          font-size: 13px;
        }

        .card-arrow {
          color: #d2ad5b;
          font-size: 31px;
          font-weight: 700;
        }

        /* =========================
           FLEET CARDS
        ========================= */

        .fleet-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .fleet-card {
          display: block;

          min-height: 165px;

          padding: 25px;

          background: #151515;
          border: 1px solid #383838;
          border-radius: 19px;

          color: white;
          text-decoration: none;

          transition: all 0.2s ease;
        }

        .fleet-card:hover {
          background: #1b1b1b;
          border-color: #d2ad5b;
          transform: translateY(-3px);

          box-shadow:
            0 12px 30px rgba(0, 0, 0, 0.35);
        }

        .fleet-icon {
          width: 46px;
          height: 46px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #211d14;
          border: 1px solid #5c4923;
          border-radius: 12px;

          font-size: 21px;

          margin-bottom: 20px;
        }

        .fleet-card h3 {
          margin: 0 0 13px;
          font-size: 18px;
          color: #eeeeee;
        }

        .fleet-count {
          color: #d2ad5b;
          font-size: 38px;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 8px;
        }

        .fleet-text {
          color: #777777;
          font-size: 13px;
        }

        /* =========================
           QUICK ACTIONS
        ========================= */

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
        }

        .action-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;

          min-height: 48px;

          padding: 0 21px;

          background: #d2ad5b;
          color: #080808;

          border: 1px solid #d2ad5b;
          border-radius: 11px;

          text-decoration: none;

          font-size: 14px;
          font-weight: 900;

          box-shadow:
            0 5px 15px rgba(0, 0, 0, 0.3);

          transition: all 0.2s ease;
        }

        .action-button:hover {
          background: #e4c574;
          border-color: #e4c574;

          transform: translateY(-3px);

          box-shadow:
            0 10px 25px rgba(210, 173, 91, 0.18);
        }

        .action-icon {
          font-size: 17px;
          font-weight: 900;
        }

        /* =========================
           ERROR
        ========================= */

        .error {
          background: #291616;
          border: 1px solid #5c2929;
          color: #e3aaaa;

          padding: 15px 18px;
          border-radius: 12px;

          margin-bottom: 25px;
        }

        /* =========================
           FOOTER
        ========================= */

        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;

          margin-top: 75px;
          padding-top: 25px;

          border-top: 1px solid #292929;

          color: #666666;
          font-size: 13px;
        }

        .footer div {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer strong {
          color: #d2ad5b;
          letter-spacing: 2px;
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 900px) {

          .dashboard {
            padding: 35px 25px;
          }

          .header {
            flex-direction: column;
          }

          .communication-grid {
            grid-template-columns: 1fr;
          }

          .fleet-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          h1 {
            font-size: 44px;
          }

        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 600px) {

          .dashboard {
            padding: 25px 16px;
          }

          h1 {
            font-size: 37px;
          }

          .fleet-grid {
            grid-template-columns: 1fr;
          }

          .communication-card {
            padding: 20px;
          }

          .actions {
            flex-direction: column;
          }

          .action-button {
            width: 100%;
            box-sizing: border-box;
          }

          .footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

        }

      `}</style>
    </main>
  );
}

/* =========================
   DASHBOARD CARD
========================= */

function DashboardCard({
  href,
  icon,
  title,
  count,
  text,
}: {
  href: string;
  icon: string;
  title: string;
  count: number;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="fleet-card"
    >

      <div className="fleet-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <div className="fleet-count">
        {count}
      </div>

      <div className="fleet-text">
        {text}
      </div>

    </Link>
  );
}

/* =========================
   ACTION BUTTON
========================= */

function ActionButton({
  href,
  icon,
  text,
}: {
  href: string;
  icon: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="action-button"
    >
      <span className="action-icon">
        {icon}
      </span>

      {text}
    </Link>
  );
}
