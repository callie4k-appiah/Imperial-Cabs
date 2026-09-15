"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      setEmail(user.email || "");
    }

    checkUser();
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
            <p>0</p>
          </div>

          <div>
            <h3>Voertuigen</h3>
            <p>0</p>
          </div>

          <div>
            <h3>Nieuwe aanvragen</h3>
            <p>0</p>
          </div>

          <div>
            <h3>Open betalingen</h3>
            <p>0</p>
          </div>

          <div>
            <h3>Open schades</h3>
            <p>0</p>
          </div>

          <div>
            <h3>Onderhoud</h3>
            <p>0</p>
          </div>
        </div>
      </section>
    </main>
  );
}
