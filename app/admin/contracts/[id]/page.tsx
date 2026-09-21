"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

type Contract = {
  id: string;
  driver_id: string | null;
  vehicle_id: string | null;
  contract_type: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  file_url: string | null;
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

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [contract, setContract] =
    useState<Contract | null>(null);

  const [driver, setDriver] =
    useState<Driver | null>(null);

  const [vehicle, setVehicle] =
    useState<Vehicle | null>(null);

  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadContract() {
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
        data: contractData,
        error: contractError,
      } = await supabase
        .from("contracts")
        .select("*")
        .eq("id", id)
        .single();

      if (contractError || !contractData) {
        console.error(contractError);

        setError(
          "Contract kon niet worden gevonden."
        );

        setLoading(false);
        return;
      }

      setContract(contractData);
      setStatus(contractData.status || "draft");

      if (contractData.driver_id) {
        const { data: driverData } =
          await supabase
            .from("driver")
            .select(
              "id, full_name, phone, email"
            )
            .eq(
              "id",
              contractData.driver_id
            )
            .maybeSingle();

        setDriver(driverData);
      }

      if (contractData.vehicle_id) {
        const { data: vehicleData } =
          await supabase
            .from("vehicle")
            .select(
              "id, brand, model, license_plate, year, status"
            )
            .eq(
              "id",
              contractData.vehicle_id
            )
            .maybeSingle();

        setVehicle(vehicleData);
      }

      setLoading(false);
    }

    loadContract();
  }, [id, router]);

  async function updateStatus() {
    if (!contract) return;

    setSaving(true);
    setError("");

    const { error: updateError } =
      await supabase
        .from("contracts")
        .update({
          status,
        })
        .eq("id", contract.id);

    if (updateError) {
      console.error(updateError);

      setError(
        "Status kon niet worden opgeslagen."
      );

      setSaving(false);
      return;
    }

    setContract({
      ...contract,
      status,
    });

    setSaving(false);
  }

  function statusLabel(value: string) {
    switch (value) {
      case "draft":
        return "Concept";

      case "active":
        return "Actief";

      case "expired":
        return "Verlopen";

      case "terminated":
        return "Beëindigd";

      case "pending":
        return "In afwachting";

      default:
        return value || "Onbekend";
    }
  }

  function contractTypeLabel(
    value: string
  ) {
    switch (value) {
      case "vehicle_use":
        return "Voertuiggebruik";

      case "fleet":
        return "Fleet contract";

      case "driver":
        return "Chauffeurscontract";

      case "rental":
        return "Huurcontract";

      case "lease":
        return "Leasecontract";

      default:
        return value || "Contract";
    }
  }

  function formatDate(
    date: string | null
  ) {
    if (!date) return "-";

    return new Date(
      date
    ).toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <main className="admin-page">
        <div className="container">
          <p>Contract laden...</p>
        </div>
      </main>
    );
  }

  if (!contract) {
    return (
      <main className="admin-page">
        <div className="container">
          <button
            className="back-button"
            onClick={() =>
              router.push(
                "/admin/contracts"
              )
            }
          >
            ← Terug naar contracten
          </button>

          <div className="error-box">
            {error ||
              "Contract niet gevonden."}
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
            router.push(
              "/admin/contracts"
            )
          }
        >
          ← Terug naar contracten
        </button>

        {/* HEADER */}
        <div className="page-header">
          <div>
            <div className="eyebrow">
              IMPERIAL CABS
            </div>

            <h1>Contract</h1>

            <p>
              Details van dit contract.
            </p>
          </div>

          <div className="status-badge">
            {statusLabel(
              contract.status
            )}
          </div>
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <div className="grid">

          {/* CONTRACTGEGEVENS */}
          <section className="card">
            <div className="card-header">
              <h2>
                Contractgegevens
              </h2>
            </div>

            <div className="info-grid">

              <div>
                <span>
                  Contracttype
                </span>

                <strong>
                  {contractTypeLabel(
                    contract.contract_type
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  {statusLabel(
                    contract.status
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Startdatum
                </span>

                <strong>
                  {formatDate(
                    contract.start_date
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Einddatum
                </span>

                <strong>
                  {formatDate(
                    contract.end_date
                  )}
                </strong>
              </div>

            </div>
          </section>

          {/* CHAUFFEUR */}
          <section className="card">
            <div className="card-header">
              <h2>Chauffeur</h2>
            </div>

            {driver ? (
              <div className="info-grid">

                <div className="full">
                  <span>
                    Naam
                  </span>

                  <strong>
                    {driver.full_name}
                  </strong>
                </div>

                <div>
                  <span>
                    Telefoon
                  </span>

                  <strong>
                    {driver.phone || "-"}
                  </strong>
                </div>

                <div>
                  <span>
                    E-mail
                  </span>

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

          {/* STATUS */}
          <section className="card">
            <div className="card-header">
              <h2>
                Status aanpassen
              </h2>
            </div>

            <div className="status-form">

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
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

        {/* DOCUMENT */}
        <section className="card document-card">

          <div className="card-header">
            <h2>
              Contractdocument
            </h2>
          </div>

          {contract.file_url ? (
            <div className="document-box">

              <div className="document-icon">
                📄
              </div>

              <div className="document-info">
                <strong>
                  Contractdocument
                </strong>

                <span>
                  Document beschikbaar
                </span>
              </div>

              <a
                href={contract.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="document-button"
              >
                Document openen →
              </a>

            </div>
          ) : (
            <div className="empty-document">
              <div className="document-icon">
                📄
              </div>

              <div>
                <strong>
                  Geen document toegevoegd
                </strong>

                <p>
                  Er is momenteel geen
                  contractbestand gekoppeld.
                </p>
              </div>
            </div>
          )}

        </section>

        {/* NOTITIES */}
        <section className="card notes-card">

          <div className="card-header">
            <h2>Notities</h2>
          </div>

          <div className="notes">

            {contract.notes ? (
              contract.notes
            ) : (
              <span className="muted">
                Geen notities toegevoegd.
              </span>
            )}

          </div>

        </section>

        {/* CREATED */}
        <div className="created">
          Contract aangemaakt op{" "}
          {formatDate(
            contract.created_at
          )}
        </div>

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
          color: #555;
          font-size: 14px;
          font-weight: 600;
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
          box-shadow:
            0 5px 20px
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
          flex-shrink: 0;
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

        .document-card,
        .notes-card {
          margin-top: 20px;
        }

        .document-box {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #f8f7f4;
          border-radius: 12px;
          padding: 15px;
        }

        .document-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }

        .document-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .document-info strong {
          font-size: 14px;
        }

        .document-info span {
          color: #888;
          font-size: 12px;
        }

        .document-button {
          background: #171717;
          color: #d4af62;
          text-decoration: none;
          padding: 11px 15px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
        }

        .empty-document {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #f8f7f4;
          border-radius: 12px;
          padding: 15px;
        }

        .empty-document strong {
          font-size: 14px;
        }

        .empty-document p {
          margin: 4px 0 0;
          color: #888;
          font-size: 13px;
        }

        .notes {
          min-height: 70px;
          background: #f8f7f4;
          border-radius: 12px;
          padding: 16px;
          font-size: 14px;
          line-height: 1.6;
        }

        .error-box {
          background: white;
          border: 1px solid #e1d3c9;
          color: #8a4b32;
          padding: 15px 18px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .created {
          text-align: right;
          color: #999;
          font-size: 12px;
          margin-top: 15px;
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

        @media (max-width: 600px) {
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

          .document-box,
          .empty-document {
            flex-direction: column;
            align-items: flex-start;
          }

          .document-button {
            width: 100%;
            text-align: center;
            box-sizing: border-box;
          }
        }
      `}</style>
    </main>
  );
}
