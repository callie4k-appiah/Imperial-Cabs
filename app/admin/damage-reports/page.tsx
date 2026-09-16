"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Driver = {
  id: string;
  full_name: string;
  phone: string | null;
};

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
};

type DamageReport = {
  id: string;
  driver_id: string;
  vehicle_id: string | null;
  description: string;
  damage_date: string;
  location: string | null;
  status: string;
  photo_url: string | null;
  created_at: string;
};

export default function DamageReportsPage() {
  const router = useRouter();

  const [reports, setReports] = useState<DamageReport[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      const [
        { data: damageData, error: damageError },
        { data: driverData, error: driverError },
        { data: vehicleData, error: vehicleError },
      ] = await Promise.all([
        supabase
          .from("damage_reports")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("driver")
          .select("id, full_name, phone"),

        supabase
          .from("vehicle")
          .select("id, brand, model, license_plate"),
      ]);

      if (damageError) {
        console.error("Damage error:", damageError);
      }

      if (driverError) {
        console.error("Driver error:", driverError);
      }

      if (vehicleError) {
        console.error("Vehicle error:", vehicleError);
      }

      setReports(damageData || []);
      setDrivers(driverData || []);
      setVehicles(vehicleData || []);
      setLoading(false);
    }

    loadData();
  }, [router]);

  function getDriverName(driverId: string) {
    const driver = drivers.find((item) => item.id === driverId);

    return driver?.full_name || "Onbekende chauffeur";
  }

  function getDriverPhone(driverId: string) {
    const driver = drivers.find((item) => item.id === driverId);

    return driver?.phone || "";
  }

  function getVehicle(vehicleId: string | null) {
    if (!vehicleId) return null;

    return vehicles.find((item) => item.id === vehicleId) || null;
  }

  function statusLabel(status: string) {
    switch (status) {
      case "open":
        return "Open";

      case "in_review":
        return "In behandeling";

      case "resolved":
        return "Afgerond";

      case "closed":
        return "Gesloten";

      default:
        return status || "Onbekend";
    }
  }

  function statusStyle(status: string) {
    switch (status) {
      case "open":
        return "status open";

      case "in_review":
        return "status review";

      case "resolved":
        return "status resolved";

      case "closed":
        return "status closed";

      default:
        return "status";
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <main className="admin-page">
        <div className="container">
          <p>Schades laden...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="container">

        {/* HEADER */}
        <div className="topbar">
          <div>
            <button
              className="back-button"
              onClick={() => router.push("/admin")}
            >
              ← Dashboard
            </button>

            <div className="eyebrow">
              IMPERIAL CABS
            </div>

            <h1>Schades</h1>

            <p>
              Overzicht van alle gemelde voertuigschades.
            </p>
          </div>

          <button
            className="add-button"
            onClick={() =>
              router.push("/admin/damage-reports/new")
            }
          >
            + Nieuwe schade
          </button>
        </div>

        {/* SUMMARY */}
        <div className="summary">
          <div className="summary-card">
            <span>Totaal schades</span>
            <strong>{reports.length}</strong>
          </div>

          <div className="summary-card">
            <span>Open</span>
            <strong>
              {
                reports.filter(
                  (report) => report.status === "open"
                ).length
              }
            </strong>
          </div>

          <div className="summary-card">
            <span>In behandeling</span>
            <strong>
              {
                reports.filter(
                  (report) =>
                    report.status === "in_review"
                ).length
              }
            </strong>
          </div>

          <div className="summary-card">
            <span>Afgerond</span>
            <strong>
              {
                reports.filter(
                  (report) =>
                    report.status === "resolved" ||
                    report.status === "closed"
                ).length
              }
            </strong>
          </div>
        </div>

        {/* REPORTS */}
        {reports.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              ✓
            </div>

            <h2>Geen schades gevonden</h2>

            <p>
              Er zijn momenteel geen
              schademeldingen geregistreerd.
            </p>

            <button
              className="add-button"
              onClick={() =>
                router.push(
                  "/admin/damage-reports/new"
                )
              }
            >
              + Eerste schade toevoegen
            </button>
          </div>
        ) : (
          <div className="reports">

            {reports.map((report) => {
              const vehicle = getVehicle(
                report.vehicle_id
              );

              return (
                <button
                  key={report.id}
                  type="button"
                  className="report-card"
                  onClick={() =>
                    router.push(
                      `/admin/damage-reports/${report.id}`
                    )
                  }
                >
                  <div className="report-top">

                    <div>
                      <div className="vehicle-title">
                        {vehicle
                          ? `${vehicle.brand} ${vehicle.model}`
                          : "Geen voertuig"}
                      </div>

                      {vehicle && (
                        <div className="license-plate">
                          {vehicle.license_plate}
                        </div>
                      )}
                    </div>

                    <span
                      className={statusStyle(
                        report.status
                      )}
                    >
                      {statusLabel(
                        report.status
                      )}
                    </span>
                  </div>

                  <div className="divider" />

                  <div className="report-info">

                    <div className="info-item">
                      <span>Chauffeur</span>

                      <strong>
                        {getDriverName(
                          report.driver_id
                        )}
                      </strong>
                    </div>

                    <div className="info-item">
                      <span>Datum</span>

                      <strong>
                        {formatDate(
                          report.damage_date
                        )}
                      </strong>
                    </div>

                    <div className="info-item">
                      <span>Locatie</span>

                      <strong>
                        {report.location ||
                          "Niet opgegeven"}
                      </strong>
                    </div>

                  </div>

                  <div className="description">
                    <span>Beschrijving</span>

                    <p>
                      {report.description}
                    </p>
                  </div>

                  <div className="card-footer">
                    <div className="driver-contact">
                      {getDriverPhone(
                        report.driver_id
                      ) && (
                        <>
                          📞{" "}
                          {getDriverPhone(
                            report.driver_id
                          )}
                        </>
                      )}
                    </div>

                    <div className="view-details">
                      Bekijk details →
                    </div>
                  </div>
                </button>
              );
            })}

          </div>
        )}
      </div>

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: #f6f5f2;
          padding: 40px 20px 80px;
          color: #171717;
        }

        .container {
          max-width: 1150px;
          margin: 0 auto;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-bottom: 35px;
        }

        .back-button {
          display: block;
          border: none;
          background: transparent;
          padding: 0;
          margin-bottom: 25px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          color: #555;
        }

        .back-button:hover {
          color: #000;
        }

        .eyebrow {
          color: #b08a3e;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        h1 {
          margin: 0 0 8px;
          font-size: 40px;
          line-height: 1.1;
        }

        .topbar p {
          margin: 0;
          color: #777;
        }

        .add-button {
          border: none;
          background: #171717;
          color: #d4af62;
          padding: 13px 20px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .add-button:hover {
          background: #2a2a2a;
        }

        .summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 25px;
        }

        .summary-card {
          background: white;
          border: 1px solid #e7e4de;
          border-radius: 15px;
          padding: 20px;
        }

        .summary-card span {
          display: block;
          color: #888;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .summary-card strong {
          font-size: 27px;
        }

        .reports {
          display: grid;
          gap: 15px;
        }

        .report-card {
          width: 100%;
          text-align: left;
          border: 1px solid #e7e4de;
          background: white;
          border-radius: 18px;
          padding: 24px;
          cursor: pointer;
          color: #171717;
          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease,
            border-color 0.15s ease;
        }

        .report-card:hover {
          transform: translateY(-2px);
          border-color: #c7a45a;
          box-shadow: 0 10px 30px
            rgba(0, 0, 0, 0.07);
        }

        .report-card:active {
          transform: translateY(0);
        }

        .report-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .vehicle-title {
          font-size: 20px;
          font-weight: 800;
        }

        .license-plate {
          display: inline-block;
          margin-top: 7px;
          background: #f2f2f2;
          border-radius: 6px;
          padding: 5px 9px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .status {
          padding: 7px 12px;
          border-radius: 999px;
          background: #eee;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .status.open {
          background: #fff0e8;
          color: #9a4e24;
        }

        .status.review {
          background: #fff7dd;
          color: #8a6a20;
        }

        .status.resolved {
          background: #e8f5ec;
          color: #327044;
        }

        .status.closed {
          background: #eeeeee;
          color: #666;
        }

        .divider {
          height: 1px;
          background: #eeeeee;
          margin: 20px 0;
        }

        .report-info {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 20px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .info-item span,
        .description span {
          color: #999;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          font-weight: 700;
        }

        .info-item strong {
          font-size: 14px;
        }

        .description {
          margin-top: 20px;
        }

        .description p {
          margin: 7px 0 0;
          color: #555;
          font-size: 14px;
          line-height: 1.5;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 22px;
          padding-top: 17px;
          border-top: 1px solid #eeeeee;
        }

        .driver-contact {
          color: #777;
          font-size: 13px;
        }

        .view-details {
          color: #9b762f;
          font-size: 13px;
          font-weight: 800;
        }

        .empty {
          background: white;
          border: 1px solid #e7e4de;
          border-radius: 18px;
          padding: 70px 30px;
          text-align: center;
        }

        .empty-icon {
          width: 55px;
          height: 55px;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #f5f2eb;
          color: #9b762f;
          font-size: 24px;
          font-weight: 800;
        }

        .empty h2 {
          margin: 0 0 8px;
        }

        .empty p {
          color: #888;
          margin: 0 0 20px;
        }

        @media (max-width: 800px) {
          .topbar {
            flex-direction: column;
            align-items: flex-start;
          }

          .summary {
            grid-template-columns: 1fr 1fr;
          }

          .report-info {
            grid-template-columns: 1fr;
            gap: 15px;
          }
        }

        @media (max-width: 500px) {
          .admin-page {
            padding: 25px 15px 60px;
          }

          h1 {
            font-size: 32px;
          }

          .summary {
            grid-template-columns: 1fr;
          }

          .report-top {
            flex-direction: column;
          }

          .card-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </main>
  );
}
