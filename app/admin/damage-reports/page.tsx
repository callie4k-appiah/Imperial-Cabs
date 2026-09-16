"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

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

type DamageReport = {
  id: string;
  driver_id: string | null;
  vehicle_id: string | null;
  description: string;
  damage_date: string;
  location: string | null;
  photo_url: string | null;
  status: string;
  created_at: string;
};

export default function DamageReportsPage() {
  const router = useRouter();

  const [reports, setReports] = useState<DamageReport[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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
        { data: driverData },
        { data: vehicleData },
      ] = await Promise.all([
        supabase
          .from("damage_reports")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("driver")
          .select("id, full_name")
          .order("full_name"),

        supabase
          .from("vehicle")
          .select("id, brand, model, license_plate")
          .order("brand"),
      ]);

      if (damageError) {
        console.error("Damage reports error:", damageError);
        setErrorMessage(
          "Schademeldingen konden niet worden geladen: " +
            damageError.message
        );
      }

      setReports(damageData || []);
      setDrivers(driverData || []);
      setVehicles(vehicleData || []);
      setLoading(false);
    }

    loadData();
  }, [router]);

  function getDriverName(id: string | null) {
    if (!id) return "Geen chauffeur";

    const driver = drivers.find(
      (item) => item.id === id
    );

    return driver?.full_name || "Onbekende chauffeur";
  }

  function getVehicleName(id: string | null) {
    if (!id) return "Geen voertuig";

    const vehicle = vehicles.find(
      (item) => item.id === id
    );

    if (!vehicle) return "Onbekend voertuig";

    return `${vehicle.brand} ${vehicle.model} — ${vehicle.license_plate}`;
  }

  function statusLabel(status: string) {
    switch (status) {
      case "open":
        return "Open";
      case "in_progress":
        return "In behandeling";
      case "resolved":
        return "Afgerond";
      default:
        return status;
    }
  }

  function statusStyle(status: string) {
    if (status === "open") {
      return {
        background: "#351414",
        color: "#ff9f9f",
        border: "1px solid #6b2525",
      };
    }

    if (status === "in_progress") {
      return {
        background: "#33280f",
        color: "#f2ca63",
        border: "1px solid #66501c",
      };
    }

    if (status === "resolved") {
      return {
        background: "#12331f",
        color: "#82dda3",
        border: "1px solid #245c39",
      };
    }

    return {
      background: "#222",
      color: "#ccc",
      border: "1px solid #333",
    };
  }

  function formatDate(date: string | null) {
    if (!date) return "—";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("nl-NL");
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#050505",
          color: "#fff",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <p style={{ color: "#999" }}>
            Schademeldingen laden...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* TERUG */}

        <button
          type="button"
          onClick={() => router.push("/admin")}
          style={{
            background: "transparent",
            color: "#999",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontSize: "14px",
            marginBottom: "20px",
          }}
        >
          ← Terug naar dashboard
        </button>

        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "36px",
                fontWeight: 700,
              }}
            >
              Schades
            </h1>

            <p
              style={{
                color: "#888",
                marginTop: "8px",
              }}
            >
              Overzicht van alle schademeldingen.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/admin/damage-reports/new")
            }
            style={{
              background: "#d9a72f",
              color: "#000",
              border: "none",
              borderRadius: "10px",
              padding: "13px 18px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            + Nieuwe schade
          </button>
        </div>

        {/* ERROR */}

        {errorMessage && (
          <div
            style={{
              background: "#160909",
              border: "1px solid #6b2525",
              color: "#ffb0b0",
              borderRadius: "12px",
              padding: "15px",
              marginBottom: "20px",
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* SUMMARY */}

        <div
          style={{
            background: "#0b0b0b",
            border: "1px solid #222",
            borderRadius: "15px",
            padding: "20px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              color: "#888",
              fontSize: "13px",
              marginBottom: "6px",
            }}
          >
            Totaal schademeldingen
          </div>

          <div
            style={{
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            {reports.length}
          </div>
        </div>

        {/* EMPTY STATE */}

        {reports.length === 0 ? (
          <div
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "16px",
              padding: "55px 25px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "36px",
                marginBottom: "15px",
              }}
            >
              ✓
            </div>

            <h2
              style={{
                margin: "0 0 8px",
              }}
            >
              Geen schademeldingen
            </h2>

            <p
              style={{
                color: "#888",
                marginBottom: "22px",
              }}
            >
              Er zijn nog geen schades geregistreerd.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/admin/damage-reports/new")
              }
              style={{
                background: "#d9a72f",
                color: "#000",
                border: "none",
                borderRadius: "9px",
                padding: "12px 18px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Eerste schade registreren
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "15px",
            }}
          >
            {reports.map((report) => (
              <div
                key={report.id}
                style={{
                  background: "#0b0b0b",
                  border: "1px solid #222",
                  borderRadius: "15px",
                  padding: "22px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginBottom: "12px",
                      }}
                    >
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "19px",
                        }}
                      >
                        {getVehicleName(
                          report.vehicle_id
                        )}
                      </h2>

                      <span
                        style={{
                          ...statusStyle(
                            report.status
                          ),
                          padding: "5px 10px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        {statusLabel(
                          report.status
                        )}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: "0 0 15px",
                        color: "#ddd",
                        lineHeight: 1.6,
                      }}
                    >
                      {report.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: "18px",
                        flexWrap: "wrap",
                        color: "#888",
                        fontSize: "13px",
                      }}
                    >
                      <span>
                        Chauffeur:{" "}
                        <strong
                          style={{ color: "#bbb" }}
                        >
                          {getDriverName(
                            report.driver_id
                          )}
                        </strong>
                      </span>

                      <span>
                        Datum:{" "}
                        <strong
                          style={{ color: "#bbb" }}
                        >
                          {formatDate(
                            report.damage_date
                          )}
                        </strong>
                      </span>

                      <span>
                        Locatie:{" "}
                        <strong
                          style={{ color: "#bbb" }}
                        >
                          {report.location || "—"}
                        </strong>
                      </span>
                    </div>

                    {report.photo_url && (
                      <div
                        style={{
                          marginTop: "15px",
                        }}
                      >
                        <a
                          href={report.photo_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                          style={{
                            color: "#d9a72f",
                            textDecoration: "none",
                            fontSize: "13px",
                          }}
                        >
                          Foto bekijken →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
