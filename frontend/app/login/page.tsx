"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CarFront,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectPath =
    searchParams.get("redirect") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password"
        );
      }

      localStorage.setItem(
        "driveease_token",
        data.token
      );

      localStorage.setItem(
        "driveease_user",
        JSON.stringify(data.user)
      );

      /*
       * Preserve redirect destination when one exists.
       * Example:
       * /login?redirect=/booking?carId=5
       */
      if (redirectPath) {
        router.push(redirectPath);
      } else if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">

      <div className="login-shell">

        {/* =================================================
            LEFT BRAND PANEL
            ================================================= */}

        <section className="login-brand-panel">

          <div className="login-brand-content">

            {/* Brand */}
            <Link
              href="/"
              className="login-brand"
              aria-label="DriveEase home"
            >
              <span className="login-brand-icon">
                <CarFront size={22} />
              </span>

              <span>DriveEase</span>
            </Link>

            {/* Main message */}
            <div className="login-brand-message">

              <span className="login-brand-badge">
                <ShieldCheck size={15} />
                Secure & Reliable
              </span>

              <h1>
                Your journey
                <br />
                starts here.
              </h1>

              <p>
                Sign in to manage your bookings, explore
                our fleet and keep your entire rental
                journey organized in one place.
              </p>

              {/* Benefits */}
              <div className="login-benefits">

                <div>
                  <span>
                    <Check size={14} />
                  </span>

                  <div>
                    <strong>
                      Manage your bookings
                    </strong>

                    <small>
                      View and manage every reservation
                    </small>
                  </div>
                </div>

                <div>
                  <span>
                    <Check size={14} />
                  </span>

                  <div>
                    <strong>
                      Explore our fleet
                    </strong>

                    <small>
                      Find the right vehicle for your journey
                    </small>
                  </div>
                </div>

                <div>
                  <span>
                    <Check size={14} />
                  </span>

                  <div>
                    <strong>
                      Track rental activity
                    </strong>

                    <small>
                      Keep your rental information organized
                    </small>
                  </div>
                </div>

              </div>

            </div>

            <p className="login-brand-footer">
              Simple booking. Better journeys.
            </p>

          </div>

        </section>

        {/* =================================================
            RIGHT LOGIN PANEL
            ================================================= */}

        <section className="login-form-panel">

          <div className="login-form-container">

            {/* Mobile logo */}
            <div className="login-mobile-brand">

              <Link
                href="/"
                className="login-brand"
              >
                <span className="login-brand-icon">
                  <CarFront size={21} />
                </span>

                <span>DriveEase</span>
              </Link>

            </div>

            {/* Header */}
            <div className="login-form-header">

              <span className="login-kicker">
                WELCOME BACK
              </span>

              <h2>
                Sign in to your account
              </h2>

              <p>
                Enter your credentials to continue
                to DriveEase.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div
                className="login-error"
                role="alert"
              >
                <div className="login-error-icon">
                  !
                </div>

                <div>
                  <strong>
                    Unable to sign in
                  </strong>

                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="login-form"
            >

              {/* Email */}
              <div className="login-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="login-input-wrap">

                  <Mail
                    size={18}
                    className="login-input-icon"
                    aria-hidden="true"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    disabled={loading}
                  />

                </div>

              </div>

              {/* Password */}
              <div className="login-field">

                <div className="login-label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                </div>

                <div className="login-input-wrap">

                  <LockKeyhole
                    size={18}
                    className="login-input-icon"
                    aria-hidden="true"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* Submit */}
              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>

            {/* Register */}
            <div className="login-register">

              <span>
                Don't have an account?
              </span>

              <Link href="/register">
                Create an account
              </Link>

            </div>

            {/* Security */}
            <div className="login-security">

              <ShieldCheck size={15} />

              <span>
                Your account information is securely handled.
              </span>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}