"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function NewDriverPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("approved");
  const [startDate, setStartDate] = useState("");
  const [chauffeurskaart, setChauffeurskaart] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSaving(true);

    const { error } = await supabase.from("driver").insert({
      full_name: fullName,
      phone,
      email,
      status,
      start_date: startDate || null,
      chauffeurskaart_number: chauffeurskaart || null,
    });

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/drivers");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <h1>Nieuwe chauffeur</h1>

      <p>Voeg een chauffeur toe aan Imperial Cabs.</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label>Volledige naam</label>

          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "6px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Telefoonnummer</label>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "6px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>E-mailadres</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "6px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Status</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "6px",
            }}
          >
            <option value="application">Application</option>
            <option value="approved">Approved</option>
            <option value="documents">Documents</option>
            <option value="ready">Ready</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Startdatum</label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "6px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Chauffeurskaart nummer</label>

          <input
            type="text"
            value={chauffeurskaart}
            onChange={(e) =>
              setChauffeurskaart(e.target.value)
            }
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "6px",
            }}
          />
        </div>

        {error && (
          <p style={{ marginBottom: "20px" }}>
            ❌ {error}
          </p>
        )}

        <button type="submit" disabled={saving}>
          {saving ? "Opslaan..." : "Chauffeur toevoegen"}
        </button>
      </form>
    </main>
  );
}
