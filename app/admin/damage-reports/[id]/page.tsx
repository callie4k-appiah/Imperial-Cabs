"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

type DamageReport = {
  id: string;
  driver_id: string;
  vehicle_id: string | null;
  description: string;
  damage_date: string;
  location: string | null;
  status: string;
  photo_url: string | null;
  created_at: string;
};

type Driver = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
};

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
  year: number | null;
  status: string;
};

type DamagePhoto = {
  id: string;
  file_path: string;
  created_at: string;
};

type PhotoWithUrl = {
  id: string;
  url: string;
};

export default function DamageReportDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [report, setReport] = useState<DamageReport | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [photos, setPhotos] = useState<PhotoWithUrl[]>([]);

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadDamageReport() {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data: damageReport, error: reportError } =
        await supabase
          .from("damage_reports")
          .select("*")
          .eq("id", id)
          .single();

      if (reportError || !damageReport) {
        console.error(reportError);
        setError("Schademelding kon niet worden gevonden.");
        setLoading(false);
        return;
      }

      setReport(damageReport);
      setStatus(damageReport.status || "open");

      if (damageReport.driver_id) {
        const { data: driverData } = await supabase
          .from("driver")
          .select("id, full_name, phone, email")
          .eq("id", damageReport.driver_id)
          .maybeSingle();

        setDriver(driverData);
      }

      if (damageReport.vehicle_id) {
        const { data: vehicleData } = await supabase
          .from("vehicle")
          .select(
            "id, brand, model, license_plate, year, status"
          )
          .eq("id", damageReport.vehicle_id)
          .maybeSingle();

        setVehicle(vehicleData);
      }

      const { data: photoData, error: photoError } = await supabase
        .from("damage_photos")
        .select("id, file_path, created_at")
        .eq("damage_report_id", id)
        .order("created_at", { ascending: true });

      if (photoError) {
        console.error(photoError);
      }

      if (photoData) {
        const signedPhotos: PhotoWithUrl[] = [];

        for (const photo of photoData as DamagePhoto[]) {
          const { data: signedUrlData, error: signedUrlError } =
            await supabase.storage
              .from("damage-photos")
              .createSignedUrl(photo.file_path, 60 * 60);

          if (signedUrlError) {
            console.error(signedUrlError);
            continue;
          }

          if (signedUrlData?.signedUrl) {
            signedPhotos.push({
              id: photo.id,
              url: signedUrlData.signedUrl,
            });
          }
        }

        setPhotos(signedPhotos);
      }

      setLoading(false);
    }

    loadDamageReport();
  }, [id, router]);

  async function updateStatus() {
    if (!report) return;

    setSaving(true);
    setError("");

    const { error: updateError } = await supabase
      .from("damage_reports")
      .update({
        status,
      })
      .eq("id", report.id);

    if (updateError) {
      console.error(updateError);
      setError("Status kon niet worden opgeslagen.");
      setSaving(false);
      return;
    }

    setReport({
      ...report,
      status,
    });

    setSaving(false);
  }

  function statusLabel(value: string) {
    switch (value) {
      case "open":
        return "Open";
      case "in_review":
        return "In behandeling";
      case "resolved":
        return "Afgerond";
      case "closed":
        return "Gesloten";
      default:
        return value;
    }
  }

  function formatDate(date: string | null) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-container">
          <p>Schademelding laden...</p>
        </div>
      </main>
    );
  }

  if (error && !report) {
    return (
      <main className="admin-page">
        <div className="admin-container">
          <button
            className="back-button"
            onClick={() => router.push("/admin/damage-reports")}
          >
            ← Terug naar schades
          </button>

          <div className="error-box">{error}</div>
        </div>

        <style jsx>{`
          .admin-page {
            min-height: 100vh;
            background: #f6f5f2;
            padding: 40px 20px;
            color: #171717;
          }

          .admin-container {
            max-width: 1100px;
            margin: 0 auto;
          }

          .back-button {
            border: none;
            background: transparent;
            cursor: pointer;
            font-size: 15px;
            margin-bottom: 25px;
          }

          .error-box {
            background: #fff;
            border: 1px solid #e2e2e2;
            padding: 25px;
            border-radius: 14px;
          }
        `}</style>
      </main>
    );
  }

  if (!report) return null;

  return (
    <main className="admin-page">
      <div className="admin-container">

        <button
          className="back-button"
          onClick={() => router.push("/admin/damage-reports")}
        >
          ← Terug naar schades
        </button>

        <div className="page-header">
          <div>
            <div className="eyebrow">IMPERIAL CABS</div>
            <h1>Schademelding</h1>
            <p>
              Bekijk de details, foto's en status van deze schade.
            </p>
          </div>

          <div className="status-badge">
            {statusLabel(report.status)}
          </div>
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <div className="grid">

          {/* Schade informatie */}
          <section className="card">
            <div className="card-header">
              <h2>Schadegegevens</h2>
            </div>

            <div className="info-grid">
              <div>
                <span>Datum</span>
                <strong>
                  {formatDate(report.damage_date)}
                </strong>
              </div>

              <div>
                <span>Locatie</span>
                <strong>
                  {report.location || "-"}
                </strong>
              </div>

              <div className="full">
                <span>Beschrijving</span>
                <strong className="description">
                  {report.description}
                </strong>
              </div>
            </div>
          </section>

          {/* Chauffeur */}
          <section className="card">
            <div className="card-header">
              <h2>Chauffeur</h2>
            </div>

            {driver ? (
              <div className="info-grid">
                <div>
                  <span>Naam</span>
                  <strong>{driver.full_name}</strong>
                </div>

                <div>
                  <span>Telefoon</span>
                  <strong>
                    {driver.phone || "-"}
                  </strong>
                </div>

                <div className="full">
                  <span>E-mail</span>
                  <strong>
                    {driver.email || "-"}
                  </strong>
                </div>
              </div>
            ) : (
              <p className="muted">
                Geen chauffeur gekoppeld.
              </p>
            )}
          </section>

          {/* Voertuig */}
          <section className="card">
            <div className="card-header">
              <h2>Voertuig</h2>
            </div>

            {vehicle ? (
              <div className="vehicle-box">
                <div className="vehicle-icon">🚗</div>

                <div>
                  <strong>
                    {vehicle.brand} {vehicle.model}
                  </strong>

                  <p>
                    Kenteken:{" "}
                    <b>{vehicle.license_plate}</b>
                  </p>

                  <p>
                    Bouwjaar:{" "}
                    {vehicle.year || "-"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="muted">
                Geen voertuig gekoppeld.
              </p>
            )}
          </section>

          {/* Status */}
          <section className="card">
            <div className="card-header">
              <h2>Status aanpassen</h2>
            </div>

            <div className="status-form">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="open">Open</option>
                <option value="in_review">
                  In behandeling
                </option>
                <option value="resolved">
                  Afgerond
                </option>
                <option value="closed">
                  Gesloten
                </option>
              </select>

              <button
                onClick={updateStatus}
                disabled={saving}
              >
                {saving
                  ? "Opslaan..."
                  : "Status opslaan"}
              </button>
            </div>
          </section>

        </div>

        {/* FOTO'S */}
        <section className="card photos-card">
          <div className="card-header">
            <div>
              <h2>Foto's van de schade</h2>
              <p>
                Klik op een foto om deze groter te bekijken.
              </p>
            </div>

            <div className="photo-count">
              {photos.length}{" "}
              {photos.length === 1
                ? "foto"
                : "foto's"}
            </div>
          </div>

          {photos.length === 0 ? (
            <div className="empty-photos">
              <div className="empty-icon">📷</div>
              <strong>Geen foto's toegevoegd</strong>
              <p>
                Voor deze schademelding zijn nog geen
                foto's opgeslagen.
              </p>
            </div>
          ) : (
            <div className="photo-grid">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  className="photo-item"
                  onClick={() =>
                    setSelectedPhoto(photo.url)
                  }
                  type="button"
                >
                  <img
                    src={photo.url}
                    alt="Schade"
                  />

                  <div className="photo-overlay">
                    Bekijk foto
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* FOTO MODAL */}
      {selectedPhoto && (
        <div
          className="modal"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="close-button"
            onClick={() => setSelectedPhoto(null)}
            type="button"
          >
            ×
          </button>

          <img
            src={selectedPhoto}
            alt="Schade groot"
            className="large-photo"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: #f6f5f2;
          padding: 40px 20px 80px;
          color: #171717;
        }

        .admin-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .back-button {
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 25px;
          padding: 0;
        }

        .page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
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
          font-size: 38px;
          line-height: 1.1;
          margin: 0 0 8px;
        }

        .page-header p {
          margin: 0;
          color: #777;
        }

        .status-badge {
          background: #171717;
          color: #d4af62;
          border-radius: 999px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .card {
          background: white;
          border: 1px solid #e7e4de;
          border-radius: 18px;
          padding: 25px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.03);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .card-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .card-header p {
          margin: 5px 0 0;
          color: #777;
          font-size: 14px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .info-grid div {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .info-grid .full {
          grid-column: 1 / -1;
        }

        .info-grid span {
          color: #888;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-grid strong {
          font-size: 15px;
        }

        .description {
          line-height: 1.6;
          font-weight: 500 !important;
        }

        .muted {
          color: #888;
          margin: 0;
        }

        .vehicle-box {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .vehicle-icon {
          width: 55px;
          height: 55px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f2eb;
          font-size: 25px;
        }

        .vehicle-box strong {
          font-size: 17px;
        }

        .vehicle-box p {
          margin: 5px 0 0;
          color: #777;
          font-size: 14px;
        }

        .status-form {
          display: flex;
          gap: 12px;
        }

        .status-form select {
          flex: 1;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 12px;
          background: white;
          font-size: 14px;
        }

        .status-form button {
          border: none;
          border-radius: 10px;
          padding: 12px 18px;
          background: #171717;
          color: #d4af62;
          font-weight: 700;
          cursor: pointer;
        }

        .status-form button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .photos-card {
          margin-top: 20px;
        }

        .photo-count {
          background: #f5f2eb;
          color: #8a6a2d;
          border-radius: 999px;
          padding: 8px 13px;
          font-size: 13px;
          font-weight: 700;
        }

        .photo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .photo-item {
          position: relative;
          padding: 0;
          border: 0;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          background: #eee;
          aspect-ratio: 4 / 3;
        }

        .photo-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.2s ease;
        }

        .photo-item:hover img {
          transform: scale(1.04);
        }

        .photo-overlay {
          position: absolute;
          inset: auto 0 0 0;
          padding: 12px;
          background: linear-gradient(
            transparent,
            rgba(0, 0, 0, 0.75)
          );
          color: white;
          font-size: 13px;
          font-weight: 700;
          text-align: left;
        }

        .empty-photos {
          text-align: center;
          padding: 50px 20px;
          border: 1px dashed #ddd;
          border-radius: 14px;
        }

        .empty-icon {
          font-size: 35px;
          margin-bottom: 10px;
        }

        .empty-photos strong {
          display: block;
          margin-bottom: 6px;
        }

        .empty-photos p {
          margin: 0;
          color: #888;
          font-size: 14px;
        }

        .error-box {
          background: #fff;
          border: 1px solid #e1d3c9;
          color: #8a4b32;
          padding: 15px 18px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .modal {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
        }

        .large-photo {
          max-width: 95vw;
          max-height: 90vh;
          object-fit: contain;
          border-radius: 8px;
        }

        .close-button {
          position: fixed;
          top: 20px;
          right: 25px;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: none;
          background: white;
          color: #171717;
          font-size: 30px;
          line-height: 1;
          cursor: pointer;
          z-index: 10000;
        }

        @media (max-width: 800px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .photo-grid {
            grid-template-columns: 1fr 1fr;
          }

          .page-header {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 520px) {
          .admin-page {
            padding: 25px 15px 60px;
          }

          h1 {
            font-size: 30px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .info-grid .full {
            grid-column: auto;
          }

          .photo-grid {
            grid-template-columns: 1fr;
          }

          .status-form {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
