"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Car,
  CheckCircle2,
  ImagePlus,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  X,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

type CarData = {
  id: number;
  brand: string;
  model: string;
  category: string;
  seats: number;
  transmission: string;
  fuel: string;
  price: number;
  year: number;
  location: string;
  image_url: string;
  description?: string;
  features?: string[] | string;
  status: "available" | "booked" | "maintenance" | "inactive";
};

type FormData = {
  brand: string;
  model: string;
  category: string;
  seats: string;
  transmission: string;
  fuel: string;
  price: string;
  year: string;
  location: string;
  image_url: string;
  description: string;
  features: string;
  status: "available" | "booked" | "maintenance" | "inactive";
};

const initialForm: FormData = {
  brand: "",
  model: "",
  category: "",
  seats: "",
  transmission: "",
  fuel: "",
  price: "",
  year: "",
  location: "",
  image_url: "",
  description: "",
  features: "",
  status: "available",
};

const statusLabels = {
  available: "Available",
  booked: "Booked",
  maintenance: "Maintenance",
  inactive: "Inactive",
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingCarId, setEditingCarId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchCars = async () => {
    try {
      setLoading(true);
      setFormError("");

      const token = localStorage.getItem("driveease_token");
      const storedUser = localStorage.getItem("driveease_user");

      if (!token || !storedUser) {
        window.location.href = "/login";
        return;
      }

      const user = JSON.parse(storedUser);

      if (user.role !== "admin") {
        window.location.href = "/dashboard";
        return;
      }

      const response = await fetch(`${API_URL}/admin/cars`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch cars");
      }

      setCars(data.cars || []);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to fetch cars"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const categories = useMemo(
    () =>
      Array.from(new Set(cars.map((car) => car.category))).sort(),
    [cars]
  );

  const filteredCars = useMemo(() => {
    const value = search.trim().toLowerCase();

    return cars.filter((car) => {
      const matchesSearch =
        !value ||
        car.brand.toLowerCase().includes(value) ||
        car.model.toLowerCase().includes(value) ||
        car.location.toLowerCase().includes(value);

      const matchesStatus =
        statusFilter === "all" || car.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" || car.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [cars, search, statusFilter, categoryFilter]);

  const openAddForm = () => {
    setEditingCarId(null);
    setForm(initialForm);
    setFormError("");
    setSuccessMessage("");
    setShowForm(true);
  };

  const openEditForm = (car: CarData) => {
    let featuresText = "";

    if (Array.isArray(car.features)) {
      featuresText = car.features.join(", ");
    } else if (typeof car.features === "string") {
      try {
        const parsed = JSON.parse(car.features);
        featuresText = Array.isArray(parsed)
          ? parsed.join(", ")
          : car.features;
      } catch {
        featuresText = car.features;
      }
    }

    setEditingCarId(car.id);
    setForm({
      brand: car.brand || "",
      model: car.model || "",
      category: car.category || "",
      seats: String(car.seats || ""),
      transmission: car.transmission || "",
      fuel: car.fuel || "",
      price: String(car.price || ""),
      year: String(car.year || ""),
      location: car.location || "",
      image_url: car.image_url || "",
      description: car.description || "",
      features: featuresText,
      status: car.status || "available",
    });
    setFormError("");
    setSuccessMessage("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (submitting) return;
    setShowForm(false);
    setEditingCarId(null);
    setForm(initialForm);
    setFormError("");
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const token = localStorage.getItem("driveease_token");

    if (!token) {
      setFormError("Please login as an admin");
      return;
    }

    if (
      !form.brand.trim() ||
      !form.model.trim() ||
      !form.category.trim() ||
      !form.seats ||
      !form.transmission.trim() ||
      !form.fuel.trim() ||
      !form.price ||
      !form.year ||
      !form.location.trim() ||
      !form.image_url.trim()
    ) {
      setFormError("Please fill all required car details");
      return;
    }

    try {
      setSubmitting(true);

      const isEditing = editingCarId !== null;
      const url = isEditing
        ? `${API_URL}/admin/cars/${editingCarId}`
        : `${API_URL}/admin/cars`;

      const payload = {
        brand: form.brand.trim(),
        model: form.model.trim(),
        category: form.category.trim(),
        seats: Number(form.seats),
        transmission: form.transmission.trim(),
        fuel: form.fuel.trim(),
        price: Number(form.price),
        year: Number(form.year),
        location: form.location.trim(),
        image_url: form.image_url.trim(),
        description: form.description.trim() || null,
        features: form.features
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        status: form.status,
      };

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEditing ? "Failed to update car" : "Failed to add car")
        );
      }

      setSuccessMessage(
        data.message ||
          (isEditing ? "Car updated successfully" : "Car added successfully")
      );
      setShowForm(false);
      setEditingCarId(null);
      setForm(initialForm);
      await fetchCars();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivateCar = async (carId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this car?\n\nThe car will no longer be available for new bookings."
    );

    if (!confirmed) return;

    const token = localStorage.getItem("driveease_token");

    if (!token) {
      setFormError("Please login as an admin");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_URL}/admin/cars/${carId}/deactivate`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to deactivate car");
      }

      setSuccessMessage(data.message || "Car deactivated successfully");
      await fetchCars();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Failed to deactivate car"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const counts = {
    total: cars.length,
    available: cars.filter((car) => car.status === "available").length,
    booked: cars.filter((car) => car.status === "booked").length,
    maintenance: cars.filter((car) => car.status === "maintenance").length,
    inactive: cars.filter((car) => car.status === "inactive").length,
  };

  const statusClass = (status: CarData["status"]) =>
    `admin-fleet-status ${status}`;

  return (
    <main className="admin-fleet-page">
      <div className="admin-fleet-container">
        <header className="admin-fleet-header">
          <div>
            <Link href="/admin" className="admin-back-link">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <div className="admin-fleet-title">
              <div className="admin-fleet-title-icon">
                <Car size={24} />
              </div>
              <div>
                <span className="admin-eyebrow">FLEET OPERATIONS</span>
                <h1>Car Management</h1>
                <p>Manage vehicles, availability and rental fleet details.</p>
              </div>
            </div>
          </div>

          <button className="admin-add-car-btn" onClick={openAddForm}>
            <Plus size={18} />
            Add New Car
          </button>
        </header>

        <section className="admin-fleet-summary">
          {[
            ["Total Fleet", counts.total, "fleet"],
            ["Available", counts.available, "available"],
            ["Booked", counts.booked, "booked"],
            ["Maintenance", counts.maintenance, "maintenance"],
            ["Inactive", counts.inactive, "inactive"],
          ].map(([label, value, type]) => (
            <div className={`admin-fleet-summary-card ${type}`} key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </section>

        {successMessage && (
          <div className="admin-fleet-alert success">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage("")} aria-label="Dismiss">
              <X size={16} />
            </button>
          </div>
        )}

        {formError && !showForm && (
          <div className="admin-fleet-alert error">
            <X size={18} />
            <span>{formError}</span>
            <button onClick={() => setFormError("")} aria-label="Dismiss">
              ×
            </button>
          </div>
        )}

        <section className="admin-fleet-toolbar">
          <div className="admin-fleet-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search brand, model or location..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            className="admin-refresh-btn"
            onClick={fetchCars}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
            Refresh
          </button>
        </section>

        <div className="admin-fleet-results">
          <span>Fleet vehicles</span>
          <strong>
            {filteredCars.length} of {cars.length}
          </strong>
        </div>

        {loading ? (
          <div className="admin-fleet-empty">
            <Loader2 size={30} className="spin" />
            <h3>Loading fleet</h3>
            <p>Fetching the latest vehicle information...</p>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="admin-fleet-empty">
            <div className="admin-fleet-empty-icon">
              <Car size={27} />
            </div>
            <h3>No vehicles found</h3>
            <p>Try changing your search or filters.</p>
            {(search || statusFilter !== "all" || categoryFilter !== "all") && (
              <button
                className="admin-empty-reset"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setCategoryFilter("all");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <section className="admin-fleet-grid">
            {filteredCars.map((car) => (
              <article className="admin-fleet-card" key={car.id}>
                <div className="admin-fleet-image">
                  <Image
                    src={car.image_url}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    className="admin-fleet-image-img"
                  />
                  <span className={statusClass(car.status)}>
                    <span />
                    {statusLabels[car.status]}
                  </span>
                </div>

                <div className="admin-fleet-card-body">
                  <div className="admin-fleet-card-heading">
                    <div>
                      <span>{car.category}</span>
                      <h2>
                        {car.brand} {car.model}
                      </h2>
                      <p>{car.year} model</p>
                    </div>
                    <div className="admin-fleet-price">
                      ₹{Number(car.price).toLocaleString("en-IN")}
                      <small>/day</small>
                    </div>
                  </div>

                  <div className="admin-fleet-specs">
                    <span>{car.seats} Seats</span>
                    <span>{car.transmission}</span>
                    <span>{car.fuel}</span>
                  </div>

                  <div className="admin-fleet-location">
                    <MapPin size={15} />
                    <span>{car.location}</span>
                  </div>

                  <div className="admin-fleet-actions">
                    <button
                      className="admin-edit-car-btn"
                      onClick={() => openEditForm(car)}
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    {car.status !== "inactive" ? (
                      <button
                        className="admin-deactivate-car-btn"
                        onClick={() => handleDeactivateCar(car.id)}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <Loader2 size={15} className="spin" />
                        ) : (
                          <Settings2 size={15} />
                        )}
                        {submitting ? "Updating..." : "Deactivate"}
                      </button>
                    ) : (
                      <div className="admin-inactive-label">
                        <CheckCircle2 size={15} />
                        Inactive
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      {showForm && (
        <div
          className="admin-fleet-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <div className="admin-fleet-modal">
            <div className="admin-fleet-modal-header">
              <div className="admin-fleet-modal-title">
                <div>
                  {editingCarId !== null ? (
                    <Pencil size={19} />
                  ) : (
                    <ImagePlus size={19} />
                  )}
                </div>
                <section>
                  <span className="admin-eyebrow">
                    {editingCarId !== null ? "FLEET UPDATE" : "NEW VEHICLE"}
                  </span>
                  <h2>
                    {editingCarId !== null ? "Edit Car" : "Add New Car"}
                  </h2>
                  <p>
                    {editingCarId !== null
                      ? "Update the vehicle information below."
                      : "Add a vehicle to your DriveEase fleet."}
                  </p>
                </section>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeForm}
                disabled={submitting}
              >
                <X size={19} />
              </button>
            </div>

            <form className="admin-car-form" onSubmit={handleSubmit}>
              {formError && (
                <div className="admin-modal-error">{formError}</div>
              )}

              <section className="admin-form-section">
                <div className="admin-form-section-heading">
                  <span>01</span>
                  <div>
                    <h3>Basic Information</h3>
                    <p>Identify the vehicle in your fleet.</p>
                  </div>
                </div>

                <div className="admin-form-grid">
                  <FormField label="Brand *">
                    <input
                      value={form.brand}
                      onChange={(e) =>
                        handleInputChange("brand", e.target.value)
                      }
                      placeholder="Toyota"
                    />
                  </FormField>

                  <FormField label="Model *">
                    <input
                      value={form.model}
                      onChange={(e) =>
                        handleInputChange("model", e.target.value)
                      }
                      placeholder="Fortuner"
                    />
                  </FormField>

                  <FormField label="Category *">
                    <select
                      value={form.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                    >
                      <option value="">Select category</option>
                      <option value="SUV">SUV</option>
                      <option value="Sedan">Sedan</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Luxury">Luxury</option>
                      <option value="MUV">MUV</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </FormField>

                  <FormField label="Year *">
                    <input
                      type="number"
                      min="2000"
                      max="2035"
                      value={form.year}
                      onChange={(e) =>
                        handleInputChange("year", e.target.value)
                      }
                      placeholder="2025"
                    />
                  </FormField>
                </div>
              </section>

              <section className="admin-form-section">
                <div className="admin-form-section-heading">
                  <span>02</span>
                  <div>
                    <h3>Specifications & Pricing</h3>
                    <p>Set the vehicle's rental specifications.</p>
                  </div>
                </div>

                <div className="admin-form-grid">
                  <FormField label="Seats *">
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={form.seats}
                      onChange={(e) =>
                        handleInputChange("seats", e.target.value)
                      }
                      placeholder="5"
                    />
                  </FormField>

                  <FormField label="Transmission *">
                    <select
                      value={form.transmission}
                      onChange={(e) =>
                        handleInputChange("transmission", e.target.value)
                      }
                    >
                      <option value="">Select transmission</option>
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </FormField>

                  <FormField label="Fuel *">
                    <select
                      value={form.fuel}
                      onChange={(e) =>
                        handleInputChange("fuel", e.target.value)
                      }
                    >
                      <option value="">Select fuel</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </FormField>

                  <FormField label="Daily Price *">
                    <div className="admin-price-input">
                      <span>₹</span>
                      <input
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                        placeholder="2500"
                      />
                    </div>
                  </FormField>
                </div>
              </section>

              <section className="admin-form-section">
                <div className="admin-form-section-heading">
                  <span>03</span>
                  <div>
                    <h3>Location & Media</h3>
                    <p>Tell customers where the vehicle is available.</p>
                  </div>
                </div>

                <div className="admin-form-grid">
                  <FormField label="Pickup Location *" full>
                    <input
                      value={form.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="Hyderabad"
                    />
                  </FormField>

                  <FormField label="Image URL *" full>
                    <input
                      type="url"
                      value={form.image_url}
                      onChange={(e) =>
                        handleInputChange("image_url", e.target.value)
                      }
                      placeholder="https://example.com/car.jpg"
                    />
                    <small>Use a publicly accessible HTTPS image URL.</small>
                  </FormField>
                </div>
              </section>

              <section className="admin-form-section">
                <div className="admin-form-section-heading">
                  <span>04</span>
                  <div>
                    <h3>Additional Information</h3>
                    <p>Add customer-facing details and fleet status.</p>
                  </div>
                </div>

                <div className="admin-form-grid">
                  <FormField label="Description" full>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Describe the vehicle..."
                      rows={4}
                    />
                  </FormField>

                  <FormField label="Features" full>
                    <input
                      value={form.features}
                      onChange={(e) =>
                        handleInputChange("features", e.target.value)
                      }
                      placeholder="AC, GPS, Bluetooth, Sunroof"
                    />
                    <small>Separate features with commas.</small>
                  </FormField>

                  <FormField label="Status">
                    <select
                      value={form.status}
                      onChange={(e) =>
                        handleInputChange(
                          "status",
                          e.target.value as FormData["status"]
                        )
                      }
                    >
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </FormField>
                </div>
              </section>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={closeForm}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      Saving...
                    </>
                  ) : editingCarId !== null ? (
                    <>
                      <CheckCircle2 size={16} />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Add Car
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function FormField({
  label,
  children,
  full = false,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={`admin-form-group ${full ? "full" : ""}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}
