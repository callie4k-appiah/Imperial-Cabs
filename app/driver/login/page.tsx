"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function DriverLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("E-mailadres of wachtwoord is niet correct.");
      setLoading(false);
      return;
    }

    router.push("/driver");
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="logo">
          <div className="crown">♛</div>
          <div className="brand">IMPERIAL CABS</div>
          <div className="subtitle">CHAUFFEUR PORTAL</div>
        </div>

        <div className="header">
          <h1>Welkom terug</h1>
          <p>Log in om je chauffeuromgeving te openen.</p>
        </div>

        <form onSubmit={handleLogin}>
          <label>E-mailadres</label>
          <input
            type="email"
            placeholder="jouw@email.nl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Wachtwoord</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Inloggen..." : "Inloggen →"}
          </button>
        </form>

<div className="register-link">
  <span>Nog geen account?</span>
  <Link href="/driver/register">
    Account aanmaken →
  </Link>
</div>

<p className="footer">
  Imperial Cabs B.V. · Chauffeur Portal
</p>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: #f7f6f3;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
        }

        .login-card {
          width: 100%;
          max-width: 460px;
          background: #ffffff;
          border: 1px solid #e4e1da;
          border-radius: 24px;
          padding: 45px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
        }

        .logo {
          text-align: center;
          margin-bottom: 40px;
        }

        .crown {
          color: #b38a32;
          font-size: 42px;
          line-height: 1;
          margin-bottom: 8px;
        }

        .brand {
          color: #151515;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .subtitle {
          color: #9b7427;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          margin-top: 6px;
        }

        .header {
          margin-bottom: 28px;
        }

        .header h1 {
          margin: 0 0 8px;
          color: #151515;
          font-size: 32px;
        }

        .header p {
          margin: 0;
          color: #777;
          line-height: 1.5;
        }

        form {
          display: flex;
          flex-direction: column;
        }

        label {
          color: #333;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        input {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #ddd8ce;
          border-radius: 10px;
          padding: 14px 15px;
          font-size: 16px;
          margin-bottom: 20px;
          outline: none;
          background: #fff;
        }

        input:focus {
          border-color: #b38a32;
        }

        button {
          border: none;
          border-radius: 10px;
          background: #b38a32;
          color: white;
          padding: 15px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 5px;
        }

        button:hover {
          background: #9b7427;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          background: #fff1f1;
          color: #a33;
          border: 1px solid #efcccc;
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 15px;
          font-size: 14px;
        }

        .footer {
          text-align: center;
          color: #999;
          font-size: 12px;
          margin: 28px 0 0;
        }

        @media (max-width: 500px) {
          .login-page {
            padding: 15px;
          }

          .login-card {
            padding: 30px 22px;
          }
        }
      `}</style>
    </main>
  );
}
