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

  useEffect(() => {
    async function loadDrivers() {
      const { data, error } = await supabase
        .from("driver")
        .select("id, full_name, phone, email, status, start_date")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading drivers:", error);
      } else {
        setDrivers(data || []);
      }

      setLoading(false);
    }

    loadDrivers();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1>Chauffeurs</h1>
          <p>Beheer alle Imperial Cabs chauffeurs.</p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/admin/drivers/new")}
        >
          + Chauffeur toevoegen
        </button>
      </div>

      {loading ? (
        <p>Chauffeurs laden...</p>
      ) : drivers.length === 0 ? (
        <div>
          <h2>Nog geen chauffeurs</h2>
          <p>
            Zodra je chauffeurs toevoegt, verschijnen ze hier.
          </p>
        </div>
      ) : (
        <div>
          {drivers.map((driver) => (
            <div
              key={driver.id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                marginBottom: "12px",
                borderRadius: "10px",
              }}
            >
              <h3>{driver.full_name}</h3>

              <p>
                <strong>Telefoon:</strong> {driver.phone}
              </p>

              <p>
                <strong>E-mail:</strong> {driver.email}
              </p>

              <p>
                <strong>Status:</strong> {driver.status}
              </p>

              {driver.start_date && (
                <p>
                  <strong>Startdatum:</strong> {driver.start_date}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
