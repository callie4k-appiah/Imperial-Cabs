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
      supabase.from("driver").select("id", { count: "exact", head: true }),

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
          <p>Dashboard laden...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="container">
        <header className="header">
          <div>
            <div className="eyebrow">IMPERIAL CABS</div>

            <h1>Admin Dashboard</h1>

            <p>
              Beheer chauffeurs, voertuigen en de dagelijkse
              fleetactiviteiten.
            </p>
          </div>
        </header>

        {error && <div className="error-box">{error}</div>}

        {/* COMMUNICATIE */}
        <section className="communication-section">
          <div className="section-heading">
            <div>
              <h2>Communicatie</h2>
              <p>Nieuwe berichten en notificaties.</p>
            </div>
          </div>

          <div className="communication-grid">
            <Link href="/admin/messages" className="communication-card">
              <div className="communication-icon">💬</div>

              <div className="communication-content">
                <span>Ongelezen berichten</span>

                <strong>{counts.unreadMessages}</strong>

                <small>
                  {counts.unreadMessages === 1
                    ? "1 bericht wacht op aandacht"
                    : `${counts.unreadMessages} berichten wachten op aandacht`}
                </small>
              </div>

              <span className="arrow">→</span>
            </Link>

            <Link
              href="/admin/notifications"
              className="communication-card"
            >
              <div className="communication-icon">🔔</div>

              <div className="communication-content">
                <span>Ongelezen notificaties</span>

                <strong>{counts.unreadNotifications}</strong>

                <small>
                  {counts.unreadNotifications === 1
                    ? "1 notificatie wacht op aandacht"
                    : `${counts.unreadNotifications} notificaties wachten op aandacht`}
                </small>
              </div>

              <span className="arrow">→</span>
            </Link>
          </div>
        </section>

        {/* OVERZICHT */}
        <section className="section">
          <div className="section-heading">
            <div>
              <h2>Overzicht</h2>
              <p>Belangrijkste onderdelen van Imperial Cabs.</p>
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
              icon="💶"
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
              <h2>Snelle acties</h2>
              <p>Veelgebruikte acties direct openen.</p>
            </div>
          </div>

          <div className="quick-actions">
            <Link href="/admin/drivers/new">
              + Nieuwe chauffeur
            </Link>

            <Link href="/admin/vehicle/new">
              + Nieuw voertuig
            </Link>

            <Link href="/admin/applications">
              📋 Aanvragen bekijken
            </Link>

            <Link href="/admin/messages/new">
              💬 Nieuw bericht
            </Link>

            <Link href="/admin/notifications/new">
              🔔 Nieuwe notificatie
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: #f7f6f3;
          padding: 40px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          margin-bottom: 45px;
        }

        .eyebrow {
          color: #b38a32;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 3px;
          margin-bottom: 12px;
        }

        h1 {
          margin: 0;
          font-size: 50px;
          letter-spacing: -2px;
          color: #151515;
        }

        .header p {
          color: #777;
          font-size: 18px;
          margin-top: 12px;
        }

        .section {
          margin-top: 45px;
        }

        .communication-section {
          margin-bottom: 45px;
        }

        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-heading h2 {
          margin: 0 0 5px;
          font-size: 24px;
          color: #181818;
        }

        .section-heading p {
          margin: 0;
          color: #888;
        }

        .communication-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .communication-card {
          display: flex;
          align-items: center;
          gap: 18px;
          background: #181818;
          color: white;
          text-decoration: none;
          border-radius: 20px;
          padding: 25px;
          border: 1px solid #272727;
          transition: 0.2s ease;
        }

        .communication-card:hover {
          transform: translateY(-2px);
          border-color: #b38a32;
        }

        .communication-icon {
          width: 55px;
          height: 55px;
          min-width: 55px;
          border-radius: 15px;
          background: #2a2a2a;
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
          color: #cfcfcf;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .communication-content strong {
          display: block;
          color: #d9b45a;
          font-size: 32px;
          line-height: 1;
          margin-bottom: 6px;
        }

        .communication-content small {
          color: #999;
        }

        .arrow {
          color: #d9b45a;
          font-size: 22px;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .dashboard-card {
          display: block;
          background: white;
          border: 1px solid #e4e1da;
          border-radius: 20px;
          padding: 27px;
          text-decoration: none;
          color: inherit;
          transition: 0.2s ease;
        }

        .dashboard-card:hover {
          transform: translateY(-2px);
          border-color: #c5a45a;
        }

        .card-icon {
          font-size: 28px;
          margin-bottom: 20px;
        }

        .dashboard-card h3 {
          margin: 0 0 10px;
          font-size: 20px;
          color: #181818;
        }

        .card-count {
          font-size: 38px;
          font-weight: 800;
          color: #a47a25;
          line-height: 1;
          margin-bottom: 8px;
        }

        .card-label {
          color: #888;
          font-size: 14px;
        }

        .quick-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .quick-actions a {
          display: inline-flex;
          align-items: center;
          background: white;
          border: 1px solid #ddd8ce;
          border-radius: 11px;
          padding: 14px 18px;
          color: #333;
          text-decoration: none;
          font-weight: 700;
        }

        .quick-actions a:hover {
          border-color: #b38a32;
          color: #9b7427;
        }

        .error-box {
          background: #fff1f1;
          color: #a33;
          border: 1px solid #efcccc;
          padding: 15px 18px;
          border-radius: 12px;
          margin-bottom: 25px;
        }

        @media (max-width: 850px) {
          .admin-page {
            padding: 25px 20px;
          }

          h1 {
            font-size: 40px;
          }

          .communication-grid,
          .cards-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 550px) {
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
    <Link href={href} className="dashboard-card">
      <div className="card-icon">{icon}</div>

      <h3>{title}</h3>

      <div className="card-count">{count}</div>

      <div className="card-label">{label}</div>
    </Link>
  );
}
