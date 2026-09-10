"use client";

import { Suspense, useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectPath = searchParams.get("redirect");

  useEffect(() => {
    const token = localStorage.getItem("driveease_token");
    const storedUser = localStorage.getItem("driveease_user");

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);

        if (user.role === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/dashboard");
        }
      } catch {
        localStorage.removeItem("driveease_token");
        localStorage.removeItem("driveease_user");
      }
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      localStorage.setItem("driveease_token", data.token);
      localStorage.setItem(
        "driveease_user",
        JSON.stringify(data.user)
      );

      /*
       * If the user came from booking, return them there.
       * Otherwise use the normal role-based destination.
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
          : "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page login-page">
      <div className="auth-container">

        {/* Brand panel */}
        <section className="auth-brand-panel">
          <div className="auth-brand-content">

            <Link href="/" className="auth-brand-logo">
              <span className="auth-brand-mark">D</span>

              <span>
                <strong>DriveEase</strong>
                <small>Car Rental Management</small>
              </span>
            </Link>

            <div className="auth-brand-copy">
              <span className="auth-eyebrow">
                Welcome back
              </span>

              <h1>
                Your journey
                <br />
                starts here.
              </h1>

              <p>
                Sign in to manage your bookings, explore our
                fleet, and enjoy a seamless rental experience.
              </p>
            </div>

            <div className="auth-benefits">
              <div className="auth-benefit">
                <ShieldCheck size={20} />
                <div>
                  <strong>Secure account</strong>
                  <span>Your account is protected</span>
                </div>
              </div>

              <div className="auth-benefit">
                <Lock size={20} />
                <div>
                  <strong>Easy booking</strong>
                  <span>Reserve your vehicle quickly</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Login panel */}
        <section className="auth-form-panel">

          <div className="auth-form-wrapper">

            <div className="auth-mobile-brand">
              <Link href="/" className="auth-brand-logo">
                <span className="auth-brand-mark">D</span>

                <span>
                  <strong>DriveEase</strong>
                  <small>Car Rental Management</small>
                </span>
              </Link>
            </div>

            <div className="auth-heading">
              <span className="auth-eyebrow">
                Account access
              </span>

              <h2>Sign in to DriveEase</h2>

              <p>
                Enter your credentials to continue.
              </p>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                <strong>Login failed</strong>
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="auth-form"
            >

              <div className="auth-field">
                <label htmlFor="email">
                  Email address
                </label>

                <div className="auth-input-wrap">
                  <Mail size={18} />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="password">
                  Password
                </label>

                <div className="auth-input-wrap">
                  <Lock size={18} />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() =>
                      setShowPassword((value) => !value)
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

              <button
                type="submit"
                className="btn btn-primary auth-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="auth-spinner" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

            </form>

            <div className="auth-footer">
              <span>Don't have an account?</span>

              <Link href="/register">
                Create an account
              </Link>
            </div>

            <div className="auth-security">
              <ShieldCheck size={16} />

              <span>
                Your information is securely processed.
              </span>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}

/*
 * IMPORTANT:
 * useSearchParams() is inside LoginContent.
 * LoginContent is rendered inside Suspense.
 */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="auth-page login-page">
          <div className="auth-container">
            <section className="auth-form-panel">
              <div className="auth-form-wrapper">
                <div className="auth-loading">
                  <div className="auth-loading-spinner" />
                  <p>Loading login...</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}