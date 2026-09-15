"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

type Driver = {
  id: string;
  full_name: string;
};

export default function NewVehiclePage() {
  const router = useRouter();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("available");
  const [assignedDriverId, setAssignedDriverId] = useState("");

  useEffect(() => {
    async function loadDrivers() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("driver")
        .select("id, full_name");

      if (error) {
        console.error("Driver error:", error);
        setErrorMessage(
          "Chauffeurs konden niet worden geladen: " +
            error.message
        );
      } else {
        setDrivers(data || []);
      }

      setLoadingDrivers(false);
    }

    loadDrivers();
  }, [router]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setErrorMessage("");

    if (!brand.trim()) {
      setErrorMessage("Vul het merk van de auto in.");
      return;
    }

    if (!model.trim()) {
      setErrorMessage("Vul het model van de auto in.");
      return;
    }

    if (!licensePlate.trim()) {
      setErrorMessage("Vul het kenteken in.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("vehicle")
      .insert({
        brand: brand.trim(),
        model: model.trim(),
        license_plate: licensePlate
          .trim()
          .toUpperCase(),
        year: year ? Number(year) : null,
        status,
        assigned_driver_id:
          assignedDriverId || null,
      });

    if (error) {
      console.error("Vehicle insert error:", error);

      setErrorMessage(
        "Voertuig kon niet worden opgeslagen: " +
          error.message
      );

      setSaving(false);
      return;
    }

    router.push("/admin/vehicle");
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
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          onClick={() => router.push("/admin/vehicle")}
          style={{
            background: "#ffffff",
            color: "#000000",
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

        <h1
          style={{
            fontSize: "36px",
            margin: 0,
          }}
        >
          Voertuig toevoegen
        </h1>

        <p
          style={{
            color: "#aaaaaa",
            marginTop: "10px",
            marginBottom: "35px",
          }}
        >
          Voeg een nieuw voertuig toe aan de Imperial Cabs
          vloot.
        </p>

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

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#0b0b0b",
            border: "1px solid #222222",
            borderRadius: "14px",
            padding: "30px",
          }}
        >
          {/* Merk */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="brand"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              Merk
            </label>

            <input
              id="brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Bijvoorbeeld Kia"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px",
                borderRadius: "8px",
                border: "1px solid #333",
                background: "#111",
                color: "#fff",
              }}
            />
          </div>

          {/* Model */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="model"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              Model
            </label>

            <input
              id="model"
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Bijvoorbeeld e-Niro"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px",
                borderRadius: "8px",
                border: "1px solid #333",
                background: "#111",
                color: "#fff",
              }}
            />
          </div>

          {/* Kenteken */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="licensePlate"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              Kenteken
            </label>

            <input
              id="licensePlate"
              type="text"
              value={licensePlate}
              onChange={(e) =>
                setLicensePlate(e.target.value)
              }
              placeholder="Bijvoorbeeld AB-123-CD"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px",
                borderRadius: "8px",
                border: "1px solid #333",
                background: "#111",
                color: "#fff",
                textTransform: "uppercase",
              }}
            />
          </div>

          {/* Bouwjaar */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="year"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              Bouwjaar
            </label>

            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Bijvoorbeeld 2025"
              min="1900"
              max="2100"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px",
                borderRadius: "8px",
                border: "1px solid #333",
                background: "#111",
                color: "#fff",
              }}
            />
          </div>

          {/* Status */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="status"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px",
                borderRadius: "8px",
                border: "1px solid #333",
                background: "#111",
                color: "#fff",
              }}
            >
              <option value="available">
                Beschikbaar
              </option>
              <option value="in_use">
                In gebruik
              </option>
              <option value="maintenance">
                Onderhoud
              </option>
              <option value="inactive">
                Inactief
              </option>
            </select>
          </div>

          {/* Chauffeur */}
          <div style={{ marginBottom: "30px" }}>
            <label
              htmlFor="driver"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              Chauffeur koppelen
            </label>

            <select
              id="driver"
              value={assignedDriverId}
              onChange={(e) =>
                setAssignedDriverId(e.target.value)
              }
              disabled={loadingDrivers}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px",
                borderRadius: "8px",
                border: "1px solid #333",
                background: "#111",
                color: "#fff",
              }}
            >
              <option value="">
                {loadingDrivers
                  ? "Chauffeurs laden..."
                  : "Geen chauffeur koppelen"}
              </option>

              {drivers.map((driver) => (
                <option
                  key={driver.id}
                  value={driver.id}
                >
                  {driver.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Opslaan */}
          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              background: "#ffffff",
              color: "#000000",
              border: "none",
              borderRadius: "8px",
              padding: "14px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: saving
                ? "not-allowed"
                : "pointer",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving
              ? "Voertuig opslaan..."
              : "Voertuig opslaan"}
          </button>
        </form>
      </div>
    </main>
  );
}
