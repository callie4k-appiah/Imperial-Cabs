"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

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
  phone: string;
  email: string;
};

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();

  const rawId = params?.id;
  const vehicleId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadVehicle() {
      setLoading(true);
      setErrorMessage("");

      if (!vehicleId) {
        setErrorMessage("Geen voertuig-ID gevonden.");
        setLoading(false);
        return;
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/admin/login");
        return;
      }

      const { data: vehicleData, error: vehicleError } =
        await supabase
          .from("vehicle")
          .select(
            "id, brand, model, license_plate, year, status, assigned_driver_id"
          )
          .eq("id", vehicleId)
          .maybeSingle();

      if (vehicleError) {
        console.error("Vehicle error:", vehicleError);

        setErrorMessage(
          "Voertuig kon niet worden geladen: " +
            vehicleError.message
        );

        setLoading(false);
        return;
      }

      if (!vehicleData) {
        setErrorMessage(
          "Geen voertuig gevonden met ID: " + vehicleId
        );

        setLoading(false);
        return;
      }

      setVehicle(vehicleData);

      if (vehicleData.assigned_driver_id) {
        const { data: driverData, error: driverError } =
          await supabase
            .from("driver")
            .select(
              "id, full_name, phone, email"
            )
            .eq(
              "id",
              vehicleData.assigned_driver_id
            )
            .maybeSingle();

        if (driverError) {
          console.error(
            "Driver error:",
            driverError
          );
        }

        setDriver(driverData || null);
      }

      setLoading(false);
    }

    loadVehicle();
  }, [vehicleId, router]);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "40px",
          background: "#050505",
          color: "#fff",
        }}
      >
        <p style={{ color: "#aaa" }}>
          Voertuig laden...
        </p>
      </main>
    );
  }

  if (errorMessage || !vehicle) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "40px",
          background: "#050505",
          color: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <button
            type="button"
            onClick={() =>
              router.push("/admin/vehicle")
            }
            style={{
              background: "#fff",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              padding: "11px 17px",
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: "30px",
            }}
          >
            ← Terug naar voertuigen
          </button>

          <div
            style={{
              background: "#160909",
              border: "1px solid #6b2525",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h1>Voertuig niet gevonden</h1>

            <p style={{ color: "#ffb0b0" }}>
              {errorMessage ||
                "Dit voertuig bestaat niet."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#050505",
        color: "#fff",
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
          onClick={() =>
            router.push("/admin/vehicle")
          }
          style={{
            background: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            padding: "11px 17px",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: "30px",
          }}
        >
          ← Terug naar voertuigen
        </button>

        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "35px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "36px",
              }}
            >
              {vehicle.brand} {vehicle.model}
            </h1>

            <p
              style={{
                color: "#999",
                marginTop: "8px",
              }}
            >
              Voertuigprofiel · Imperial Cabs
            </p>
          </div>

          <span
            style={{
              background: "#fff",
              color: "#000",
              padding: "8px 14px",
              borderRadius: "20px",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            {vehicle.status}
          </span>
        </div>

        {/* CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {/* VOERTUIGGEGEVENS */}
          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>Voertuiggegevens</h2>

            <p>
              <strong>Merk:</strong>{" "}
              {vehicle.brand}
            </p>

            <p>
              <strong>Model:</strong>{" "}
              {vehicle.model}
            </p>

            <p>
              <strong>Kenteken:</strong>{" "}
              {vehicle.license_plate}
            </p>

            <p>
              <strong>Bouwjaar:</strong>{" "}
              {vehicle.year || "Niet bekend"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {vehicle.status}
            </p>
          </section>

          {/* CHAUFFEUR */}
          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>Gekoppelde chauffeur</h2>

            {driver ? (
              <>
                <p>
                  <strong>Naam:</strong>{" "}
                  {driver.full_name}
                </p>

                <p>
                  <strong>Telefoon:</strong>{" "}
                  {driver.phone}
                </p>

                <p>
                  <strong>E-mail:</strong>{" "}
                  {driver.email}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/admin/drivers/${driver.id}`
                    )
                  }
                  style={{
                    marginTop: "12px",
                    background: "#fff",
                    color: "#000",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 15px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Chauffeur bekijken →
                </button>
              </>
            ) : (
              <p style={{ color: "#999" }}>
                Er is momenteel geen chauffeur
                gekoppeld.
              </p>
            )}
          </section>

          {/* APK */}
          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>APK</h2>

            <p style={{ color: "#999" }}>
              APK-gegevens worden hier bijgehouden.
            </p>
          </section>

          {/* VERZEKERING */}
          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>Verzekering</h2>

            <p style={{ color: "#999" }}>
              Verzekeringsgegevens komen hier.
            </p>
          </section>

          {/* ONDERHOUD */}
          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>Onderhoud</h2>

            <p style={{ color: "#999" }}>
              Onderhoudshistorie komt hier.
            </p>
          </section>

          {/* SCHADES */}
          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>Schades</h2>

            <p style={{ color: "#999" }}>
              Schademeldingen komen hier.
            </p>
          </section>

          {/* DOCUMENTEN */}
          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>Documenten</h2>

            <p style={{ color: "#999" }}>
              Voertuigdocumenten komen hier.
            </p>
          </section>

          {/* KILOMETERSTAND */}
          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>Kilometerstand</h2>

            <p style={{ color: "#999" }}>
              Kilometerregistratie komt hier.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
