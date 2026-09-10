"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Fuel,
  MapPin,
  ShieldCheck,
  Settings2,
  Users,
  AlertCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  createBooking,
  getCarById,
} from "@/lib/api";

function BookingContent() {
  const searchParams = useSearchParams();

  const carId = Number(searchParams.get("carId"));

  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const [pickupDate, setPickupDate] = useState(today);
  const [returnDate, setReturnDate] = useState(today);
  const [location, setLocation] = useState("Hyderabad");

  /* =========================================================
     LOAD CAR
     ========================================================= */

  useEffect(() => {
    const loadCar = async () => {
      try {
        const data = await getCarById(String(carId));
        setCar(data);
      } catch (error) {
        console.error("Failed to load car:", error);
        setCar(null);
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      loadCar();
    } else {
      setLoading(false);
    }
  }, [carId]);

  /* =========================================================
     RENTAL DAYS
     ========================================================= */

  const rentalDays = useMemo(() => {
    if (!pickupDate || !returnDate) {
      return 0;
    }

    const start = new Date(pickupDate);
    const end = new Date(returnDate);

    const difference = end.getTime() - start.getTime();

    if (difference <= 0) {
      return 0;
    }

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  }, [pickupDate, returnDate]);

  /* =========================================================
     PRICE
     ========================================================= */

  const dailyRate = car ? Number(car.price) : 0;

  const totalPrice = dailyRate * rentalDays;

  /* =========================================================
     BOOKING
     ========================================================= */

  const handleBooking = async () => {
    setBookingError("");
    setBookingSuccess("");

    try {
      const token = localStorage.getItem("driveease_token");

      if (!token) {
        window.location.href =
          `/login?redirect=/booking?carId=${car.id}`;

        return;
      }

      if (rentalDays <= 0) {
        setBookingError(
          "Please select a valid pickup and return date."
        );

        return;
      }

      if (new Date(pickupDate) < new Date(today)) {
        setBookingError(
          "Pickup date cannot be in the past."
        );

        return;
      }

      setBookingLoading(true);

      const result = await createBooking({
        car_id: car.id,
        pickup_location: location,
        pickup_date: pickupDate,
        return_date: returnDate,
      });

      setBookingSuccess(
        `Booking created successfully! Booking Reference: ${result.booking.booking_reference}`
      );

      alert(
        `Booking created successfully!\n\nBooking Reference: ${result.booking.booking_reference}`
      );
    } catch (error) {
      console.error("Booking error:", error);

      if (
        error instanceof Error &&
        error.message.includes("already booked")
      ) {
        setBookingError(
          "This car is already booked for the selected dates. Please choose different dates or select another vehicle."
        );

        return;
      }

      setBookingError(
        error instanceof Error
          ? error.message
          : "Failed to create booking. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <section className="section booking-section">
        <div className="container booking-loading">

          <div className="booking-loading-card">
            <div className="booking-loading-image" />

            <div className="booking-loading-lines">
              <span />
              <span />
              <span />
            </div>
          </div>

          <p>Preparing your booking...</p>

        </div>
      </section>
    );
  }

  /* =========================================================
     NOT FOUND
     ========================================================= */

  if (!car) {
    return (
      <section className="section">
        <div className="container not-found">
          <div className="car-not-found-icon">
            <MapPin size={27} />
          </div>

          <span className="eyebrow dark">
            BOOKING ERROR
          </span>

          <h1>Vehicle not found</h1>

          <p>
            Please select a valid vehicle before continuing
            with your booking.
          </p>

          <Link href="/cars" className="btn btn-primary">
            <ArrowLeft size={17} />
            Browse Fleet
          </Link>
        </div>
      </section>
    );
  }

  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <section className="section booking-section">
      <div className="container">

        {/* BACK */}
        <Link href={`/cars/${car.id}`} className="back-link">
          <ArrowLeft size={17} />
          Back to Vehicle
        </Link>

        {/* HEADING */}
        <div className="booking-heading">

          <span className="eyebrow">
            RESERVE YOUR VEHICLE
          </span>

          <h1>
            Complete your booking
          </h1>

          <p>
            Choose your pickup location and rental dates.
            Your booking details will be reviewed before payment.
          </p>

        </div>

        <div className="booking-layout">

          {/* =================================================
              LEFT COLUMN
              ================================================= */}

          <div className="booking-form-card">

            {/* SELECTED CAR */}
            <div className="selected-car">

              <div className="selected-car-image">
                <img
                  src={car.image_url}
                  alt={`${car.brand} ${car.model}`}
                />
              </div>

              <div className="selected-car-info">

                <div className="selected-car-category">
                  {car.category}
                </div>

                <h2>
                  {car.brand} {car.model}
                </h2>

                <div className="selected-car-specs">

                  <span>
                    <Users size={14} />
                    {car.seats}
                  </span>

                  <span>
                    <Settings2 size={14} />
                    {car.transmission}
                  </span>

                  <span>
                    <Fuel size={14} />
                    {car.fuel}
                  </span>

                </div>

              </div>

              <div className="selected-car-rate">
                <span>From</span>

                <strong>
                  ₹{dailyRate.toLocaleString("en-IN")}
                </strong>

                <small>/day</small>
              </div>

            </div>

            <div className="booking-divider" />

            {/* RENTAL DETAILS */}
            <div className="form-section">

              <div className="form-section-heading">
                <div>
                  <span className="step-number">
                    01
                  </span>

                  <div>
                    <h3>Rental details</h3>
                    <p>
                      Tell us when and where you need the vehicle.
                    </p>
                  </div>
                </div>
              </div>

              {/* LOCATION */}
              <div className="form-group">

                <label htmlFor="location">
                  <MapPin size={16} />
                  Pickup Location
                </label>

                <select
                  id="location"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setBookingError("");
                  }}
                >
                  <option value="Hyderabad">
                    Hyderabad
                  </option>

                  <option value="Bengaluru">
                    Bengaluru
                  </option>

                  <option value="Chennai">
                    Chennai
                  </option>

                  <option value="Mumbai">
                    Mumbai
                  </option>

                  <option value="Delhi">
                    Delhi
                  </option>
                </select>

              </div>

              {/* DATES */}
              <div className="date-grid">

                <div className="form-group">

                  <label htmlFor="pickup">
                    <CalendarDays size={16} />
                    Pickup Date
                  </label>

                  <input
                    id="pickup"
                    type="date"
                    min={today}
                    value={pickupDate}
                    onChange={(e) => {
                      const value = e.target.value;

                      setPickupDate(value);
                      setBookingError("");

                      if (value > returnDate) {
                        setReturnDate(value);
                      }
                    }}
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="return">
                    <CalendarDays size={16} />
                    Return Date
                  </label>

                  <input
                    id="return"
                    type="date"
                    min={pickupDate || today}
                    value={returnDate}
                    onChange={(e) => {
                      setReturnDate(e.target.value);
                      setBookingError("");
                    }}
                  />

                </div>

              </div>

              {/* RENTAL DURATION */}
              <div className="rental-duration">

                <Clock3 size={18} />

                <div>
                  <strong>
                    {rentalDays > 0
                      ? `${rentalDays} rental ${
                          rentalDays === 1
                            ? "day"
                            : "days"
                        }`
                      : "Select your rental dates"}
                  </strong>

                  <span>
                    {rentalDays > 0
                      ? "Your total rental duration"
                      : "Choose a pickup and return date"}
                  </span>
                </div>

              </div>

            </div>

            {/* SECURITY */}
            <div className="security-note">

              <div className="security-icon">
                <ShieldCheck size={20} />
              </div>

              <div>
                <strong>
                  Secure booking
                </strong>

                <p>
                  Your booking information is protected
                  and securely processed.
                </p>
              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT COLUMN
              ================================================= */}

          <aside className="booking-summary">

            <div className="summary-heading">

              <div>
                <span className="eyebrow dark">
                  YOUR RESERVATION
                </span>

                <h2>
                  Booking Summary
                </h2>
              </div>

              <CheckCircle2 size={22} />

            </div>

            {/* CAR */}
            <div className="summary-car">

              <img
                src={car.image_url}
                alt={`${car.brand} ${car.model}`}
              />

              <div>
                <strong>
                  {car.brand} {car.model}
                </strong>

                <span>
                  <MapPin size={13} />
                  {location}
                </span>
              </div>

            </div>

            <div className="summary-divider" />

            {/* DAILY RATE */}
            <div className="summary-line">
              <span>Daily rate</span>

              <strong>
                ₹{dailyRate.toLocaleString("en-IN")}
              </strong>
            </div>

            {/* DAYS */}
            <div className="summary-line">
              <span>Rental duration</span>

              <strong>
                {rentalDays > 0
                  ? `${rentalDays} ${
                      rentalDays === 1
                        ? "day"
                        : "days"
                    }`
                  : "—"}
              </strong>
            </div>

            {/* PICKUP */}
            <div className="summary-line">
              <span>Pickup</span>

              <strong>
                {pickupDate || "—"}
              </strong>
            </div>

            {/* RETURN */}
            <div className="summary-line">
              <span>Return</span>

              <strong>
                {returnDate || "—"}
              </strong>
            </div>

            {/* TOTAL */}
            <div className="summary-total">

              <div>
                <span>Total rental</span>

                <small>
                  {rentalDays > 0
                    ? `${rentalDays} × ₹${dailyRate.toLocaleString(
                        "en-IN"
                      )}`
                    : "Select dates to calculate"}
                </small>
              </div>

              <strong>
                ₹{totalPrice.toLocaleString("en-IN")}
              </strong>

            </div>

            {/* ERROR */}
            {bookingError && (
              <div
                className="booking-error-message"
                role="alert"
              >
                <AlertCircle size={20} />

                <div>
                  <strong>
                    Booking unavailable
                  </strong>

                  <p>
                    {bookingError}
                  </p>
                </div>
              </div>
            )}

            {/* SUCCESS */}
            {bookingSuccess && (
              <div
                className="booking-success-message"
                role="status"
              >
                <CheckCircle2 size={20} />

                <div>
                  <strong>
                    Booking confirmed
                  </strong>

                  <p>
                    {bookingSuccess}
                  </p>
                </div>
              </div>
            )}

            {/* BUTTON */}
            <button
              type="button"
              className="btn btn-large booking-btn"
              disabled={
                rentalDays <= 0 ||
                bookingLoading ||
                Boolean(bookingSuccess)
              }
              onClick={handleBooking}
            >
              {bookingLoading ? (
                <>
                  <span className="button-spinner" />
                  Creating Booking...
                </>
              ) : bookingSuccess ? (
                <>
                  <CheckCircle2 size={18} />
                  Booking Created
                </>
              ) : (
                <>
                  Continue Booking
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="summary-footer">

              <ShieldCheck size={15} />

              <span>
                Secure reservation • No hidden booking fees
              </span>

            </div>

          </aside>

        </div>

      </div>
    </section>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <main className="booking-page">
          <div className="booking-container">
            <div className="booking-loading-card">
              <div className="booking-skeleton booking-skeleton-title" />
              <div className="booking-skeleton booking-skeleton-line" />
              <div className="booking-skeleton booking-skeleton-line" />
              <div className="booking-skeleton booking-skeleton-box" />
            </div>
          </div>
        </main>
      }
    >
      <BookingContent />
    </Suspense>
  );
}