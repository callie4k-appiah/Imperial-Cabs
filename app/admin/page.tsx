"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Stats = {
  drivers: number;
  vehicles: number;
  applications: number;
  payments: number;
  damages: number;
  maintenance: number;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [stats, setStats] = useState<Stats>({
    drivers: 0,
    vehicles: 0,
    applications: 0,
    payments: 0,
    damages: 0,
    maintenance: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      setEmail(user.email || "");

      const [
        drivers,
        vehicles,
        applications,
        payments,
        damages,
        maintenance,
      ] = await Promise.all([
        supabase
          .from("driver")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("vehicle")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("applications")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("payments")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("damage_reports")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("maintenance")
          .select("*", {
            count: "exact",
            head: true,
          }),
      ]);

      setStats({
        drivers: drivers.count || 0,
        vehicles: vehicles.count || 0,
        applications: applications.count || 0,
        payments: payments.count || 0,
        damages: damages.count || 0,
        maintenance: maintenance.count || 0,
      });

      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const cards = [
    {
      title: "Chauffeurs",
      value: stats.drivers,
      description: "Beheer alle chauffeurs",
      icon: "👤",
      path: "/admin/drivers",
    },
    {
      title: "Voertuigen",
      value: stats.vehicles,
      description: "Beheer je wagenpark",
      icon: "🚗",
      path: "/admin/vehicle",
    },
    {
      title: "Nieuwe aanvragen",
      value: stats.applications,
      description: "Bekijk chauffeur-aanvragen",
      icon: "📋",
      path: "/admin/applications",
    },
    {
      title: "Open betalingen",
      value: stats.payments,
      description: "Bekijk betalingen",
      icon: "💰",
      path: "/admin/payments",
    },
    {
      title: "Open schades",
      value: stats.damages,
      description: "Bekijk schademeldingen",
      icon: "🔧",
      path: "/admin/damage-reports",
    },
    {
      title: "Onderhoud",
      value: stats.maintenance,
      description: "Bekijk onderhoud",
      icon: "🛠️",
      path: "/admin/maintenance",
    },
  ];

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
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <p style={{ color: "#999" }}>
            Dashboard laden...
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
        padding: "30px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >

        {/* HEADER */}

        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "50px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "32px",
                fontWeight: 700,
              }}
            >
              Imperial Cabs
            </h1>

            <p
              style={{
                marginTop: "6px",
                color: "#999",
              }}
            >
              Admin Dashboard
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <span
              style={{
                color: "#aaa",
                fontSize: "14px",
              }}
            >
              {email}
            </span>

            <button
              type="button"
              onClick={logout}
              style={{
                background: "#fff",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                padding: "9px 14px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Uitloggen
            </button>
          </div>
        </header>

        {/* TITLE */}

        <div
          style={{
            marginBottom: "25px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
            }}
          >
            Overzicht
          </h2>

          <p
            style={{
              color: "#777",
              marginTop: "6px",
            }}
          >
            Beheer je chauffeurs, voertuigen en dagelijkse
            operatie vanuit één omgeving.
          </p>
        </div>

        {/* CARDS */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px",
          }}
        >
          {cards.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={() => router.push(card.path)}
              style={{
                textAlign: "left",
                background: "#0b0b0b",
                color: "#fff",
                border: "1px solid #222",
                borderRadius: "16px",
                padding: "25px",
                cursor: "pointer",
                transition:
                  "border-color 0.2s, transform 0.2s",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.borderColor =
                  "#d9a72f";
                event.currentTarget.style.transform =
                  "translateY(-2px)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.borderColor =
                  "#222";
                event.currentTarget.style.transform =
                  "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "15px",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      color: "#aaa",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {card.title}
                  </p>

                  <p
                    style={{
                      margin: "12px 0 0",
                      fontSize: "36px",
                      fontWeight: 700,
                    }}
                  >
                    {card.value}
                  </p>
                </div>

                <span
                  style={{
                    fontSize: "28px",
                  }}
                >
                  {card.icon}
                </span>
              </div>

              <div
                style={{
                  marginTop: "18px",
                  paddingTop: "15px",
                  borderTop: "1px solid #1d1d1d",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: "#777",
                    fontSize: "13px",
                  }}
                >
                  {card.description}
                </span>

                <span
                  style={{
                    color: "#d9a72f",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  Open →
                </span>
              </div>
            </button>
          ))}
        </section>

        {/* QUICK ACTIONS */}

        <section
          style={{
            marginTop: "40px",
            background: "#0b0b0b",
            border: "1px solid #222",
            borderRadius: "16px",
            padding: "25px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              fontSize: "20px",
            }}
          >
            Snelle acties
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "18px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                router.push("/admin/drivers/new")
              }
              style={{
                background: "#d9a72f",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                padding: "12px 17px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              + Chauffeur toevoegen
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/admin/vehicle/new")
              }
              style={{
                background: "#171717",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "12px 17px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              + Voertuig toevoegen
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/admin/applications")
              }
              style={{
                background: "#171717",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "12px 17px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              📋 Aanvragen bekijken
            </button>
          </div>
        </section>

        {/* FOOTER */}

        <footer
          style={{
            marginTop: "50px",
            paddingTop: "20px",
            borderTop: "1px solid #1d1d1d",
            color: "#555",
            fontSize: "13px",
          }}
        >
          Imperial Cabs B.V. · Amsterdam & omgeving
        </footer>

      </div>
    </main>
  );
}
