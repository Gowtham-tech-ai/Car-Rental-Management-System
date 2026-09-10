"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Fuel,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { cancelBooking, getBookingById } from "@/lib/api";

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
  car_id: number;
  brand: string;
  model: string;
  category: string;
  seats: number;
  transmission: string;
  fuel: string;
  year: number;
  image_url: string;
  description?: string;
  features?: string[] | Record<string, unknown> | null;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
};

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = String(params.id);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    async function loadBooking() {
      try {
        setLoading(true);
        setError("");
        const data = await getBookingById(bookingId);
        setBooking(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load booking details."
        );
      } finally {
        setLoading(false);
      }
    }

    if (bookingId) loadBooking();
  }, [bookingId]);

  async function handleCancelBooking() {
    if (!booking) return;

    try {
      setCancelling(true);
      setError("");
      await cancelBooking(booking.id);
      setBooking({ ...booking, status: "cancelled", payment_status: booking.payment_status });
      setShowCancelConfirm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel booking.");
    } finally {
      setCancelling(false);
    }
  }

  function formatDate(date: string) {
    if (!date) return "-";
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatDateTime(date: string) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount));
  }

  function statusLabel(status: string) {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  const canCancel =
    booking &&
    ["pending", "confirmed"].includes(booking.status.toLowerCase());

  if (loading) {
    return (
      <main className="booking-details-page">
        <div className="booking-details-shell booking-details-loading">
          <div className="booking-loading-bar back" />
          <div className="booking-loading-bar title" />
          <div className="booking-loading-grid">
            <div className="booking-loading-card large" />
            <div className="booking-loading-card" />
          </div>
          <div className="booking-loading-grid lower">
            <div className="booking-loading-card" />
            <div className="booking-loading-card" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="booking-details-page">
        <div className="booking-details-error">
          <div className="booking-error-icon"><XCircle size={30} /></div>
          <span className="booking-eyebrow">BOOKING DETAILS</span>
          <h1>Unable to load booking</h1>
          <p>{error || "The requested booking could not be found."}</p>
          <div className="booking-error-actions">
            <button type="button" onClick={() => router.back()} className="booking-outline-button">
              <ArrowLeft size={16} /> Go Back
            </button>
            <Link href="/dashboard" className="booking-primary-button">
              Dashboard <ArrowLeft size={16} className="rotate-180" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="booking-details-page">
      <div className="booking-details-shell">
        <Link href="/dashboard" className="booking-back-link">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <header className="booking-details-header">
          <div>
            <div className="booking-eyebrow-row">
              <span className="booking-eyebrow">RESERVATION</span>
              <span className="booking-reference-chip">{booking.booking_reference}</span>
            </div>
            <h1>Booking Details</h1>
            <p>
              Your complete rental summary for{" "}
              <strong>{booking.brand} {booking.model}</strong>.
            </p>
          </div>

          <span className={`booking-status-pill status-${booking.status.toLowerCase()}`}>
            <span />
            {statusLabel(booking.status)}
          </span>
        </header>

        {error && (
          <div className="booking-details-alert">
            <XCircle size={18} />
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} aria-label="Dismiss error">
              <X size={16} />
            </button>
          </div>
        )}

        <section className="booking-hero-grid">
          <article className="booking-vehicle-card">
            <div className="booking-vehicle-image">
              <Image
                src={booking.image_url}
                alt={`${booking.brand} ${booking.model}`}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 62vw"
              />
              <div className="booking-image-overlay">
                <span>{booking.category}</span>
                <span>{booking.year}</span>
              </div>
            </div>

            <div className="booking-vehicle-content">
              <div className="booking-vehicle-heading">
                <div>
                  <span className="booking-mini-label">RENTAL VEHICLE</span>
                  <h2>{booking.brand} {booking.model}</h2>
                  <p>Premium DriveEase rental vehicle</p>
                </div>
                <div className="booking-daily-price">
                  <strong>{formatCurrency(booking.daily_rate)}</strong>
                  <span>per day</span>
                </div>
              </div>

              <div className="booking-spec-grid">
                <Spec icon={<Users size={17} />} label="Seats" value={`${booking.seats}`} />
                <Spec label="Transmission" value={booking.transmission} />
                <Spec icon={<Fuel size={17} />} label="Fuel" value={booking.fuel} />
                <Spec label="Model Year" value={`${booking.year}`} />
              </div>

              {booking.description && (
                <div className="booking-description">
                  <h3>About this vehicle</h3>
                  <p>{booking.description}</p>
                </div>
              )}
            </div>
          </article>

          <aside className="booking-payment-card">
            <div className="booking-card-topline">
              <div className="booking-payment-icon"><CreditCard size={19} /></div>
              <div>
                <span className="booking-mini-label">FINANCIAL SUMMARY</span>
                <h2>Payment Summary</h2>
              </div>
            </div>

            <div className="booking-price-rows">
              <div><span>Daily rental rate</span><strong>{formatCurrency(booking.daily_rate)}</strong></div>
              <div><span>Rental duration</span><strong>{booking.rental_days} {booking.rental_days === 1 ? "day" : "days"}</strong></div>
            </div>

            <div className="booking-total-row">
              <span>Total rental value</span>
              <strong>{formatCurrency(booking.total_amount)}</strong>
            </div>

            <div className="booking-payment-state">
              <div>
                <span>Payment status</span>
                <strong>{statusLabel(booking.payment_status)}</strong>
              </div>
              <span className={`payment-dot payment-${booking.payment_status.toLowerCase()}`} />
            </div>

            <div className="booking-secure-note">
              <ShieldCheck size={17} />
              <span>Your booking information is securely associated with your account.</span>
            </div>
          </aside>
        </section>

        <section className="booking-info-grid">
          <InfoCard
            icon={<CalendarDays size={19} />}
            title="Rental Information"
            subtitle="Your selected rental schedule"
          >
            <InfoRow icon={<MapPin size={17} />} label="Pickup Location" value={booking.pickup_location} />
            <InfoRow icon={<CalendarDays size={17} />} label="Pickup Date" value={formatDate(booking.pickup_date)} />
            <InfoRow icon={<CalendarDays size={17} />} label="Return Date" value={formatDate(booking.return_date)} />
            <InfoRow icon={<Clock3 size={17} />} label="Rental Duration" value={`${booking.rental_days} ${booking.rental_days === 1 ? "day" : "days"}`} />
            <InfoRow icon={<Clock3 size={17} />} label="Booked On" value={formatDateTime(booking.created_at)} />
          </InfoCard>

          <InfoCard
            icon={<User size={19} />}
            title="Customer Information"
            subtitle="Account associated with this booking"
          >
            <InfoRow icon={<User size={17} />} label="Name" value={booking.customer_name} />
            <InfoRow icon={<CreditCard size={17} />} label="Email" value={booking.customer_email} />
            <InfoRow icon={<Phone size={17} />} label="Phone" value={booking.customer_phone || "Not provided"} />
          </InfoCard>
        </section>

        <section className="booking-manage-card">
          <div className="booking-manage-copy">
            <div className="booking-success-icon"><CheckCircle2 size={19} /></div>
            <div>
              <span className="booking-mini-label">RESERVATION MANAGEMENT</span>
              <h2>Manage your booking</h2>
              <p>Return to your dashboard or cancel this reservation when cancellation is available.</p>
            </div>
          </div>

          <div className="booking-manage-actions">
            <Link href="/dashboard" className="booking-outline-button">
              <ArrowLeft size={16} /> Dashboard
            </Link>

            {canCancel && (
              <button
                type="button"
                onClick={() => setShowCancelConfirm(true)}
                disabled={cancelling}
                className="booking-danger-button"
              >
                <XCircle size={16} /> Cancel Booking
              </button>
            )}
          </div>
        </section>
      </div>

      {showCancelConfirm && (
        <div className="booking-modal-overlay" onClick={() => !cancelling && setShowCancelConfirm(false)}>
          <div className="booking-cancel-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="booking-modal-close"
              onClick={() => !cancelling && setShowCancelConfirm(false)}
              aria-label="Close cancellation dialog"
            >
              <X size={18} />
            </button>
            <div className="booking-modal-icon"><XCircle size={27} /></div>
            <span className="booking-eyebrow">CANCELLATION</span>
            <h2>Cancel this booking?</h2>
            <p>
              Are you sure you want to cancel{" "}
              <strong>{booking.booking_reference}</strong>? This action cannot be undone.
            </p>
            <div className="booking-modal-actions">
              <button type="button" onClick={() => setShowCancelConfirm(false)} disabled={cancelling} className="booking-outline-button">
                Keep Booking
              </button>
              <button type="button" onClick={handleCancelBooking} disabled={cancelling} className="booking-danger-confirm">
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="booking-spec">
      <div className="booking-spec-icon">{icon || <span>•</span>}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="booking-info-card">
      <div className="booking-info-card-header">
        <div className="booking-info-card-icon">{icon}</div>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="booking-info-list">{children}</div>
    </section>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="booking-info-row">
      <div className="booking-info-row-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
