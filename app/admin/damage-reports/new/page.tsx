"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

type Driver = {
  id: string;
  full_name: string;
};

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
  assigned_driver_id: string | null;
};

export default function NewDamageReportPage() {
  const router = useRouter();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [description, setDescription] = useState("");
  const [damageDate, setDamageDate] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("open");

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      const [
        { data: driverData, error: driverError },
        { data: vehicleData, error: vehicleError },
      ] = await Promise.all([
        supabase
          .from("driver")
          .select("id, full_name")
          .order("full_name"),

        supabase
          .from("vehicle")
          .select(
            "id, brand, model, license_plate, assigned_driver_id"
          )
          .order("brand"),
      ]);

      if (driverError) {
        console.error("Driver error:", driverError);
        setErrorMessage(
          "Chauffeurs konden niet worden geladen."
        );
      }

      if (vehicleError) {
        console.error("Vehicle error:", vehicleError);
        setErrorMessage(
          "Voertuigen konden niet worden geladen."
        );
      }

      setDrivers(driverData || []);
      setVehicles(vehicleData || []);
      setLoading(false);
    }

    loadData();
  }, [router]);

  function handleDriverChange(value: string) {
    setDriverId(value);

    const matchingVehicle = vehicles.find(
      (vehicle) =>
        vehicle.assigned_driver_id === value
    );

    if (matchingVehicle) {
      setVehicleId(matchingVehicle.id);
    }
  }

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (selectedFiles.length === 0) return;

    const remainingSlots = 5 - photos.length;

    const filesToAdd = selectedFiles.slice(
      0,
      remainingSlots
    );

    const invalidFile = filesToAdd.find(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFile) {
      setErrorMessage(
        "Alleen afbeeldingen kunnen worden geüpload."
      );
      return;
    }

    const tooLarge = filesToAdd.find(
      (file) => file.size > 10 * 1024 * 1024
    );

    if (tooLarge) {
      setErrorMessage(
        "Een foto mag maximaal 10 MB zijn."
      );
      return;
    }

    setErrorMessage("");

    setPhotos((current) => [
      ...current,
      ...filesToAdd,
    ]);

    const newPreviews = filesToAdd.map((file) =>
      URL.createObjectURL(file)
    );

    setPhotoPreviews((current) => [
      ...current,
      ...newPreviews,
    ]);

    event.target.value = "";
  }

  function removePhoto(index: number) {
    URL.revokeObjectURL(photoPreviews[index]);

    setPhotos((current) =>
      current.filter((_, i) => i !== index)
    );

    setPhotoPreviews((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    if (!driverId) {
      setErrorMessage("Selecteer een chauffeur.");
      return;
    }

    if (!description.trim()) {
      setErrorMessage(
        "Vul een omschrijving van de schade in."
      );
      return;
    }

    if (!damageDate) {
      setErrorMessage(
        "Vul de datum van de schade in."
      );
      return;
    }

    setSaving(true);

    try {
      // 1. Schademelding opslaan
      const { data: damageReport, error: damageError } =
        await supabase
          .from("damage_reports")
          .insert({
            driver_id: driverId,
            vehicle_id: vehicleId || null,
            description: description.trim(),
            damage_date: damageDate,
            location: location.trim() || null,
            status,
          })
          .select("id")
          .single();

      if (damageError) {
        throw new Error(
          "Schade kon niet worden opgeslagen: " +
            damageError.message
        );
      }

      if (!damageReport) {
        throw new Error(
          "De schademelding kon niet worden aangemaakt."
        );
      }

      // 2. Foto's uploaden
      for (const photo of photos) {
        const extension =
          photo.name.split(".").pop() || "jpg";

        const fileName =
          `${crypto.randomUUID()}.${extension}`;

        const filePath =
          `${damageReport.id}/${fileName}`;

        const { error: uploadError } =
          await supabase.storage
            .from("damage-photos")
            .upload(filePath, photo, {
              cacheControl: "3600",
              upsert: false,
              contentType: photo.type,
            });

        if (uploadError) {
          throw new Error(
            "Foto kon niet worden geüpload: " +
              uploadError.message
          );
        }

        // 3. Foto koppelen aan schademelding
        const { error: photoRecordError } =
          await supabase
            .from("damage_photos")
            .insert({
              damage_report_id: damageReport.id,
              file_path: filePath,
            });

        if (photoRecordError) {
          throw new Error(
            "Foto kon niet aan de schade worden gekoppeld: " +
              photoRecordError.message
          );
        }
      }

      router.push("/admin/damage-reports");
    } catch (error) {
      console.error("Damage report error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Er ging iets mis bij het opslaan."
      );

      setSaving(false);
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
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <p style={{ color: "#999" }}>
            Gegevens laden...
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
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* TERUG */}

        <button
          type="button"
          onClick={() =>
            router.push("/admin/damage-reports")
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
          ← Terug naar schades
        </button>

        {/* HEADER */}

        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              fontWeight: 700,
            }}
          >
            Schade melden
          </h1>

          <p
            style={{
              color: "#999",
              marginTop: "8px",
            }}
          >
            Registreer een nieuwe schade aan een
            voertuig.
          </p>
        </div>

        {/* ERROR */}

        {errorMessage && (
          <div
            style={{
              background: "#160909",
              border: "1px solid #6b2525",
              color: "#ffb0b0",
              borderRadius: "12px",
              padding: "15px",
              marginBottom: "20px",
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#0b0b0b",
            border: "1px solid #222",
            borderRadius: "16px",
            padding: "30px",
          }}
        >
          {/* CHAUFFEUR */}

          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#bbb",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Chauffeur *
            </label>

            <select
              value={driverId}
              onChange={(event) =>
                handleDriverChange(
                  event.target.value
                )
              }
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#151515",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "9px",
                padding: "13px",
                fontSize: "15px",
              }}
            >
              <option value="">
                Selecteer chauffeur
              </option>

              {drivers.map((driver) => (
                <option
                  key={driver.id}
                  value={driver.id}
                >
                  {driver.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* VOERTUIG */}

          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#bbb",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Voertuig
            </label>

            <select
              value={vehicleId}
              onChange={(event) =>
                setVehicleId(
                  event.target.value
                )
              }
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#151515",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "9px",
                padding: "13px",
                fontSize: "15px",
              }}
            >
              <option value="">
                Geen voertuig
              </option>

              {vehicles.map((vehicle) => (
                <option
                  key={vehicle.id}
                  value={vehicle.id}
                >
                  {vehicle.brand}{" "}
                  {vehicle.model} —{" "}
                  {vehicle.license_plate}
                </option>
              ))}
            </select>
          </div>

          {/* OMSCHRIJVING */}

          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#bbb",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Omschrijving schade *
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Bijvoorbeeld: schade aan rechter achterdeur..."
              required
              minLength={5}
              rows={5}
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#151515",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "9px",
                padding: "13px",
                fontSize: "15px",
                resize: "vertical",
              }}
            />
          </div>

          {/* DATUM */}

          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#bbb",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Datum schade *
            </label>

            <input
              type="date"
              value={damageDate}
              onChange={(event) =>
                setDamageDate(
                  event.target.value
                )
              }
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#151515",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "9px",
                padding: "13px",
                fontSize: "15px",
              }}
            />
          </div>

          {/* LOCATIE */}

          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#bbb",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Locatie
            </label>

            <input
              type="text"
              value={location}
              onChange={(event) =>
                setLocation(
                  event.target.value
                )
              }
              placeholder="Bijvoorbeeld: Amsterdam Zuid"
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#151515",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "9px",
                padding: "13px",
                fontSize: "15px",
              }}
            />
          </div>

          {/* FOTO'S */}

          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#bbb",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Foto's van de schade
            </label>

            <div
              style={{
                border: "1px dashed #444",
                borderRadius: "12px",
                padding: "25px",
                textAlign: "center",
                background: "#101010",
              }}
            >
              <div
                style={{
                  fontSize: "30px",
                  marginBottom: "8px",
                }}
              >
                📸
              </div>

              <p
                style={{
                  margin: "0 0 15px",
                  color: "#999",
                  fontSize: "14px",
                }}
              >
                Voeg maximaal 5 foto's toe
              </p>

              <label
                style={{
                  display: "inline-block",
                  background: "#222",
                  color: "#fff",
                  border: "1px solid #444",
                  borderRadius: "9px",
                  padding: "11px 16px",
                  cursor:
                    photos.length >= 5
                      ? "not-allowed"
                      : "pointer",
                  fontWeight: 600,
                  opacity:
                    photos.length >= 5 ? 0.5 : 1,
                }}
              >
                Foto's kiezen
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={photos.length >= 5}
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                />
              </label>

              <p
                style={{
                  margin: "12px 0 0",
                  color: "#666",
                  fontSize: "12px",
                }}
              >
                JPG, PNG, WEBP · maximaal 10 MB per foto
              </p>
            </div>

            {/* PREVIEWS */}

            {photoPreviews.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(130px, 1fr))",
                  gap: "12px",
                  marginTop: "15px",
                }}
              >
                {photoPreviews.map(
                  (preview, index) => (
                    <div
                      key={preview}
                      style={{
                        position: "relative",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "1px solid #333",
                        aspectRatio: "1",
                        background: "#151515",
                      }}
                    >
                      <img
                        src={preview}
                        alt={`Schade foto ${
                          index + 1
                        }`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removePhoto(index)
                        }
                        style={{
                          position: "absolute",
                          top: "7px",
                          right: "7px",
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          border: "none",
                          background:
                            "rgba(0,0,0,0.75)",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* STATUS */}

          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#bbb",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Status *
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value
                )
              }
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#151515",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "9px",
                padding: "13px",
                fontSize: "15px",
              }}
            >
              <option value="open">
                Open
              </option>

              <option value="in_progress">
                In behandeling
              </option>

              <option value="resolved">
                Afgerond
              </option>
            </select>
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              background: "#d9a72f",
              color: "#000",
              border: "none",
              borderRadius: "10px",
              padding: "15px",
              cursor: saving
                ? "not-allowed"
                : "pointer",
              fontWeight: 700,
              fontSize: "16px",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving
              ? "Schade + foto's opslaan..."
              : "Schade opslaan →"}
          </button>
        </form>
      </div>
    </main>
  );
}
