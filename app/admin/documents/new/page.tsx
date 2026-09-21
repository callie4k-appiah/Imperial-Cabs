"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

type Driver = {
  id: string;
  full_name: string;
};

export default function NewDocumentPage() {
  const router = useRouter();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [driverId, setDriverId] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [status, setStatus] = useState("pending");
  const [expiryDate, setExpiryDate] = useState("");

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
        .select("id, full_name")
        .order("full_name");

      if (error) {
        console.error(error);
        setError("Chauffeurs konden niet worden geladen.");
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

    if (!documentType) {
      setError("Selecteer een documenttype.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("documents")
      .insert({
        driver_id: driverId,
        document_type: documentType,
        file_url: fileUrl || null,
        status,
        expiry_date: expiryDate || null,
      });

    if (error) {
      console.error(error);
      setError(
        "Document kon niet worden opgeslagen: " +
          error.message
      );
      setSaving(false);
      return;
    }

    router.push("/admin/documents");
  }

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

        <button
          className="back"
          onClick={() =>
            router.push("/admin/documents")
          }
        >
          ← Terug naar documenten
        </button>

        <div className="header">
          <div>
            <div className="eyebrow">
              IMPERIAL CABS
            </div>

            <h1>Nieuw document</h1>

            <p>
              Voeg een document toe aan een
              chauffeur.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="form-card"
        >

          {/* CHAUFFEUR */}
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

          {/* DOCUMENT TYPE */}
          <div className="field">
            <label>Documenttype</label>

            <select
              value={documentType}
              onChange={(e) =>
                setDocumentType(e.target.value)
              }
              required
            >
              <option value="">
                Selecteer documenttype
              </option>

              <option value="chauffeurskaart">
                Chauffeurskaart
              </option>

              <option value="rijbewijs">
                Rijbewijs
              </option>

              <option value="id">
                Identiteitsbewijs
              </option>

              <option value="taxipas">
                Taxipas
              </option>

              <option value="vgb">
                VGB
              </option>

              <option value="verzekering">
                Verzekeringsbewijs
              </option>

              <option value="apk">
                APK
              </option>

              <option value="overig">
                Overig
              </option>
            </select>
          </div>

          {/* STATUS */}
          <div className="field">
            <label>Status</label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option value="pending">
                In behandeling
              </option>

              <option value="approved">
                Goedgekeurd
              </option>

              <option value="rejected">
                Afgekeurd
              </option>

              <option value="expired">
                Verlopen
              </option>

              <option value="missing">
                Ontbreekt
              </option>
            </select>
          </div>

          {/* EXPIRY DATE */}
          <div className="field">
            <label>Vervaldatum</label>

            <input
              type="date"
              value={expiryDate}
              onChange={(e) =>
                setExpiryDate(e.target.value)
              }
            />

            <small>
              Laat leeg als het document geen
              vervaldatum heeft.
            </small>
          </div>

          {/* FILE URL */}
          <div className="field">
            <label>Document link</label>

            <input
              type="url"
              placeholder="https://..."
              value={fileUrl}
              onChange={(e) =>
                setFileUrl(e.target.value)
              }
            />

            <small>
              Voeg eventueel een link toe naar
              het document.
            </small>
          </div>

          {/* ERROR */}
          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {/* BUTTONS */}
          <div className="actions">

            <button
              type="button"
              className="cancel"
              onClick={() =>
                router.push("/admin/documents")
              }
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
                : "Document opslaan →"}
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
          margin: 0 0 30px;
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

        input,
        select {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #dcd9d2;
          background: white;
          border-radius: 10px;
          padding: 13px 14px;
          font-size: 14px;
          color: #171717;
          outline: none;
        }

        input:focus,
        select:focus {
          border-color: #b08a3e;
        }

        small {
          display: block;
          margin-top: 7px;
          color: #999;
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

        .submit:disabled {
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
