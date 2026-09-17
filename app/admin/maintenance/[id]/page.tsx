"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

type Maintenance = {
  id: string;
  driver_id: string | null;
  vehicle_id: string | null;
  maintenance_type: string;
  description: string | null;
  status: string;
  maintenance_date: string | null;
  notes: string | null;
  created_at: string;
};

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

export default function MaintenancePage() {
  const router = useRouter();

  const [maintenance, setMaintenance] = useState<
    Maintenance[]
  >([]);
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
        { data: maintenanceData, error: maintenanceError },
        { data: driverData, error: driverError },
        { data: vehicleData, error: vehicleError },
      ] = await Promise.all([
        supabase
          .from("maintenance")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("driver")
          .select("id, full_name, phone"),

        supabase
          .from("vehicle")
          .select("id, brand, model, license_plate"),
      ]);

      if (maintenanceError) {
        console.error(
          "Maintenance error:",
          maintenanceError
        );
      }

      if (driverError) {
        console.error("Driver error:", driverError);
      }

      if (vehicleError) {
        console.error("Vehicle error:", vehicleError);
      }

      setMaintenance(maintenanceData || []);
      setDrivers(driverData || []);
      setVehicles(vehicleData || []);
      setLoading(false);
    }

    loadData();
  }, [router]);

  function getDriver(driverId: string | null) {
    if (!driverId) return null;

    return (
      drivers.find(
        (driver) => driver.id === driverId
      ) || null
    );
  }

  function getVehicle(vehicleId: string | null) {
    if (!vehicleId) return null;

    return (
      vehicles.find(
        (vehicle) => vehicle.id === vehicleId
      ) || null
    );
  }

  function statusLabel(status: string) {
    switch (status) {
      case "open":
        return "Open";

      case "planned":
        return "Gepland";

      case "in_progress":
        return "In behandeling";

      case "completed":
        return "Afgerond";

      case "cancelled":
        return "Geannuleerd";

      default:
        return status || "Onbekend";
    }
  }

  function statusClass(status: string) {
    switch (status) {
      case "open":
        return "status open";

      case "planned":
        return "status planned";

      case "in_progress":
        return "status progress";

      case "completed":
        return "status completed";

      case "cancelled":
        return "status cancelled";

      default:
        return "status";
    }
  }

  function formatDate(date: string | null) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "nl-NL",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  }

  if (loading) {
    return (
      <main className="admin-page">
        <div className="container">
          <p>Onderhoud laden...</p>
        </div>
      </main>
    );
  }

  const openCount = maintenance.filter(
    (item) =>
      item.status === "open"
  ).length;

  const plannedCount = maintenance.filter(
    (item) =>
      item.status === "planned"
  ).length;

  const progressCount = maintenance.filter(
    (item) =>
      item.status === "in_progress"
  ).length;

  const completedCount = maintenance.filter(
    (item) =>
      item.status === "completed"
  ).length;

  return (
    <main className="admin-page">
      <div className="container">

        {/* HEADER */}
        <div className="topbar">
          <div>
            <button
              className="back-button"
              onClick={() =>
                router.push("/admin")
              }
            >
              ← Dashboard
            </button>

            <div className="eyebrow">
              IMPERIAL CABS
            </div>

            <h1>Onderhoud</h1>

            <p>
              Beheer onderhoud en
              onderhoudsafspraken van de vloot.
            </p>
          </div>

          <button
            className="add-button"
            onClick={() =>
              router.push(
                "/admin/maintenance/new"
              )
            }
          >
            + Nieuw onderhoud
          </button>
        </div>

        {/* SUMMARY */}
        <div className="summary">
          <div className="summary-card">
            <span>Totaal</span>
            <strong>
              {maintenance.length}
            </strong>
          </div>

          <div className="summary-card">
            <span>Open</span>
            <strong>{openCount}</strong>
          </div>

          <div className="summary-card">
            <span>Gepland</span>
            <strong>{plannedCount}</strong>
          </div>

          <div className="summary-card">
            <span>Afgerond</span>
            <strong>{completedCount}</strong>
          </div>
        </div>

        {/* MAINTENANCE LIST */}
        {maintenance.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              🔧
            </div>

            <h2>
              Geen onderhoud gevonden
            </h2>

            <p>
              Er zijn momenteel geen
              onderhoudsregistraties.
            </p>

            <button
              className="add-button"
              onClick={() =>
                router.push(
                  "/admin/maintenance/new"
                )
              }
            >
              + Eerste onderhoud toevoegen
            </button>
          </div>
        ) : (
          <div className="maintenance-list">
            {maintenance.map((item) => {
              const driver = getDriver(
                item.driver_id
              );

              const vehicle = getVehicle(
                item.vehicle_id
              );

              return (
                <button
                  key={item.id}
                  type="button"
                  className="maintenance-card"
                  onClick={() =>
                    router.push(
                      `/admin/maintenance/${item.id}`
                    )
                  }
                >
                  {/* TOP */}
                  <div className="card-top">
                    <div className="title-section">
                      <div className="maintenance-icon">
                        🔧
                      </div>

                      <div>
                        <h2>
                          {item.maintenance_type ||
                            "Onderhoud"}
                        </h2>

                        {vehicle ? (
                          <div className="vehicle">
                            {vehicle.brand}{" "}
                            {vehicle.model}
                          </div>
                        ) : (
                          <div className="vehicle muted">
                            Geen voertuig gekoppeld
                          </div>
                        )}
                      </div>
                    </div>

                    <span
                      className={statusClass(
                        item.status
                      )}
                    >
                      {statusLabel(
                        item.status
                      )}
                    </span>
                  </div>

                  <div className="divider" />

                  {/* INFO */}
                  <div className="info-grid">

                    <div className="info-item">
                      <span>Voertuig</span>

                      <strong>
                        {vehicle
                          ? vehicle.license_plate
                          : "-"}
                      </strong>
                    </div>

                    <div className="info-item">
                      <span>Chauffeur</span>

                      <strong>
                        {driver
                          ? driver.full_name
                          : "Geen chauffeur"}
                      </strong>
                    </div>

                    <div className="info-item">
                      <span>Datum</span>

                      <strong>
                        {formatDate(
                          item.maintenance_date
                        )}
                      </strong>
                    </div>

                  </div>

                  {/* DESCRIPTION */}
                  {item.description && (
                    <div className="description">
                      <span>
                        Beschrijving
                      </span>

                      <p>
                        {item.description}
                      </p>
                    </div>
                  )}

                  {/* FOOTER */}
                  <div className="card-footer">
                    <div className="contact">
                      {driver?.phone
                        ? `📞 ${driver.phone}`
                        : ""}
                    </div>

                    <div className="details">
                      Bekijk details →
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* EXTRA INFO */}
        {maintenance.length > 0 && (
          <div className="bottom-info">
            <span>
              {progressCount} onderhoudsitem
              {progressCount === 1
                ? ""
                : "s"} in behandeling
            </span>
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
          cursor: pointer;
          color: #555;
          font-size: 14px;
          font-weight: 600;
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
          grid-template-columns:
            repeat(4, 1fr);
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

        .maintenance-list {
          display: grid;
          gap: 15px;
        }

        .maintenance-card {
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

        .maintenance-card:hover {
          transform: translateY(-2px);
          border-color: #c7a45a;
          box-shadow:
            0 10px 30px
            rgba(0, 0, 0, 0.07);
        }

        .maintenance-card:active {
          transform: translateY(0);
        }

        .card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .maintenance-icon {
          width: 50px;
          height: 50px;
          border-radius: 13px;
          background: #f5f2eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
          flex-shrink: 0;
        }

        .title-section h2 {
          margin: 0 0 5px;
          font-size: 19px;
        }

        .vehicle {
          color: #777;
          font-size: 14px;
        }

        .muted {
          color: #999;
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

        .status.planned {
          background: #fff7dd;
          color: #8a6a20;
        }

        .status.progress {
          background: #e8f0ff;
          color: #42648f;
        }

        .status.completed {
          background: #e8f5ec;
          color: #327044;
        }

        .status.cancelled {
          background: #eeeeee;
          color: #777;
        }

        .divider {
          height: 1px;
          background: #eeeeee;
          margin: 20px 0;
        }

        .info-grid {
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
          border-top: 1px solid #eeeeee;
          margin-top: 20px;
          padding-top: 17px;
        }

        .contact {
          color: #777;
          font-size: 13px;
        }

        .details {
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
          border-radius: 50%;
          background: #f5f2eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .empty h2 {
          margin: 0 0 8px;
        }

        .empty p {
          color: #888;
          margin: 0 0 20px;
        }

        .bottom-info {
          margin-top: 18px;
          color: #888;
          font-size: 13px;
          text-align: right;
        }

        @media (max-width: 800px) {
          .topbar {
            flex-direction: column;
            align-items: flex-start;
          }

          .summary {
            grid-template-columns: 1fr 1fr;
          }

          .info-grid {
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

          .card-top {
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
