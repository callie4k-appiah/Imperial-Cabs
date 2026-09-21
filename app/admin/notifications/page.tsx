"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

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
};

export default function NotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/admin/login");
      return;
    }

    const [notificationsResult, driversResult] = await Promise.all([
      supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("driver")
        .select("id, full_name")
        .order("full_name", { ascending: true }),
    ]);

    if (notificationsResult.error) {
      setError(
        `Notificaties konden niet worden geladen: ${notificationsResult.error.message}`
      );
      setLoading(false);
      return;
    }

    setNotifications(notificationsResult.data || []);
    setDrivers(driversResult.data || []);
    setLoading(false);
  }

  function getDriverName(driverId: string) {
    const driver = drivers.find((item) => item.id === driverId);
    return driver?.full_name || "Onbekende chauffeur";
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

  const total = notifications.length;
  const unread = notifications.filter((item) => !item.is_read).length;
  const read = notifications.filter((item) => item.is_read).length;

  const driverNotifications = notifications.filter(
    (item) => item.driver_id
  ).length;

  if (loading) {
    return (
      <main className="admin-page">
        <div className="container">
          <p>Notificaties laden...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="container">
        <header className="header">
          <div>
            <div className="eyebrow">IMPERIAL CABS</div>

            <h1>Notificaties</h1>

            <p>
              Belangrijke meldingen en updates voor chauffeurs beheren.
            </p>
          </div>

          <Link href="/admin/notifications/new" className="new-button">
            + Nieuwe notificatie
          </Link>
        </header>

        {error && <div className="error-box">{error}</div>}

        <section className="stats">
          <div className="stat-card">
            <span>Totaal</span>
            <strong>{total}</strong>
          </div>

          <div className="stat-card">
            <span>Ongelezen</span>
            <strong className="gold">{unread}</strong>
          </div>

          <div className="stat-card">
            <span>Gelezen</span>
            <strong>{read}</strong>
          </div>

          <div className="stat-card">
            <span>Voor chauffeurs</span>
            <strong>{driverNotifications}</strong>
          </div>
        </section>

        {notifications.length === 0 ? (
          <div className="empty-card">
            <div className="empty-icon">🔔</div>

            <h2>Nog geen notificaties</h2>

            <p>
              Maak je eerste notificatie aan om een chauffeur op de hoogte te
              brengen.
            </p>

            <Link
              href="/admin/notifications/new"
              className="empty-button"
            >
              + Nieuwe notificatie
            </Link>
          </div>
        ) : (
          <section className="notification-list">
            {notifications.map((notification) => {
              const formatted = formatDate(notification.created_at);
              const driverName = getDriverName(notification.driver_id);

              return (
                <Link
                  key={notification.id}
                  href={`/admin/notifications/${notification.id}`}
                  className={`notification-card ${
                    !notification.is_read ? "unread" : ""
                  }`}
                >
                  <div className="notification-icon">
                    🔔
                  </div>

                  <div className="notification-content">
                    <div className="notification-top">
                      <div>
                        <h2>{notification.title}</h2>

                        <div className="meta">
                          <span>{driverName}</span>

                          <span>•</span>

                          <span>
                            {notification.type || "Algemeen"}
                          </span>
                        </div>
                      </div>

                      <div className="date">
                        <strong>{formatted.date}</strong>
                        <span>{formatted.time}</span>
                      </div>
                    </div>

                    <p>{notification.message}</p>

                    <div className="notification-bottom">
                      {notification.is_read ? (
                        <span className="read">
                          ● Gelezen
                        </span>
                      ) : (
                        <span className="unread-status">
                          ● Ongelezen
                        </span>
                      )}

                      <span className="view">
                        Bekijk notificatie →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
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

        .header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 45px;
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
          font-size: 52px;
          line-height: 1;
          letter-spacing: -2px;
        }

        .header p {
          margin: 15px 0 0;
          color: #777;
          font-size: 19px;
        }

        .new-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #181818;
          color: #d9b45a;
          text-decoration: none;
          font-weight: 700;
          padding: 20px 28px;
          border-radius: 15px;
          white-space: nowrap;
        }

        .new-button:hover {
          background: #000;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e4e1da;
          border-radius: 20px;
          padding: 30px;
        }

        .stat-card span {
          display: block;
          color: #888;
          font-size: 16px;
          margin-bottom: 20px;
        }

        .stat-card strong {
          font-size: 38px;
          color: #181818;
        }

        .stat-card .gold {
          color: #a47a25;
        }

        .notification-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .notification-card {
          display: flex;
          gap: 22px;
          background: white;
          border: 1px solid #e4e1da;
          border-radius: 20px;
          padding: 25px;
          text-decoration: none;
          color: inherit;
          transition: 0.2s ease;
        }

        .notification-card:hover {
          transform: translateY(-2px);
          border-color: #c5a45a;
        }

        .notification-card.unread {
          border-left: 5px solid #b58a32;
        }

        .notification-icon {
          width: 58px;
          height: 58px;
          min-width: 58px;
          border-radius: 50%;
          background: #f1ecdf;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-top {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .notification-top h2 {
          margin: 0 0 7px;
          font-size: 21px;
          color: #181818;
        }

        .meta {
          display: flex;
          gap: 8px;
          color: #8b8b8b;
          font-size: 14px;
        }

        .date {
          display: flex;
          flex-direction: column;
          text-align: right;
          gap: 4px;
          white-space: nowrap;
        }

        .date strong {
          color: #555;
          font-size: 14px;
        }

        .date span {
          color: #999;
          font-size: 14px;
        }

        .notification-content > p {
          color: #555;
          margin: 20px 0;
          line-height: 1.6;
          font-size: 16px;
        }

        .notification-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #eeeae3;
          padding-top: 17px;
        }

        .read {
          color: #888;
          font-weight: 600;
        }

        .unread-status {
          color: #a47a25;
          font-weight: 700;
        }

        .view {
          color: #a47a25;
          font-weight: 700;
        }

        .empty-card {
          background: white;
          border: 1px solid #e4e1da;
          border-radius: 22px;
          padding: 70px 30px;
          text-align: center;
        }

        .empty-icon {
          font-size: 45px;
          margin-bottom: 20px;
        }

        .empty-card h2 {
          margin: 0 0 10px;
          font-size: 25px;
        }

        .empty-card p {
          color: #777;
          margin-bottom: 25px;
        }

        .empty-button {
          display: inline-block;
          background: #181818;
          color: #d9b45a;
          text-decoration: none;
          padding: 14px 22px;
          border-radius: 10px;
          font-weight: 700;
        }

        .error-box {
          background: #fff1f1;
          color: #a33;
          border: 1px solid #efcccc;
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 25px;
        }

        @media (max-width: 850px) {
          .admin-page {
            padding: 25px 20px;
          }

          .header {
            flex-direction: column;
          }

          .stats {
            grid-template-columns: 1fr 1fr;
          }

          h1 {
            font-size: 42px;
          }
        }

        @media (max-width: 600px) {
          .stats {
            grid-template-columns: 1fr;
          }

          .notification-card {
            padding: 20px;
          }

          .notification-top {
            flex-direction: column;
          }

          .date {
            text-align: left;
          }

          .notification-bottom {
            align-items: flex-start;
            gap: 10px;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
