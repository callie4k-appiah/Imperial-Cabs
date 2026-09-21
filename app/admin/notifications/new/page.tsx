"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";

type Driver = {
  id: string;
  full_name: string;
  phone: string | null;
};

export default function NewNotificationPage() {
  const router = useRouter();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driverId, setDriverId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("Algemeen");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDrivers();
  }, []);

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
      .select("id, full_name, phone")
      .order("full_name", { ascending: true });

    if (error) {
      setError(`Chauffeurs konden niet worden geladen: ${error.message}`);
    } else {
      setDrivers(data || []);
    }

    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!driverId) {
      setError("Selecteer eerst een chauffeur.");
      return;
    }

    if (!title.trim()) {
      setError("Vul een titel in.");
      return;
    }

    if (!message.trim()) {
      setError("Vul een bericht in.");
      return;
    }

    setSaving(true);

    const { error: insertError } = await supabase
      .from("notifications")
      .insert({
        driver_id: driverId,
        title: title.trim(),
        message: message.trim(),
        type,
        is_read: false,
      });

    if (insertError) {
      setError(
        `Notificatie kon niet worden opgeslagen: ${insertError.message}`
      );
      setSaving(false);
      return;
    }

    router.push("/admin/notifications");
  }

  const selectedDriver = drivers.find(
    (driver) => driver.id === driverId
  );

  if (loading) {
    return (
      <main className="admin-page">
        <div className="container">
          <p>Pagina laden...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="container">
        <Link href="/admin/notifications" className="back-link">
          ← Terug naar notificaties
        </Link>

        <header className="header">
          <div className="eyebrow">IMPERIAL CABS</div>

          <h1>Nieuwe notificatie</h1>

          <p>
            Stuur een belangrijke melding naar een chauffeur.
          </p>
        </header>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-section">
            <h2>Ontvanger</h2>
            <p>Selecteer de chauffeur die de notificatie ontvangt.</p>

            <label htmlFor="driver">Chauffeur</label>

            <select
              id="driver"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              required
            >
              <option value="">Selecteer chauffeur</option>

              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.full_name}
                  {driver.phone ? ` — ${driver.phone}` : ""}
                </option>
              ))}
            </select>

            {selectedDriver && (
              <div className="driver-preview">
                <div className="avatar">
                  {selectedDriver.full_name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <strong>{selectedDriver.full_name}</strong>

                  <span>
                    {selectedDriver.phone || "Geen telefoonnummer"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="form-section">
            <h2>Notificatie</h2>
            <p>Vul de inhoud van de melding in.</p>

            <label htmlFor="type">Type</label>

            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Algemeen">Algemeen</option>
              <option value="Betaling">Betaling</option>
              <option value="Voertuig">Voertuig</option>
              <option value="Document">Document</option>
              <option value="Onderhoud">Onderhoud</option>
              <option value="Contract">Contract</option>
              <option value="Belangrijk">Belangrijk</option>
            </select>

            <label htmlFor="title">Titel</label>

            <input
              id="title"
              type="text"
              placeholder="Bijvoorbeeld: Betaling ontvangen"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />

            <label htmlFor="message">Bericht</label>

            <textarea
              id="message"
              placeholder="Schrijf hier de notificatie..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={7}
              maxLength={1000}
              required
            />

            <div className="character-count">
              {message.length}/1000
            </div>
          </div>

          <div className="actions">
            <Link
              href="/admin/notifications"
              className="cancel-button"
            >
              Annuleren
            </Link>

            <button
              type="submit"
              className="save-button"
              disabled={saving}
            >
              {saving
                ? "Notificatie opslaan..."
                : "Notificatie versturen →"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: #f7f6f3;
          padding: 40px;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
        }

        .back-link {
          display: inline-block;
          color: #9b7427;
          text-decoration: none;
          font-weight: 600;
          margin-bottom: 40px;
        }

        .header {
          margin-bottom: 30px;
        }

        .eyebrow {
          color: #b38a32;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 3px;
          margin-bottom: 12px;
        }

        h1 {
          margin: 0;
          color: #151515;
          font-size: 48px;
          letter-spacing: -1.5px;
        }

        .header p {
          margin-top: 12px;
          color: #777;
          font-size: 18px;
        }

        .form-card {
          background: white;
          border: 1px solid #e4e1da;
          border-radius: 22px;
          overflow: hidden;
        }

        .form-section {
          padding: 32px;
          border-bottom: 1px solid #ece9e2;
        }

        .form-section h2 {
          margin: 0 0 6px;
          font-size: 22px;
          color: #181818;
        }

        .form-section > p {
          margin: 0 0 25px;
          color: #888;
        }

        label {
          display: block;
          font-weight: 700;
          color: #333;
          margin: 20px 0 8px;
        }

        input,
        select,
        textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #ddd8ce;
          background: #faf9f7;
          border-radius: 11px;
          padding: 14px 15px;
          font-size: 16px;
          font-family: inherit;
          color: #222;
          outline: none;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #b38a32;
          background: white;
        }

        textarea {
          resize: vertical;
          min-height: 160px;
          line-height: 1.6;
        }

        .driver-preview {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 18px;
          padding: 15px;
          background: #f8f6f0;
          border-radius: 14px;
        }

        .avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: #eee7d7;
          color: #9b7427;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 19px;
        }

        .driver-preview strong {
          display: block;
          color: #222;
          margin-bottom: 3px;
        }

        .driver-preview span {
          color: #888;
          font-size: 14px;
        }

        .character-count {
          text-align: right;
          color: #999;
          font-size: 13px;
          margin-top: 7px;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 25px 32px;
          background: #fcfbf9;
        }

        .cancel-button,
        .save-button {
          border-radius: 11px;
          padding: 14px 22px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
        }

        .cancel-button {
          background: white;
          color: #555;
          border: 1px solid #ddd8ce;
        }

        .save-button {
          background: #181818;
          color: #d9b45a;
          border: none;
        }

        .save-button:hover {
          background: #000;
        }

        .save-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-box {
          background: #fff1f1;
          color: #a33;
          border: 1px solid #efcccc;
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 25px;
        }

        @media (max-width: 600px) {
          .admin-page {
            padding: 25px 18px;
          }

          h1 {
            font-size: 38px;
          }

          .form-section {
            padding: 24px 20px;
          }

          .actions {
            padding: 20px;
            flex-direction: column-reverse;
          }

          .cancel-button,
          .save-button {
            width: 100%;
            text-align: center;
            box-sizing: border-box;
          }
        }
      `}</style>
    </main>
  );
}
