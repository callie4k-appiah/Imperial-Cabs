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

  const rawId = params?.id;
  const driverId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [driver, setDriver] = useState<Driver | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDriver() {
      setLoading(true);
      setErrorMessage("");

      if (!driverId) {
        setErrorMessage("Geen chauffeur-ID gevonden in de URL.");
        setLoading(false);
        return;
      }

      // Controleer login
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("Auth error:", authError);
        setErrorMessage(
          "Er is een probleem met de admin-login: " +
            authError.message
        );
        setLoading(false);
        return;
      }

      if (!user) {
        router.push("/admin/login");
        return;
      }

      console.log("Chauffeur ID:", driverId);
      console.log("Admin:", user.email);

      // Chauffeur ophalen
      const { data: driverData, error: driverError } =
        await supabase
          .from("driver")
          .select(
            "id, full_name, phone, email, status, start_date, chauffeurskaart_number"
          )
          .eq("id", driverId)
          .maybeSingle();

      if (driverError) {
        console.error("Driver error:", driverError);

        setErrorMessage(
          "Chauffeur kon niet worden geladen: " +
            driverError.message
        );

        setLoading(false);
        return;
      }

      if (!driverData) {
        console.error(
          "Geen chauffeur gevonden voor ID:",
          driverId
        );

        setErrorMessage(
          "Geen chauffeur gevonden met ID: " + driverId
        );

        setLoading(false);
        return;
      }

      console.log("Chauffeur gevonden:", driverData);

      setDriver(driverData);

      // Gekoppeld voertuig ophalen
      const { data: vehicleData, error: vehicleError } =
        await supabase
          .from("vehicle")
          .select(
            "id, brand, model, license_plate, year, status"
          )
          .eq("assigned_driver_id", driverId)
          .maybeSingle();

      if (vehicleError) {
        console.error("Vehicle error:", vehicleError);
      }

      setVehicle(vehicleData || null);

      setLoading(false);
    }

    loadDriver();
  }, [driverId, router]);

  // Laden
  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#050505",
          color: "#fff",
          padding: "40px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <p style={{ color: "#aaa" }}>
            Chauffeur laden...
          </p>
        </div>
      </main>
    );
  }

  // Fout
  if (errorMessage) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#050505",
          color: "#fff",
          padding: "40px",
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
              router.push("/admin/drivers")
            }
            style={{
              background: "#fff",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              padding: "11px 17px",
              cursor: "pointer",
              fontWeight: 600,
              marginBottom: "30px",
            }}
          >
            ← Terug naar chauffeurs
          </button>

          <div
            style={{
              background: "#160909",
              border: "1px solid #6b2525",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h1 style={{ marginTop: 0 }}>
              Chauffeur niet gevonden
            </h1>

            <p
              style={{
                color: "#ffb0b0",
                lineHeight: 1.6,
              }}
            >
              {errorMessage}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Chauffeur bestaat niet
  if (!driver) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#050505",
          color: "#fff",
          padding: "40px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <h1>Chauffeur niet gevonden</h1>

          <button
            type="button"
            onClick={() =>
              router.push("/admin/drivers")
            }
            style={{
              marginTop: "20px",
              background: "#fff",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              padding: "12px 18px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ← Terug naar chauffeurs
          </button>
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
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Terug */}
        <button
          type="button"
          onClick={() =>
            router.push("/admin/drivers")
          }
          style={{
            background: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            padding: "11px 17px",
            cursor: "pointer",
            fontWeight: 600,
            marginBottom: "30px",
          }}
        >
          ← Terug naar chauffeurs
        </button>

        {/* Header */}
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
              {driver.full_name}
            </h1>

            <p
              style={{
                color: "#999",
                marginTop: "8px",
              }}
            >
              Chauffeurprofiel · Imperial Cabs
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
            {driver.status}
          </span>
        </div>

        {/* Cards */}
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
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>Persoonsgegevens</h2>

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

            <p>
              <strong>Startdatum:</strong>{" "}
              {driver.start_date || "Niet ingevuld"}
            </p>

            <p>
              <strong>Chauffeurskaart:</strong>{" "}
              {driver.chauffeurskaart_number ||
                "Niet ingevuld"}
            </p>
          </section>

          {/* Voertuig */}
          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>Voertuig</h2>

            {vehicle ? (
              <>
                <p>
                  <strong>Auto:</strong>{" "}
                  {vehicle.brand} {vehicle.model}
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
              </>
            ) : (
              <p style={{ color: "#999" }}>
                Nog geen voertuig gekoppeld.
              </p>
            )}
          </section>

          {/* Documenten */}
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
              Documenten beheren.
            </p>
          </section>

          {/* Betalingen */}
          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>Betalingen</h2>

            <p style={{ color: "#999" }}>
              Betalingen en openstaande bedragen.
            </p>
          </section>

          {/* Schade */}
          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>Schademeldingen</h2>

            <p style={{ color: "#999" }}>
              Schades van deze chauffeur.
            </p>
          </section>

          {/* Onderhoud */}
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
              Onderhoud en reparaties.
            </p>
          </section>

          {/* Contract */}
          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>Contract</h2>

            <p style={{ color: "#999" }}>
              Contractgegevens.
            </p>
          </section>

          {/* Berichten */}
          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>Berichten</h2>

            <p style={{ color: "#999" }}>
              Communicatie met deze chauffeur.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
