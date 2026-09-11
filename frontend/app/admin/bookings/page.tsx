"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  RefreshCw,
  User,
  XCircle,
  CreditCard,
} from "lucide-react";

type Booking = {
  id: number;
  booking_reference: string;
  pickup_location: string;
  pickup_date: string;
  return_date: string;
  rental_days: number;
  daily_rate: number;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  car_id: number;
  brand: string;
  model: string;
  category: string;
  image_url: string;
  seats: number;
  transmission: string;
  fuel: string;
};

type FilterType =
  | "all"
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled";

const filters: FilterType[] = [
  "all",
  "pending",
  "confirmed",
  "active",
  "completed",
  "cancelled",
];

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchBookings = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      else setRefreshing(true);

      setError("");

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

      const response = await fetch(
        `${API_URL}/admin/bookings`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bookings");
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Admin bookings error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load bookings"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (
    bookingId: number,
    newStatus: string
  ) => {
    try {
      setUpdatingId(bookingId);
      setError("");

      const token = localStorage.getItem("driveease_token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `${API_URL}/admin/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update booking"
        );
      }

      await fetchBookings(false);
    } catch (error) {
      console.error("Update booking status error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update booking"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (
    booking: Booking,
    newStatus: string
  ) => {
    if (booking.status === newStatus) return;

    const confirmed = window.confirm(
      `Change booking ${booking.booking_reference} status from "${booking.status}" to "${newStatus}"?`
    );

    if (!confirmed) return;

    await updateBookingStatus(booking.id, newStatus);
  };

  const filteredBookings = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((booking) => booking.status === filter);
  }, [bookings, filter]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const counts = useMemo(
    () => ({
      all: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      active: bookings.filter((b) => b.status === "active").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    }),
    [bookings]
  );

  const getStatusIcon = (status: string) => {
    if (status === "pending") return <Clock3 size={14} />;
    if (status === "completed") return <CheckCircle2 size={14} />;
    if (status === "cancelled") return <XCircle size={14} />;
    return <Car size={14} />;
  };

  if (loading) {
    return (
      <main className="admin-bookings-page">
        <div className="admin-bookings-loading">
          <div className="admin-bookings-loading-icon">
            <CalendarDays size={25} />
          </div>
          <Loader2 size={28} className="animate-spin" />
          <h2>Loading bookings</h2>
          <p>Fetching the latest DriveEase reservations...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-bookings-page">
      <div className="admin-bookings-container">
        {/* Header */}
        <section className="admin-bookings-header">
          <div>
            <Link href="/admin" className="admin-back-link">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <div className="admin-bookings-title-row">
              <div className="admin-bookings-title-icon">
                <CalendarDays size={22} />
              </div>
              <div>
                <span className="admin-eyebrow">ADMINISTRATION</span>
                <h1>Booking Management</h1>
              </div>
            </div>

            <p>
              Review, monitor and manage all DriveEase customer
              reservations.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={() => fetchBookings(false)}
            disabled={refreshing}
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </section>

        {/* Error */}
        {error && (
          <div className="admin-booking-alert" role="alert">
            <XCircle size={19} />
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* Overview */}
        <section className="admin-booking-overview">
          <div>
            <span className="admin-eyebrow">RESERVATIONS</span>
            <h2>Booking Overview</h2>
          </div>
          <strong>
            {filteredBookings.length}{" "}
            {filteredBookings.length === 1 ? "booking" : "bookings"}
          </strong>
        </section>

        {/* Filters */}
        <section className="admin-booking-filters" aria-label="Booking filters">
          {filters.map((status) => (
            <button
              key={status}
              type="button"
              className={
                filter === status
                  ? "admin-filter active"
                  : "admin-filter"
              }
              onClick={() => setFilter(status)}
            >
              <span>
                {status === "all"
                  ? "All Bookings"
                  : statusLabels[status]}
              </span>
              <b>{counts[status]}</b>
            </button>
          ))}
        </section>

        {/* Booking list */}
        <section className="admin-bookings-list">
          {filteredBookings.length === 0 ? (
            <div className="admin-no-bookings">
              <div className="admin-empty-icon">
                <CalendarDays size={27} />
              </div>
              <h2>No bookings found</h2>
              <p>
                There are no reservations matching the selected
                status.
              </p>
              {filter !== "all" && (
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className="admin-empty-action"
                >
                  View all bookings
                </button>
              )}
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <article
                key={booking.id}
                className="admin-booking-card"
              >
                {/* Vehicle */}
                <div className="admin-booking-vehicle">
                  <div className="admin-booking-image-wrap">
                    <Image
                      src={booking.image_url}
                      alt={`${booking.brand} ${booking.model}`}
                      width={230}
                      height={155}
                      className="admin-booking-image"
                    />
                    <span
                      className={`admin-booking-status ${booking.status}`}
                    >
                      {getStatusIcon(booking.status)}
                      {statusLabels[booking.status] ||
                        booking.status}
                    </span>
                  </div>

                  <div className="admin-vehicle-meta">
                    <span>{booking.category}</span>
                    <strong>
                      {booking.brand} {booking.model}
                    </strong>
                    <small>
                      {booking.seats} seats · {booking.transmission} ·{" "}
                      {booking.fuel}
                    </small>
                  </div>
                </div>

                {/* Main details */}
                <div className="admin-booking-main">
                  <div className="admin-booking-reference">
                    <span>BOOKING REFERENCE</span>
                    <strong>{booking.booking_reference}</strong>
                  </div>

                  <div className="admin-booking-info-grid">
                    <div className="admin-booking-info">
                      <div className="admin-info-icon">
                        <User size={16} />
                      </div>
                      <div>
                        <span>Customer</span>
                        <strong>{booking.customer_name}</strong>
                        <small>{booking.customer_email}</small>
                      </div>
                    </div>

                    <div className="admin-booking-info">
                      <div className="admin-info-icon">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <span>Pickup Location</span>
                        <strong>{booking.pickup_location}</strong>
                      </div>
                    </div>

                    <div className="admin-booking-info">
                      <div className="admin-info-icon">
                        <CalendarDays size={16} />
                      </div>
                      <div>
                        <span>Rental Period</span>
                        <strong>
                          {formatDate(booking.pickup_date)} →{" "}
                          {formatDate(booking.return_date)}
                        </strong>
                        <small>
                          {booking.rental_days}{" "}
                          {booking.rental_days === 1
                            ? "day"
                            : "days"}
                        </small>
                      </div>
                    </div>

                    <div className="admin-booking-info">
                      <div className="admin-info-icon">
                        <Car size={16} />
                      </div>
                      <div>
                        <span>Vehicle</span>
                        <strong>
                          {booking.seats} seats ·{" "}
                          {booking.transmission}
                        </strong>
                        <small>{booking.fuel}</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <aside className="admin-booking-actions">
                  <div className="admin-booking-price">
                    <span>Total Amount</span>
                    <strong>
                      {formatCurrency(
                        Number(booking.total_amount)
                      )}
                    </strong>
                  </div>

                  <div className="admin-payment">
                    <div className="admin-payment-icon">
                      <CreditCard size={15} />
                    </div>
                    <div>
                      <span>Payment</span>
                      <strong>
                        {booking.payment_status}
                      </strong>
                    </div>
                  </div>

                  <label className="admin-status-control">
                    <span>Update Status</span>
                    <select
                      value={booking.status}
                      disabled={updatingId === booking.id}
                      onChange={(e) =>
                        handleStatusChange(
                          booking,
                          e.target.value
                        )
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </label>

                  {updatingId === booking.id && (
                    <div className="admin-updating">
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                      Updating booking...
                    </div>
                  )}
                </aside>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
