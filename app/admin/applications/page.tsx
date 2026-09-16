"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

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

export default function ApplicationsPage() {
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadApplications() {
      setLoading(true);
      setErrorMessage("");

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
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Application error:", error);

        setErrorMessage(
          "Aanvragen konden niet worden geladen: " + error.message
        );

        setLoading(false);
        return;
      }

      setApplications(data || []);
      setLoading(false);
    }

    loadApplications();
  }, [router]);

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

  function getExperienceLabel(experience: string) {
    if (experience === "ja") return "Ja";
    if (experience === "nee") return "Nee";
    return experience || "-";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-white/60">Aanvragen laden...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <button
              onClick={() => router.push("/admin")}
              className="mb-4 text-sm text-white/50 transition hover:text-white"
            >
              ← Terug naar dashboard
            </button>

            <h1 className="text-3xl font-semibold tracking-tight">
              Chauffeur-aanvragen
            </h1>

            <p className="mt-2 text-sm text-white/50">
              Bekijk en beheer aanvragen van chauffeurs.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-white/40">
              Totaal
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {applications.length}
            </p>
          </div>

        </div>

        {/* ERROR */}
        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        {/* EMPTY */}
        {applications.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">

            <h2 className="text-xl font-medium">
              Nog geen aanvragen
            </h2>

            <p className="mt-2 text-sm text-white/50">
              Nieuwe chauffeur-aanvragen verschijnen hier automatisch.
            </p>

          </div>
        ) : (

          <div className="space-y-4">

            {applications.map((application) => (

              <div
                key={application.id}
                onClick={() =>
                  router.push(
                    `/admin/applications/${application.id}`
                  )
                }
                className="cursor-pointer rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/25 hover:bg-white/[0.06]"
              >

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  {/* CHAUFFEUR */}
                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-xl font-semibold">
                        {application.full_name}
                      </h2>

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                        {getStatusLabel(application.status)}
                      </span>

                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-white/60 md:grid-cols-3">

                      <p>
                        <span className="text-white/35">
                          Telefoon:
                        </span>{" "}
                        {application.phone}
                      </p>

                      <p>
                        <span className="text-white/35">
                          E-mail:
                        </span>{" "}
                        {application.email}
                      </p>

                      <p>
                        <span className="text-white/35">
                          Ervaring:
                        </span>{" "}
                        {getExperienceLabel(
                          application.experience
                        )}
                      </p>

                    </div>

                    {application.message && (
                      <p className="mt-4 line-clamp-2 text-sm text-white/45">
                        {application.message}
                      </p>
                    )}

                  </div>

                  {/* OPEN BUTTON */}
                  <div className="flex shrink-0 items-center gap-3">

                    <span className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm transition hover:bg-white/10">
                      Bekijk aanvraag →
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </main>
  );
}
