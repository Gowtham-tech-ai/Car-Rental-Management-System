"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

type UserData = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: "customer" | "admin";
  created_at: string;
  updated_at: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [changingRoleId, setChangingRoleId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("driveease_user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      if (user?.id) setCurrentUserId(Number(user.id));
    } catch {
      console.error("Failed to read current user");
    }
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("driveease_token");
      const storedUser = localStorage.getItem("driveease_user");

      if (!token || !storedUser) {
        window.location.href = "/login";
        return;
      }

      const user = JSON.parse(storedUser);

      if (user?.role !== "admin") {
        window.location.href = "/dashboard";
        return;
      }

      const response = await fetch(`${API_URL}/admin/users`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (
    user: UserData,
    newRole: "customer" | "admin"
  ) => {
    if (user.role === newRole) return;

    if (user.id === currentUserId) {
      setError("You cannot change your own admin role.");
      return;
    }

    const roleName = newRole === "admin" ? "Administrator" : "Customer";
    const confirmed = window.confirm(
      `Are you sure you want to change ${user.name}'s role to ${roleName}?`
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("driveease_token");

      if (!token) {
        setError("Please login as an admin.");
        return;
      }

      setChangingRoleId(user.id);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_URL}/admin/users/${user.id}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user role");
      }

      setUsers((previous) =>
        previous.map((item) =>
          item.id === user.id ? { ...item, role: newRole } : item
        )
      );

      setSuccessMessage(data.message || "User role updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update user role"
      );
    } finally {
      setChangingRoleId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !value ||
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        (user.phone || "").toLowerCase().includes(value);

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const totalUsers = users.length;
  const totalCustomers = users.filter((user) => user.role === "customer").length;
  const totalAdmins = users.filter((user) => user.role === "admin").length;

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("all");
  };

  const formatDate = (date: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="du-users-page">
      <div className="du-users-container">
        <header className="du-users-header">
          <div>
            <Link href="/admin" className="du-back-link">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <div className="du-title-row">
              <div className="du-title-icon">
                <Users size={24} />
              </div>
              <div>
                <span className="du-eyebrow">ADMINISTRATION</span>
                <h1>User Management</h1>
                <p>Manage registered customers and administrators.</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="du-refresh-btn"
            onClick={fetchUsers}
            disabled={loading}
          >
            <RefreshCw size={17} className={loading ? "du-spin" : ""} />
            Refresh Users
          </button>
        </header>

        {successMessage && (
          <div className="du-message du-success">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
            <button type="button" onClick={() => setSuccessMessage("")}>
              <X size={16} />
            </button>
          </div>
        )}

        {error && (
          <div className="du-message du-error">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")}>
              <X size={16} />
            </button>
          </div>
        )}

        <section className="du-summary-grid">
          <div className="du-summary-card">
            <div className="du-summary-icon">
              <Users size={20} />
            </div>
            <div>
              <span>Total Users</span>
              <strong>{totalUsers}</strong>
              <small>Registered accounts</small>
            </div>
          </div>

          <div className="du-summary-card">
            <div className="du-summary-icon du-customer-icon">
              <User size={20} />
            </div>
            <div>
              <span>Customers</span>
              <strong>{totalCustomers}</strong>
              <small>Standard accounts</small>
            </div>
          </div>

          <div className="du-summary-card">
            <div className="du-summary-icon du-admin-icon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span>Administrators</span>
              <strong>{totalAdmins}</strong>
              <small>Privileged accounts</small>
            </div>
          </div>
        </section>

        <section className="du-toolbar">
          <div className="du-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search users"
            />
            {search && (
              <button
                type="button"
                className="du-search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            aria-label="Filter users by role"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="admin">Administrators</option>
          </select>

          {(search || roleFilter !== "all") && (
            <button
              type="button"
              className="du-clear-btn"
              onClick={clearFilters}
            >
              <X size={15} />
              Clear Filters
            </button>
          )}
        </section>

        {!loading && (
          <div className="du-result-row">
            <span>
              Showing <strong>{filteredUsers.length}</strong> of{" "}
              <strong>{users.length}</strong> users
            </span>
            {roleFilter !== "all" && (
              <span className="du-filter-chip">
                {roleFilter === "admin" ? "Administrators" : "Customers"}
              </span>
            )}
          </div>
        )}

        {loading ? (
          <section className="du-table-shell">
            <div className="du-loading">
              <Loader2 size={30} className="du-spin" />
              <strong>Loading users</strong>
              <span>Fetching account information...</span>
            </div>
          </section>
        ) : filteredUsers.length === 0 ? (
          <section className="du-table-shell">
            <div className="du-empty">
              <div className="du-empty-icon">
                <Users size={28} />
              </div>
              <h3>No users found</h3>
              <p>Try changing your search or role filter.</p>
              {(search || roleFilter !== "all") && (
                <button
                  type="button"
                  className="du-empty-btn"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </section>
        ) : (
          <section className="du-table-shell">
            <div className="du-table-scroll">
              <table className="du-users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Current Role</th>
                    <th>Registered</th>
                    <th>Role Access</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => {
                    const isCurrentUser = user.id === currentUserId;
                    const isChanging = changingRoleId === user.id;

                    return (
                      <tr key={user.id}>
                        <td>
                          <div className="du-user-cell">
                            <div className="du-avatar">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <strong>{user.name}</strong>
                              <span>User #{user.id}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="du-contact">
                            <div>
                              <Mail size={14} />
                              <span>{user.email}</span>
                            </div>
                            {user.phone && (
                              <div>
                                <Phone size={14} />
                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td>
                          <span
                            className={`du-role ${
                              user.role === "admin"
                                ? "du-role-admin"
                                : "du-role-customer"
                            }`}
                          >
                            {user.role === "admin" ? (
                              <>
                                <ShieldCheck size={14} />
                                Administrator
                              </>
                            ) : (
                              <>
                                <User size={14} />
                                Customer
                              </>
                            )}
                          </span>
                        </td>

                        <td>
                          <span className="du-date">
                            {formatDate(user.created_at)}
                          </span>
                        </td>

                        <td>
                          {isCurrentUser ? (
                            <span className="du-protected">
                              <ShieldCheck size={14} />
                              Your Account
                            </span>
                          ) : (
                            <div className="du-role-control">
                              <select
                                value={user.role}
                                disabled={isChanging}
                                onChange={(event) =>
                                  handleRoleChange(
                                    user,
                                    event.target.value as "customer" | "admin"
                                  )
                                }
                                aria-label={`Change role for ${user.name}`}
                              >
                                <option value="customer">Customer</option>
                                <option value="admin">Administrator</option>
                              </select>
                              {isChanging && (
                                <Loader2 size={15} className="du-role-spinner du-spin" />
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="du-table-footer">
              <span>
                {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"} displayed
              </span>
              <span>Role changes require confirmation</span>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
