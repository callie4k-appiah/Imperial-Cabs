"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
  year: number | null;
  status: string;
  assigned_driver_id: string | null;
};

type Driver = {
  id: string;
  full_name: string;
};

export default function VehiclesPage() {
  const router = useRouter();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setErrorMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data: vehicleData, error: vehicleError } =
        await supabase
          .from("vehicle")
          .select(
            "id, brand, model, license_plate, year, status, assigned_driver_id"
          );

      if (vehicleError) {
        console.error("Vehicle error:", vehicleError);

        setErrorMessage(
          "Voertuigen konden niet worden geladen: " +
            vehicleError.message
        );

        setLoading(false);
        return;
      }

      const { data: driverData, error: driverError } =
        await supabase
          .from("driver")
          .select("id, full_name");

      if (driverError) {
        console.error("Driver error:", driverError);
      }

      setVehicles(vehicleData || []);
      setDrivers(driverData || []);
      setLoading(false);
    }

    loadData();
  }, [router]);

  function getDriverName(driverId: string | null) {
    if (!driverId) {
      return "Niet gekoppeld";
    }

    const driver = drivers.find(
      (item) => item.id === driverId
    );

    return driver?.full_name || "Onbekende chauffeur";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#050505",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "36px",
              }}
            >
              Voertuigen
            </h1>

            <p
              style={{
                color: "#aaaaaa",
                marginTop: "8px",
              }}
            >
              Beheer alle Imperial Cabs taxi voertuigen.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/admin/vehicles/new")
            }
            style={{
              background: "#ffffff",
              color: "#000000",
              border: "none",
              borderRadius: "8px",
              padding: "12px 18px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Voertuig toevoegen
          </button>
        </div>

        {/* ERROR */}
        {errorMessage && (
          <div
            style={{
              background: "#160909",
              border: "1px solid #6b2525",
              color: "#ffb0b0",
              padding: "18px",
              borderRadius: "10px",
              marginBottom: "25px",
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <p style={{ color: "#aaaaaa" }}>
            Voertuigen laden...
          </p>
        ) : vehicles.length === 0 ? (
          /* EMPTY */
          <div
            style={{
              background: "#0b0b0b",
              border: "1px solid #222222",
              borderRadius: "14px",
              padding: "40px",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              Nog geen voertuigen
            </h2>

            <p style={{ color: "#aaaaaa" }}>
              Voeg je eerste taxi toe aan de vloot.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/admin/vehicles/new")
              }
              style={{
                marginTop: "15px",
                background: "#ffffff",
                color: "#000000",
                border: "none",
                borderRadius: "8px",
                padding: "12px 18px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Eerste voertuig toevoegen
            </button>
          </div>
        ) : (
          /* VEHICLES */
          <div
            style={{
              display: "grid",
              gap: "15px",
            }}
          >
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                style={{
                  background: "#0b0b0b",
                  border: "1px solid #222222",
                  borderRadius: "14px",
                  padding: "22px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "20px",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "21px",
                      }}
                    >
                      {vehicle.brand} {vehicle.model}
                    </h2>

                    <p
                      style={{
                        color: "#aaaaaa",
                        margin: "8px 0 0",
                      }}
                    >
                      Kenteken:{" "}
                      {vehicle.license_plate}
                    </p>

                    <p
                      style={{
                        color: "#aaaaaa",
                        margin: "5px 0 0",
                      }}
                    >
                      Bouwjaar:{" "}
                      {vehicle.year || "Niet bekend"}
                    </p>

                    <p
                      style={{
                        color: "#aaaaaa",
                        margin: "5px 0 0",
                      }}
                    >
                      Chauffeur:{" "}
                      {getDriverName(
                        vehicle.assigned_driver_id
                      )}
                    </p>
                  </div>

                  <span
                    style={{
                      background: "#ffffff",
                      color: "#000000",
                      borderRadius: "20px",
                      padding: "7px 13px",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {vehicle.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
