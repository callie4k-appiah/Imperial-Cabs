"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function DriverRegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("De wachtwoorden komen niet overeen.");
      return;
    }

    if (password.length < 6) {
      setError("Je wachtwoord moet minimaal 6 tekens bevatten.");
      return;
    }

    setLoading(true);

    /*
     * Eerst controleren of er al een chauffeur
     * met dit e-mailadres bestaat.
     */
    const { data: existingDriver } = await supabase
      .from("driver")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (existingDriver) {
      setError(
        "Er bestaat al een chauffeursprofiel met dit e-mailadres."
      );
      setLoading(false);
      return;
    }

    /*
     * Account aanmaken in Supabase Auth.
     */
    const { data, error: authError } =
      await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
      });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    /*
     * Chauffeursprofiel aanmaken.
     *
     * Nieuwe accounts krijgen standaard de status
     * pending. Imperial Cabs kan de chauffeur daarna
     * controleren/goedkeuren.
     */
    const { error: driverError } = await supabase
      .from("driver")
      .insert({
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        status: "pending",
      });

    if (driverError) {
      setError(
        "Het account is aangemaakt, maar het chauffeursprofiel kon niet worden aangemaakt."
      );
      setLoading(false);
      return;
    }

    /*
     * Als Supabase e-mailbevestiging gebruikt,
     * laten we de chauffeur dat eerst doen.
     */
    if (!data.session) {
      setSuccess(
        "Je account is aangemaakt. Controleer je e-mail om je account te bevestigen. Daarna kan Imperial Cabs je aanvraag beoordelen."
      );

      setLoading(false);
      return;
    }

    /*
     * Als e-mailbevestiging niet verplicht is,
     * gaat de chauffeur naar de loginpagina.
     */
    await supabase.auth.signOut();

    router.push("/driver/login");
  }

  return (
    <main className="page">
      <div className="register-card">

        {/* LOGO */}
        <div className="logo">
          <div className="crown">♛</div>

          <div className="brand">
            IMPERIAL CABS
          </div>

          <div className="subtitle">
            CHAUFFEUR PORTAL
          </div>
        </div>

        {/* HEADER */}
        <div className="header">
          <div className="eyebrow">
            CHAUFFEUR REGISTRATIE
          </div>

          <h1>Account aanmaken</h1>

          <p>
            Maak je chauffeuraccount aan. Na registratie
            kan Imperial Cabs je aanvraag controleren.
          </p>
        </div>

        <form onSubmit={handleRegister}>

          <label>Volledige naam</label>

          <input
            type="text"
            placeholder="Voor- en achternaam"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label>Telefoonnummer</label>

          <input
            type="tel"
            placeholder="06 12345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

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
            placeholder="Minimaal 6 tekens"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <label>Wachtwoord bevestigen</label>

          <input
            type="password"
            placeholder="Herhaal je wachtwoord"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            minLength={6}
            required
          />

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {success && (
            <div className="success">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Account aanmaken..."
              : "Account aanmaken →"}
          </button>
        </form>

        <div className="login-link">
          Heb je al een account?
          <Link href="/driver/login">
            Log hier in
          </Link>
        </div>

        <div className="notice">
          Door een account aan te maken, geef je Imperial
          Cabs toestemming om contact met je op te nemen
          over je chauffeursaanvraag.
        </div>

      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f7f6f3;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px 20px;
        }

        .register-card {
          width: 100%;
          max-width: 500px;
          background: white;
          border: 1px solid #e4e1da;
          border-radius: 24px;
          padding: 45px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
        }

        .logo {
          text-align: center;
          margin-bottom: 35px;
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
          font-weight: 900;
          letter-spacing: 3px;
        }

        .subtitle {
          color: #9b7427;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-top: 6px;
        }

        .header {
          margin-bottom: 28px;
        }

        .eyebrow {
          color: #b38a32;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        .header h1 {
          margin: 0 0 8px;
          color: #151515;
          font-size: 32px;
          letter-spacing: -0.7px;
        }

        .header p {
          margin: 0;
          color: #777;
          line-height: 1.6;
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
          margin-bottom: 19px;
          outline: none;
          background: #fff;
          color: #181818;
        }

        input:focus {
          border-color: #b38a32;
          box-shadow: 0 0 0 3px rgba(179, 138, 50, 0.08);
        }

        button {
          border: none;
          border-radius: 10px;
          background: #b38a32;
          color: white;
          padding: 15px;
          font-size: 16px;
          font-weight: 800;
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
          line-height: 1.5;
        }

        .success {
          background: #f1f7f1;
          color: #47704b;
          border: 1px solid #cfe2d1;
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 15px;
          font-size: 14px;
          line-height: 1.5;
        }

        .login-link {
          text-align: center;
          color: #777;
          font-size: 14px;
          margin-top: 25px;
        }

        .login-link a {
          color: #9b7427;
          font-weight: 800;
          text-decoration: none;
          margin-left: 5px;
        }

        .notice {
          margin-top: 22px;
          padding-top: 20px;
          border-top: 1px solid #ece9e2;
          color: #999;
          font-size: 12px;
          line-height: 1.6;
          text-align: center;
        }

        @media (max-width: 550px) {
          .page {
            padding: 15px;
          }

          .register-card {
            padding: 30px 22px;
          }

          .header h1 {
            font-size: 28px;
          }
        }
      `}</style>
    </main>
  );
}
