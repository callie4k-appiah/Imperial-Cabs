"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";

type Message = {
  id: string;
  driver_id: string;
  sender_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

type Driver = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  status: string | null;
};

export default function MessageDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [message, setMessage] = useState<Message | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMessage();
  }, []);

  async function loadMessage() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/admin/login");
      return;
    }

    const id = String(params.id);

    const { data: messageData, error: messageError } = await supabase
      .from("messages")
      .select("*")
      .eq("id", id)
      .single();

    if (messageError || !messageData) {
      setError("Bericht kon niet worden gevonden.");
      setLoading(false);
      return;
    }

    setMessage(messageData);

    if (messageData.driver_id) {
      const { data: driverData } = await supabase
        .from("driver")
        .select("*")
        .eq("id", messageData.driver_id)
        .single();

      setDriver(driverData);
    }

    // Bericht automatisch als gelezen markeren
    if (!messageData.is_read) {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("id", id);

      setMessage({
        ...messageData,
        is_read: true,
      });
    }

    setLoading(false);
  }

  async function deleteMessage() {
    if (!message) return;

    const confirmed = window.confirm(
      "Weet je zeker dat je dit bericht wilt verwijderen?"
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    const { error: deleteError } = await supabase
      .from("messages")
      .delete()
      .eq("id", message.id);

    if (deleteError) {
      setError("Bericht kon niet worden verwijderd.");
      setDeleting(false);
      return;
    }

    router.push("/admin/messages");
  }

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-container">
          <p>Bericht laden...</p>
        </div>
      </main>
    );
  }

  if (error || !message) {
    return (
      <main className="admin-page">
        <div className="admin-container">
          <Link href="/admin/messages" className="back-link">
            ← Terug naar berichten
          </Link>

          <div className="error-card">
            <h2>Bericht niet gevonden</h2>
            <p>{error}</p>
          </div>
        </div>

        <style jsx>{`
          .admin-page {
            min-height: 100vh;
            background: #f7f6f3;
            padding: 40px;
          }

          .admin-container {
            max-width: 1100px;
            margin: 0 auto;
          }

          .back-link {
            color: #9b7427;
            text-decoration: none;
            font-weight: 600;
          }

          .error-card {
            margin-top: 30px;
            background: white;
            border: 1px solid #e4e1da;
            border-radius: 20px;
            padding: 35px;
          }

          .error-card h2 {
            margin: 0 0 10px;
          }

          .error-card p {
            color: #777;
          }
        `}</style>
      </main>
    );
  }

  const date = new Date(message.created_at);

  return (
    <main className="admin-page">
      <div className="admin-container">
        <div className="top-row">
          <Link href="/admin/messages" className="back-link">
            ← Terug naar berichten
          </Link>

          <button
            className="delete-button"
            onClick={deleteMessage}
            disabled={deleting}
          >
            {deleting ? "Verwijderen..." : "Bericht verwijderen"}
          </button>
        </div>

        <div className="header">
          <div>
            <div className="eyebrow">IMPERIAL CABS</div>
            <h1>Bericht</h1>
            <p>Bekijk en beheer communicatie met deze chauffeur.</p>
          </div>
        </div>

        <section className="message-card">
          <div className="message-header">
            <div className="avatar">
              {(driver?.full_name || "C").charAt(0).toUpperCase()}
            </div>

            <div className="sender-info">
              <h2>{driver?.full_name || "Onbekende chauffeur"}</h2>

              <span>
                {message.sender_type === "admin"
                  ? "Imperial Cabs"
                  : "Chauffeur"}
              </span>
            </div>

            <div className="date">
              <strong>
                {date.toLocaleDateString("nl-NL", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </strong>

              <span>
                {date.toLocaleTimeString("nl-NL", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div className="message-body">
            {message.message}
          </div>

          <div className="message-status">
            <span className="read-badge">● Gelezen</span>
          </div>
        </section>

        {driver && (
          <section className="driver-card">
            <div className="section-title">
              <h2>Chauffeur</h2>
              <Link href={`/admin/drivers/${driver.id}`}>
                Bekijk chauffeur →
              </Link>
            </div>

            <div className="driver-grid">
              <div>
                <span>Naam</span>
                <strong>{driver.full_name}</strong>
              </div>

              <div>
                <span>Telefoon</span>
                <strong>{driver.phone || "-"}</strong>
              </div>

              <div>
                <span>E-mail</span>
                <strong>{driver.email || "-"}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong className="status">
                  {driver.status || "-"}
                </strong>
              </div>
            </div>
          </section>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: #f7f6f3;
          padding: 40px;
        }

        .admin-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 45px;
        }

        .back-link {
          color: #9b7427;
          text-decoration: none;
          font-weight: 600;
        }

        .delete-button {
          border: none;
          background: #181818;
          color: white;
          padding: 13px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .delete-button:hover {
          background: #000;
        }

        .delete-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .header {
          margin-bottom: 30px;
        }

        .eyebrow {
          color: #b38a32;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 3px;
          margin-bottom: 10px;
        }

        h1 {
          font-size: 48px;
          margin: 0;
          color: #151515;
          letter-spacing: -1.5px;
        }

        .header p {
          color: #777;
          font-size: 18px;
          margin-top: 10px;
        }

        .message-card,
        .driver-card {
          background: white;
          border: 1px solid #e4e1da;
          border-radius: 22px;
          margin-bottom: 25px;
          overflow: hidden;
        }

        .message-card {
          border-left: 5px solid #b58a32;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 28px 30px;
          border-bottom: 1px solid #ece9e2;
        }

        .avatar {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #f1ecdf;
          color: #9b7427;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
          font-weight: 700;
        }

        .sender-info {
          flex: 1;
        }

        .sender-info h2 {
          margin: 0 0 5px;
          font-size: 22px;
        }

        .sender-info span {
          color: #888;
        }

        .date {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .date strong {
          color: #555;
        }

        .date span {
          color: #999;
        }

        .message-body {
          padding: 35px 30px;
          font-size: 19px;
          line-height: 1.7;
          color: #222;
          min-height: 120px;
          white-space: pre-wrap;
        }

        .message-status {
          padding: 18px 30px;
          border-top: 1px solid #ece9e2;
        }

        .read-badge {
          color: #9b7427;
          font-weight: 700;
        }

        .driver-card {
          padding: 30px;
        }

        .section-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .section-title h2 {
          margin: 0;
          font-size: 22px;
        }

        .section-title a {
          color: #9b7427;
          text-decoration: none;
          font-weight: 700;
        }

        .driver-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .driver-grid div {
          background: #f8f7f4;
          border-radius: 14px;
          padding: 18px;
        }

        .driver-grid span {
          display: block;
          color: #888;
          font-size: 14px;
          margin-bottom: 7px;
        }

        .driver-grid strong {
          display: block;
          color: #222;
        }

        .status {
          text-transform: capitalize;
        }

        .error-message {
          background: #fff1f1;
          color: #a33;
          border: 1px solid #efcccc;
          border-radius: 12px;
          padding: 15px 18px;
        }

        @media (max-width: 800px) {
          .admin-page {
            padding: 20px;
          }

          h1 {
            font-size: 38px;
          }

          .message-header {
            align-items: flex-start;
          }

          .date {
            display: none;
          }

          .driver-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 500px) {
          .top-row {
            align-items: flex-start;
            gap: 15px;
            flex-direction: column;
          }

          .driver-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
