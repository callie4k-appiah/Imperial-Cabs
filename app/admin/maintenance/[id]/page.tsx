"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  email: string | null;
};

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
  year: number | null;
  status: string;
};

export default function MaintenanceDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [maintenance, setMaintenance] =
    useState<Maintenance | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadMaintenance() {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      const {
        data: maintenanceData,
        error: maintenanceError,
      } = await supabase
        .from("maintenance")
        .select("*")
        .eq("id", id)
        .single();

      if (maintenanceError || !maintenanceData) {
        console.error(maintenanceError);
        setError(
          "Onderhoudsrecord kon niet worden gevonden."
        );
        setLoading(false);
        return;
      }

      setMaintenance(maintenanceData);
      setStatus(maintenanceData.status || "open");

      if (maintenanceData.driver_id) {
        const { data: driverData } = await supabase
          .from("driver")
          .select(
            "id, full_name, phone, email"
          )
          .eq("id", maintenanceData.driver_id)
          .maybeSingle();

        setDriver(driverData);
      }

      if (maintenanceData.vehicle_id) {
        const { data: vehicleData } =
          await supabase
            .from("vehicle")
            .select(
              "id, brand, model, license_plate, year, status"
            )
            .eq("id", maintenanceData.vehicle_id)
            .maybeSingle();

        setVehicle(vehicleData);
      }

      setLoading(false);
    }

    loadMaintenance();
  }, [id, router]);

  async function updateStatus() {
    if (!maintenance) return;

    setSaving(true);
    setError("");

    const { error: updateError } =
      await supabase
        .from("maintenance")
        .update({
          status,
        })
        .eq("id", maintenance.id);

    if (updateError) {
      console.error(updateError);
      setError(
        "Status kon niet worden opgeslagen."
      );
      setSaving(false);
      return;
    }

    setMaintenance({
      ...maintenance,
      status,
    });

    setSaving(false);
  }

  function statusLabel(value: string) {
    switch (value) {
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
        return value || "Onbekend";
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

  if (!maintenance) {
    return (
      <main className="admin-page">
        <div className="container">
          <button
            className="back-button"
            onClick={() =>
              router.push("/admin/maintenance")
            }
          >
            ← Terug naar onderhoud
          </button>

          <div className="error-box">
            {error ||
              "Onderhoudsrecord niet gevonden."}
          </div>
        </div>

        <style jsx>{`
          .admin-page {
            min-height: 100vh;
            background: #f6f5f2;
            padding: 40px 20px;
            color: #171717;
          }

          .container {
            max-width: 1100px;
            margin: 0 auto;
          }

          .back-button {
            border: none;
            background: transparent;
            padding: 0;
            margin-bottom: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
          }

          .error-box {
            background: white;
            border: 1px solid #e7e4de;
            border-radius: 15px;
            padding: 25px;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="container">

        {/* BACK */}
        <button
          className="back-button"
          onClick={() =>
            router.push("/admin/maintenance")
          }
        >
          ← Terug naar onderhoud
        </button>

        {/* HEADER */}
        <div className="page-header">
          <div>
            <div className="eyebrow">
              IMPERIAL CABS
            </div>

            <h1>Onderhoud</h1>

            <p>
              Details van deze
              onderhoudsregistratie.
            </p>
          </div>

          <div className="status-badge">
            {statusLabel(
              maintenance.status
            )}
          </div>
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <div className="grid">

          {/* ONDERHOUD */}
          <section className="card">
            <div className="card-header">
              <h2>Onderhoudsgegevens</h2>
            </div>

            <div className="info-grid">

              <div>
                <span>Type onderhoud</span>
                <strong>
                  {maintenance.maintenance_type ||
                    "-"}
                </strong>
              </div>

              <div>
                <span>Datum</span>
                <strong>
                  {formatDate(
                    maintenance.maintenance_date
                  )}
                </strong>
              </div>

              <div className="full">
                <span>Beschrijving</span>

                <strong className="description">
                  {maintenance.description ||
                    "Geen beschrijving toegevoegd."}
                </strong>
              </div>

            </div>
          </section>

          {/* VOERTUIG */}
          <section className="card">
            <div className="card-header">
              <h2>Voertuig</h2>
            </div>

            {vehicle ? (
              <div className="vehicle-box">
                <div className="vehicle-icon">
                  🚗
                </div>

                <div>
                  <strong>
                    {vehicle.brand}{" "}
                    {vehicle.model}
                  </strong>

                  <p>
                    Kenteken:{" "}
                    <b>
                      {vehicle.license_plate}
                    </b>
                  </p>

                  <p>
                    Bouwjaar:{" "}
                    {vehicle.year || "-"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="muted">
                Geen voertuig gekoppeld.
              </p>
            )}
          </section>

          {/* CHAUFFEUR */}
          <section className="card">
            <div className="card-header">
              <h2>Chauffeur</h2>
            </div>

            {driver ? (
              <div className="info-grid">

                <div>
                  <span>Naam</span>
                  <strong>
                    {driver.full_name}
                  </strong>
                </div>

                <div>
                  <span>Telefoon</span>
                  <strong>
                    {driver.phone || "-"}
                  </strong>
                </div>

                <div className="full">
                  <span>E-mail</span>
                  <strong>
                    {driver.email || "-"}
                  </strong>
                </div>

              </div>
            ) : (
              <p className="muted">
                Geen chauffeur gekoppeld.
              </p>
            )}
          </section>

          {/* STATUS */}
          <section className="card">
            <div className="card-header">
              <h2>Status aanpassen</h2>
            </div>

            <div className="status-form">

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option value="open">
                  Open
                </option>

                <option value="planned">
                  Gepland
                </option>

                <option value="in_progress">
                  In behandeling
                </option>

                <option value="completed">
                  Afgerond
                </option>

                <option value="cancelled">
                  Geannuleerd
                </option>
              </select>

              <button
                onClick={updateStatus}
                disabled={saving}
              >
                {saving
                  ? "Opslaan..."
                  : "Status opslaan"}
              </button>

            </div>
          </section>

        </div>

        {/* NOTITIES */}
        <section className="card notes-card">
          <div className="card-header">
            <h2>Notities</h2>
          </div>

          <div className="notes">
            {maintenance.notes ? (
              maintenance.notes
            ) : (
              <span className="muted">
                Geen notities toegevoegd.
              </span>
            )}
          </div>
        </section>

      </div>

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: #f6f5f2;
          padding: 40px 20px 80px;
          color: #171717;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .back-button {
          border: none;
          background: transparent;
          padding: 0;
          margin-bottom: 25px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #555;
        }

        .back-button:hover {
          color: #000;
        }

        .page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 30px;
        }

        .eyebrow {
          color: #b08a3e;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        h1 {
          font-size: 40px;
          line-height: 1.1;
          margin: 0 0 8px;
        }

        .page-header p {
          margin: 0;
          color: #777;
        }

        .status-badge {
          background: #171717;
          color: #d4af62;
          padding: 10px 18px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
          white-space: nowrap;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .card {
          background: white;
          border: 1px solid #e7e4de;
          border-radius: 18px;
          padding: 25px;
          box-shadow: 0 5px 20px
            rgba(0, 0, 0, 0.03);
        }

        .card-header {
          margin-bottom: 20px;
        }

        .card-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .info-grid div {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .info-grid .full {
          grid-column: 1 / -1;
        }

        .info-grid span {
          color: #888;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          font-weight: 700;
        }

        .info-grid strong {
          font-size: 15px;
        }

        .description {
          line-height: 1.6;
          font-weight: 500 !important;
        }

        .vehicle-box {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .vehicle-icon {
          width: 55px;
          height: 55px;
          border-radius: 14px;
          background: #f5f2eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
        }

        .vehicle-box strong {
          font-size: 17px;
        }

        .vehicle-box p {
          margin: 5px 0 0;
          color: #777;
          font-size: 14px;
        }

        .muted {
          color: #888;
        }

        .status-form {
          display: flex;
          gap: 12px;
        }

        .status-form select {
          flex: 1;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 12px;
          background: white;
          font-size: 14px;
        }

        .status-form button {
          border: none;
          border-radius: 10px;
          padding: 12px 18px;
          background: #171717;
          color: #d4af62;
          font-weight: 700;
          cursor: pointer;
        }

        .status-form button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .notes-card {
          margin-top: 20px;
        }

        .notes {
          min-height: 70px;
          background: #f8f7f4;
          border-radius: 12px;
          padding: 16px;
          line-height: 1.6;
          font-size: 14px;
        }

        .error-box {
          background: white;
          border: 1px solid #e1d3c9;
          color: #8a4b32;
          padding: 15px 18px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        @media (max-width: 800px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 520px) {
          .admin-page {
            padding: 25px 15px 60px;
          }

          h1 {
            font-size: 32px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .info-grid .full {
            grid-column: auto;
          }

          .status-form {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
