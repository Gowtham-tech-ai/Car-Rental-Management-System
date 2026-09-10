"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  CarFront,
  CheckCircle2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";

import CarCard from "@/components/CarCard";
import { getCars } from "@/lib/api";
import type { Car } from "@/lib/data";

type CarStatus =
  | "available"
  | "booked"
  | "maintenance"
  | "inactive";

type ApiCar = Omit<Car, "image"> & {
  image_url: string;
  description?: string | null;
  status: CarStatus;
};

type DisplayCar = Car & {
  status: CarStatus;
};



export default function HomePage() {
  const [cars, setCars] = useState<DisplayCar[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [carsError, setCarsError] = useState("");

  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoadingCars(true);
        setCarsError("");

        const data = (await getCars()) as ApiCar[];

        const activeCars: DisplayCar[] = data
          .filter((car) => car.status !== "inactive")
          .map((car) => ({
            ...car,
            image: car.image_url,
          }));

        setCars(activeCars);
      } catch (error) {
        console.error("Failed to load featured cars:", error);
        setCarsError("Unable to load our featured cars right now.");
      } finally {
        setLoadingCars(false);
      }
    };

    loadCars();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (pickupDate && returnDate && returnDate < pickupDate) {
      alert("Return date cannot be earlier than pickup date.");
      return;
    }

    const params = new URLSearchParams();

    if (pickupLocation.trim()) {
      params.set("location", pickupLocation.trim());
    }

    if (pickupDate) {
      params.set("pickup", pickupDate);
    }

    if (returnDate) {
      params.set("return", returnDate);
    }

    const query = params.toString();

    window.location.href = query ? `/cars?${query}` : "/cars";
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="hero">
        <div className="hero-overlay" />

        <div className="container hero-content">
          <div className="eyebrow">
            <Sparkles size={15} />
            PREMIUM MOBILITY
          </div>

          <h1>
            Find your perfect car.
            <br />
            <span>Drive without limits.</span>
          </h1>

          <p>
            Discover reliable vehicles, transparent pricing and a
            seamless online rental experience built around your journey.
          </p>

          <div className="hero-actions">
            <Link href="/cars" className="btn btn-primary">
              Explore Cars
              <ArrowRight size={18} />
            </Link>

            <Link href="/about" className="btn btn-ghost">
              How It Works
            </Link>
          </div>

          <div className="hero-trust">
            <span>
              <ShieldCheck size={17} />
              Verified vehicles
            </span>

            <span>
              <Zap size={17} />
              Easy booking
            </span>

            <span>
              <Star size={17} />
              Customer focused
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK SEARCH
      ====================================================== */}
      <section className="section home-search-section">
        <div className="container">
          <div className="home-search-card">
            <div className="home-search-heading">
              <div>
                <span className="eyebrow dark">
                  <Search size={15} />
                  FIND YOUR RIDE
                </span>

                <h2>Find a car for your journey</h2>

                <p>
                  Choose your location and rental dates to discover
                  available vehicles.
                </p>
              </div>

              <div className="home-search-badge">
                <CheckCircle2 size={16} />
                Simple & secure
              </div>
            </div>

            <form
              onSubmit={handleSearch}
              className="home-search-form"
            >
              {/* Location */}
              <div className="home-search-field">
                <label htmlFor="pickup-location">
                  Pickup Location
                </label>

                <div className="home-input-wrapper">
                  <MapPin size={18} />

                  <input
                    id="pickup-location"
                    type="text"
                    placeholder="e.g. Hyderabad"
                    value={pickupLocation}
                    onChange={(e) =>
                      setPickupLocation(e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Pickup Date */}
              <div className="home-search-field">
                <label htmlFor="pickup-date">
                  Pickup Date
                </label>

                <div className="home-input-wrapper">
                  <CalendarCheck size={18} />

                  <input
                    id="pickup-date"
                    type="date"
                    value={pickupDate}
                    min={today}
                    onChange={(e) =>
                      setPickupDate(e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Return Date */}
              <div className="home-search-field">
                <label htmlFor="return-date">
                  Return Date
                </label>

                <div className="home-input-wrapper">
                  <CalendarCheck size={18} />

                  <input
                    id="return-date"
                    type="date"
                    value={returnDate}
                    min={pickupDate || today}
                    onChange={(e) =>
                      setReturnDate(e.target.value)
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary home-search-button"
              >
                <Search size={18} />
                Search Cars
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED CARS
      ====================================================== */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow dark">OUR FLEET</span>

              <h2>Featured cars</h2>

              <p>
                Choose from city-friendly sedans, spacious SUVs and
                premium models for every kind of journey.
              </p>
            </div>

            <Link href="/cars" className="text-link">
              View all cars
              <ArrowRight size={17} />
            </Link>
          </div>

          {/* Loading */}
          {loadingCars && (
            <div className="car-grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="car-card home-car-skeleton" key={index}>
                  <div className="home-skeleton-image" />

                  <div className="home-skeleton-content">
                    <div className="home-skeleton-line large" />
                    <div className="home-skeleton-line small" />
                    <div className="home-skeleton-line medium" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loadingCars && carsError && (
            <div className="home-state-card">
              <div className="step-icon">
                <CarFront size={25} />
              </div>

              <h3>We couldn't load the fleet</h3>

              <p>{carsError}</p>

              <Link href="/cars" className="btn btn-primary">
                Browse Cars
                <ArrowRight size={17} />
              </Link>
            </div>
          )}

          {/* Cars */}
          {!loadingCars && !carsError && cars.length > 0 && (
            <>
              <div className="car-grid">
                {cars.slice(0, 6).map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>

              <div className="home-fleet-footer">
                <span>
                  Showing {Math.min(cars.length, 6)} of {cars.length}{" "}
                  available vehicles
                </span>

                <Link href="/cars" className="text-link">
                  Explore complete fleet
                  <ArrowRight size={17} />
                </Link>
              </div>
            </>
          )}

          {/* Empty */}
          {!loadingCars && !carsError && cars.length === 0 && (
            <div className="home-state-card">
              <div className="step-icon">
                <CarFront size={25} />
              </div>

              <h3>No cars available right now</h3>

              <p>
                Please check our fleet again shortly.
              </p>

              <Link href="/cars" className="btn btn-primary">
                View Fleet
                <ArrowRight size={17} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          TRUST STATISTICS
      ====================================================== */}
      <section className="section">
        <div className="container">
          <div className="section-head centered">
            <div>
              <span className="eyebrow dark">
                DRIVEEASE AT A GLANCE
              </span>

              <h2>Built around a better rental experience</h2>

              <p>
                Everything you need to find, book and manage your
                rental car in one place.
              </p>
            </div>
          </div>

          <div className="home-stat-grid">
            <div className="home-stat-card">
              <div className="step-icon">
                <CarFront size={27} />
              </div>

              <strong>25+</strong>

              <h3>Vehicles</h3>

              <p>
                A growing fleet across multiple categories.
              </p>
            </div>

            <div className="home-stat-card">
              <div className="step-icon">
                <CalendarCheck size={27} />
              </div>

              <strong>Easy</strong>

              <h3>Online Booking</h3>

              <p>
                Reserve your vehicle through a simple process.
              </p>
            </div>

            <div className="home-stat-card">
              <div className="step-icon">
                <ShieldCheck size={27} />
              </div>

              <strong>Secure</strong>

              <h3>Protected</h3>

              <p>
                Secure accounts and protected booking data.
              </p>
            </div>

            <div className="home-stat-card">
              <div className="step-icon">
                <Users size={27} />
              </div>

              <strong>Customer</strong>

              <h3>Focused</h3>

              <p>
                Designed to make every rental straightforward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY DRIVEEASE
      ====================================================== */}
      <section className="section section-muted">
        <div className="container">
          <div className="section-head centered">
            <div>
              <span className="eyebrow dark">
                WHY DRIVEEASE
              </span>

              <h2>Everything you need to drive better</h2>

              <p>
                A modern rental experience designed for convenience,
                flexibility and confidence.
              </p>
            </div>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-icon">
                <ShieldCheck size={28} />
              </div>

              <h3>Verified Vehicles</h3>

              <p>
                Every vehicle in our fleet is maintained and checked
                before rental.
              </p>
            </div>

            <div className="step">
              <div className="step-icon">
                <CalendarCheck size={28} />
              </div>

              <h3>Easy Booking</h3>

              <p>
                Choose your car and dates with a simple browser-based
                booking experience.
              </p>
            </div>

            <div className="step">
              <div className="step-icon">
                <Zap size={28} />
              </div>

              <h3>Fast & Flexible</h3>

              <p>
                Manage reservations, view history and access your
                account from anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}
      <section className="section">
        <div className="container">
          <div className="section-head centered">
            <div>
              <span className="eyebrow dark">
                SIMPLE PROCESS
              </span>

              <h2>Book in three simple steps</h2>

              <p>
                From choosing your vehicle to starting your journey,
                DriveEase keeps the process simple.
              </p>
            </div>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-icon">01</div>

              <h3>Choose a car</h3>

              <p>
                Search our fleet and select the vehicle that matches
                your journey.
              </p>
            </div>

            <div className="step">
              <div className="step-icon">02</div>

              <h3>Pick your dates</h3>

              <p>
                Select pickup and return dates and complete your
                reservation.
              </p>
            </div>

            <div className="step">
              <div className="step-icon">03</div>

              <h3>Start your journey</h3>

              <p>
                Receive your booking confirmation and enjoy the drive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}
      <section className="section">
        <div className="container">
          <div className="cta home-final-cta">
            <div>
              <span className="eyebrow dark">
                READY TO DRIVE?
              </span>

              <h2>Your next journey starts here.</h2>

              <p>
                Browse our curated fleet and reserve your favorite
                car in minutes.
              </p>

              <div className="home-cta-points">
                <span>
                  <CheckCircle2 size={16} />
                  Transparent pricing
                </span>

                <span>
                  <CheckCircle2 size={16} />
                  Easy online booking
                </span>

                <span>
                  <CheckCircle2 size={16} />
                  Flexible vehicle choices
                </span>
              </div>
            </div>

            <Link href="/cars" className="btn btn-dark">
              Browse Fleet
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}