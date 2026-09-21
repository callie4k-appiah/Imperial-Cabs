"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

type Driver = {
  id: string;
  full_name: string;
};

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
};

export default function NewContractPage() {
  const router = useRouter();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [contractType, setContractType] =
    useState("vehicle_use");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("draft");
  const [fileUrl, setFileUrl] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
        { data: driverData, error: driverError },
        { data: vehicleData, error: vehicleError },
      ] = await Promise.all([
        supabase
          .from("driver")
          .select("id, full_name")
          .order("full_name"),

        supabase
          .from("vehicle")
          .select(
            "id, brand, model, license_plate"
          )
          .order("brand"),
      ]);

      if (driverError) {
        console.error(driverError);
      }

      if (vehicleError) {
        console.error(vehicleError);
      }

      setDrivers(driverData || []);
      setVehicles(vehicleData || []);
      setLoading(false);
    }

    loadData();
  }, [router]);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");

    if (!driverId) {
      setError("Selecteer een chauffeur.");
      return;
    }

    if (!contractType) {
      setError("Selecteer een contracttype.");
      return;
    }

    if (!startDate) {
      setError("Vul een startdatum in.");
      return;
    }

    setSaving(true);

    const { error: insertError } =
      await supabase
        .from("contracts")
        .insert({
          driver_id: driverId,
          vehicle_id: vehicleId || null,
          contract_type: contractType,
          start_date: startDate,
          end_date: endDate || null,
          status,
          file_url: fileUrl.trim() || null,
          notes: notes.trim() || null,
        });

    if (insertError) {
      console.error(insertError);

      setError(
        "Contract kon niet worden opgeslagen."
      );

      setSaving(false);
      return;
    }

    router.push("/admin/contracts");
  }

  if (loading) {
    return (
      <main className="admin-page">
        <div className="container">
          <p>Gegevens laden...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="container">

        <button
          className="back-button"
          type="button"
          onClick={() =>
            router.push("/admin/contracts")
          }
        >
          ← Terug naar contracten
        </button>

        <div className="header">
          <div>
            <div className="eyebrow">
              IMPERIAL CABS
            </div>

            <h1>Nieuw contract</h1>

            <p>
              Maak een nieuw contract aan voor
              een chauffeur.
            </p>
          </div>
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="form"
        >

          {/* BETROKKENEN */}
          <section className="card">
            <div className="section-header">
              <h2>Betrokkenen</h2>

              <p>
                Koppel het contract aan een
                chauffeur en eventueel een voertuig.
              </p>
            </div>

            <div className="form-grid">

              <div className="field full">
                <label>
                  Chauffeur *
                </label>

                <select
                  value={driverId}
                  onChange={(e) =>
                    setDriverId(e.target.value)
                  }
                  required
                >
                  <option value="">
                    Selecteer chauffeur
                  </option>

                  {drivers.map((driver) => (
                    <option
                      key={driver.id}
                      value={driver.id}
                    >
                      {driver.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field full">
                <label>
                  Voertuig
                </label>

                <select
                  value={vehicleId}
                  onChange={(e) =>
                    setVehicleId(e.target.value)
                  }
                >
                  <option value="">
                    Geen voertuig
                  </option>

                  {vehicles.map((vehicle) => (
                    <option
                      key={vehicle.id}
                      value={vehicle.id}
                    >
                      {vehicle.brand}{" "}
                      {vehicle.model} —{" "}
                      {vehicle.license_plate}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </section>

          {/* CONTRACT */}
          <section className="card">
            <div className="section-header">
              <h2>Contractgegevens</h2>

              <p>
                Stel het type en de looptijd van
                het contract in.
              </p>
            </div>

            <div className="form-grid">

              <div className="field">
                <label>
                  Contracttype *
                </label>

                <select
                  value={contractType}
                  onChange={(e) =>
                    setContractType(
                      e.target.value
                    )
                  }
                  required
                >
                  <option value="vehicle_use">
                    Voertuiggebruik
                  </option>

                  <option value="fleet">
                    Fleet contract
                  </option>

                  <option value="driver">
                    Chauffeurscontract
                  </option>

                  <option value="rental">
                    Huurcontract
                  </option>

                  <option value="lease">
                    Leasecontract
                  </option>
                </select>
              </div>

              <div className="field">
                <label>
                  Status *
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  required
                >
                  <option value="draft">
                    Concept
                  </option>

                  <option value="pending">
                    In afwachting
                  </option>

                  <option value="active">
                    Actief
                  </option>

                  <option value="expired">
                    Verlopen
                  </option>

                  <option value="terminated">
                    Beëindigd
                  </option>
                </select>
              </div>

              <div className="field">
                <label>
                  Startdatum *
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="field">
                <label>
                  Einddatum
                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(
                      e.target.value
                    )
                  }
                />
              </div>

            </div>
          </section>

          {/* DOCUMENT */}
          <section className="card">
            <div className="section-header">
              <h2>Contractdocument</h2>

              <p>
                Voeg eventueel een link naar het
                contractbestand toe.
              </p>
            </div>

            <div className="field">
              <label>
                Document URL
              </label>

              <input
                type="url"
                value={fileUrl}
                onChange={(e) =>
                  setFileUrl(
                    e.target.value
                  )
                }
                placeholder="https://..."
              />

              <small>
                Bijvoorbeeld een beveiligde link
                naar het contractdocument.
              </small>
            </div>
          </section>

          {/* NOTES */}
          <section className="card">
            <div className="section-header">
              <h2>Notities</h2>

              <p>
                Extra informatie over het contract.
              </p>
            </div>

            <div className="field">
              <label>
                Notities
              </label>

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                placeholder="Bijvoorbeeld afspraken, opmerkingen of aanvullende informatie..."
                rows={5}
              />
            </div>
          </section>

          {/* ACTIONS */}
          <div className="actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                router.push(
                  "/admin/contracts"
                )
              }
            >
              Annuleren
            </button>

            <button
              type="submit"
              className="save-button"
              disabled={saving}
            >
              {saving
                ? "Contract opslaan..."
                : "Contract opslaan →"}
            </button>

          </div>

        </form>
      </div>

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: #f6f5f2;
          padding: 40px 20px 80px;
          color: #171717;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
        }

        .back-button {
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

        .header p {
          margin: 0 0 30px;
          color: #777;
        }

        .form {
          display: grid;
          gap: 20px;
        }

        .card {
          background: white;
          border: 1px solid #e7e4de;
          border-radius: 18px;
          padding: 25px;
          box-shadow:
            0 5px 20px
            rgba(0, 0, 0, 0.03);
        }

        .section-header {
          margin-bottom: 22px;
        }

        .section-header h2 {
          margin: 0 0 6px;
          font-size: 20px;
        }

        .section-header p {
          margin: 0;
          color: #888;
          font-size: 14px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .field.full {
          grid-column: 1 / -1;
        }

        label {
          font-size: 13px;
          font-weight: 700;
          color: #333;
        }

        input,
        select,
        textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #ddd;
          border-radius: 10px;
          background: white;
          padding: 13px 14px;
          font-family: inherit;
          font-size: 14px;
          color: #171717;
          outline: none;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #b08a3e;
          box-shadow:
            0 0 0 3px
            rgba(176, 138, 62, 0.1);
        }

        textarea {
          resize: vertical;
          min-height: 120px;
        }

        small {
          color: #999;
          font-size: 12px;
        }

        .error-box {
          background: #fff;
          border: 1px solid #e1d3c9;
          color: #8a4b32;
          padding: 15px 18px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 5px;
        }

        .cancel-button,
        .save-button {
          border: none;
          border-radius: 10px;
          padding: 13px 20px;
          font-weight: 700;
          cursor: pointer;
        }

        .cancel-button {
          background: white;
          border: 1px solid #ddd;
          color: #555;
        }

        .save-button {
          background: #171717;
          color: #d4af62;
        }

        .save-button:hover {
          background: #292929;
        }

        .save-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 650px) {
          .admin-page {
            padding: 25px 15px 60px;
          }

          h1 {
            font-size: 32px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .field.full {
            grid-column: auto;
          }

          .actions {
            flex-direction: column-reverse;
          }

          .cancel-button,
          .save-button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
