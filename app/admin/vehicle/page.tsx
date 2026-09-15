"use client";

import { useRouter } from "next/navigation";

export default function VehiclesPage() {
  const router = useRouter();

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
        <button
          type="button"
          onClick={() => router.push("/admin")}
          style={{
            background: "#ffffff",
            color: "#000000",
            border: "none",
            borderRadius: "8px",
            padding: "12px 18px",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: "30px",
          }}
        >
          ← Terug naar dashboard
        </button>

        <h1
          style={{
            fontSize: "36px",
            margin: 0,
          }}
        >
          Voertuigen
        </h1>

        <p
          style={{
            color: "#aaaaaa",
            marginTop: "10px",
          }}
        >
          Beheer alle Imperial Cabs voertuigen.
        </p>

        <div
          style={{
            marginTop: "40px",
            padding: "30px",
            border: "1px solid #222",
            borderRadius: "14px",
            background: "#0b0b0b",
          }}
        >
          <h2>Voertuigenbeheer</h2>

          <p style={{ color: "#aaaaaa" }}>
            De voertuigenpagina werkt.
          </p>

          <button
            type="button"
            onClick={() =>
              alert("Voertuig toevoegen komt hier.")
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
            + Voertuig toevoegen
          </button>
        </div>
      </div>
    </main>
  );
}
