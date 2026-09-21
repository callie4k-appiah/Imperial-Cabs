"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

type Driver = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
};

export default function NewMessagePage() {
  const router = useRouter();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [driverId, setDriverId] = useState("");
  const [message, setMessage] = useState("");

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
        .select(
          "id, full_name, phone, email"
        )
        .order("full_name");

      if (error) {
        console.error(error);
        setError(
          "Chauffeurs konden niet worden geladen."
        );
      } else {
        setDrivers(data || []);
      }

      setLoading(false);
    }

    loadDrivers();
  }, [router]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    if (!driverId) {
      setError("Selecteer een chauffeur.");
      return;
    }

    if (!message.trim()) {
      setError("Vul een bericht in.");
      return;
    }

    if (message.trim().length < 3) {
      setError(
        "Het bericht moet minimaal 3 tekens bevatten."
      );
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("messages")
      .insert({
        driver_id: driverId,
        sender_type: "admin",
        message: message.trim(),
        is_read: false,
      });

    if (error) {
      console.error(error);

      setError(
        "Bericht kon niet worden opgeslagen: " +
          error.message
      );

      setSaving(false);
      return;
    }

    router.push("/admin/messages");
  }

  const selectedDriver = drivers.find(
    (driver) => driver.id === driverId
  );

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <p>Pagina laden...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">

        {/* BACK */}
        <button
          className="back"
          onClick={() =>
            router.push("/admin/messages")
          }
        >
          ← Terug naar berichten
        </button>

        {/* HEADER */}
        <div className="header">
          <div>
            <div className="eyebrow">
              IMPERIAL CABS
            </div>

            <h1>Nieuw bericht</h1>

            <p>
              Stuur een bericht naar een chauffeur.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="form-card"
        >

          {/* DRIVER */}
          <div className="field">
            <label>Chauffeur</label>

            <select
              value={driverId}
              onChange={(e) =>
                setDriverId(e.target.value)
              }
              required
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

          {/* SELECTED DRIVER */}
          {selectedDriver && (
            <div className="driver-preview">

              <div className="avatar">
                {selectedDriver.full_name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <strong>
                  {selectedDriver.full_name}
                </strong>

                <span>
                  {selectedDriver.phone ||
                    "Geen telefoonnummer"}
                </span>

                {selectedDriver.email && (
                  <span>
                    {selectedDriver.email}
                  </span>
                )}
              </div>

            </div>
          )}

          {/* MESSAGE */}
          <div className="field">
            <label>Bericht</label>

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Typ hier je bericht..."
              rows={8}
              required
            />

            <div className="character-count">
              {message.length} tekens
            </div>
          </div>

          {/* INFO */}
          <div className="info-box">

            <div className="info-icon">
              💬
            </div>

            <div>
              <strong>
                Bericht van Imperial Cabs
              </strong>

              <p>
                Dit bericht wordt gekoppeld aan
                de geselecteerde chauffeur.
              </p>
            </div>

          </div>

          {/* ERROR */}
          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {/* ACTIONS */}
          <div className="actions">

            <button
              type="button"
              className="cancel"
              onClick={() =>
                router.push(
                  "/admin/messages"
                )
              }
              disabled={saving}
            >
              Annuleren
            </button>

            <button
              type="submit"
              className="submit"
              disabled={saving}
            >
              {saving
                ? "Opslaan..."
                : "Bericht versturen →"}
            </button>

          </div>

        </form>

      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f6f5f2;
          padding: 40px 20px 80px;
          color: #171717;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
        }

        .back {
          border: none;
          background: transparent;
          padding: 0;
          margin-bottom: 30px;
          color: #666;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .back:hover {
          color: #000;
        }

        .header {
          margin-bottom: 30px;
        }

        .eyebrow {
          color: #b08a3e;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        h1 {
          margin: 0 0 8px;
          font-size: 40px;
        }

        .header p {
          margin: 0;
          color: #777;
        }

        .form-card {
          background: white;
          border: 1px solid #e7e4de;
          border-radius: 18px;
          padding: 30px;
        }

        .field {
          margin-bottom: 22px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 800;
        }

        select,
        textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #dcd9d2;
          background: white;
          border-radius: 10px;
          padding: 13px 14px;
          font-size: 14px;
          color: #171717;
          outline: none;
          font-family: inherit;
        }

        select:focus,
        textarea:focus {
          border-color: #b08a3e;
        }

        textarea {
          resize: vertical;
          min-height: 170px;
          line-height: 1.6;
        }

        .driver-preview {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #faf9f6;
          border: 1px solid #ebe7de;
          border-radius: 12px;
          padding: 15px;
          margin-top: -8px;
          margin-bottom: 24px;
        }

        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #f1ecdf;
          color: #8f6e2c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 17px;
        }

        .driver-preview div:last-child {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .driver-preview strong {
          font-size: 14px;
        }

        .driver-preview span {
          color: #888;
          font-size: 12px;
        }

        .character-count {
          text-align: right;
          color: #999;
          font-size: 11px;
          margin-top: 6px;
        }

        .info-box {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #faf7ee;
          border: 1px solid #eadfbd;
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 22px;
        }

        .info-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #f0e7cb;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .info-box strong {
          font-size: 13px;
        }

        .info-box p {
          margin: 4px 0 0;
          color: #8a6a20;
          font-size: 12px;
        }

        .error {
          background: #fff0e8;
          color: #9a4e24;
          border: 1px solid #f0cbb9;
          padding: 13px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 10px;
        }

        .cancel,
        .submit {
          border: none;
          border-radius: 10px;
          padding: 13px 20px;
          font-weight: 700;
          cursor: pointer;
        }

        .cancel {
          background: #eeeeee;
          color: #444;
        }

        .submit {
          background: #171717;
          color: #d4af62;
        }

        .submit:hover {
          background: #292929;
        }

        .submit:disabled,
        .cancel:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 600px) {
          .page {
            padding: 25px 15px 60px;
          }

          h1 {
            font-size: 32px;
          }

          .form-card {
            padding: 20px;
          }

          .actions {
            flex-direction: column-reverse;
          }

          .cancel,
          .submit {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
