"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [stats, setStats] = useState({
    drivers: 0,
    vehicles: 0,
    applications: 0,
    payments: 0,
    damages: 0,
    maintenance: 0,
  });

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
        supabase.from("driver").select("*", { count: "exact", head: true }),
        supabase.from("vehicle").select("*", { count: "exact", head: true }),
        supabase
          .from("applications")
          .select("*", { count: "exact", head: true }),
        supabase.from("payments").select("*", { count: "exact", head: true }),
        supabase
          .from("damage_reports")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("maintenance")
          .select("*", { count: "exact", head: true }),
      ]);

      setStats({
        drivers: drivers.count || 0,
        vehicles: vehicles.count || 0,
        applications: applications.count || 0,
        payments: payments.count || 0,
        damages: damages.count || 0,
        maintenance: maintenance.count || 0,
      });
    }

    loadDashboard();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <main style={{ minHeight: "100vh", padding: "40px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <div>
          <h1>Imperial Cabs</h1>
          <p>Admin Dashboard</p>
        </div>

        <div>
          <span>{email}</span>{" "}
          <button onClick={logout}>Uitloggen</button>
        </div>
      </header>

      <section>
        <h2>Overzicht</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div>
            <h3>Chauffeurs</h3>
            <p>{stats.drivers}</p>
          </div>

          <div>
            <h3>Voertuigen</h3>
            <p>{stats.vehicles}</p>
          </div>

          <div>
            <h3>Nieuwe aanvragen</h3>
            <p>{stats.applications}</p>
          </div>

          <div>
            <h3>Open betalingen</h3>
            <p>{stats.payments}</p>
          </div>

          <div>
            <h3>Open schades</h3>
            <p>{stats.damages}</p>
          </div>

          <div>
            <h3>Onderhoud</h3>
            <p>{stats.maintenance}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
