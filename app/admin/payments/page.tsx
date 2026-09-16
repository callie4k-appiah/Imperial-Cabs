"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Payment = {
  id: string;
  driver_id: string;
  vehicle_id: string | null;
  amount: number | null;
  status: string;
  payment_date: string | null;
  due_date: string | null;
  notes: string | null;
  created_at: string;
};

type Driver = {
  id: string;
  full_name: string;
};

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
};

export default function PaymentsPage() {
  const router = useRouter();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPayments() {
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

      const [
        { data: paymentData, error: paymentError },
        { data: driverData, error: driverError },
        { data: vehicleData, error: vehicleError },
      ] = await Promise.all([
        supabase
          .from("payments")
          .select(
            "id, driver_id, vehicle_id, amount, status, payment_date, due_date, notes, created_at"
          )
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("driver")
          .select("id, full_name"),

        supabase
          .from("vehicle")
          .select(
            "id, brand, model, license_plate"
          ),
      ]);

      if (paymentError) {
        console.error(
          "Payment error:",
          paymentError
        );

        setErrorMessage(
          "Betalingen konden niet worden geladen: " +
            paymentError.message
        );

        setLoading(false);
        return;
      }

      if (driverError) {
        console.error(
          "Driver error:",
          driverError
        );
      }

      if (vehicleError) {
        console.error(
          "Vehicle error:",
          vehicleError
        );
      }

      setPayments(paymentData || []);
      setDrivers(driverData || []);
      setVehicles(vehicleData || []);

      setLoading(false);
    }

    loadPayments();
  }, [router]);

  function getDriverName(driverId: string) {
    const driver = drivers.find(
      (item) => item.id === driverId
    );

    return driver?.full_name || "Onbekende chauffeur";
  }

  function getVehicle(vehicleId: string | null) {
    if (!vehicleId) return null;

    return vehicles.find(
      (item) => item.id === vehicleId
    );
  }

  function formatDate(date: string | null) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "nl-NL"
    );
  }

  function formatAmount(amount: number | null) {
    if (amount === null) return "€ 0,00";

    return new Intl.NumberFormat(
      "nl-NL",
      {
        style: "currency",
        currency: "EUR",
      }
    ).format(Number(amount));
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case "paid":
        return "Betaald";

      case "open":
        return "Open";

      case "pending":
        return "In behandeling";

      case "overdue":
        return "Te laat";

      default:
        return status || "Onbekend";
    }
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case "paid":
        return {
          background: "#102417",
          color: "#79d99a",
          border: "1px solid #1d5930",
        };

      case "overdue":
        return {
          background: "#2a1111",
          color: "#ff9d9d",
          border: "1px solid #682525",
        };

      case "open":
      case "pending":
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
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <p style={{ color: "#999" }}>
            Betalingen laden...
          </p>
        </div>
      </main>
    );
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
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >

        {/* HEADER */}

        <button
          type="button"
          onClick={() =>
            router.push("/admin")
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
          ← Terug naar dashboard
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "36px",
              }}
            >
              Betalingen
            </h1>

            <p
              style={{
                color: "#999",
                marginTop: "8px",
              }}
            >
              Beheer betalingen en openstaande
              bedragen.
            </p>
          </div>

          <div
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "12px",
              padding: "15px 20px",
              minWidth: "140px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#777",
                fontSize: "13px",
              }}
            >
              Totaal
            </p>

            <p
              style={{
                margin: "5px 0 0",
                fontSize: "25px",
                fontWeight: 700,
              }}
            >
              {payments.length}
            </p>
          </div>
        </div>

        {/* ERROR */}

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

        {/* EMPTY */}

        {payments.length === 0 ? (
          <div
            style={{
              background: "#0b0b0b",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "50px",
              textAlign: "center",
            }}
          >
            <h2>
              Nog geen betalingen
            </h2>

            <p
              style={{
                color: "#777",
              }}
            >
              Betalingen die je toevoegt
              verschijnen hier.
            </p>
          </div>
        ) : (

          /* PAYMENTS */

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {payments.map((payment) => {
              const vehicle =
                getVehicle(
                  payment.vehicle_id
                );

              return (
                <div
                  key={payment.id}
                  style={{
                    background: "#0b0b0b",
                    border: "1px solid #222",
                    borderRadius: "14px",
                    padding: "22px",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >

                    {/* DRIVER */}

                    <div>
                      <p
                        style={{
                          color: "#777",
                          fontSize: "12px",
                          margin: 0,
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.05em",
                        }}
                      >
                        Chauffeur
                      </p>

                      <p
                        style={{
                          marginTop: "7px",
                          fontWeight: 600,
                        }}
                      >
                        {getDriverName(
                          payment.driver_id
                        )}
                      </p>
                    </div>

                    {/* VEHICLE */}

                    <div>
                      <p
                        style={{
                          color: "#777",
                          fontSize: "12px",
                          margin: 0,
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.05em",
                        }}
                      >
                        Voertuig
                      </p>

                      {vehicle ? (
                        <p
                          style={{
                            marginTop: "7px",
                          }}
                        >
                          {vehicle.brand}{" "}
                          {vehicle.model}
                          <br />

                          <span
                            style={{
                              color: "#777",
                              fontSize: "13px",
                            }}
                          >
                            {vehicle.license_plate}
                          </span>
                        </p>
                      ) : (
                        <p
                          style={{
                            marginTop: "7px",
                            color: "#777",
                          }}
                        >
                          Geen voertuig
                        </p>
                      )}
                    </div>

                    {/* AMOUNT */}

                    <div>
                      <p
                        style={{
                          color: "#777",
                          fontSize: "12px",
                          margin: 0,
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.05em",
                        }}
                      >
                        Bedrag
                      </p>

                      <p
                        style={{
                          marginTop: "7px",
                          fontSize: "20px",
                          fontWeight: 700,
                        }}
                      >
                        {formatAmount(
                          payment.amount
                        )}
                      </p>
                    </div>

                    {/* DUE DATE */}

                    <div>
                      <p
                        style={{
                          color: "#777",
                          fontSize: "12px",
                          margin: 0,
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.05em",
                        }}
                      >
                        Vervaldatum
                      </p>

                      <p
                        style={{
                          marginTop: "7px",
                        }}
                      >
                        {formatDate(
                          payment.due_date
                        )}
                      </p>
                    </div>

                    {/* STATUS */}

                    <div>
                      <p
                        style={{
                          color: "#777",
                          fontSize: "12px",
                          margin: 0,
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.05em",
                        }}
                      >
                        Status
                      </p>

                      <span
                        style={{
                          ...getStatusStyle(
                            payment.status
                          ),
                          display:
                            "inline-block",
                          marginTop: "7px",
                          padding:
                            "6px 10px",
                          borderRadius:
                            "14px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {getStatusLabel(
                          payment.status
                        )}
                      </span>
                    </div>

                  </div>

                  {/* EXTRA INFO */}

                  {(payment.payment_date ||
                    payment.notes) && (
                    <div
                      style={{
                        marginTop: "18px",
                        paddingTop: "15px",
                        borderTop:
                          "1px solid #1d1d1d",
                      }}
                    >
                      {payment.payment_date && (
                        <p
                          style={{
                            color: "#888",
                            fontSize: "13px",
                            margin: 0,
                          }}
                        >
                          Betaald op:{" "}
                          {formatDate(
                            payment.payment_date
                          )}
                        </p>
                      )}

                      {payment.notes && (
                        <p
                          style={{
                            color: "#777",
                            fontSize: "13px",
                            marginTop:
                              "8px",
                          }}
                        >
                          {payment.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
