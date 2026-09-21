"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Message = {
  id: string;
  driver_id: string | null;
  sender_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

type Driver = {
  id: string;
  full_name: string;
  phone: string | null;
};

export default function MessagesPage() {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMessages() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      const [
        { data: messageData, error: messageError },
        { data: driverData, error: driverError },
      ] = await Promise.all([
        supabase
          .from("messages")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("driver")
          .select("id, full_name, phone")
          .order("full_name"),
      ]);

      if (messageError) {
        console.error(
          "Message error:",
          messageError
        );
      }

      if (driverError) {
        console.error(
          "Driver error:",
          driverError
        );
      }

      setMessages(messageData || []);
      setDrivers(driverData || []);
      setLoading(false);
    }

    loadMessages();
  }, [router]);

  function getDriver(
    driverId: string | null
  ) {
    if (!driverId) return null;

    return (
      drivers.find(
        (driver) =>
          driver.id === driverId
      ) || null
    );
  }

  function senderLabel(
    senderType: string
  ) {
    switch (senderType) {
      case "admin":
        return "Imperial Cabs";

      case "driver":
        return "Chauffeur";

      default:
        return senderType || "Onbekend";
    }
  }

  function formatDate(
    date: string
  ) {
    return new Date(date).toLocaleDateString(
      "nl-NL",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  }

  function formatTime(
    date: string
  ) {
    return new Date(date).toLocaleTimeString(
      "nl-NL",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  const unreadCount = messages.filter(
    (message) =>
      !message.is_read
  ).length;

  const adminCount = messages.filter(
    (message) =>
      message.sender_type === "admin"
  ).length;

  const driverCount = messages.filter(
    (message) =>
      message.sender_type === "driver"
  ).length;

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <p>Berichten laden...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">

        {/* HEADER */}
        <div className="topbar">

          <div>
            <button
              className="back"
              onClick={() =>
                router.push("/admin")
              }
            >
              ← Dashboard
            </button>

            <div className="eyebrow">
              IMPERIAL CABS
            </div>

            <h1>Berichten</h1>

            <p>
              Communicatie met chauffeurs
              beheren en opvolgen.
            </p>
          </div>

          <button
            className="add-button"
            onClick={() =>
              router.push(
                "/admin/messages/new"
              )
            }
          >
            + Nieuw bericht
          </button>

        </div>

        {/* SUMMARY */}
        <div className="summary">

          <div className="summary-card">
            <span>Totaal</span>
            <strong>
              {messages.length}
            </strong>
          </div>

          <div className="summary-card unread">
            <span>Ongelezen</span>
            <strong>
              {unreadCount}
            </strong>
          </div>

          <div className="summary-card">
            <span>Van Imperial Cabs</span>
            <strong>
              {adminCount}
            </strong>
          </div>

          <div className="summary-card">
            <span>Van chauffeurs</span>
            <strong>
              {driverCount}
            </strong>
          </div>

        </div>

        {/* EMPTY */}
        {messages.length === 0 ? (
          <div className="empty">

            <div className="empty-icon">
              💬
            </div>

            <h2>
              Nog geen berichten
            </h2>

            <p>
              Er zijn momenteel geen
              berichten geregistreerd.
            </p>

            <button
              className="add-button"
              onClick={() =>
                router.push(
                  "/admin/messages/new"
                )
              }
            >
              + Eerste bericht maken
            </button>

          </div>
        ) : (
          <div className="messages-list">

            {messages.map((message) => {
              const driver = getDriver(
                message.driver_id
              );

              return (
                <button
                  key={message.id}
                  type="button"
                  className={
                    message.is_read
                      ? "message-card"
                      : "message-card unread-card"
                  }
                  onClick={() =>
                    router.push(
                      `/admin/messages/${message.id}`
                    )
                  }
                >

                  <div className="message-top">

                    <div className="person">

                      <div className="avatar">
                        {driver?.full_name
                          ?.charAt(0)
                          .toUpperCase() || "?"}
                      </div>

                      <div>

                        <h2>
                          {driver?.full_name ||
                            "Geen chauffeur"}
                        </h2>

                        <span>
                          {senderLabel(
                            message.sender_type
                          )}
                        </span>

                      </div>

                    </div>

                    <div className="date">

                      <span>
                        {formatDate(
                          message.created_at
                        )}
                      </span>

                      <small>
                        {formatTime(
                          message.created_at
                        )}
                      </small>

                    </div>

                  </div>

                  <div className="divider" />

                  <p className="message-preview">
                    {message.message}
                  </p>

                  <div className="message-footer">

                    <span
                      className={
                        message.is_read
                          ? "read"
                          : "unread-label"
                      }
                    >
                      {message.is_read
                        ? "✓ Gelezen"
                        : "● Ongelezen"}
                    </span>

                    <span className="details">
                      Bekijk bericht →
                    </span>

                  </div>

                </button>
              );
            })}

          </div>
        )}

      </div>

      <style jsx>{`
        .page {
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

        .back {
          display: block;
          border: none;
          background: transparent;
          padding: 0;
          margin-bottom: 25px;
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
          background: #292929;
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

        .summary-card.unread strong {
          color: #9b762f;
        }

        .messages-list {
          display: grid;
          gap: 15px;
        }

        .message-card {
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

        .message-card:hover {
          transform: translateY(-2px);
          border-color: #c7a45a;
          box-shadow:
            0 10px 30px
            rgba(0, 0, 0, 0.07);
        }

        .unread-card {
          border-left: 4px solid #b08a3e;
        }

        .message-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .person {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #f1ecdf;
          color: #8f6e2c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .person h2 {
          margin: 0 0 4px;
          font-size: 17px;
        }

        .person span {
          color: #999;
          font-size: 12px;
        }

        .date {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 3px;
          color: #777;
          font-size: 12px;
        }

        .date small {
          color: #aaa;
        }

        .divider {
          height: 1px;
          background: #eeeeee;
          margin: 20px 0;
        }

        .message-preview {
          margin: 0;
          color: #555;
          font-size: 14px;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .message-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 18px;
          padding-top: 15px;
          border-top: 1px solid #eeeeee;
        }

        .read {
          color: #777;
          font-size: 12px;
          font-weight: 700;
        }

        .unread-label {
          color: #9b762f;
          font-size: 12px;
          font-weight: 800;
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
        }

        @media (max-width: 500px) {
          .page {
            padding: 25px 15px 60px;
          }

          h1 {
            font-size: 32px;
          }

          .summary {
            grid-template-columns: 1fr;
          }

          .message-top {
            align-items: flex-start;
          }

          .date {
            display: none;
          }

          .message-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </main>
  );
}
