"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

type Driver = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  status: string;
  start_date: string | null;
  chauffeurskaart_number: string | null;
};

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
  year: number | null;
  status: string;
};

type Document = {
  id: string;
  document_type: string;
  file_url: string | null;
  status: string;
  expiry_date: string | null;
  created_at: string;
};

type Payment = {
  id: string;
  amount: number | null;
  status: string;
  payment_date: string | null;
  due_date: string | null;
  notes: string | null;
};

type DamageReport = {
  id: string;
  description: string;
  damage_date: string | null;
  location: string | null;
  photo_url: string | null;
  status: string;
};

type Maintenance = {
  id: string;
  maintenance_type: string;
  description: string;
  status: string;
  maintenance_date: string | null;
  notes: string | null;
};

type Contract = {
  id: string;
  contract_type: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  file_url: string | null;
  notes: string | null;
};

type Message = {
  id: string;
  sender_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function DriverDetailPage() {
  const params = useParams();
  const router = useRouter();

  const rawId = params?.id;
  const driverId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [driver, setDriver] = useState<Driver | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [damageReports, setDamageReports] = useState<DamageReport[]>([]);
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDriver() {
      setLoading(true);
      setErrorMessage("");

      if (!driverId) {
        setErrorMessage("Geen chauffeur-ID gevonden in de URL.");
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

      // =========================
      // CHAUFFEUR
      // =========================

      const { data: driverData, error: driverError } =
        await supabase
          .from("driver")
          .select(
            "id, full_name, phone, email, status, start_date, chauffeurskaart_number"
          )
          .eq("id", driverId)
          .maybeSingle();

      if (driverError) {
        console.error("Driver error:", driverError);

        setErrorMessage(
          "Chauffeur kon niet worden geladen: " +
            driverError.message
        );

        setLoading(false);
        return;
      }

      if (!driverData) {
        setErrorMessage("Geen chauffeur gevonden.");
        setLoading(false);
        return;
      }

      setDriver(driverData);

      // =========================
      // VOERTUIG
      // =========================

      const { data: vehicleData, error: vehicleError } =
        await supabase
          .from("vehicle")
          .select(
            "id, brand, model, license_plate, year, status"
          )
          .eq("assigned_driver_id", driverId)
          .limit(1)
          .maybeSingle();

      if (vehicleError) {
        console.error("Vehicle error:", vehicleError);
      }

      setVehicle(vehicleData || null);

      // =========================
      // DOCUMENTEN
      // =========================

      const { data: documentData, error: documentError } =
        await supabase
          .from("documents")
          .select(
            "id, document_type, file_url, status, expiry_date, created_at"
          )
          .eq("driver_id", driverId)
          .order("created_at", { ascending: false });

      if (documentError) {
        console.error("Documents error:", documentError);
      }

      setDocuments(documentData || []);

      // =========================
      // BETALINGEN
      // =========================

      const { data: paymentData, error: paymentError } =
        await supabase
          .from("payments")
          .select(
            "id, amount, status, payment_date, due_date, notes"
          )
          .eq("driver_id", driverId)
          .order("created_at", { ascending: false });

      if (paymentError) {
        console.error("Payments error:", paymentError);
      }

      setPayments(paymentData || []);

      // =========================
      // SCHADE
      // =========================

      const { data: damageData, error: damageError } =
        await supabase
          .from("damage_reports")
          .select(
            "id, description, damage_date, location, photo_url, status"
          )
          .eq("driver_id", driverId)
          .order("created_at", { ascending: false });

      if (damageError) {
        console.error("Damage error:", damageError);
      }

      setDamageReports(damageData || []);

      // =========================
      // ONDERHOUD
      // =========================

      const { data: maintenanceData, error: maintenanceError } =
        await supabase
          .from("maintenance")
          .select(
            "id, maintenance_type, description, status, maintenance_date, notes"
          )
          .eq("driver_id", driverId)
          .order("created_at", { ascending: false });

      if (maintenanceError) {
        console.error("Maintenance error:", maintenanceError);
      }

      setMaintenance(maintenanceData || []);

      // =========================
      // CONTRACTEN
      // =========================

      const { data: contractData, error: contractError } =
        await supabase
          .from("contracts")
          .select(
            "id, contract_type, start_date, end_date, status, file_url, notes"
          )
          .eq("driver_id", driverId)
          .order("created_at", { ascending: false });

      if (contractError) {
        console.error("Contracts error:", contractError);
      }

      setContracts(contractData || []);

      // =========================
      // BERICHTEN
      // =========================

      const { data: messageData, error: messageError } =
        await supabase
          .from("messages")
          .select(
            "id, sender_type, message, is_read, created_at"
          )
          .eq("driver_id", driverId)
          .order("created_at", { ascending: false });

      if (messageError) {
        console.error("Messages error:", messageError);
      }

      setMessages(messageData || []);

      setLoading(false);
    }

    loadDriver();
  }, [driverId, router]);

  // =========================
  // STATUS AANPASSEN
  // =========================

  async function updateDriverStatus(newStatus: string) {
    if (!driver) return;

    setSavingStatus(true);
    setErrorMessage("");

    const { error } = await supabase
      .from("driver")
      .update({
        status: newStatus,
      })
      .eq("id", driver.id);

    if (error) {
      console.error("Status update error:", error);

      setErrorMessage(
        "Status kon niet worden aangepast: " +
          error.message
      );

      setSavingStatus(false);
      return;
    }

    setDriver({
      ...driver,
      status: newStatus,
    });

    setSavingStatus(false);
  }

  // =========================
  // HELPERS
  // =========================

  function formatDate(date: string | null) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("nl-NL");
  }

  function formatDateTime(date: string) {
    return new Date(date).toLocaleString("nl-NL");
  }

  function statusLabel(status: string) {
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

      case "paid":
        return "Betaald";

      case "open":
        return "Open";

      case "pending":
        return "In behandeling";

      case "repaired":
        return "Gerepareerd";

      case "in_progress":
        return "In behandeling";

      default:
        return status || "—";
    }
  }

  function statusClass(status: string) {
    switch (status) {
      case "approved":
      case "active":
      case "paid":
      case "repaired":
        return {
          background: "#102417",
          color: "#79d99a",
          border: "1px solid #1d5930",
        };

      case "rejected":
        return {
          background: "#2a1111",
          color: "#ff9d9d",
          border: "1px solid #682525",
        };

      case "pending":
      case "documents":
      case "open":
      case "in_progress":
        return {
          background: "#2a2110",
          color: "#e7bd58",
          border: "1px solid #604c20",
        };

      default:
        return {
          background: "#171717",
          color: "#aaa",
          border: "1px solid #292929",
        };
    }
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#050505",
          color: "#fff",
          padding: "40px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <p style={{ color: "#aaa" }}>
            Chauffeur laden...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (errorMessage && !driver) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#050505",
          color: "#fff",
          padding: "40px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <button
            type="button"
            onClick={() =>
              router.push("/admin/drivers")
            }
            style={{
              background: "#fff",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              padding: "11px 17px",
              cursor: "pointer",
              fontWeight: 600,
              marginBottom: "30px",
            }}
          >
            ← Terug naar chauffeurs
          </button>

          <div
            style={{
              background: "#160909",
              border: "1px solid #6b2525",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h1>Chauffeur niet gevonden</h1>

            <p
              style={{
                color: "#ffb0b0",
                lineHeight: 1.6,
              }}
            >
              {errorMessage}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!driver) {
    return null;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >

        {/* =========================
            TERUG
        ========================= */}

        <button
          type="button"
          onClick={() =>
            router.push("/admin/drivers")
          }
          style={{
            background: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            padding: "11px 17px",
            cursor: "pointer",
            fontWeight: 600,
            marginBottom: "30px",
          }}
        >
          ← Terug naar chauffeurs
        </button>

        {/* =========================
            HEADER
        ========================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
            marginBottom: "35px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "36px",
                fontWeight: 700,
              }}
            >
              {driver.full_name}
            </h1>

            <p
              style={{
                color: "#999",
                marginTop: "8px",
              }}
            >
              Chauffeurprofiel · Imperial Cabs
            </p>
          </div>

          <span
            style={{
              ...statusClass(driver.status),
              padding: "9px 16px",
              borderRadius: "20px",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            {statusLabel(driver.status)}
          </span>
        </div>

        {/* =========================
            FOUTMELDING
        ========================= */}

        {errorMessage && (
          <div
            style={{
              background: "#160909",
              border: "1px solid #6b2525",
              borderRadius: "12px",
              padding: "15px",
              marginBottom: "20px",
              color: "#ffb0b0",
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* =========================
            ACTIES
        ========================= */}

        <section
          style={{
            background: "#0b0b0b",
            border: "1px solid #222",
            borderRadius: "14px",
            padding: "25px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            Acties
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <a
              href={`tel:${driver.phone}`}
              style={{
                background: "#fff",
                color: "#000",
                padding: "11px 17px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              📞 Bellen
            </a>

            <a
              href={`mailto:${driver.email}`}
              style={{
                background: "#171717",
                color: "#fff",
                border: "1px solid #333",
                padding: "11px 17px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              ✉️ E-mail
            </a>
          </div>
        </section>

        {/* =========================
            STATUS
        ========================= */}

        <section
          style={{
            background: "#0b0b0b",
            border: "1px solid #222",
            borderRadius: "14px",
            padding: "25px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            Chauffeurstatus
          </h2>

          <p
            style={{
              color: "#999",
              marginTop: "5px",
            }}
          >
            Werk de chauffeur door de verschillende fases.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            {[
              ["approved", "Goedgekeurd"],
              ["documents", "Documenten"],
              ["ready", "Klaar voor voertuig"],
              ["active", "Actief"],
              ["rejected", "Afwijzen"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                disabled={savingStatus}
                onClick={() =>
                  updateDriverStatus(value)
                }
                style={{
                  background:
                    driver.status === value
                      ? "#d9a72f"
                      : "#171717",
                  color:
                    driver.status === value
                      ? "#000"
                      : "#fff",
                  border:
                    driver.status === value
                      ? "1px solid #d9a72f"
                      : "1px solid #333",
                  borderRadius: "8px",
                  padding: "11px 15px",
                  cursor: savingStatus
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: 600,
                  opacity: savingStatus ? 0.6 : 1,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* =========================
            GRID
        ========================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >

          {/* =========================
              PERSOONSGEGEVENS
          ========================= */}

          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>Persoonsgegevens</h2>

            <p>
              <strong>Naam:</strong>{" "}
              {driver.full_name}
            </p>

            <p>
              <strong>Telefoon:</strong>{" "}
              {driver.phone}
            </p>

            <p>
              <strong>E-mail:</strong>{" "}
              {driver.email}
            </p>

            <p>
              <strong>Startdatum:</strong>{" "}
              {formatDate(driver.start_date)}
            </p>

            <p>
              <strong>Chauffeurskaart:</strong>{" "}
              {driver.chauffeurskaart_number ||
                "Niet ingevuld"}
            </p>
          </section>

          {/* =========================
              VOERTUIG
          ========================= */}

          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>Voertuig</h2>

            {vehicle ? (
              <>
                <p>
                  <strong>Auto:</strong>{" "}
                  {vehicle.brand}{" "}
                  {vehicle.model}
                </p>

                <p>
                  <strong>Kenteken:</strong>{" "}
                  {vehicle.license_plate}
                </p>

                <p>
                  <strong>Bouwjaar:</strong>{" "}
                  {vehicle.year || "—"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {statusLabel(vehicle.status)}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/admin/vehicle/${vehicle.id}`
                    )
                  }
                  style={{
                    marginTop: "10px",
                    background: "#171717",
                    color: "#fff",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    cursor: "pointer",
                  }}
                >
                  Bekijk voertuig →
                </button>
              </>
            ) : (
              <p style={{ color: "#999" }}>
                Nog geen voertuig gekoppeld.
              </p>
            )}
          </section>

          {/* =========================
              DOCUMENTEN
          ========================= */}

          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>
              Documenten{" "}
              <span
                style={{
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                ({documents.length})
              </span>
            </h2>

            {documents.length === 0 ? (
              <p style={{ color: "#999" }}>
                Nog geen documenten toegevoegd.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginTop: "15px",
                }}
              >
                {documents.map((document) => (
                  <div
                    key={document.id}
                    style={{
                      border: "1px solid #222",
                      borderRadius: "10px",
                      padding: "14px",
                    }}
                  >
                    <strong>
                      {document.document_type}
                    </strong>

                    <p
                      style={{
                        color: "#999",
                        margin: "7px 0",
                      }}
                    >
                      Geldig tot:{" "}
                      {formatDate(
                        document.expiry_date
                      )}
                    </p>

                    <span
                      style={{
                        ...statusClass(
                          document.status
                        ),
                        display: "inline-block",
                        padding: "5px 9px",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    >
                      {statusLabel(
                        document.status
                      )}
                    </span>

                    {document.file_url && (
                      <a
                        href={document.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "block",
                          marginTop: "10px",
                          color: "#d9a72f",
                          textDecoration: "none",
                        }}
                      >
                        Bekijk document →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* =========================
              BETALINGEN
          ========================= */}

          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>
              Betalingen{" "}
              <span
                style={{
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                ({payments.length})
              </span>
            </h2>

            {payments.length === 0 ? (
              <p style={{ color: "#999" }}>
                Nog geen betalingen geregistreerd.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginTop: "15px",
                }}
              >
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    style={{
                      border: "1px solid #222",
                      borderRadius: "10px",
                      padding: "14px",
                    }}
                  >
                    <p>
                      <strong>
                        €{" "}
                        {payment.amount !== null
                          ? Number(
                              payment.amount
                            ).toFixed(2)
                          : "0.00"}
                      </strong>
                    </p>

                    <p
                      style={{
                        color: "#999",
                      }}
                    >
                      Vervaldatum:{" "}
                      {formatDate(
                        payment.due_date
                      )}
                    </p>

                    <span
                      style={{
                        ...statusClass(
                          payment.status
                        ),
                        display: "inline-block",
                        padding: "5px 9px",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    >
                      {statusLabel(
                        payment.status
                      )}
                    </span>

                    {payment.notes && (
                      <p
                        style={{
                          color: "#888",
                          marginTop: "8px",
                        }}
                      >
                        {payment.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* =========================
              SCHADE
          ========================= */}

          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>
              Schademeldingen{" "}
              <span
                style={{
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                ({damageReports.length})
              </span>
            </h2>

            {damageReports.length === 0 ? (
              <p style={{ color: "#999" }}>
                Geen schademeldingen.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginTop: "15px",
                }}
              >
                {damageReports.map((damage) => (
                  <div
                    key={damage.id}
                    style={{
                      border: "1px solid #222",
                      borderRadius: "10px",
                      padding: "14px",
                    }}
                  >
                    <strong>
                      {damage.description}
                    </strong>

                    <p
                      style={{
                        color: "#999",
                        margin: "7px 0",
                      }}
                    >
                      Datum:{" "}
                      {formatDate(
                        damage.damage_date
                      )}
                    </p>

                    {damage.location && (
                      <p
                        style={{
                          color: "#999",
                        }}
                      >
                        Locatie:{" "}
                        {damage.location}
                      </p>
                    )}

                    <span
                      style={{
                        ...statusClass(
                          damage.status
                        ),
                        display: "inline-block",
                        padding: "5px 9px",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    >
                      {statusLabel(
                        damage.status
                      )}
                    </span>

                    {damage.photo_url && (
                      <a
                        href={damage.photo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "block",
                          marginTop: "10px",
                          color: "#d9a72f",
                        }}
                      >
                        Bekijk foto →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* =========================
              ONDERHOUD
          ========================= */}

          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>
              Onderhoud{" "}
              <span
                style={{
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                ({maintenance.length})
              </span>
            </h2>

            {maintenance.length === 0 ? (
              <p style={{ color: "#999" }}>
                Geen onderhoud geregistreerd.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginTop: "15px",
                }}
              >
                {maintenance.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: "1px solid #222",
                      borderRadius: "10px",
                      padding: "14px",
                    }}
                  >
                    <strong>
                      {item.maintenance_type}
                    </strong>

                    {item.description && (
                      <p
                        style={{
                          color: "#999",
                          margin: "7px 0",
                        }}
                      >
                        {item.description}
                      </p>
                    )}

                    <p
                      style={{
                        color: "#888",
                      }}
                    >
                      Datum:{" "}
                      {formatDate(
                        item.maintenance_date
                      )}
                    </p>

                    <span
                      style={{
                        ...statusClass(
                          item.status
                        ),
                        display: "inline-block",
                        padding: "5px 9px",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    >
                      {statusLabel(
                        item.status
                      )}
                    </span>

                    {item.notes && (
                      <p
                        style={{
                          color: "#777",
                          marginTop: "8px",
                        }}
                      >
                        {item.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* =========================
              CONTRACT
          ========================= */}

          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>
              Contracten{" "}
              <span
                style={{
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                ({contracts.length})
              </span>
            </h2>

            {contracts.length === 0 ? (
              <p style={{ color: "#999" }}>
                Nog geen contract geregistreerd.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginTop: "15px",
                }}
              >
                {contracts.map((contract) => (
                  <div
                    key={contract.id}
                    style={{
                      border: "1px solid #222",
                      borderRadius: "10px",
                      padding: "14px",
                    }}
                  >
                    <strong>
                      {contract.contract_type}
                    </strong>

                    <p
                      style={{
                        color: "#999",
                        margin: "7px 0",
                      }}
                    >
                      Start:{" "}
                      {formatDate(
                        contract.start_date
                      )}
                    </p>

                    <p
                      style={{
                        color: "#999",
                      }}
                    >
                      Einde:{" "}
                      {formatDate(
                        contract.end_date
                      )}
                    </p>

                    <span
                      style={{
                        ...statusClass(
                          contract.status
                        ),
                        display: "inline-block",
                        padding: "5px 9px",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    >
                      {statusLabel(
                        contract.status
                      )}
                    </span>

                    {contract.file_url && (
                      <a
                        href={contract.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "block",
                          marginTop: "10px",
                          color: "#d9a72f",
                        }}
                      >
                        Bekijk contract →
                      </a>
                    )}

                    {contract.notes && (
                      <p
                        style={{
                          color: "#777",
                          marginTop: "8px",
                        }}
                      >
                        {contract.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* =========================
              BERICHTEN
          ========================= */}

          <section
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h2>
              Berichten{" "}
              <span
                style={{
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                ({messages.length})
              </span>
            </h2>

            {messages.length === 0 ? (
              <p style={{ color: "#999" }}>
                Nog geen berichten.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginTop: "15px",
                }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      border: "1px solid #222",
                      borderRadius: "10px",
                      padding: "14px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        gap: "10px",
                        marginBottom: "8px",
                      }}
                    >
                      <strong>
                        {message.sender_type}
                      </strong>

                      <span
                        style={{
                          color: "#777",
                          fontSize: "12px",
                        }}
                      >
                        {formatDateTime(
                          message.created_at
                        )}
                      </span>
                    </div>

                    <p
                      style={{
                        color: "#ccc",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {message.message}
                    </p>

                    {!message.is_read && (
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "10px",
                          background: "#2a2110",
                          color: "#e7bd58",
                          border: "1px solid #604c20",
                          padding: "4px 8px",
                          borderRadius: "10px",
                          fontSize: "11px",
                        }}
                      >
                        Ongelezen
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}
