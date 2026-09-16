"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

type Application = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  experience: string;
  message: string;
  status: string;
  created_at: string;
};

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();

  const rawId = params?.id;
  const applicationId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [application, setApplication] =
    useState<Application | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadApplication() {
      setLoading(true);
      setErrorMessage("");

      if (!applicationId) {
        setErrorMessage("Geen aanvraag-ID gevonden.");
        setLoading(false);
        return;
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("applications")
        .select(
          "id, full_name, phone, email, experience, message, status, created_at"
        )
        .eq("id", applicationId)
        .maybeSingle();

      if (error) {
        console.error("Application error:", error);

        setErrorMessage(
          "Aanvraag kon niet worden geladen: " + error.message
        );

        setLoading(false);
        return;
      }

      if (!data) {
        setErrorMessage("Deze aanvraag bestaat niet.");
        setLoading(false);
        return;
      }

      setApplication(data);
      setLoading(false);
    }

    loadApplication();
  }, [applicationId, router]);

  async function updateStatus(newStatus: string) {
    if (!application) return;

    setSaving(true);
    setErrorMessage("");

    const { error } = await supabase
      .from("applications")
      .update({
        status: newStatus,
      })
      .eq("id", application.id);

    if (error) {
      console.error("Status update error:", error);

      setErrorMessage(
        "Status kon niet worden aangepast: " + error.message
      );

      setSaving(false);
      return;
    }

    setApplication({
      ...application,
      status: newStatus,
    });

    setSaving(false);
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case "new":
        return "Nieuw";
      case "contacted":
        return "Gebeld";
      case "approved":
        return "Goedgekeurd";
      case "documents":
        return "Documenten";
      case "ready":
        return "Klaar voor voertuig";
      case "active":
        return "Actief";
      case "rejected":
        return "Afgewezen";
      default:
        return status || "Nieuw";
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-white/60">
            Aanvraag laden...
          </p>
        </div>
      </main>
    );
  }

  if (!application) {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">

          <button
            onClick={() => router.push("/admin/applications")}
            className="mb-6 text-sm text-white/50 hover:text-white"
          >
            ← Terug naar aanvragen
          </button>

          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
            <p className="text-red-300">
              {errorMessage || "Aanvraag niet gevonden."}
            </p>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">

          <button
            onClick={() => router.push("/admin/applications")}
            className="mb-5 text-sm text-white/50 transition hover:text-white"
          >
            ← Terug naar aanvragen
          </button>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h1 className="text-3xl font-semibold">
                {application.full_name}
              </h1>

              <p className="mt-2 text-sm text-white/50">
                Chauffeur-aanvraag
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              Status:{" "}
              <span className="text-white">
                {getStatusLabel(application.status)}
              </span>
            </div>

          </div>
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Personal information */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">

            <h2 className="text-lg font-semibold">
              Persoonlijke gegevens
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Volledige naam
                </p>

                <p className="mt-1 text-white/80">
                  {application.full_name}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Telefoon
                </p>

                <p className="mt-1 text-white/80">
                  {application.phone}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-white/35">
                  E-mailadres
                </p>

                <p className="mt-1 break-all text-white/80">
                  {application.email}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Taxi-ervaring
                </p>

                <p className="mt-1 text-white/80">
                  {application.experience === "ja"
                    ? "Ja"
                    : application.experience === "nee"
                    ? "Nee"
                    : application.experience || "-"}
                </p>
              </div>

            </div>

          </section>

          {/* Actions */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <h2 className="text-lg font-semibold">
              Acties
            </h2>

            <div className="mt-5 space-y-3">

              <a
                href={`tel:${application.phone}`}
                className="block w-full rounded-xl bg-white px-4 py-3 text-center text-sm font-medium text-black transition hover:bg-white/90"
              >
                📞 Chauffeur bellen
              </a>

              <a
                href={`mailto:${application.email}`}
                className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm transition hover:bg-white/10"
              >
                ✉️ E-mail sturen
              </a>

            </div>

          </section>

          {/* Message */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-3">

            <h2 className="text-lg font-semibold">
              Bericht van chauffeur
            </h2>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">

              <p className="whitespace-pre-wrap text-sm leading-7 text-white/70">
                {application.message || "Geen bericht ingevuld."}
              </p>

            </div>

          </section>

          {/* Status management */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-3">

            <h2 className="text-lg font-semibold">
              Aanvraagstatus
            </h2>

            <p className="mt-2 text-sm text-white/45">
              Werk de chauffeur door de onboarding-fases.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <button
                onClick={() => updateStatus("contacted")}
                disabled={saving}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10 disabled:opacity-50"
              >
                Gebeld
              </button>

              <button
                onClick={() => updateStatus("approved")}
                disabled={saving}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10 disabled:opacity-50"
              >
                Goedgekeurd
              </button>

              <button
                onClick={() => updateStatus("documents")}
                disabled={saving}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10 disabled:opacity-50"
              >
                Documenten
              </button>

              <button
                onClick={() => updateStatus("ready")}
                disabled={saving}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10 disabled:opacity-50"
              >
                Klaar voor voertuig
              </button>

              <button
                onClick={() => updateStatus("active")}
                disabled={saving}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10 disabled:opacity-50"
              >
                Actief
              </button>

              <button
                onClick={() => updateStatus("rejected")}
                disabled={saving}
                className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
              >
                Afwijzen
              </button>

            </div>

          </section>

          {/* Application details */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-3">

            <h2 className="text-lg font-semibold">
              Aanvraaginformatie
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-3">

              <div>
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Aanvraag-ID
                </p>

                <p className="mt-1 break-all text-sm text-white/60">
                  {application.id}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Status
                </p>

                <p className="mt-1 text-sm text-white/70">
                  {getStatusLabel(application.status)}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Aangemeld op
                </p>

                <p className="mt-1 text-sm text-white/70">
                  {new Date(
                    application.created_at
                  ).toLocaleString("nl-NL")}
                </p>
              </div>

            </div>

          </section>

        </div>

      </div>
    </main>
  );
}
