"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CarFront,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordChecks = useMemo(
    () => ({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    }),
    [password]
  );

  const passwordStrength =
    Object.values(passwordChecks).filter(Boolean).length;

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  function getPasswordStrengthText() {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  }

  function validateForm() {
    if (name.trim().length < 2) {
      return "Please enter your full name.";
    }

    if (!email.trim()) {
      return "Please enter your email address.";
    }

    if (
      phone.trim() &&
      !/^[0-9+\-\s()]{7,20}$/.test(phone.trim())
    ) {
      return "Please enter a valid phone number.";
    }

    if (password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (!passwordChecks.uppercase) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!passwordChecks.lowercase) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!passwordChecks.number) {
      return "Password must contain at least one number.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      setSuccess(true);
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
    <main className="register-page">
      <div className="register-shell">

        {/* =================================================
            LEFT BRAND PANEL
            ================================================= */}

        <section className="register-brand-panel">

          <div className="register-brand-content">

            <Link
              href="/"
              className="register-brand"
              aria-label="DriveEase home"
            >
              <span className="register-brand-icon">
                <CarFront size={22} />
              </span>

              <span>DriveEase</span>
            </Link>

            <div className="register-brand-message">

              <span className="register-brand-badge">
                <ShieldCheck size={15} />
                Join DriveEase
              </span>

              <h1>
                Start your journey
                <br />
                with us.
              </h1>

              <p>
                Create your DriveEase account and make
                your car rental experience simpler, faster
                and more organized.
              </p>

              <div className="register-benefits">

                <div>
                  <span>
                    <Check size={14} />
                  </span>

                  <div>
                    <strong>
                      Discover available vehicles
                    </strong>

                    <small>
                      Browse a fleet designed for every journey
                    </small>
                  </div>
                </div>

                <div>
                  <span>
                    <Check size={14} />
                  </span>

                  <div>
                    <strong>
                      Manage your bookings
                    </strong>

                    <small>
                      Keep your reservations organized
                    </small>
                  </div>
                </div>

                <div>
                  <span>
                    <Check size={14} />
                  </span>

                  <div>
                    <strong>
                      Personalized dashboard
                    </strong>

                    <small>
                      Access your rental activity in one place
                    </small>
                  </div>
                </div>

              </div>

            </div>

            <p className="register-brand-footer">
              Simple booking. Better journeys.
            </p>

          </div>

        </section>

        {/* =================================================
            RIGHT FORM PANEL
            ================================================= */}

        <section className="register-form-panel">

          <div className="register-form-container">

            {/* Mobile brand */}

            <div className="register-mobile-brand">

              <Link
                href="/"
                className="register-brand"
              >
                <span className="register-brand-icon">
                  <CarFront size={21} />
                </span>

                <span>DriveEase</span>
              </Link>

            </div>

            {/* =================================================
                SUCCESS
                ================================================= */}

            {success ? (
              <div className="register-success">

                <div className="register-success-icon">
                  <CheckCircle2 size={38} />
                </div>

                <span className="register-success-kicker">
                  REGISTRATION COMPLETE
                </span>

                <h2>
                  Welcome to DriveEase!
                </h2>

                <p>
                  Your account has been created successfully.
                  Sign in to explore vehicles and manage your
                  bookings.
                </p>

                <Link
                  href="/login"
                  className="register-success-button"
                >
                  Continue to Login
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/"
                  className="register-home-link"
                >
                  Back to Home
                </Link>

              </div>
            ) : (
              <>

                {/* Header */}

                <div className="register-form-header">

                  <span className="register-kicker">
                    CREATE ACCOUNT
                  </span>

                  <h2>
                    Join DriveEase
                  </h2>

                  <p>
                    Create your account to start booking
                    your next ride.
                  </p>

                </div>

                {/* Error */}

                {error && (
                  <div
                    className="register-error"
                    role="alert"
                  >
                    <div className="register-error-icon">
                      !
                    </div>

                    <div>
                      <strong>
                        Unable to create account
                      </strong>

                      <p>{error}</p>
                    </div>
                  </div>
                )}

                {/* Form */}

                <form
                  onSubmit={handleSubmit}
                  className="register-form"
                >

                  {/* Name */}

                  <div className="register-field">

                    <label htmlFor="name">
                      Full Name
                    </label>

                    <div className="register-input-wrap">

                      <User
                        size={18}
                        className="register-input-icon"
                        aria-hidden="true"
                      />

                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(event) => {
                          setName(event.target.value);
                          setError("");
                        }}
                        required
                        autoComplete="name"
                        placeholder="Enter your full name"
                        disabled={loading}
                      />

                    </div>

                  </div>

                  {/* Email */}

                  <div className="register-field">

                    <label htmlFor="email">
                      Email Address
                    </label>

                    <div className="register-input-wrap">

                      <Mail
                        size={18}
                        className="register-input-icon"
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

                  {/* Phone */}

                  <div className="register-field">

                    <label htmlFor="phone">
                      Phone Number
                      <span>
                        Optional
                      </span>
                    </label>

                    <div className="register-input-wrap">

                      <Phone
                        size={18}
                        className="register-input-icon"
                        aria-hidden="true"
                      />

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={phone}
                        onChange={(event) => {
                          setPhone(event.target.value);
                          setError("");
                        }}
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        disabled={loading}
                      />

                    </div>

                  </div>

                  {/* Password */}

                  <div className="register-field">

                    <label htmlFor="password">
                      Password
                    </label>

                    <div className="register-input-wrap">

                      <LockKeyhole
                        size={18}
                        className="register-input-icon"
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
                        autoComplete="new-password"
                        placeholder="Create a password"
                        disabled={loading}
                      />

                      <button
                        type="button"
                        className="register-password-toggle"
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

                    {/* Strength */}

                    {password.length > 0 && (
                      <div className="register-strength">

                        <div className="register-strength-bars">
                          {[1, 2, 3, 4].map(
                            (level) => (
                              <span
                                key={level}
                                className={
                                  level <=
                                  passwordStrength
                                    ? "active"
                                    : ""
                                }
                              />
                            )
                          )}
                        </div>

                        <div className="register-strength-label">
                          Password strength:
                          <strong>
                            {getPasswordStrengthText()}
                          </strong>
                        </div>

                      </div>
                    )}

                  </div>

                  {/* Requirements */}

                  {password.length > 0 && (
                    <div className="register-requirements">

                      <p>
                        Password requirements
                      </p>

                      <div>

                        <PasswordRequirement
                          met={passwordChecks.length}
                          text="8+ characters"
                        />

                        <PasswordRequirement
                          met={passwordChecks.uppercase}
                          text="Uppercase letter"
                        />

                        <PasswordRequirement
                          met={passwordChecks.lowercase}
                          text="Lowercase letter"
                        />

                        <PasswordRequirement
                          met={passwordChecks.number}
                          text="One number"
                        />

                      </div>

                    </div>
                  )}

                  {/* Confirm */}

                  <div className="register-field">

                    <label htmlFor="confirmPassword">
                      Confirm Password
                    </label>

                    <div className="register-input-wrap">

                      <LockKeyhole
                        size={18}
                        className="register-input-icon"
                        aria-hidden="true"
                      />

                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(
                            event.target.value
                          )
                        }
                        required
                        autoComplete="new-password"
                        placeholder="Confirm your password"
                        disabled={loading}
                        className={
                          confirmPassword.length > 0
                            ? passwordsMatch
                              ? "password-valid"
                              : "password-invalid"
                            : ""
                        }
                      />

                      <button
                        type="button"
                        className="register-password-toggle"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        disabled={loading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>

                    </div>

                    {confirmPassword.length > 0 && (
                      <p
                        className={`register-match ${
                          passwordsMatch
                            ? "match"
                            : "no-match"
                        }`}
                      >
                        {passwordsMatch ? (
                          <Check size={14} />
                        ) : (
                          <X size={14} />
                        )}

                        {passwordsMatch
                          ? "Passwords match"
                          : "Passwords do not match"}
                      </p>
                    )}

                  </div>

                  {/* Submit */}

                  <button
                    type="submit"
                    className="register-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="register-spinner" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                </form>

                {/* Login */}

                <div className="register-login">

                  <span>
                    Already have an account?
                  </span>

                  <Link href="/login">
                    Sign in
                  </Link>

                </div>

                {/* Security */}

                <div className="register-security">

                  <ShieldCheck size={15} />

                  <span>
                    Your account information is securely handled.
                  </span>

                </div>

              </>
            )}

          </div>

        </section>

      </div>
    </main>
  );
}

function PasswordRequirement({
  met,
  text,
}: {
  met: boolean;
  text: string;
}) {
  return (
    <div className="register-requirement">

      <span className={met ? "met" : ""}>
        {met ? (
          <Check size={10} />
        ) : (
          <span className="requirement-dot" />
        )}
      </span>

      <span className={met ? "requirement-met" : ""}>
        {text}
      </span>

    </div>
  );
}