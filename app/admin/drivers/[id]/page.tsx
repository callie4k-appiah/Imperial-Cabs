"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

type Driver = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  status: string;
  start_date: string | null;
  chauffeurskaart_number: string | null;
  created_at: string;
};

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
  year: number | null;
  status: string;
};

export default function DriverDetailPage() {
  const params = useParams();
  const router = useRouter();
  const driverId = params.id as string;

  const [driver, setDriver] = useState<Driver | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDriver() {
      setLoading(true);

      const { data: driverData, error: driverError } = await supabase
        .from("driver")
        .select(
          "id, full_name, phone, email, status, start_date, chauffeurskaart_number, created_at"
        )
        .eq("id", driverId)
        .single();

      if (driverError) {
        console.error("Error loading driver:", driverError);
        setLoading(false);
        return;
      }

      setDriver(driverData);

      const { data: vehicleData, error: vehicleError } = await supabase
        .from("vehicle")
        .select(
          "id, brand, model, license_plate, year, status"
        )
        .eq("assigned_driver_id", driverId)
        .maybeSingle();

      if (vehicleError) {
        console.error("Error loading vehicle:", vehicleError);
      }

      setVehicle(vehicleData);

      setLoading(false);
    }

    if (driverId) {
      loadDriver();
    }
  }, [driverId]);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "40px",
        }}
      >
        <p>Chauffeur laden...</p>
      </main>
    );
  }

  if (!driver) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "40px",
        }}
      >
        <h1>Chauffeur niet gevonden</h1>

        <button
          onClick={() => router.push("/admin/drivers")}
          style={{
            marginTop: "20px",
            padding: "12px 18px",
            cursor: "pointer",
          }}
        >
          ← Terug naar chauffeurs
        </button>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#f7f5f0",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <button
          onClick={() => router.push("/admin/drivers")}
          style={{
            marginBottom: "25px",
            padding: "10px 16px",
            cursor: "pointer",
          }}
        >
          ← Terug naar chauffeurs
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "32px",
                marginBottom: "8px",
              }}
            >
              {driver.full_name}
            </h1>

            <p style={{ color: "#666" }}>
              Chauffeurprofiel · Imperial Cabs
            </p>
          </div>

          <div
            style={{
              padding: "8px 14px",
              borderRadius: "20px",
              background: "#111",
              color: "#fff",
              fontSize: "14px",
            }}
          >
            {driver.status}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Persoonsgegevens */}
          <section
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "14px",
              border: "1px solid #ddd",
            }}
          >
            <h2>Persoonsgegevens</h2>

            <p>
              <strong>Naam:</strong> {driver.full_name}
            </p>

            <p>
              <strong>Telefoon:</strong> {driver.phone}
            </p>

            <p>
              <strong>E-mail:</strong> {driver.email}
            </p>

            <p>
              <strong>Startdatum:</strong>{" "}
              {driver.start_date || "Nog niet ingevuld"}
            </p>

            <p>
              <strong>Chauffeurskaart:</strong>{" "}
              {driver.chauffeurskaart_number ||
                "Nog niet ingevuld"}
            </p>
          </section>

          {/* Voertuig */}
          <section
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "14px",
              border: "1px solid #ddd",
            }}
          >
            <h2>Gekoppeld voertuig</h2>

            {vehicle ? (
              <>
                <p>
                  <strong>Auto:</strong> {vehicle.brand}{" "}
                  {vehicle.model}
                </p>

                <p>
                  <strong>Kenteken:</strong>{" "}
                  {vehicle.license_plate}
                </p>

                <p>
                  <strong>Bouwjaar:</strong>{" "}
                  {vehicle.year || "Onbekend"}
                </p>

                <p>
                  <strong>Status:</strong> {vehicle.status}
                </p>
              </>
            ) : (
              <p>Deze chauffeur heeft nog geen voertuig.</p>
            )}
          </section>

          {/* Documenten */}
          <section
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "14px",
              border: "1px solid #ddd",
            }}
          >
            <h2>Documenten</h2>
            <p>Documenten beheren komt hier.</p>
          </section>

          {/* Betalingen */}
          <section
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "14px",
              border: "1px solid #ddd",
            }}
          >
            <h2>Betalingen</h2>
            <p>Betalingen en openstaande bedragen komen hier.</p>
          </section>

          {/* Schade */}
          <section
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "14px",
              border: "1px solid #ddd",
            }}
          >
            <h2>Schademeldingen</h2>
            <p>Schademeldingen komen hier.</p>
          </section>

          {/* Onderhoud */}
          <section
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "14px",
              border: "1px solid #ddd",
            }}
          >
            <h2>Onderhoud</h2>
            <p>Onderhoud en reparaties komen hier.</p>
          </section>

          {/* Contract */}
          <section
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "14px",
              border: "1px solid #ddd",
            }}
          >
            <h2>Contract</h2>
            <p>Contractgegevens komen hier.</p>
          </section>

          {/* Berichten */}
          <section
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "14px",
              border: "1px solid #ddd",
            }}
          >
            <h2>Berichten</h2>
            <p>Communicatie met deze chauffeur komt hier.</p>
          </section>
        </div>
      </div>
    </main>
  );
}

