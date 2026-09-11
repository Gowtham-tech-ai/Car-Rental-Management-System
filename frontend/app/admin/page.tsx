"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Car,
  CalendarDays,
  IndianRupee,
  Clock3,
  CheckCircle2,
  XCircle,
  Activity,
  ArrowRight,
  ShieldCheck,
  Loader2,
  TrendingUp,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react";

type AdminStats = {
  total_users: number;
  total_cars: number;
  total_bookings: number;
  total_revenue: number;
  pending_bookings: number;
  active_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const managementItems = [
  {
    href: "/admin/bookings",
    title: "Booking Management",
    description: "Review, confirm and manage customer reservations.",
    icon: CalendarDays,
    tag: "Reservations",
  },
  {
    href: "/admin/cars",
    title: "Fleet Management",
    description: "Add, update and manage DriveEase vehicles.",
    icon: Car,
    tag: "Vehicles",
  },
  {
    href: "/admin/users",
    title: "User Management",
    description: "View and manage registered customers.",
    icon: Users,
    tag: "Customers",
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

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

      const response = await fetch(`${API_URL}/admin/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load admin dashboard");
      }

      setStats(data.stats);
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const statItems = [
    {
      label: "Total Users",
      value: stats?.total_users ?? 0,
      description: "Registered customers",
      icon: Users,
      className: "users",
    },
    {
      label: "Fleet Vehicles",
      value: stats?.total_cars ?? 0,
      description: "Vehicles in the fleet",
      icon: Car,
      className: "cars",
    },
    {
      label: "Total Bookings",
      value: stats?.total_bookings ?? 0,
      description: "All reservations",
      icon: CalendarDays,
      className: "bookings",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.total_revenue ?? 0),
      description: "Confirmed rental revenue",
      icon: IndianRupee,
      className: "revenue",
    },
  ];

  const statusItems = [
    {
      label: "Pending",
      value: stats?.pending_bookings ?? 0,
      icon: Clock3,
      className: "pending",
      description: "Awaiting action",
    },
    {
      label: "Active",
      value: stats?.active_bookings ?? 0,
      icon: Activity,
      className: "active",
      description: "Currently rented",
    },
    {
      label: "Completed",
      value: stats?.completed_bookings ?? 0,
      icon: CheckCircle2,
      className: "completed",
      description: "Successfully finished",
    },
    {
      label: "Cancelled",
      value: stats?.cancelled_bookings ?? 0,
      icon: XCircle,
      className: "cancelled",
      description: "Cancelled rentals",
    },
  ];

  if (loading) {
    return (
      <main className="de-admin-page">
        <div className="de-admin-loading">
          <div className="de-admin-loading-icon">
            <LayoutDashboard size={25} />
          </div>
          <Loader2 size={28} className="de-spin" />
          <h2>Loading admin dashboard</h2>
          <p>Preparing the latest DriveEase operations data...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="de-admin-page">
        <div className="de-admin-error">
          <div className="de-admin-error-icon">
            <XCircle size={30} />
          </div>
          <span className="de-admin-eyebrow">SYSTEM MESSAGE</span>
          <h1>Unable to load dashboard</h1>
          <p>{error}</p>
          <button
            type="button"
            className="de-admin-primary-btn"
            onClick={() => loadDashboard()}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="de-admin-page">
      <div className="de-admin-container">
        <section className="de-admin-hero">
          <div className="de-admin-hero-copy">
            <div className="de-admin-breadcrumb">
              <span>DriveEase</span>
              <span>/</span>
              <strong>Administration</strong>
            </div>

            <div className="de-admin-title-row">
              <div className="de-admin-title-icon">
                <LayoutDashboard size={24} />
              </div>
              <div>
                <span className="de-admin-eyebrow">ADMINISTRATION</span>
                <h1>Admin Dashboard</h1>
              </div>
            </div>

            <p>
              Monitor rental operations, fleet performance, reservations and
              customer activity from one place.
            </p>
          </div>

          <div className="de-admin-hero-actions">
            <div className="de-admin-access-card">
              <div className="de-admin-access-icon">
                <ShieldCheck size={20} />
              </div>
              <div>
                <strong>Admin Access</strong>
                <span>Authorized workspace</span>
              </div>
              <span className="de-admin-live-dot" />
            </div>

            <button
              type="button"
              className="de-admin-refresh-btn"
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
            >
              <RefreshCw size={16} className={refreshing ? "de-spin" : ""} />
              Refresh
            </button>
          </div>
        </section>

        <section className="de-admin-kpi-grid">
          {statItems.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className={`de-admin-kpi ${item.className}`}
              >
                <div className="de-admin-kpi-top">
                  <div className="de-admin-kpi-icon">
                    <Icon size={20} />
                  </div>
                  <span>{item.label}</span>
                </div>

                <strong>{item.value}</strong>

                <div className="de-admin-kpi-bottom">
                  <span>{item.description}</span>
                  <TrendingUp size={14} />
                </div>
              </article>
            );
          })}
        </section>

        <section className="de-admin-panel">
          <div className="de-admin-panel-heading">
            <div>
              <span className="de-admin-eyebrow">BOOKING OVERVIEW</span>
              <h2>Rental Activity</h2>
              <p>Current reservation status across DriveEase.</p>
            </div>
            <div className="de-admin-panel-icon">
              <Activity size={20} />
            </div>
          </div>

          <div className="de-admin-status-grid">
            {statusItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className={`de-admin-status-card ${item.className}`}
                >
                  <div className="de-admin-status-icon">
                    <Icon size={19} />
                  </div>
                  <div>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <small>{item.description}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="de-admin-panel de-management-panel">
          <div className="de-admin-panel-heading">
            <div>
              <span className="de-admin-eyebrow">MANAGEMENT</span>
              <h2>DriveEase Operations</h2>
              <p>Quick access to the core administration areas.</p>
            </div>
          </div>

          <div className="de-admin-management-grid">
            {managementItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="de-admin-management-card"
                >
                  <div className="de-admin-management-icon">
                    <Icon size={22} />
                  </div>

                  <div className="de-admin-management-content">
                    <span>{item.tag}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>

                  <div className="de-admin-management-arrow">
                    <ArrowRight size={17} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <footer className="de-admin-footer-status">
          <div>
            <span className="de-admin-live-dot" />
            <strong>Dashboard connected</strong>
          </div>
          <span>DriveEase Operations Center</span>
        </footer>
      </div>
    </main>
  );
}
