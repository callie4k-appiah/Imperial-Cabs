"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

type Driver = {
  id: string;
  full_name: string;
};

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
  assigned_driver_id: string | null;
};

export default function NewPaymentPage() {
  const router = useRouter();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("open");
  const [paymentDate, setPaymentDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        { data: driverData, error: driverError },
        { data: vehicleData, error: vehicleError },
      ] = await Promise.all([
        supabase
          .from("driver")
          .select("id, full_name")
          .order("full_name"),

        supabase
          .from("vehicle")
          .select(
            "id, brand, model, license_plate, assigned_driver_id"
          )
          .order("brand"),
      ]);

      if (driverError) {
        console.error("Driver error:", driverError);
        setErrorMessage(
          "Chauffeurs konden niet worden geladen."
        );
      }

      if (vehicleError) {
        console.error("Vehicle error:", vehicleError);
        setErrorMessage(
          "Voertuigen konden niet worden geladen."
        );
      }

      setDrivers(driverData || []);
      setVehicles(vehicleData || []);
      setLoading(false);
    }

    loadData();
  }, [router]);

  function handleDriverChange(value: string) {
    setDriverId(value);

    const matchingVehicle = vehicles.find(
      (vehicle) =>
        vehicle.assigned_driver_id === value
    );

    if (matchingVehicle) {
      setVehicleId(matchingVehicle.id);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    if (!driverId) {
      setErrorMessage("Selecteer een chauffeur.");
      return;
    }

    if (!amount) {
      setErrorMessage("Vul een bedrag in.");
      return;
    }

    if (!dueDate) {
      setErrorMessage("Vul een vervaldatum in.");
      return;
    }

    const numericAmount = Number(
      amount.replace(",", ".")
    );

    if (
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      setErrorMessage(
        "Vul een geldig bedrag in."
      );
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("payments")
      .insert({
        driver_id: driverId,
        vehicle_id: vehicleId || null,
        amount: numericAmount,
        status,
        payment_date: paymentDate || null,
        due_date: dueDate,
        notes: notes.trim() || null,
      });

    if (error) {
      console.error(
        "Payment insert error:",
        error
      );

      setErrorMessage(
        "Betaling kon niet worden opgeslagen: " +
          error.message
      );

      setSaving(false);
      return;
    }

    router.push("/admin/payments");
  }

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
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <p style={{ color: "#999" }}>
            Gegevens laden...
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
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* TERUG */}

        <button
          type="button"
          onClick={() =>
            router.push("/admin/payments")
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
          ← Terug naar betalingen
        </button>

        {/* HEADER */}

        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              fontWeight: 700,
            }}
          >
            Betaling toevoegen
          </h1>

          <p
            style={{
              color: "#999",
              marginTop: "8px",
            }}
          >
            Registreer een nieuwe betaling voor
            een chauffeur.
          </p>
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

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#0b0b0b",
            border: "1px solid #222",
            borderRadius: "16px",
            padding: "30px",
          }}
        >
          {/* CHAUFFEUR */}

          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#bbb",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Chauffeur *
            </label>

            <select
              value={driverId}
              onChange={(event) =>
                handleDriverChange(
                  event.target.value
                )
              }
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#151515",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "9px",
                padding: "13px",
                fontSize: "15px",
              }}
            >
              <option value="">
                Selecteer chauffeur
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

          {/* VOERTUIG */}

          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#bbb",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Voertuig
            </label>

            <select
              value={vehicleId}
              onChange={(event) =>
                setVehicleId(
                  event.target.value
                )
              }
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#151515",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "9px",
                padding: "13px",
                fontSize: "15px",
              }}
            >
              <option value="">
                Geen voertuig
              </option>

              {vehicles.map((vehicle) => (
                <option
                  key={vehicle.id}
                  value={vehicle.id}
                >
                  {vehicle.brand}{" "}
                  {vehicle.model} —{" "}
                  {vehicle.license_plate}
                </option>
              ))}
            </select>
          </div>

          {/* BEDRAG */}

          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#bbb",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Bedrag *
            </label>

            <input
              type="text"
              inputMode="decimal"
              placeholder="Bijvoorbeeld 400"
              value={amount}
              onChange={(event) =>
                setAmount(
                  event.target.value
                )
              }
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#151515",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "9px",
                padding: "13px",
                fontSize: "15px",
              }}
            />
          </div>

          {/* STATUS */}

          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#bbb",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Status *
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value
                )
              }
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#151515",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "9px",
                padding: "13px",
                fontSize: "15px",
              }}
            >
              <option value="open">
                Open
              </option>

              <option value="paid">
                Betaald
              </option>

              <option value="pending">
                In behandeling
              </option>

              <option value="overdue">
                Te laat
              </option>
            </select>
          </div>

          {/* VERVALDATUM */}

          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#bbb",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Vervaldatum *
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(
                  event.target.value
                )
              }
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#151515",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "9px",
                padding: "13px",
                fontSize: "15px",
              }}
            />
          </div>

          {/* BETAALDATUM */}

          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#bbb",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Betaaldatum
            </label>

            <input
              type="date"
              value={paymentDate}
              onChange={(event) =>
                setPaymentDate(
                  event.target.value
                )
              }
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#151515",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "9px",
                padding: "13px",
                fontSize: "15px",
              }}
            />
          </div>

          {/* NOTITIE */}

          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#bbb",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Notitie
            </label>

            <textarea
              placeholder="Bijvoorbeeld: weekbetaling week 38"
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
              rows={4}
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#151515",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "9px",
                padding: "13px",
                fontSize: "15px",
                resize: "vertical",
              }}
            />
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              background: "#d9a72f",
              color: "#000",
              border: "none",
              borderRadius: "10px",
              padding: "15px",
              cursor: saving
                ? "not-allowed"
                : "pointer",
              fontWeight: 700,
              fontSize: "16px",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving
              ? "Betaling opslaan..."
              : "Betaling opslaan →"}
          </button>
        </form>
      </div>
    </main>
  );
}
