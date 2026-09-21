"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

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
};

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
};

export default function ContractsPage() {
  const router = useRouter();

  const [contracts, setContracts] = useState<Contract[]>([]);
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
        { data: contractData, error: contractError },
        { data: driverData, error: driverError },
        { data: vehicleData, error: vehicleError },
      ] = await Promise.all([
        supabase
          .from("contracts")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("driver")
          .select("id, full_name, phone"),

        supabase
          .from("vehicle")
          .select("id, brand, model, license_plate"),
      ]);

      if (contractError) {
        console.error(
          "Contract error:",
          contractError
        );
      }

      if (driverError) {
        console.error(
          "Driver error:",
          driverError
        );
      }

      if (vehicleError) {
        console.error(
          "Vehicle error:",
          vehicleError
        );
      }

      setContracts(contractData || []);
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
        return status || "Onbekend";
    }
  }

  function statusClass(status: string) {
    switch (status) {
      case "draft":
        return "status draft";

      case "active":
        return "status active";

      case "expired":
        return "status expired";

      case "terminated":
        return "status terminated";

      case "pending":
        return "status pending";

      default:
        return "status";
    }
  }

  function contractTypeLabel(type: string) {
    switch (type) {
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
        return type || "Contract";
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
          <p>Contracten laden...</p>
        </div>
      </main>
    );
  }

  const activeCount = contracts.filter(
    (contract) =>
      contract.status === "active"
  ).length;

  const pendingCount = contracts.filter(
    (contract) =>
      contract.status === "pending"
  ).length;

  const expiredCount = contracts.filter(
    (contract) =>
      contract.status === "expired"
  ).length;

  const terminatedCount = contracts.filter(
    (contract) =>
      contract.status === "terminated"
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

            <h1>Contracten</h1>

            <p>
              Beheer contracten van chauffeurs
              en voertuigen.
            </p>
          </div>

          <button
            className="add-button"
            onClick={() =>
              router.push(
                "/admin/contracts/new"
              )
            }
          >
            + Nieuw contract
          </button>
        </div>

        {/* SUMMARY */}
        <div className="summary">

          <div className="summary-card">
            <span>Totaal</span>
            <strong>
              {contracts.length}
            </strong>
          </div>

          <div className="summary-card">
            <span>Actief</span>
            <strong>
              {activeCount}
            </strong>
          </div>

          <div className="summary-card">
            <span>In afwachting</span>
            <strong>
              {pendingCount}
            </strong>
          </div>

          <div className="summary-card">
            <span>Verlopen</span>
            <strong>
              {expiredCount}
            </strong>
          </div>

        </div>

        {/* CONTRACTS */}
        {contracts.length === 0 ? (
          <div className="empty">

            <div className="empty-icon">
              📄
            </div>

            <h2>
              Geen contracten gevonden
            </h2>

            <p>
              Er zijn momenteel geen
              contracten geregistreerd.
            </p>

            <button
              className="add-button"
              onClick={() =>
                router.push(
                  "/admin/contracts/new"
                )
              }
            >
              + Eerste contract toevoegen
            </button>

          </div>
        ) : (
          <div className="contracts-list">

            {contracts.map((contract) => {
              const driver = getDriver(
                contract.driver_id
              );

              const vehicle = getVehicle(
                contract.vehicle_id
              );

              return (
                <button
                  key={contract.id}
                  type="button"
                  className="contract-card"
                  onClick={() =>
                    router.push(
                      `/admin/contracts/${contract.id}`
                    )
                  }
                >

                  {/* TOP */}
                  <div className="card-top">

                    <div className="title-section">

                      <div className="contract-icon">
                        📄
                      </div>

                      <div>

                        <h2>
                          {contractTypeLabel(
                            contract.contract_type
                          )}
                        </h2>

                        {driver ? (
                          <div className="driver-name">
                            {driver.full_name}
                          </div>
                        ) : (
                          <div className="muted">
                            Geen chauffeur
                          </div>
                        )}

                      </div>

                    </div>

                    <span
                      className={statusClass(
                        contract.status
                      )}
                    >
                      {statusLabel(
                        contract.status
                      )}
                    </span>

                  </div>

                  <div className="divider" />

                  {/* INFO */}
                  <div className="info-grid">

                    <div className="info-item">
                      <span>Chauffeur</span>

                      <strong>
                        {driver
                          ? driver.full_name
                          : "-"}
                      </strong>
                    </div>

                    <div className="info-item">
                      <span>Voertuig</span>

                      <strong>
                        {vehicle
                          ? vehicle.license_plate
                          : "-"}
                      </strong>
                    </div>

                    <div className="info-item">
                      <span>Contracttype</span>

                      <strong>
                        {contractTypeLabel(
                          contract.contract_type
                        )}
                      </strong>
                    </div>

                    <div className="info-item">
                      <span>Startdatum</span>

                      <strong>
                        {formatDate(
                          contract.start_date
                        )}
                      </strong>
                    </div>

                    <div className="info-item">
                      <span>Einddatum</span>

                      <strong>
                        {formatDate(
                          contract.end_date
                        )}
                      </strong>
                    </div>

                    <div className="info-item">
                      <span>Document</span>

                      <strong>
                        {contract.file_url
                          ? "Beschikbaar"
                          : "Geen bestand"}
                      </strong>
                    </div>

                  </div>

                  {/* VEHICLE */}
                  {vehicle && (
                    <div className="vehicle-box">

                      <div className="vehicle-icon">
                        🚗
                      </div>

                      <div>
                        <span>
                          Gekoppeld voertuig
                        </span>

                        <strong>
                          {vehicle.brand}{" "}
                          {vehicle.model}
                        </strong>

                        <small>
                          {vehicle.license_plate}
                        </small>
                      </div>

                    </div>
                  )}

                  {/* NOTES */}
                  {contract.notes && (
                    <div className="notes">

                      <span>
                        Notitie
                      </span>

                      <p>
                        {contract.notes}
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
                      Bekijk contract →
                    </div>

                  </div>

                </button>
              );
            })}

          </div>
        )}

        {contracts.length > 0 && (
          <div className="bottom-info">
            {terminatedCount} beëindigd
            contract
            {terminatedCount === 1
              ? ""
              : "en"}
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

        .contracts-list {
          display: grid;
          gap: 15px;
        }

        .contract-card {
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

        .contract-card:hover {
          transform: translateY(-2px);
          border-color: #c7a45a;
          box-shadow:
            0 10px 30px
            rgba(0, 0, 0, 0.07);
        }

        .contract-card:active {
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

        .contract-icon {
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

        .driver-name {
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

        .status.draft {
          background: #f0f0f0;
          color: #666;
        }

        .status.active {
          background: #e8f5ec;
          color: #327044;
        }

        .status.expired {
          background: #fff0e8;
          color: #9a4e24;
        }

        .status.terminated {
          background: #eeeeee;
          color: #777;
        }

        .status.pending {
          background: #fff7dd;
          color: #8a6a20;
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
        .vehicle-box span,
        .notes span {
          color: #999;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          font-weight: 700;
        }

        .info-item strong {
          font-size: 14px;
        }

        .vehicle-box {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #f8f7f4;
          border-radius: 12px;
          padding: 14px;
          margin-top: 20px;
        }

        .vehicle-icon {
          width: 45px;
          height: 45px;
          border-radius: 11px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 21px;
        }

        .vehicle-box div:last-child {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .vehicle-box strong {
          font-size: 14px;
        }

        .vehicle-box small {
          color: #777;
          font-size: 12px;
        }

        .notes {
          margin-top: 20px;
        }

        .notes p {
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
