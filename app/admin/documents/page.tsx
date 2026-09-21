"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

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
};

export default function DocumentsPage() {
  const router = useRouter();

  const [documents, setDocuments] = useState<Document[]>(
    []
  );
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      const [
        { data: documentData, error: documentError },
        { data: driverData, error: driverError },
      ] = await Promise.all([
        supabase
          .from("documents")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("driver")
          .select("id, full_name, phone")
          .order("full_name"),
      ]);

      if (documentError) {
        console.error(
          "Document error:",
          documentError
        );
      }

      if (driverError) {
        console.error(
          "Driver error:",
          driverError
        );
      }

      setDocuments(documentData || []);
      setDrivers(driverData || []);
      setLoading(false);
    }

    loadData();
  }, [router]);

  function getDriver(driverId: string | null) {
    if (!driverId) return null;

    return (
      drivers.find(
        (driver) => driver.id === driverId
      ) || null
    );
  }

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

      case "kvk":
        return "KVK-document";

      case "verzekering":
        return "Verzekering";

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

  function isExpiringSoon(date: string | null) {
    if (!date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(date);
    expiry.setHours(0, 0, 0, 0);

    const difference =
      expiry.getTime() - today.getTime();

    const days =
      difference / (1000 * 60 * 60 * 24);

    return days >= 0 && days <= 30;
  }

  if (loading) {
    return (
      <main className="admin-page">
        <div className="container">
          <p>Documenten laden...</p>
        </div>
      </main>
    );
  }

  const approvedCount = documents.filter(
    (document) =>
      document.status === "approved"
  ).length;

  const pendingCount = documents.filter(
    (document) =>
      document.status === "pending"
  ).length;

  const expiredCount = documents.filter(
    (document) =>
      document.status === "expired" ||
      isExpired(document.expiry_date)
  ).length;

  const expiringSoonCount = documents.filter(
    (document) =>
      isExpiringSoon(document.expiry_date)
  ).length;

  return (
    <main className="admin-page">
      <div className="container">

        {/* HEADER */}
        <div className="topbar">
          <div>
            <button
              className="back-button"
              onClick={() =>
                router.push("/admin")
              }
            >
              ← Dashboard
            </button>

            <div className="eyebrow">
              IMPERIAL CABS
            </div>

            <h1>Documenten</h1>

            <p>
              Beheer documenten en
              vervaldatums van chauffeurs.
            </p>
          </div>

          <button
            className="add-button"
            onClick={() =>
              router.push(
                "/admin/documents/new"
              )
            }
          >
            + Nieuw document
          </button>
        </div>

        {/* SUMMARY */}
        <div className="summary">

          <div className="summary-card">
            <span>Totaal</span>

            <strong>
              {documents.length}
            </strong>
          </div>

          <div className="summary-card">
            <span>Goedgekeurd</span>

            <strong>
              {approvedCount}
            </strong>
          </div>

          <div className="summary-card">
            <span>In behandeling</span>

            <strong>
              {pendingCount}
            </strong>
          </div>

          <div className="summary-card warning-card">
            <span>Verlopen</span>

            <strong>
              {expiredCount}
            </strong>
          </div>

        </div>

        {/* EXPIRING SOON */}
        {expiringSoonCount > 0 && (
          <div className="alert">

            <div className="alert-icon">
              ⚠
            </div>

            <div>
              <strong>
                Documenten verlopen binnenkort
              </strong>

              <p>
                {expiringSoonCount} document
                {expiringSoonCount === 1
                  ? ""
                  : "en"}{" "}
                verloopt binnen 30 dagen.
              </p>
            </div>

          </div>
        )}

        {/* DOCUMENTS */}
        {documents.length === 0 ? (
          <div className="empty">

            <div className="empty-icon">
              📄
            </div>

            <h2>
              Geen documenten gevonden
            </h2>

            <p>
              Er zijn momenteel geen
              documenten geregistreerd.
            </p>

            <button
              className="add-button"
              onClick={() =>
                router.push(
                  "/admin/documents/new"
                )
              }
            >
              + Eerste document toevoegen
            </button>

          </div>
        ) : (
          <div className="documents-list">

            {documents.map((document) => {
              const driver = getDriver(
                document.driver_id
              );

              const expired =
                isExpired(
                  document.expiry_date
                );

              const expiringSoon =
                isExpiringSoon(
                  document.expiry_date
                );

              return (
                <button
                  key={document.id}
                  type="button"
                  className="document-card"
                  onClick={() =>
                    router.push(
                      `/admin/documents/${document.id}`
                    )
                  }
                >

                  {/* TOP */}
                  <div className="card-top">

                    <div className="title-section">

                      <div className="document-icon">
                        📄
                      </div>

                      <div>
                        <h2>
                          {documentTypeLabel(
                            document.document_type
                          )}
                        </h2>

                        <div className="driver-name">
                          {driver
                            ? driver.full_name
                            : "Geen chauffeur"}
                        </div>
                      </div>

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

                  <div className="divider" />

                  {/* INFO */}
                  <div className="info-grid">

                    <div className="info-item">
                      <span>
                        Chauffeur
                      </span>

                      <strong>
                        {driver
                          ? driver.full_name
                          : "-"}
                      </strong>
                    </div>

                    <div className="info-item">
                      <span>
                        Vervaldatum
                      </span>

                      <strong
                        className={
                          expired
                            ? "date-expired"
                            : expiringSoon
                            ? "date-warning"
                            : ""
                        }
                      >
                        {formatDate(
                          document.expiry_date
                        )}
                      </strong>
                    </div>

                    <div className="info-item">
                      <span>
                        Bestand
                      </span>

                      <strong>
                        {document.file_url
                          ? "Beschikbaar"
                          : "Niet toegevoegd"}
                      </strong>
                    </div>

                  </div>

                  {/* EXPIRY MESSAGE */}
                  {expired && (
                    <div className="expiry-message expired-message">
                      ⚠ Dit document is verlopen.
                    </div>
                  )}

                  {!expired &&
                    expiringSoon && (
                      <div className="expiry-message warning-message">
                        ⚠ Dit document verloopt
                        binnen 30 dagen.
                      </div>
                    )}

                  {/* FOOTER */}
                  <div className="card-footer">

                    <div className="contact">
                      {driver?.phone
                        ? `📞 ${driver.phone}`
                        : ""}
                    </div>

                    <div className="details">
                      Bekijk document →
                    </div>

                  </div>

                </button>
              );
            })}

          </div>
        )}

      </div>

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: #f6f5f2;
          padding: 40px 20px 80px;
          color: #171717;
        }

        .container {
          max-width: 1150px;
          margin: 0 auto;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-bottom: 35px;
        }

        .back-button {
          display: block;
          border: none;
          background: transparent;
          padding: 0;
          margin-bottom: 25px;
          cursor: pointer;
          color: #555;
          font-size: 14px;
          font-weight: 600;
        }

        .back-button:hover {
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
          line-height: 1.1;
        }

        .topbar p {
          margin: 0;
          color: #777;
        }

        .add-button {
          border: none;
          background: #171717;
          color: #d4af62;
          padding: 13px 20px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .add-button:hover {
          background: #2a2a2a;
        }

        .summary {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .summary-card {
          background: white;
          border: 1px solid #e7e4de;
          border-radius: 15px;
          padding: 20px;
        }

        .summary-card span {
          display: block;
          color: #888;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .summary-card strong {
          font-size: 27px;
        }

        .warning-card strong {
          color: #9a4e24;
        }

        .alert {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #fff8e7;
          border: 1px solid #ead9a7;
          border-radius: 15px;
          padding: 16px 20px;
          margin-bottom: 20px;
        }

        .alert-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #f5e8bd;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8a6a20;
          font-size: 20px;
        }

        .alert strong {
          font-size: 14px;
        }

        .alert p {
          margin: 4px 0 0;
          color: #8a6a20;
          font-size: 13px;
        }

        .documents-list {
          display: grid;
          gap: 15px;
        }

        .document-card {
          width: 100%;
          text-align: left;
          border: 1px solid #e7e4de;
          background: white;
          border-radius: 18px;
          padding: 24px;
          cursor: pointer;
          color: #171717;
          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease,
            border-color 0.15s ease;
        }

        .document-card:hover {
          transform: translateY(-2px);
          border-color: #c7a45a;
          box-shadow:
            0 10px 30px
            rgba(0, 0, 0, 0.07);
        }

        .document-card:active {
          transform: translateY(0);
        }

        .card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .document-icon {
          width: 50px;
          height: 50px;
          border-radius: 13px;
          background: #f5f2eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
          flex-shrink: 0;
        }

        .title-section h2 {
          margin: 0 0 5px;
          font-size: 19px;
        }

        .driver-name {
          color: #777;
          font-size: 14px;
        }

        .status {
          padding: 7px 12px;
          border-radius: 999px;
          background: #eee;
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

        .status.rejected {
          background: #fff0e8;
          color: #9a4e24;
        }

        .status.expired {
          background: #fff0e8;
          color: #9a4e24;
        }

        .status.missing {
          background: #eeeeee;
          color: #777;
        }

        .divider {
          height: 1px;
          background: #eeeeee;
          margin: 20px 0;
        }

        .info-grid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 20px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .info-item span {
          color: #999;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          font-weight: 700;
        }

        .info-item strong {
          font-size: 14px;
        }

        .date-expired {
          color: #9a4e24;
        }

        .date-warning {
          color: #8a6a20;
        }

        .expiry-message {
          margin-top: 18px;
          padding: 11px 13px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
        }

        .expired-message {
          background: #fff0e8;
          color: #9a4e24;
        }

        .warning-message {
          background: #fff8e7;
          color: #8a6a20;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #eeeeee;
          margin-top: 20px;
          padding-top: 17px;
        }

        .contact {
          color: #777;
          font-size: 13px;
        }

        .details {
          color: #9b762f;
          font-size: 13px;
          font-weight: 800;
        }

        .empty {
          background: white;
          border: 1px solid #e7e4de;
          border-radius: 18px;
          padding: 70px 30px;
          text-align: center;
        }

        .empty-icon {
          width: 55px;
          height: 55px;
          margin: 0 auto 15px;
          border-radius: 50%;
          background: #f5f2eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .empty h2 {
          margin: 0 0 8px;
        }

        .empty p {
          color: #888;
          margin: 0 0 20px;
        }

        @media (max-width: 800px) {
          .topbar {
            flex-direction: column;
            align-items: flex-start;
          }

          .summary {
            grid-template-columns: 1fr 1fr;
          }

          .info-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
        }

        @media (max-width: 500px) {
          .admin-page {
            padding: 25px 15px 60px;
          }

          h1 {
            font-size: 32px;
          }

          .summary {
            grid-template-columns: 1fr;
          }

          .card-top {
            flex-direction: column;
          }

          .card-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </main>
  );
}
