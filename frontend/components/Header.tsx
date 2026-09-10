"use client";

import Link from "next/link";
import { CarFront, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "customer" | "admin";
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("driveease_theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.dataset.theme = "dark";
    } else {
      setDarkMode(false);
      document.documentElement.dataset.theme = "light";
    }

    const savedUser = localStorage.getItem("driveease_user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("driveease_user");
        setUser(null);
      }
    }

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("driveease_user");

      if (updatedUser) {
        try {
          setUser(JSON.parse(updatedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;

    setDarkMode(newMode);

    document.documentElement.dataset.theme = newMode
      ? "dark"
      : "light";

    localStorage.setItem(
      "driveease_theme",
      newMode ? "dark" : "light"
    );
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("driveease_token");
    localStorage.removeItem("driveease_user");

    setUser(null);
    setMenuOpen(false);

    window.location.href = "/";
  };

  const firstName = user?.name?.split(" ")[0] || "";

  return (
    <header className="site-header">
      <div className="container nav">

        {/* Brand */}
        <Link
          href="/"
          className="brand"
          onClick={closeMenu}
          aria-label="DriveEase Home"
        >
          <span className="brand-mark">
            <CarFront size={21} strokeWidth={2.4} />
          </span>

          <span className="brand-text">
            Drive<span>Ease</span>
          </span>
        </Link>

        {/* Main Navigation */}
        <nav
          className={`nav-links ${menuOpen ? "open" : ""}`}
          aria-label="Main navigation"
        >
          <Link href="/" onClick={closeMenu}>
            Home
          </Link>

          <Link href="/cars" onClick={closeMenu}>
            Cars
          </Link>

          <Link href="/about" onClick={closeMenu}>
            About
          </Link>

          <Link href="/contact" onClick={closeMenu}>
            Contact
          </Link>

          {user?.role === "customer" && (
            <Link href="/dashboard" onClick={closeMenu}>
              Dashboard
            </Link>
          )}

          {user?.role === "admin" && (
            <Link href="/admin" onClick={closeMenu}>
              Admin
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">

          {/* Theme Toggle */}
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <Sun size={18} strokeWidth={2.2} />
            ) : (
              <Moon size={18} strokeWidth={2.2} />
            )}
          </button>

          {/* Guest */}
          {!user && (
            <div className="nav-auth">
              <Link
                href="/login"
                className="btn btn-small nav-login"
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                href="/register"
                className="btn btn-small btn-primary nav-register"
                onClick={closeMenu}
              >
                Register
              </Link>
            </div>
          )}

          {/* Logged-in */}
          {user && (
            <div className="nav-account">
              <Link
                href={
                  user.role === "admin"
                    ? "/admin"
                    : "/dashboard"
                }
                className="nav-user"
                onClick={closeMenu}
                title={`Open ${
                  user.role === "admin"
                    ? "admin dashboard"
                    : "dashboard"
                }`}
              >
                <span className="nav-avatar">
                  {firstName.charAt(0).toUpperCase()}
                </span>

                <span className="nav-user-name">
                  Hi, {firstName}
                </span>
              </Link>

              <button
                type="button"
                className="btn btn-small nav-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Menu */}
          <button
            type="button"
            className="menu-btn"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={21} strokeWidth={2.2} />
            ) : (
              <Menu size={21} strokeWidth={2.2} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}