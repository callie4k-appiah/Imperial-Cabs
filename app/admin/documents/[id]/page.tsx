"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

type Document = {
  id: string;
  driver_id: string | null;
  document_type: string;
  file_url: string | null;
  status: string;
  expiry_date: string | null;
  created_at: string;
};

type Driver = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
};

export default function DocumentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  const [document, setDocument] =
    useState<Document | null>(null);

  const [driver, setDriver] =
    useState<Driver | null>(null);

  const [signedUrl, setSignedUrl] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDocument() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data: documentData, error: documentError } =
        await supabase
          .from("documents")
          .select("*")
          .eq("id", documentId)
          .single();

      if (documentError || !documentData) {
        console.error(documentError);
        setError("Document kon niet worden gevonden.");
        setLoading(false);
        return;
      }

      setDocument(documentData);

      if (documentData.driver_id) {
        const { data: driverData } = await supabase
          .from("driver")
          .select("id, full_name, phone, email")
          .eq("id", documentData.driver_id)
          .single();

        setDriver(driverData);
      }

      /*
       * Maak een tijdelijke beveiligde URL
       * voor het privé opgeslagen bestand.
       */
      if (documentData.file_url) {
        const { data, error: signedUrlError } =
          await supabase.storage
            .from("documents")
            .createSignedUrl(
              documentData.file_url,
              60 * 30
            );

        if (signedUrlError) {
          console.error(signedUrlError);
          setError(
            "Het document kon niet worden geladen."
          );
        } else {
          setSignedUrl(data.signedUrl);
        }
      }

      setLoading(false);
    }

    if (documentId) {
      loadDocument();
    }
  }, [documentId, router]);

  function documentTypeLabel(type: string) {
    switch (type) {
      case "chauffeurskaart":
        return "Chauffeurskaart";

      case "rijbewijs":
        return "Rijbewijs";

      case "id":
        return "Identiteitsbewijs";

      case "taxipas":
        return "Taxipas";

      case "vgb":
        return "VGB";

      case "verzekering":
        return "Verzekeringsbewijs";

      case "apk":
        return "APK";

      default:
        return type || "Document";
    }
  }

  function statusLabel(status: string) {
    switch (status) {
      case "approved":
        return "Goedgekeurd";

      case "pending":
        return "In behandeling";

      case "rejected":
        return "Afgekeurd";

      case "expired":
        return "Verlopen";

      case "missing":
        return "Ontbreekt";

      default:
        return status || "Onbekend";
    }
  }

  function statusClass(status: string) {
    switch (status) {
      case "approved":
        return "status approved";

      case "pending":
        return "status pending";

      case "rejected":
        return "status rejected";

      case "expired":
        return "status expired";

      case "missing":
        return "status missing";

      default:
        return "status";
    }
  }

  function formatDate(date: string | null) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "nl-NL",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  }

  function isExpired(date: string | null) {
    if (!date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(date);
    expiry.setHours(0, 0, 0, 0);

    return expiry < today;
  }

  function getFileType() {
    if (!document?.file_url) {
      return "unknown";
    }

    const path =
      document.file_url.toLowerCase();

    if (path.endsWith(".pdf")) {
      return "pdf";
    }

    if (
      path.endsWith(".jpg") ||
      path.endsWith(".jpeg") ||
      path.endsWith(".png") ||
      path.endsWith(".webp")
    ) {
      return "image";
    }

    return "unknown";
  }

  async function updateStatus(
    newStatus: string
  ) {
    if (!document) return;

    setUpdating(true);
    setError("");

    const { error } = await supabase
      .from("documents")
      .update({
        status: newStatus,
      })
      .eq("id", document.id);

    if (error) {
      console.error(error);

      setError(
        "Status kon niet worden aangepast."
      );

      setUpdating(false);
      return;
    }

    setDocument({
      ...document,
      status: newStatus,
    });

    setUpdating(false);
  }

  async function deleteDocument() {
    if (!document) return;

    const confirmed = window.confirm(
      "Weet je zeker dat je dit document wilt verwijderen?"
    );

    if (!confirmed) return;

    setUpdating(true);
    setError("");

    if (document.file_url) {
      const { error: storageError } =
        await supabase.storage
          .from("documents")
          .remove([
            document.file_url,
          ]);

      if (storageError) {
        console.error(storageError);
      }
    }

    const { error: deleteError } =
      await supabase
        .from("documents")
        .delete()
        .eq("id", document.id);

    if (deleteError) {
      console.error(deleteError);

      setError(
        "Document kon niet worden verwijderd."
      );

      setUpdating(false);
      return;
    }

    router.push("/admin/documents");
  }

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <p>Document laden...</p>
        </div>
      </main>
    );
  }

  if (!document) {
    return (
      <main className="page">
        <div className="container">
          <button
            className="back"
            onClick={() =>
              router.push(
                "/admin/documents"
              )
            }
          >
            ← Terug naar documenten
          </button>

          <div className="error-card">
            <h1>Document niet gevonden</h1>
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  const expired = isExpired(
    document.expiry_date
  );

  const fileType = getFileType();

  return (
    <main className="page">
      <div className="container">

        <button
          className="back"
          onClick={() =>
            router.push(
              "/admin/documents"
            )
          }
        >
          ← Terug naar documenten
        </button>

        {/* HEADER */}
        <div className="header">

          <div>
            <div className="eyebrow">
              IMPERIAL CABS
            </div>

            <h1>
              {documentTypeLabel(
                document.document_type
              )}
            </h1>

            <p>
              Documentdetails en
              documentbeheer.
            </p>
          </div>

          <span
            className={statusClass(
              expired
                ? "expired"
                : document.status
            )}
          >
            {expired
              ? "Verlopen"
              : statusLabel(
                  document.status
                )}
          </span>

        </div>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <div className="grid">

          {/* DOCUMENT VIEWER */}
          <section className="card document-card">

            <div className="card-header">

              <div>
                <span className="label">
                  DOCUMENT
                </span>

                <h2>
                  {documentTypeLabel(
                    document.document_type
                  )}
                </h2>
              </div>

              <div className="file-icon">
                📄
              </div>

            </div>

            <div className="document-viewer">

              {!signedUrl ? (
                <div className="viewer-loading">
                  <div className="spinner" />

                  <strong>
                    Document laden...
                  </strong>
                </div>
              ) : fileType === "pdf" ? (
                <iframe
                  src={signedUrl}
                  className="pdf-viewer"
                  title="Document bekijken"
                />
              ) : fileType === "image" ? (
                <img
                  src={signedUrl}
                  className="image-viewer"
                  alt="Document"
                />
              ) : (
                <div className="viewer-loading">
                  <div className="preview-icon">
                    📄
                  </div>

                  <strong>
                    Voorbeeld niet beschikbaar
                  </strong>

                  <p>
                    Gebruik de knop hieronder
                    om het bestand te openen.
                  </p>
                </div>
              )}

            </div>

            {signedUrl && (
              <div className="viewer-actions">

                <a
                  href={signedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="open-button"
                >
                  Open in nieuw venster ↗
                </a>

                <a
                  href={signedUrl}
                  download
                  className="download-button"
                >
                  ↓ Download document
                </a>

              </div>
            )}

          </section>

          {/* DRIVER */}
          <section className="card">

            <span className="label">
              CHAUFFEUR
            </span>

            <h2>
              {driver?.full_name ||
                "Geen chauffeur"}
            </h2>

            <div className="details">

              <div>
                <span>Telefoon</span>

                <strong>
                  {driver?.phone || "-"}
                </strong>
              </div>

              <div>
                <span>E-mail</span>

                <strong>
                  {driver?.email || "-"}
                </strong>
              </div>

            </div>

            {driver && (
              <button
                className="secondary-button"
                onClick={() =>
                  router.push(
                    `/admin/drivers/${driver.id}`
                  )
                }
              >
                Bekijk chauffeur →
              </button>
            )}

          </section>

          {/* DETAILS */}
          <section className="card">

            <span className="label">
              DOCUMENTDETAILS
            </span>

            <div className="details">

              <div>
                <span>Documenttype</span>

                <strong>
                  {documentTypeLabel(
                    document.document_type
                  )}
                </strong>
              </div>

              <div>
                <span>Vervaldatum</span>

                <strong
                  className={
                    expired
                      ? "expired-text"
                      : ""
                  }
                >
                  {formatDate(
                    document.expiry_date
                  )}
                </strong>
              </div>

              <div>
                <span>Aangemaakt</span>

                <strong>
                  {formatDate(
                    document.created_at
                  )}
                </strong>
              </div>

            </div>

          </section>

          {/* STATUS */}
          <section className="card">

            <span className="label">
              STATUS AANPASSEN
            </span>

            <h2>
              {statusLabel(
                document.status
              )}
            </h2>

            <div className="status-buttons">

              <button
                className="approved-button"
                disabled={updating}
                onClick={() =>
                  updateStatus(
                    "approved"
                  )
                }
              >
                ✓ Goedgekeurd
              </button>

              <button
                className="pending-button"
                disabled={updating}
                onClick={() =>
                  updateStatus(
                    "pending"
                  )
                }
              >
                In behandeling
              </button>

              <button
                className="rejected-button"
                disabled={updating}
                onClick={() =>
                  updateStatus(
                    "rejected"
                  )
                }
              >
                Afgekeurd
              </button>

            </div>

          </section>

        </div>

        {/* DELETE */}
        <div className="danger-zone">

          <div>
            <strong>
              Document verwijderen
            </strong>

            <p>
              Het bestand en de registratie
              worden permanent verwijderd.
            </p>
          </div>

          <button
            className="delete-button"
            disabled={updating}
            onClick={deleteDocument}
          >
            Document verwijderen
          </button>

        </div>

      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f6f5f2;
          padding: 40px 20px 80px;
          color: #171717;
        }

        .container {
          max-width: 1050px;
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

        .eyebrow {
          color: #b08a3e;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 25px;
          margin-bottom: 30px;
        }

        h1 {
          margin: 0 0 8px;
          font-size: 40px;
        }

        .header p {
          margin: 0;
          color: #777;
        }

        .status {
          padding: 9px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .status.approved {
          background: #e8f5ec;
          color: #327044;
        }

        .status.pending {
          background: #fff7dd;
          color: #8a6a20;
        }

        .status.rejected,
        .status.expired {
          background: #fff0e8;
          color: #9a4e24;
        }

        .status.missing {
          background: #eeeeee;
          color: #777;
        }

        .error {
          background: #fff0e8;
          border: 1px solid #f0cbb9;
          color: #9a4e24;
          padding: 13px 15px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .card {
          background: white;
          border: 1px solid #e7e4de;
          border-radius: 18px;
          padding: 25px;
        }

        .document-card {
          grid-column: span 2;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .label {
          display: block;
          color: #999;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        h2 {
          margin: 0;
          font-size: 20px;
        }

        .file-icon {
          width: 50px;
          height: 50px;
          border-radius: 13px;
          background: #f5f2eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
        }

        .document-viewer {
          margin-top: 22px;
          min-height: 600px;
          border: 1px solid #ddd7ca;
          border-radius: 14px;
          background: #f2f1ee;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pdf-viewer {
          width: 100%;
          height: 700px;
          border: none;
          background: white;
        }

        .image-viewer {
          display: block;
          max-width: 100%;
          max-height: 700px;
          width: auto;
          height: auto;
          object-fit: contain;
        }

        .viewer-loading {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px;
        }

        .viewer-loading strong {
          margin-top: 12px;
        }

        .viewer-loading p {
          color: #888;
          font-size: 13px;
        }

        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #ddd;
          border-top-color: #b08a3e;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .preview-icon {
          font-size: 35px;
        }

        .viewer-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .open-button,
        .download-button {
          display: inline-block;
          text-decoration: none;
          border-radius: 10px;
          padding: 12px 17px;
          font-size: 13px;
          font-weight: 700;
        }

        .open-button {
          background: #171717;
          color: #d4af62;
        }

        .download-button {
          background: #eee;
          color: #333;
        }

        .details {
          display: grid;
          gap: 18px;
          margin-top: 20px;
        }

        .details div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .details span {
          color: #999;
          font-size: 11px;
          text-transform: uppercase;
          font-weight: 700;
        }

        .details strong {
          font-size: 14px;
          word-break: break-word;
        }

        .expired-text {
          color: #9a4e24;
        }

        .secondary-button {
          margin-top: 22px;
          width: 100%;
          border: 1px solid #ddd8ce;
          background: white;
          color: #333;
          border-radius: 10px;
          padding: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .status-buttons {
          display: grid;
          gap: 9px;
          margin-top: 20px;
        }

        .status-buttons button {
          border: none;
          border-radius: 10px;
          padding: 12px;
          font-weight: 700;
          cursor: pointer;
          text-align: left;
        }

        .status-buttons button:disabled {
          opacity: 0.5;
        }

        .approved-button {
          background: #e8f5ec;
          color: #327044;
        }

        .pending-button {
          background: #fff7dd;
          color: #8a6a20;
        }

        .rejected-button {
          background: #fff0e8;
          color: #9a4e24;
        }

        .danger-zone {
          margin-top: 20px;
          padding: 22px 25px;
          border: 1px solid #ead6cb;
          background: #fffaf8;
          border-radius: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .danger-zone p {
          margin: 5px 0 0;
          color: #999;
          font-size: 12px;
        }

        .delete-button {
          border: none;
          background: #fff0e8;
          color: #9a4e24;
          border-radius: 10px;
          padding: 12px 16px;
          font-weight: 700;
          cursor: pointer;
        }

        .error-card {
          background: white;
          border: 1px solid #e7e4de;
          border-radius: 18px;
          padding: 30px;
        }

        @media (max-width: 700px) {
          .page {
            padding: 25px 15px 60px;
          }

          h1 {
            font-size: 32px;
          }

          .header {
            flex-direction: column;
            align-items: flex-start;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .document-card {
            grid-column: span 1;
          }

          .document-viewer {
            min-height: 450px;
          }

          .pdf-viewer {
            height: 550px;
          }

          .viewer-actions {
            flex-direction: column;
          }

          .open-button,
          .download-button {
            text-align: center;
          }

          .danger-zone {
            flex-direction: column;
            align-items: flex-start;
          }

          .delete-button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
