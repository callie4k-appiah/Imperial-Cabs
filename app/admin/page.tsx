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
      driversResult,
      vehiclesResult,
      applicationsResult,
      paymentsResult,
      damagesResult,
      maintenanceResult,
      messagesResult,
      notificationsResult,
    ] = await Promise.all([
      supabase
        .from("driver")
        .select("id", { count: "exact", head: true }),

      supabase
        .from("vehicle")
        .select("id", { count: "exact", head: true }),

      supabase
        .from("applications")
        .select("id", { count: "exact", head: true }),

      supabase
        .from("payments")
        .select("id", { count: "exact", head: true })
        .eq("status", "open"),

      supabase
        .from("damage_reports")
        .select("id", { count: "exact", head: true })
        .eq("status", "open"),

      supabase
        .from("maintenance")
        .select("id", { count: "exact", head: true })
        .eq("status", "open"),

      supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false),

      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false),
    ]);

    const errors = [
      driversResult.error,
      vehiclesResult.error,
      applicationsResult.error,
      paymentsResult.error,
      damagesResult.error,
      maintenanceResult.error,
      messagesResult.error,
      notificationsResult.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      setError("Een deel van het dashboard kon niet worden geladen.");
    }

    setCounts({
      drivers: driversResult.count || 0,
      vehicles: vehiclesResult.count || 0,
      applications: applicationsResult.count || 0,
      payments: paymentsResult.count || 0,
      damages: damagesResult.count || 0,
      maintenance: maintenanceResult.count || 0,
      unreadMessages: messagesResult.count || 0,
      unreadNotifications: notificationsResult.count || 0,
    });

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="admin-page">
        <div className="container">
          <div className="loading">
            Dashboard laden...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="container">

        {/* HEADER */}
        <header className="header">
          <div>
            <div className="eyebrow">
              IMPERIAL CABS
            </div>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Beheer chauffeurs, voertuigen en de dagelijkse
              fleetactiviteiten.
            </p>
          </div>

          <div className="header-badge">
            <span className="status-dot"></span>
            Systeem actief
          </div>
        </header>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {/* COMMUNICATIE */}
        <section className="section communication-section">

          <div className="section-heading">
            <div>
              <div className="section-label">
                COMMUNICATIE
              </div>

              <h2>
                Berichten & notificaties
              </h2>

              <p>
                Alles wat nog aandacht nodig heeft.
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
                  {counts.unreadMessages === 1
                    ? "1 bericht wacht op aandacht"
                    : `${counts.unreadMessages} berichten wachten op aandacht`}
                </small>
              </div>

              <span className="arrow">
                →
              </span>
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
                  {counts.unreadNotifications === 1
                    ? "1 notificatie wacht op aandacht"
                    : `${counts.unreadNotifications} notificaties wachten op aandacht`}
                </small>
              </div>

              <span className="arrow">
                →
              </span>
            </Link>

          </div>
        </section>

        {/* OVERZICHT */}
        <section className="section">

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

          <div className="cards-grid">

            <DashboardCard
              href="/admin/drivers"
              icon="👤"
              title="Chauffeurs"
              count={counts.drivers}
              label="Geregistreerde chauffeurs"
            />

            <DashboardCard
              href="/admin/vehicle"
              icon="🚗"
              title="Voertuigen"
              count={counts.vehicles}
              label="Voertuigen in systeem"
            />

            <DashboardCard
              href="/admin/applications"
              icon="📋"
              title="Aanvragen"
              count={counts.applications}
              label="Chauffeursaanvragen"
            />

            <DashboardCard
              href="/admin/payments"
              icon="€"
              title="Open betalingen"
              count={counts.payments}
              label="Betalingen open"
            />

            <DashboardCard
              href="/admin/damage-reports"
              icon="⚠️"
              title="Open schades"
              count={counts.damages}
              label="Schademeldingen"
            />

            <DashboardCard
              href="/admin/maintenance"
              icon="🔧"
              title="Onderhoud"
              count={counts.maintenance}
              label="Open onderhoud"
            />

          </div>
        </section>

        {/* SNELLE ACTIES */}
        <section className="section">

          <div className="section-heading">
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

          <div className="quick-actions">

            <Link href="/admin/drivers/new">
              <span>+</span>
              Nieuwe chauffeur
            </Link>

            <Link href="/admin/vehicle/new">
              <span>+</span>
              Nieuw voertuig
            </Link>

            <Link href="/admin/applications">
              <span>📋</span>
              Aanvragen bekijken
            </Link>

            <Link href="/admin/messages/new">
              <span>💬</span>
              Nieuw bericht
            </Link>

            <Link href="/admin/notifications/new">
              <span>🔔</span>
              Nieuwe notificatie
            </Link>

          </div>
        </section>

        {/* FOOTER */}
        <footer className="dashboard-footer">

          <div className="footer-brand">
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
           BASE
        ========================= */

        .admin-page {
          min-height: 100vh;
          background: #0a0a0a;
          color: #ffffff;
          padding: 45px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .loading {
          color: #c9a24a;
          font-size: 17px;
          padding-top: 40px;
        }

        /* =========================
           HEADER
        ========================= */

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 30px;
          margin-bottom: 55px;
        }

        .eyebrow {
          color: #c9a24a;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 4px;
          margin-bottom: 14px;
        }

        h1 {
          margin: 0;
          color: #ffffff;
          font-size: 52px;
          line-height: 1;
          letter-spacing: -2px;
        }

        .header p {
          color: #909090;
          font-size: 17px;
          margin-top: 14px;
        }

        .header-badge {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 12px 17px;
          background: #151515;
          border: 1px solid #353535;
          border-radius: 30px;
          color: #b5b5b5;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #c9a24a;
          box-shadow: 0 0 12px rgba(201, 162, 74, 0.65);
        }

        /* =========================
           SECTIONS
        ========================= */

        .section {
          margin-top: 50px;
        }

        .communication-section {
          margin-top: 0;
        }

        .section-heading {
          margin-bottom: 22px;
        }

        .section-label {
          color: #c9a24a;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 3px;
          margin-bottom: 8px;
        }

        .section-heading h2 {
          margin: 0;
          color: #ffffff;
          font-size: 25px;
        }

        .section-heading p {
          margin: 7px 0 0;
          color: #777777;
          font-size: 15px;
        }

        /* =========================
           COMMUNICATION CARDS
        ========================= */

        .communication-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .communication-card {
          display: flex;
          align-items: center;
          gap: 18px;
          background: #171717;
          border: 1px solid #3a3a3a;
          border-radius: 20px;
          padding: 25px;
          color: white;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .communication-card:hover {
          border-color: #c9a24a;
          background: #1d1d1d;
          transform: translateY(-3px);
          box-shadow:
            0 12px 35px rgba(0, 0, 0, 0.35),
            0 0 25px rgba(201, 162, 74, 0.08);
        }

        .communication-icon {
          width: 58px;
          height: 58px;
          min-width: 58px;
          border-radius: 15px;
          background: #211d14;
          border: 1px solid #5a4823;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .communication-content {
          flex: 1;
        }

        .communication-content span {
          display: block;
          color: #aaaaaa;
          font-size: 13px;
          margin-bottom: 7px;
        }

        .communication-content strong {
          display: block;
          color: #d2ad5b;
          font-size: 36px;
          line-height: 1;
          margin-bottom: 7px;
        }

        .communication-content small {
          color: #777777;
          font-size: 13px;
        }

        .arrow {
          color: #d2ad5b;
          font-size: 30px;
          font-weight: 700;
        }

        /* =========================
           DASHBOARD CARDS
        ========================= */

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .dashboard-card {
          display: block;
          background: #151515;
          border: 1px solid #363636;
          border-radius: 19px;
          padding: 27px;
          color: white;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .dashboard-card:hover {
          border-color: #c9a24a;
          background: #1a1a1a;
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
        }

        .card-icon {
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #211d14;
          border: 1px solid #5a4823;
          font-size: 21px;
          margin-bottom: 20px;
        }

        .dashboard-card h3 {
          margin: 0 0 13px;
          color: #e9e9e9;
          font-size: 18px;
        }

        .card-count {
          color: #d2ad5b;
          font-size: 39px;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 8px;
        }

        .card-label {
          color: #777777;
          font-size: 13px;
        }

        /* =========================
           QUICK ACTION BUTTONS
        ========================= */

        .quick-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .quick-actions a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;

          background: #c9a24a;
          border: 1px solid #c9a24a;
          border-radius: 11px;

          padding: 14px 20px;

          color: #0a0a0a;
          text-decoration: none;

          font-weight: 800;
          font-size: 14px;

          box-shadow:
            0 4px 14px rgba(0, 0, 0, 0.25);

          transition: all 0.2s ease;
        }

        .quick-actions a:hover {
          background: #e0bd67;
          border-color: #e0bd67;
          color: #080808;

          transform: translateY(-2px);

          box-shadow:
            0 8px 22px rgba(201, 162, 74, 0.20);
        }

        .quick-actions span {
          color: #0a0a0a;
          font-weight: 900;
        }

        /* =========================
           ERROR
        ========================= */

        .error-box {
          background: #241414;
          color: #e5aaaa;
          border: 1px solid #572929;
          padding: 15px 18px;
          border-radius: 12px;
          margin-bottom: 25px;
        }

        /* =========================
           FOOTER
        ========================= */

        .dashboard-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;

          margin-top: 65px;
          padding-top: 25px;

          border-top: 1px solid #292929;

          color: #666666;
          font-size: 13px;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-brand strong {
          color: #c9a24a;
          letter-spacing: 2px;
        }

        .footer-brand span {
          color: #666666;
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 850px) {

          .admin-page {
            padding: 30px 20px;
          }

          .header {
            flex-direction: column;
          }

          h1 {
            font-size: 42px;
          }

          .communication-grid {
            grid-template-columns: 1fr;
          }

          .cards-grid {
            grid-template-columns: 1fr 1fr;
          }

        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 600px) {

          .admin-page {
            padding: 25px 16px;
          }

          h1 {
            font-size: 36px;
          }

          .cards-grid {
            grid-template-columns: 1fr;
          }

          .communication-card {
            padding: 20px;
          }

          .quick-actions {
            flex-direction: column;
          }

          .quick-actions a {
            width: 100%;
            box-sizing: border-box;
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

function DashboardCard({
  href,
  icon,
  title,
  count,
  label,
}: {
  href: string;
  icon: string;
  title: string;
  count: number;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="dashboard-card"
    >
      <div className="card-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <div className="card-count">
        {count}
      </div>

      <div className="card-label">
        {label}
      </div>
    </Link>
  );
}
