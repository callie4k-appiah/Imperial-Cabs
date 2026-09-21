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
      supabase
        .from("driver")
        .select("id", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("vehicle")
        .select("id", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("applications")
        .select("id", {
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
      setError(
        "Een deel van het dashboard kon niet worden geladen."
      );
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
        <div className="loading">
          Dashboard laden...
        </div>

        <style jsx>{`
          .dashboard {
            min-height: 100vh;
            background: #f7f6f3;
            padding: 50px;
          }

          .loading {
            color: #b18732;
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

        <header className="dashboard-header">

          <div className="header-content">

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
            <span className="status-dot" />
            Systeem actief
          </div>

        </header>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {/* COMMUNICATIE */}

        <section className="dashboard-section communication-section">

          <div className="section-heading">

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

              <div className="communication-content">

                <span>
                  Ongelezen berichten
                </span>

                <strong>
                  {counts.unreadMessages}
                </strong>

                <small>
                  Bekijk alle berichten →
                </small>

              </div>

              <div className="communication-arrow">
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

              <div className="communication-content">

                <span>
                  Ongelezen notificaties
                </span>

                <strong>
                  {counts.unreadNotifications}
                </strong>

                <small>
                  Bekijk alle notificaties →
                </small>

              </div>

              <div className="communication-arrow">
                →
              </div>

            </Link>

          </div>

        </section>

        {/* FLEET MANAGEMENT */}

        <section className="dashboard-section">

          <div className="section-heading">

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

        {/* SNELLE ACTIES */}

        <section className="dashboard-section quick-section">

          <div className="section-heading">

            <div>

              <div className="section-label">
                SNELLE ACTIES
              </div>

              <h2>
                Snelle acties
              </h2>

              <p>
                Veelgebruikte acties direct openen.
              </p>

            </div>

          </div>

          <div className="actions-grid">

            <ActionButton
              href="/admin/drivers/new"
              icon="+"
              text="Nieuwe chauffeur"
              primary
            />

            <ActionButton
              href="/admin/vehicle/new"
              icon="+"
              text="Nieuw voertuig"
              primary
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

        <footer className="dashboard-footer">

          <div className="footer-left">

            <strong>
              IMPERIAL CABS
            </strong>

            <span className="footer-divider">
              |
            </span>

            <span>
              Taxi Fleet Management
            </span>

          </div>

          <span>
            Amsterdam & omgeving
          </span>

        </footer>

      </div>

      <style jsx global>{`

        * {
          box-sizing: border-box;
        }

        .dashboard {
          min-height: 100vh;
          background: #f7f6f3;
          color: #171717;
          padding: 55px 40px;
        }

        .dashboard-container {
          width: 100%;
          max-width: 1220px;
          margin: 0 auto;
        }

        /* ==============================
           HEADER
        ============================== */

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 30px;
          margin-bottom: 55px;
        }

        .brand {
          color: #b18732;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 4px;
          margin-bottom: 15px;
        }

        .dashboard-header h1 {
          margin: 0;
          color: #151515;
          font-size: 52px;
          line-height: 1;
          letter-spacing: -2px;
          font-weight: 800;
        }

        .dashboard-header p {
          margin: 14px 0 0;
          color: #777;
          font-size: 17px;
        }

        .system-status {
          display: flex;
          align-items: center;
          gap: 9px;

          background: #171717;
          color: white;

          padding: 13px 18px;
          border-radius: 30px;

          font-size: 13px;
          font-weight: 700;

          white-space: nowrap;

          box-shadow:
            0 5px 15px rgba(0, 0, 0, 0.12);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d2ad5b;
          box-shadow:
            0 0 10px rgba(210, 173, 91, 0.7);
        }

        /* ==============================
           SECTIONS
        ============================== */

        .dashboard-section {
          margin-top: 52px;
        }

        .communication-section {
          margin-top: 0;
        }

        .section-heading {
          margin-bottom: 22px;
        }

        .section-label {
          color: #b18732;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 3px;
          margin-bottom: 8px;
        }

        .section-heading h2 {
          margin: 0;
          color: #171717;
          font-size: 27px;
          line-height: 1.15;
          font-weight: 800;
        }

        .section-heading p {
          margin: 7px 0 0;
          color: #777;
          font-size: 15px;
        }

        /* ==============================
           COMMUNICATION
        ============================== */

        .communication-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .communication-card {
          display: flex;
          align-items: center;
          gap: 20px;

          min-height: 130px;

          padding: 24px 25px;

          background: #171717;

          border: 1px solid #171717;
          border-radius: 17px;

          color: white;
          text-decoration: none;

          box-shadow:
            0 8px 25px rgba(0, 0, 0, 0.08);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .communication-card:hover {
          transform: translateY(-3px);

          border-color: #c9a24a;

          box-shadow:
            0 14px 32px rgba(0, 0, 0, 0.15);
        }

        .communication-icon {
          width: 58px;
          height: 58px;
          min-width: 58px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #282117;

          border: 1px solid #6a5426;
          border-radius: 14px;

          font-size: 25px;
        }

        .communication-content {
          flex: 1;
        }

        .communication-content span {
          display: block;

          color: #bdbdbd;

          font-size: 13px;
          font-weight: 600;

          margin-bottom: 5px;
        }

        .communication-content strong {
          display: block;

          color: #d2ad5b;

          font-size: 36px;
          line-height: 1;

          margin-bottom: 7px;

          font-weight: 900;
        }

        .communication-content small {
          color: #d5d5d5;
          font-size: 13px;
          font-weight: 600;
        }

        .communication-arrow {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #d2ad5b;
          color: #111;

          border-radius: 50%;

          font-size: 23px;
          font-weight: 900;
        }

        /* ==============================
           FLEET CARDS
        ============================== */

        .fleet-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .fleet-card {
          position: relative;

          display: flex;
          flex-direction: column;

          min-height: 175px;

          padding: 22px;

          background: #ffffff;

          border: 1px solid #dedbd4;
          border-radius: 17px;

          color: #171717;
          text-decoration: none;

          box-shadow:
            0 3px 12px rgba(0, 0, 0, 0.035);

          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .fleet-card:hover {
          transform: translateY(-3px);

          border-color: #c6a75e;

          box-shadow:
            0 12px 28px rgba(0, 0, 0, 0.09);
        }

        .fleet-icon {
          width: 48px;
          height: 48px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #f5efe1;

          border: 1px solid #e4d5b1;
          border-radius: 12px;

          font-size: 22px;

          margin-bottom: 17px;
        }

        .fleet-card h3 {
          margin: 0 0 8px;

          color: #171717;

          font-size: 18px;
          font-weight: 800;
        }

        .fleet-count {
          color: #a47a25;

          font-size: 37px;
          line-height: 1;

          font-weight: 900;

          margin-bottom: 7px;
        }

        .fleet-text {
          color: #777;

          font-size: 13px;
        }

        .fleet-card::after {
          content: "→";

          position: absolute;

          right: 18px;
          top: 50%;

          transform: translateY(-50%);

          width: 36px;
          height: 36px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #f7f0df;

          color: #a47a25;

          border-radius: 50%;

          font-size: 20px;
          font-weight: 800;

          opacity: 0.9;
        }

        /* ==============================
           QUICK ACTIONS
        ============================== */

        .quick-section {
          margin-top: 58px;
        }

        .actions-grid {
          display: grid;

          grid-template-columns:
            repeat(5, minmax(0, 1fr));

          gap: 14px;
        }

        .action-button {
          min-height: 54px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 9px;

          padding: 0 16px;

          background: #171717;

          color: white;

          border: 1px solid #171717;
          border-radius: 11px;

          text-decoration: none;

          font-size: 14px;
          font-weight: 800;

          box-shadow:
            0 5px 15px rgba(0, 0, 0, 0.08);

          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .action-button:hover {
          transform: translateY(-2px);

          background: #000000;

          border-color: #c9a24a;

          box-shadow:
            0 8px 20px rgba(0, 0, 0, 0.14);
        }

        .action-button.primary {
          background: #d2ad5b;
          color: #111111;
          border-color: #d2ad5b;
        }

        .action-button.primary:hover {
          background: #e0bd67;
          border-color: #e0bd67;

          box-shadow:
            0 8px 22px rgba(177, 135, 50, 0.22);
        }

        .action-icon {
          font-size: 18px;
          font-weight: 900;
        }

        /* ==============================
           ERROR
        ============================== */

        .error-box {
          background: #fff2f2;

          border: 1px solid #e6caca;

          color: #9b3d3d;

          padding: 15px 18px;

          border-radius: 11px;

          margin-bottom: 25px;
        }

        /* ==============================
           FOOTER
        ============================== */

        .dashboard-footer {
          display: flex;

          justify-content: space-between;
          align-items: center;

          margin-top: 65px;

          padding-top: 24px;

          border-top: 1px solid #dedbd4;

          color: #777;

          font-size: 13px;
        }

        .footer-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-left strong {
          color: #b18732;
          letter-spacing: 2px;
        }

        .footer-divider {
          color: #bbb;
        }

        /* ==============================
           TABLET
        ============================== */

        @media (max-width: 1000px) {

          .actions-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }

          .fleet-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        /* ==============================
           MOBILE
        ============================== */

        @media (max-width: 700px) {

          .dashboard {
            padding: 30px 18px;
          }

          .dashboard-header {
            flex-direction: column;
          }

          .dashboard-header h1 {
            font-size: 40px;
          }

          .communication-grid {
            grid-template-columns: 1fr;
          }

          .fleet-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

        }

      `}</style>
    </main>
  );
}

/* =========================================
   FLEET CARD
========================================= */

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

/* =========================================
   ACTION BUTTON
========================================= */

function ActionButton({
  href,
  icon,
  text,
  primary = false,
}: {
  href: string;
  icon: string;
  text: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`action-button ${
        primary ? "primary" : ""
      }`}
    >

      <span className="action-icon">
        {icon}
      </span>

      <span>
        {text}
      </span>

    </Link>
  );
}
