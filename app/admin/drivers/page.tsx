"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Driver = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  status: string;
  start_date: string | null;
};

export default function DriversPage() {
  const router = useRouter();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDrivers() {
      setLoading(true);
      setErrorMessage("");

      // Controleer of de admin is ingelogd
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("Auth error:", authError);
        setErrorMessage("Er is een probleem met de login.");
        setLoading(false);
        return;
      }

      if (!user) {
        router.push("/admin/login");
        return;
      }

      // Chauffeurs ophalen
      const { data, error } = await supabase
        .from("driver")
        .select(
          "id, full_name, phone, email, status, start_date"
        );

      if (error) {
        console.error("Driver error:", error);

        setErrorMessage(
          "Chauffeurs konden niet worden geladen: " +
            error.message
        );

        setLoading(false);
        return;
      }

      console.log("Drivers gevonden:", data);

      setDrivers(data || []);
      setLoading(false);
    }

    loadDrivers();
  }, [router]);

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
                fontWeight: 700,
              }}
            >
              Chauffeurs
            </h1>

            <p
              style={{
                marginTop: "8px",
                color: "#aaaaaa",
              }}
            >
              Beheer alle Imperial Cabs chauffeurs.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/admin/drivers/new")
            }
            style={{
              background: "#ffffff",
              color: "#000000",
              border: "none",
              borderRadius: "8px",
              padding: "12px 18px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Chauffeur toevoegen
          </button>
        </div>

        {/* ERROR */}
        {errorMessage && (
          <div
            style={{
              background: "#2a1111",
              border: "1px solid #7a2d2d",
              color: "#ffb3b3",
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
          <div
            style={{
              padding: "30px 0",
              color: "#aaaaaa",
            }}
          >
            Chauffeurs laden...
          </div>
        ) : drivers.length === 0 ? (
          /* GEEN CHAUFFEURS */
          <div
            style={{
              border: "1px solid #222222",
              borderRadius: "14px",
              padding: "40px",
              background: "#0b0b0b",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                fontSize: "24px",
              }}
            >
              Nog geen chauffeurs
            </h2>

            <p
              style={{
                color: "#aaaaaa",
                marginBottom: "25px",
              }}
            >
              Zodra je chauffeurs toevoegt, verschijnen ze
              hier.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/admin/drivers/new")
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
              Eerste chauffeur toevoegen
            </button>
          </div>
        ) : (
          /* CHAUFFEURS */
          <div
            style={{
              display: "grid",
              gap: "15px",
            }}
          >
            {drivers.map((driver) => (
              <button
                key={driver.id}
                type="button"
                onClick={() =>
                  router.push(
                    `/admin/drivers/${driver.id}`
                  )
                }
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "#0b0b0b",
                  color: "#ffffff",
                  border: "1px solid #222222",
                  borderRadius: "14px",
                  padding: "22px",
                  cursor: "pointer",
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
                      {driver.full_name}
                    </h2>

                    <p
                      style={{
                        margin: "8px 0 0",
                        color: "#aaaaaa",
                      }}
                    >
                      {driver.phone}
                    </p>

                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "#aaaaaa",
                      }}
                    >
                      {driver.email}
                    </p>
                  </div>

                  <span
                    style={{
                      background: "#ffffff",
                      color: "#000000",
                      borderRadius: "20px",
                      padding: "6px 12px",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {driver.status}
                  </span>
                </div>

                {driver.start_date && (
                  <p
                    style={{
                      margin: "18px 0 0",
                      color: "#888888",
                      fontSize: "14px",
                    }}
                  >
                    Startdatum: {driver.start_date}
                  </p>
                )}

                <div
                  style={{
                    marginTop: "18px",
                    color: "#d4af37",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  Chauffeur bekijken →
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
