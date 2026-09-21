"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";

type Notification = {
  id: string;
  driver_id: string;
  title: string;
  message: string;
  type: string;
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

export default function NotificationDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [notification, setNotification] =
    useState<Notification | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotification();
  }, []);

  async function loadNotification() {
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

    const { data, error: notificationError } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", id)
      .single();

    if (notificationError || !data) {
      setError("Notificatie kon niet worden gevonden.");
      setLoading(false);
      return;
    }

    setNotification(data);

    if (data.driver_id) {
      const { data: driverData } = await supabase
        .from("driver")
        .select("id, full_name, phone, email, status")
        .eq("id", data.driver_id)
        .single();

      setDriver(driverData);
    }

    // Automatisch als gelezen markeren
    if (!data.is_read) {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      setNotification({
        ...data,
        is_read: true,
      });
    }

    setLoading(false);
  }

  async function markAsUnread() {
    if (!notification) return;

    setMarking(true);
    setError("");

    const { error: updateError } = await supabase
      .from("notifications")
      .update({ is_read: false })
      .eq("id", notification.id);

    if (updateError) {
      setError("Notificatie kon niet worden aangepast.");
      setMarking(false);
      return;
    }

    setNotification({
      ...notification,
      is_read: false,
    });

    setMarking(false);
  }

  async function deleteNotification() {
    if (!notification) return;

    const confirmed = window.confirm(
      "Weet je zeker dat je deze notificatie wilt verwijderen?"
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    const { error: deleteError } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notification.id);

    if (deleteError) {
      setError(
        `Notificatie kon niet worden verwijderd: ${deleteError.message}`
      );
      setDeleting(false);
      return;
    }

    router.push("/admin/notifications");
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    return {
      date: date.toLocaleDateString("nl-NL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }

  if (loading) {
    return (
      <main className="admin-page">
        <div className="container">
          <p>Notificatie laden...</p>
        </div>
      </main>
    );
  }

  if (!notification) {
    return (
      <main className="admin-page">
        <div className="container">
          <Link href="/admin/notifications" className="back-link">
            ← Terug naar notificaties
          </Link>

          <div className="error-card">
            <h2>Notificatie niet gevonden</h2>
            <p>{error}</p>
          </div>
        </div>

        <style jsx>{`
          .admin-page {
            min-height: 100vh;
            background: #f7f6f3;
            padding: 40px;
          }

          .container {
            max-width: 1100px;
            margin: 0 auto;
          }

          .back-link {
            color: #9b7427;
            text-decoration: none;
            font-weight: 700;
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

  const formatted = formatDate(notification.created_at);

  return (
    <main className="admin-page">
      <div className="container">
        <div className="top-row">
          <Link href="/admin/notifications" className="back-link">
            ← Terug naar notificaties
          </Link>

          <button
            className="delete-button"
            onClick={deleteNotification}
            disabled={deleting}
          >
            {deleting
              ? "Verwijderen..."
              : "Notificatie verwijderen"}
          </button>
        </div>

        <header className="header">
          <div>
            <div className="eyebrow">IMPERIAL CABS</div>

            <h1>Notificatie</h1>

            <p>
              Bekijk en beheer deze melding voor de chauffeur.
            </p>
          </div>
        </header>

        {error && <div className="error-box">{error}</div>}

        <section className="notification-card">
          <div className="notification-header">
            <div className="notification-icon">
              🔔
            </div>

            <div className="notification-heading">
              <div className="type-badge">
                {notification.type || "Algemeen"}
              </div>

              <h2>{notification.title}</h2>

              <div className="meta">
                <span>{formatted.date}</span>
                <span>•</span>
                <span>{formatted.time}</span>
              </div>
            </div>
          </div>

          <div className="notification-body">
            {notification.message}
          </div>

          <div className="notification-footer">
            <div>
              {notification.is_read ? (
                <span className="read-status">
                  ● Gelezen
                </span>
              ) : (
                <span className="unread-status">
                  ● Ongelezen
                </span>
              )}
            </div>

            {notification.is_read && (
              <button
                className="secondary-button"
                onClick={markAsUnread}
                disabled={marking}
              >
                {marking ? "Aanpassen..." : "Markeer als ongelezen"}
              </button>
            )}
          </div>
        </section>

        {driver && (
          <section className="driver-card">
            <div className="section-header">
              <div>
                <h2>Ontvanger</h2>
                <p>De chauffeur voor wie deze notificatie bedoeld is.</p>
              </div>

              <Link
                href={`/admin/drivers/${driver.id}`}
                className="driver-link"
              >
                Bekijk chauffeur →
              </Link>
            </div>

            <div className="driver-info">
              <div className="avatar">
                {driver.full_name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="driver-main">
                <h3>{driver.full_name}</h3>

                <span>
                  {driver.status || "Status onbekend"}
                </span>
              </div>
            </div>

            <div className="driver-grid">
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
                <strong>{driver.status || "-"}</strong>
              </div>
            </div>
          </section>
        )}
      </div>

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: #f7f6f3;
          padding: 40px;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 45px;
        }

        .back-link {
          color: #9b7427;
          text-decoration: none;
          font-weight: 700;
        }

        .delete-button {
          border: none;
          background: #181818;
          color: white;
          padding: 13px 20px;
          border-radius: 10px;
          font-weight: 700;
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
          margin: 0;
          color: #151515;
          font-size: 48px;
          letter-spacing: -1.5px;
        }

        .header p {
          color: #777;
          font-size: 18px;
          margin-top: 10px;
        }

        .notification-card,
        .driver-card {
          background: white;
          border: 1px solid #e4e1da;
          border-radius: 22px;
          overflow: hidden;
          margin-bottom: 25px;
        }

        .notification-card {
          border-left: 5px solid #b58a32;
        }

        .notification-header {
          display: flex;
          gap: 20px;
          align-items: center;
          padding: 30px;
          border-bottom: 1px solid #ece9e2;
        }

        .notification-icon {
          width: 64px;
          height: 64px;
          min-width: 64px;
          border-radius: 50%;
          background: #f1ecdf;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
        }

        .notification-heading {
          flex: 1;
        }

        .type-badge {
          display: inline-block;
          background: #f1ecdf;
          color: #9b7427;
          padding: 6px 10px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .notification-heading h2 {
          margin: 0 0 7px;
          font-size: 27px;
          color: #181818;
        }

        .meta {
          display: flex;
          gap: 8px;
          color: #999;
          font-size: 14px;
        }

        .notification-body {
          padding: 35px 30px;
          min-height: 130px;
          white-space: pre-wrap;
          color: #252525;
          font-size: 18px;
          line-height: 1.7;
        }

        .notification-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 30px;
          border-top: 1px solid #ece9e2;
        }

        .read-status {
          color: #777;
          font-weight: 700;
        }

        .unread-status {
          color: #a47a25;
          font-weight: 800;
        }

        .secondary-button {
          border: 1px solid #ddd8ce;
          background: white;
          color: #555;
          padding: 10px 15px;
          border-radius: 9px;
          font-weight: 700;
          cursor: pointer;
        }

        .secondary-button:hover {
          border-color: #b38a32;
          color: #9b7427;
        }

        .secondary-button:disabled {
          opacity: 0.6;
        }

        .driver-card {
          padding: 30px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 25px;
        }

        .section-header h2 {
          margin: 0 0 5px;
          font-size: 23px;
        }

        .section-header p {
          margin: 0;
          color: #888;
        }

        .driver-link {
          color: #9b7427;
          text-decoration: none;
          font-weight: 700;
        }

        .driver-info {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 18px;
          background: #f8f7f4;
          border-radius: 15px;
          margin-bottom: 20px;
        }

        .avatar {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background: #eee7d7;
          color: #9b7427;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 800;
        }

        .driver-main h3 {
          margin: 0 0 5px;
          font-size: 20px;
        }

        .driver-main span {
          color: #888;
          font-size: 14px;
        }

        .driver-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .driver-grid div {
          background: #f8f7f4;
          border-radius: 13px;
          padding: 17px;
        }

        .driver-grid span {
          display: block;
          color: #888;
          font-size: 13px;
          margin-bottom: 6px;
        }

        .driver-grid strong {
          color: #222;
        }

        .error-box {
          background: #fff1f1;
          color: #a33;
          border: 1px solid #efcccc;
          padding: 15px 18px;
          border-radius: 12px;
          margin-bottom: 25px;
        }

        @media (max-width: 700px) {
          .admin-page {
            padding: 25px 18px;
          }

          .top-row {
            align-items: flex-start;
            flex-direction: column;
          }

          h1 {
            font-size: 38px;
          }

          .notification-header {
            padding: 24px;
          }

          .notification-body {
            padding: 28px 24px;
          }

          .notification-footer {
            padding: 18px 24px;
            align-items: flex-start;
            flex-direction: column;
            gap: 15px;
          }

          .driver-card {
            padding: 24px;
          }

          .section-header {
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
