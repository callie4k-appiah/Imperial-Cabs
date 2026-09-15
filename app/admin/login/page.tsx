"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("E-mailadres of wachtwoord is incorrect.");
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <h1>Imperial Cabs</h1>
        <p>Admin login</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-mailadres"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p>{error}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Inloggen..." : "Inloggen"}
          </button>
        </form>
      </div>
    </main>
  );
}
