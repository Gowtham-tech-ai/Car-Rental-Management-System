"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Search,
  User,
  X,
  XCircle,
} from "lucide-react";

import { cancelBooking, updateProfile } from "@/lib/api";

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
  image_url: string;
  seats: number;
  transmission: string;
  fuel: string;
};

type UserData = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
};

type StatusFilter =
  | "all"
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled";

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All Bookings" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("driveease_token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const API_URL =
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5000/api";
      
      const response = await fetch(`${API_URL}/bookings/my`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bookings");
      }

      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Dashboard booking error:", err);
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("driveease_user");
    const token = localStorage.getItem("driveease_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user:", err);
      }
    }

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(bookingId);
      setError("");
      setSuccessMessage("");

      await cancelBooking(bookingId);
      setSuccessMessage("Booking cancelled successfully.");
      await fetchBookings();
    } catch (err) {
      console.error("Cancel booking error:", err);
      setError(err instanceof Error ? err.message : "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

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

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const activeBookings = bookings.filter(
    (b) => b.status === "active" || b.status === "confirmed"
  ).length;
  const completedBookings = bookings.filter(
    (b) => b.status === "completed"
  ).length;

  const totalRentalDays = bookings.reduce(
    (total, booking) => total + Number(booking.rental_days || 0),
    0
  );

  const totalSpent = bookings.reduce(
    (total, booking) =>
      booking.status !== "cancelled"
        ? total + Number(booking.total_amount || 0)
        : total,
    0
  );

  const categoryCounts = bookings.reduce((counts, booking) => {
    const category = booking.category || "Other";
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const favouriteCategory =
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        !query ||
        booking.booking_reference.toLowerCase().includes(query) ||
        booking.brand.toLowerCase().includes(query) ||
        booking.model.toLowerCase().includes(query) ||
        booking.pickup_location.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" || statusFilter !== "all";

  const handleProfileUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileMessage("");
    setProfileError("");

    if (!profileName.trim()) {
      setProfileError("Name is required");
      return;
    }

    try {
      setProfileSaving(true);

      const data = await updateProfile({
        name: profileName.trim(),
        phone: profilePhone.trim(),
      });

      if (data.user) {
        setUser(data.user);
        localStorage.setItem("driveease_user", JSON.stringify(data.user));
      }

      setProfileMessage("Profile updated successfully.");

      setTimeout(() => {
        setIsProfileModalOpen(false);
        setProfileMessage("");
      }, 1000);
    } catch (err) {
      console.error("Profile update error:", err);
      setProfileError(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "booking-status pending";
      case "confirmed":
        return "booking-status confirmed";
      case "active":
        return "booking-status active";
      case "completed":
        return "booking-status completed";
      case "cancelled":
        return "booking-status cancelled";
      default:
        return "booking-status";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "active":
        return "Active";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <main className="dashboard-section">
        <div className="dashboard-loading-shell">
          <div className="dashboard-loading-mark">
            <Car size={30} />
          </div>
          <Loader2 size={22} className="animate-spin" />
          <p>Loading your DriveEase dashboard...</p>
          <span>Please wait while we retrieve your rental activity.</span>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-section">
      <div className="dashboard-container">
        <section className="dashboard-welcome">
          <div className="dashboard-welcome-content">
            <div className="dashboard-welcome-label">
              <span className="dashboard-label-dot" />
              CUSTOMER DASHBOARD
            </div>

            <h1>
              Welcome back
              {user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
            </h1>

            <p>
              Manage your bookings, explore vehicles, and keep your next journey
              organized from one place.
            </p>

            <div className="dashboard-welcome-actions">
              <Link href="/cars" className="dashboard-primary-action">
                <Search size={17} />
                Browse Cars
                <ArrowRight size={17} />
              </Link>

              <Link href="/about" className="dashboard-secondary-action">
                Learn More
              </Link>
            </div>
          </div>

          <div className="dashboard-welcome-visual" aria-hidden="true">
            <div className="dashboard-visual-ring" />
            <div className="dashboard-car-icon">
              <Car size={54} />
            </div>
            <div className="dashboard-visual-badge">Drive smarter</div>
          </div>
        </section>

        {(successMessage || error) && (
          <div className={`dashboard-alert ${error ? "error" : "success"}`}>
            {error ? <XCircle size={19} /> : <CheckCircle2 size={19} />}
            <span>{error || successMessage}</span>
            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccessMessage("");
              }}
              aria-label="Dismiss notification"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <section className="dashboard-stats">
          {[
            {
              icon: <Car size={21} />,
              label: "Total Bookings",
              value: totalBookings,
              note: "All your rentals",
            },
            {
              icon: <Clock3 size={21} />,
              label: "Pending",
              value: pendingBookings,
              note: "Awaiting confirmation",
            },
            {
              icon: <CheckCircle2 size={21} />,
              label: "Active",
              value: activeBookings,
              note: "Current rentals",
            },
            {
              icon: <CalendarDays size={21} />,
              label: "Completed",
              value: completedBookings,
              note: "Finished rentals",
            },
          ].map((stat) => (
            <div className="dashboard-stat-card" key={stat.label}>
              <div className="dashboard-stat-icon">{stat.icon}</div>
              <div>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.note}</small>
              </div>
            </div>
          ))}
        </section>

        <section className="dashboard-overview-grid">
          <div className="dashboard-profile-card">
            <div className="dashboard-profile-header">
              <div className="dashboard-profile-top">
                <div className="dashboard-profile-avatar">
                  <User size={25} />
                </div>
                <div>
                  <span>MY ACCOUNT</span>
                  <h2>{user?.name || "Customer"}</h2>
                  <p className="dashboard-profile-role">
                    {user?.role === "admin"
                      ? "Administrator"
                      : "DriveEase Customer"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="dashboard-edit-profile"
                onClick={() => {
                  setProfileName(user?.name || "");
                  setProfilePhone(user?.phone || "");
                  setProfileMessage("");
                  setProfileError("");
                  setIsProfileModalOpen(true);
                }}
              >
                Edit Profile
              </button>
            </div>

            <div className="dashboard-profile-info">
              <div className="dashboard-profile-detail">
                <span>Email Address</span>
                <strong>{user?.email || "Not available"}</strong>
              </div>
              <div className="dashboard-profile-detail">
                <span>Phone Number</span>
                <strong>{user?.phone || "Not added"}</strong>
              </div>
              <div className="dashboard-profile-detail">
                <span>Account Type</span>
                <strong>
                  {user?.role === "admin" ? "Administrator" : "Customer"}
                </strong>
              </div>
              <div className="dashboard-profile-detail">
                <span>Account Status</span>
                <strong className="dashboard-account-active">
                  <span /> Active
                </strong>
              </div>
            </div>
          </div>

          <div className="dashboard-quick-card">
            <div className="dashboard-card-heading">
              <div>
                <span>QUICK ACTIONS</span>
                <h2>Manage your rental</h2>
              </div>
              <div className="dashboard-heading-icon">
                <ArrowRight size={17} />
              </div>
            </div>

            <div className="dashboard-quick-actions">
              <Link href="/cars" className="dashboard-quick-action">
                <div><Car size={20} /></div>
                <span>Explore Cars</span>
                <ArrowRight size={16} />
              </Link>

              <Link href="/booking" className="dashboard-quick-action">
                <div><CalendarDays size={20} /></div>
                <span>Make a Booking</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="dashboard-rental-summary">
          <div className="dashboard-summary-heading">
            <div>
              <p className="section-eyebrow">RENTAL OVERVIEW</p>
              <h2>Your Rental Summary</h2>
              <p>A quick overview of your activity on DriveEase.</p>
            </div>
          </div>

          <div className="dashboard-summary-grid">
            <div className="dashboard-summary-card">
              <div className="dashboard-summary-icon">₹</div>
              <div className="dashboard-summary-content">
                <span>Total Rental Value</span>
                <strong>{formatCurrency(totalSpent)}</strong>
                <small>Excluding cancelled bookings</small>
              </div>
            </div>

            <div className="dashboard-summary-card">
              <div className="dashboard-summary-icon"><Clock3 size={21} /></div>
              <div className="dashboard-summary-content">
                <span>Total Rental Days</span>
                <strong>{totalRentalDays}</strong>
                <small>Across all bookings</small>
              </div>
            </div>

            <div className="dashboard-summary-card">
              <div className="dashboard-summary-icon"><Car size={21} /></div>
              <div className="dashboard-summary-content">
                <span>Favourite Category</span>
                <strong>{favouriteCategory}</strong>
                <small>Based on your bookings</small>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-bookings">
          <div className="dashboard-section-heading">
            <div>
              <p className="section-eyebrow">RENTAL ACTIVITY</p>
              <h2>My Bookings</h2>
              <p>View and manage your recent car rental bookings.</p>
            </div>

            <Link href="/cars" className="dashboard-view-all">
              Find a Car <ArrowRight size={16} />
            </Link>
          </div>

          {bookings.length > 0 && (
            <div className="booking-filters">
              <div className="booking-search">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search booking ID, car, or location..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="booking-status-filter">
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as StatusFilter)
                  }
                  aria-label="Filter bookings by status"
                >
                  {statusOptions.map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {bookings.length > 0 && (
            <div className="booking-filter-summary">
              <span>
                Showing <strong>{filteredBookings.length}</strong> of{" "}
                <strong>{totalBookings}</strong> bookings
              </span>

              {hasActiveFilters && (
                <button type="button" onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {bookings.length === 0 ? (
            <div className="empty-bookings">
              <div className="empty-bookings-icon"><Car size={38} /></div>
              <h3>No bookings yet</h3>
              <p>Your rental activity will appear here after you make your first booking.</p>
              <Link href="/cars" className="dashboard-primary-action">
                Explore Cars <ArrowRight size={17} />
              </Link>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="empty-bookings">
              <div className="empty-bookings-icon"><Search size={38} /></div>
              <h3>No bookings found</h3>
              <p>We couldn&apos;t find any bookings matching your search or filter.</p>
              <button
                type="button"
                className="dashboard-primary-action"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="booking-list">
              {filteredBookings.map((booking) => (
                <article className="dashboard-booking-card" key={booking.id}>
                  <div className="dashboard-booking-car">
                    <Image
                      src={booking.image_url}
                      alt={`${booking.brand} ${booking.model}`}
                      width={260}
                      height={180}
                    />
                  </div>

                  <div className="dashboard-booking-details">
                    <div>
                      <span className="booking-category">{booking.category}</span>
                      <h3>{booking.brand} {booking.model}</h3>
                      <p className="booking-reference">
                        Booking ID: <strong>{booking.booking_reference}</strong>
                      </p>
                    </div>

                    <div className="booking-detail-grid">
                      <div className="booking-detail-item">
                        <MapPin size={17} />
                        <div>
                          <span>Pickup Location</span>
                          <strong>{booking.pickup_location}</strong>
                        </div>
                      </div>

                      <div className="booking-detail-item">
                        <CalendarDays size={17} />
                        <div>
                          <span>Rental Period</span>
                          <strong>
                            {formatDate(booking.pickup_date)} →{" "}
                            {formatDate(booking.return_date)}
                          </strong>
                        </div>
                      </div>

                      <div className="booking-detail-item">
                        <Clock3 size={17} />
                        <div>
                          <span>Duration</span>
                          <strong>
                            {booking.rental_days}{" "}
                            {booking.rental_days === 1 ? "day" : "days"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-booking-right">
                    <span className={getStatusClass(booking.status)}>
                      {getStatusLabel(booking.status)}
                    </span>

                    <div className="booking-total">
                      <span>Total</span>
                      <strong>{formatCurrency(Number(booking.total_amount))}</strong>
                    </div>

                    <Link
                      href={`/booking/${booking.id}`}
                      className="booking-details-button"
                    >
                      View Details <ArrowRight size={16} />
                    </Link>

                    {booking.status === "pending" && (
                      <button
                        type="button"
                        className="booking-cancel-button"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                      >
                        {cancellingId === booking.id ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <XCircle size={16} />
                            Cancel Booking
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {isProfileModalOpen && (
        <div
          className="profile-modal-overlay"
          onClick={() => {
            if (!profileSaving) setIsProfileModalOpen(false);
          }}
        >
          <div
            className="profile-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="profile-modal-header">
              <div>
                <span>ACCOUNT SETTINGS</span>
                <h2>Edit Profile</h2>
                <p>Keep your DriveEase account information up to date.</p>
              </div>

              <button
                type="button"
                className="profile-modal-close"
                onClick={() => {
                  if (!profileSaving) setIsProfileModalOpen(false);
                }}
                aria-label="Close profile editor"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleProfileUpdate} className="profile-modal-form">
              <div className="profile-form-group">
                <label htmlFor="profile-name">Full Name</label>
                <input
                  id="profile-name"
                  type="text"
                  value={profileName}
                  onChange={(event) => setProfileName(event.target.value)}
                  placeholder="Enter your full name"
                  disabled={profileSaving}
                  autoComplete="name"
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="profile-email">Email Address</label>
                <input
                  id="profile-email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  autoComplete="email"
                />
                <small>Email address cannot be changed here.</small>
              </div>

              <div className="profile-form-group">
                <label htmlFor="profile-phone">Phone Number</label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={profilePhone}
                  onChange={(event) => setProfilePhone(event.target.value)}
                  placeholder="+91 9876543210"
                  disabled={profileSaving}
                  autoComplete="tel"
                />
              </div>

              {profileError && (
                <div className="profile-form-error">{profileError}</div>
              )}

              {profileMessage && (
                <div className="profile-form-success">{profileMessage}</div>
              )}

              <div className="profile-modal-actions">
                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={() => {
                    if (!profileSaving) setIsProfileModalOpen(false);
                  }}
                  disabled={profileSaving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={profileSaving}
                >
                  {profileSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
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
