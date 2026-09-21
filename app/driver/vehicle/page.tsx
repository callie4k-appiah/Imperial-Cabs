"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

type Driver = {
  id: string;
  full_name: string;
  email: string | null;
};

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
  year: number | null;
  status: string | null;
  assigned_driver_id: string | null;
};

export default function DriverVehiclePage() {
  const router = useRouter();

  const [driver, setDriver] = useState<Driver | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadVehicle();
  }, []);

  async function loadVehicle() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/driver/login");
      return;
    }

    const { data: driverData, error: driverError } = await supabase
      .from("driver")
      .select("id, full_name, email")
      .eq("email", user.email)
      .single();

    if (driverError || !driverData) {
      setError(
        "Er is geen chauffeursprofiel gekoppeld aan dit account."
      );
      setLoading(false);
      return;
    }

    setDriver(driverData);

    const { data: vehicleData, error: vehicleError } = await supabase
      .from("vehicle")
      .select("*")
      .eq("assigned_driver_id", driverData.id)
      .maybeSingle();

    if (vehicleError) {
      setError("Voertuiggegevens konden niet worden geladen.");
      setLoading(false);
      return;
    }

    setVehicle(vehicleData);
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/driver/login");
  }

  function statusLabel(status: string | null) {
    if (!status) return "Onbekend";

    const labels: Record<string, string> = {
      available: "Beschikbaar",
      in_use: "In gebruik",
      maintenance: "Onderhoud",
      inactive: "Inactief",
    };

    return labels[status] || status;
  }

  function statusClass(status: string | null) {
    if (status === "in_use") return "green";
    if (status === "maintenance") return "orange";
    if (status === "inactive") return "red";

    return "gold";
  }

  if (loading) {
    return (
      <main className="page">
        <div className="loading">
          <div className="crown">♛</div>
          <p>Voertuiggegevens laden...</p>
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

          .crown {
            color: #b38a32;
            font-size: 45px;
            margin-bottom: 10px;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">

        {/* HEADER */}
        <header className="topbar">
          <div className="brand">
            <div className="crown">♛</div>

            <div>
              <div className="brand-name">IMPERIAL CABS</div>
              <div className="brand-subtitle">
                CHAUFFEUR PORTAL
              </div>
            </div>
          </div>

          <button className="logout" onClick={logout}>
            Uitloggen
          </button>
        </header>

        {/* BACK */}
        <Link href="/driver" className="back-link">
          ← Terug naar dashboard
        </Link>

        {/* TITLE */}
        <section className="header">
          <div className="eyebrow">MIJN VOERTUIG</div>

          <h1>Mijn voertuig</h1>

          <p>
            Bekijk hier de gegevens van het voertuig dat aan jou is
            toegewezen.
          </p>
        </section>

        {error && (
          <div className="error-card">
            <strong>Er is iets misgegaan</strong>
            <p>{error}</p>
          </div>
        )}

        {!error && !vehicle && (
          <section className="empty-card">
            <div className="empty-icon">🚘</div>

            <h2>Geen voertuig toegewezen</h2>

            <p>
              Er is momenteel geen voertuig aan jouw chauffeursprofiel
              gekoppeld.
            </p>

            <Link href="/driver" className="dark-button">
              Terug naar dashboard
            </Link>
          </section>
        )}

        {vehicle && (
          <>
            {/* VEHICLE HERO */}
            <section className="vehicle-card">

              <div className="vehicle-top">
                <div>
                  <span className="vehicle-label">
                    TOEGEWEZEN VOERTUIG
                  </span>

                  <h2>
                    {vehicle.brand} {vehicle.model}
                  </h2>

                  <p>
                    {vehicle.year || "Bouwjaar onbekend"}
                  </p>
                </div>

                <div
                  className={`status ${statusClass(
                    vehicle.status
                  )}`}
                >
                  <span className="status-dot"></span>
                  {statusLabel(vehicle.status)}
                </div>
              </div>

              <div className="plate">
                <span className="plate-blue">NL</span>
                <strong>{vehicle.license_plate}</strong>
              </div>

            </section>

            {/* DETAILS */}
            <section className="details-card">

              <div className="section-title">
                <div>
                  <div className="eyebrow">VOERTUIGGEGEVENS</div>
                  <h2>Details</h2>
                </div>
              </div>

              <div className="details-grid">

                <div className="detail">
                  <span>Merk</span>
                  <strong>{vehicle.brand}</strong>
                </div>

                <div className="detail">
                  <span>Model</span>
                  <strong>{vehicle.model}</strong>
                </div>

                <div className="detail">
                  <span>Kenteken</span>
                  <strong>{vehicle.license_plate}</strong>
                </div>

                <div className="detail">
                  <span>Bouwjaar</span>
                  <strong>{vehicle.year || "-"}</strong>
                </div>

                <div className="detail">
                  <span>Status</span>
                  <strong>{statusLabel(vehicle.status)}</strong>
                </div>

                <div className="detail">
                  <span>Chauffeur</span>
                  <strong>{driver?.full_name || "-"}</strong>
                </div>

              </div>
            </section>

            {/* ACTIONS */}
            <section className="actions">

              <Link
                href="/driver/damage"
                className="action-card black"
              >
                <div>
                  <span>SCHADE</span>
                  <h3>Schade melden</h3>
                  <p>
                    Meld schade aan dit voertuig en voeg foto's toe.
                  </p>
                </div>

                <strong>→</strong>
              </Link>

              <Link
                href="/driver/maintenance"
                className="action-card"
              >
                <div>
                  <span>ONDERHOUD</span>
                  <h3>Onderhoud bekijken</h3>
                  <p>
                    Bekijk onderhoud en geplande werkzaamheden.
                  </p>
                </div>

                <strong>→</strong>
              </Link>

            </section>
          </>
        )}

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
          max-width: 1100px;
          margin: 0 auto;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 45px;
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

        .back-link {
          display: inline-block;
          color: #9b7427;
          text-decoration: none;
          font-weight: 700;
          margin-bottom: 35px;
        }

        .header {
          margin-bottom: 35px;
        }

        .eyebrow {
          color: #b38a32;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 3px;
          margin-bottom: 9px;
        }

        .header h1 {
          margin: 0;
          font-size: 48px;
          letter-spacing: -1.5px;
        }

        .header p {
          color: #777;
          font-size: 17px;
          line-height: 1.6;
          margin: 12px 0 0;
        }

        .vehicle-card {
          background: #181818;
          color: white;
          border-radius: 22px;
          padding: 35px;
          margin-bottom: 22px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
        }

        .vehicle-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .vehicle-label {
          color: #b38a32;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .vehicle-card h2 {
          font-size: 38px;
          margin: 12px 0 5px;
          letter-spacing: -1px;
        }

        .vehicle-card p {
          color: #aaa;
          margin: 0;
        }

        .status {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 800;
          white-space: nowrap;
        }

        .status.gold {
          background: #3a301e;
          color: #d2aa52;
        }

        .status.green {
          background: #1d3524;
          color: #78bb83;
        }

        .status.orange {
          background: #3b2b1a;
          color: #d8a35b;
        }

        .status.red {
          background: #3b2020;
          color: #e28a8a;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: currentColor;
          border-radius: 50%;
          margin-right: 8px;
        }

        .plate {
          display: inline-flex;
          align-items: center;
          margin-top: 35px;
          background: #f5d34f;
          color: #111;
          border: 3px solid #111;
          border-radius: 6px;
          overflow: hidden;
          font-size: 23px;
          letter-spacing: 2px;
        }

        .plate-blue {
          background: #1c4c8c;
          color: white;
          font-size: 11px;
          letter-spacing: 0;
          padding: 7px 6px;
          align-self: stretch;
          display: flex;
          align-items: center;
        }

        .plate strong {
          padding: 7px 18px;
        }

        .details-card {
          background: white;
          border: 1px solid #e4e1da;
          border-radius: 22px;
          padding: 30px;
          margin-bottom: 22px;
        }

        .section-title h2 {
          margin: 0;
          font-size: 28px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 25px;
        }

        .detail {
          background: #f8f7f4;
          border-radius: 14px;
          padding: 19px;
        }

        .detail span {
          display: block;
          color: #888;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .detail strong {
          font-size: 16px;
          color: #222;
        }

        .actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .action-card {
          background: white;
          border: 1px solid #e4e1da;
          border-radius: 20px;
          padding: 27px;
          text-decoration: none;
          color: #181818;
          display: flex;
          justify-content: space-between;
          min-height: 150px;
          box-sizing: border-box;
          transition: transform 0.18s ease;
        }

        .action-card:hover {
          transform: translateY(-3px);
        }

        .action-card.black {
          background: #181818;
          color: white;
          border-color: #181818;
        }

        .action-card span {
          color: #b38a32;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .action-card h3 {
          font-size: 22px;
          margin: 12px 0 7px;
        }

        .action-card p {
          color: #888;
          margin: 0;
          line-height: 1.5;
        }

        .action-card.black p {
          color: #aaa;
        }

        .action-card > strong {
          color: #b38a32;
          font-size: 25px;
        }

        .empty-card,
        .error-card {
          background: white;
          border: 1px solid #e4e1da;
          border-radius: 22px;
          padding: 45px;
          text-align: center;
        }

        .empty-icon {
          font-size: 45px;
          margin-bottom: 10px;
        }

        .empty-card h2,
        .error-card strong {
          font-size: 25px;
        }

        .empty-card p,
        .error-card p {
          color: #777;
          line-height: 1.6;
        }

        .dark-button {
          display: inline-block;
          background: #181818;
          color: white;
          padding: 13px 20px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 700;
          margin-top: 10px;
        }

        .error-card {
          border-left: 5px solid #b33;
        }

        footer {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-top: 65px;
          padding-top: 25px;
          border-top: 1px solid #ddd8ce;
          color: #999;
          font-size: 13px;
        }

        footer strong {
          color: #555;
        }

        @media (max-width: 800px) {
          .header h1 {
            font-size: 40px;
          }

          .vehicle-top {
            flex-direction: column;
          }

          .details-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .page {
            padding: 22px 15px 45px;
          }

          .topbar {
            margin-bottom: 35px;
          }

          .header h1 {
            font-size: 35px;
          }

          .vehicle-card,
          .details-card,
          .empty-card,
          .error-card {
            padding: 24px;
          }

          .vehicle-card h2 {
            font-size: 30px;
          }

          .details-grid,
          .actions {
            grid-template-columns: 1fr;
          }

          .vehicle-top {
            gap: 25px;
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
