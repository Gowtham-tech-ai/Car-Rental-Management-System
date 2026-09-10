import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  Fuel,
  MapPin,
  ShieldCheck,
  Settings2,
  Sparkles,
  Users,
} from "lucide-react";

import { getCarById } from "@/lib/api";

type CarDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CarDetailsPage({
  params,
}: CarDetailsPageProps) {
  const { id } = await params;

  const car = await getCarById(id);

  if (!car) {
    return (
      <section className="section">
        <div className="container car-not-found">
          <div className="car-not-found-icon">
            <MapPin size={28} />
          </div>

          <span className="eyebrow dark">
            VEHICLE NOT FOUND
          </span>

          <h1>We couldn't find that car.</h1>

          <p>
            The vehicle you are looking for may have been removed
            or is no longer available.
          </p>

          <Link href="/cars" className="btn btn-primary">
            <ArrowLeft size={17} />
            Back to Fleet
          </Link>
        </div>
      </section>
    );
  }

  const features =
    Array.isArray(car.features)
      ? car.features
      : typeof car.features === "string"
        ? (() => {
            try {
              const parsed = JSON.parse(car.features);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          })()
        : [];

  const isAvailable = car.status === "available";

  return (
    <section className="section car-details-section">
      <div className="container">

        {/* Back navigation */}
        <Link href="/cars" className="back-link">
          <ArrowLeft size={17} />
          Back to Fleet
        </Link>

        {/* Main vehicle card */}
        <div className="car-details">

          {/* Image */}
          <div className="car-details-image-wrap">
            <img
              src={car.image_url}
              alt={`${car.brand} ${car.model}`}
              className="car-details-image"
            />

            <div className="car-image-overlay">
              <span
                className={`availability ${
                  isAvailable
                    ? "details-availability"
                    : "details-unavailable"
                }`}
              >
                <span className="availability-dot" />
                {isAvailable
                  ? "Available for booking"
                  : "Currently unavailable"}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="car-details-content">

            <div className="car-details-topline">
              <span className="car-category">
                {car.category}
              </span>

              <span className="car-location-label">
                <MapPin size={14} />
                {car.location}
              </span>
            </div>

            <h1>
              {car.brand} {car.model}
            </h1>

            <p className="car-description">
              Enjoy a comfortable and reliable driving experience
              with this well-maintained {car.brand} {car.model}.
              Perfect for city trips, business travel and longer
              journeys.
            </p>

            {/* Price */}
            <div className="details-price-box">
              <div>
                <span className="price-label">
                  Starting from
                </span>

                <div className="details-price">
                  ₹{Number(car.price).toLocaleString("en-IN")}
                  <span>/ day</span>
                </div>
              </div>

              <span className="price-note">
                Transparent pricing
              </span>
            </div>

            {/* Specifications */}
            <div className="details-meta">

              <div className="details-meta-item">
                <div className="details-meta-icon">
                  <Users size={19} />
                </div>

                <span>
                  <strong>{car.seats}</strong>
                  Seats
                </span>
              </div>

              <div className="details-meta-item">
                <div className="details-meta-icon">
                  <Settings2 size={19} />
                </div>

                <span>
                  <strong>{car.transmission}</strong>
                  Transmission
                </span>
              </div>

              <div className="details-meta-item">
                <div className="details-meta-icon">
                  <Fuel size={19} />
                </div>

                <span>
                  <strong>{car.fuel}</strong>
                  Fuel
                </span>
              </div>

              <div className="details-meta-item">
                <div className="details-meta-icon">
                  <MapPin size={19} />
                </div>

                <span>
                  <strong>{car.location}</strong>
                  Pickup location
                </span>
              </div>

            </div>

            {/* Features */}
            <div className="features-box">
              <div className="features-heading">
                <div>
                  <span className="eyebrow dark">
                    <Sparkles size={14} />
                    VEHICLE DETAILS
                  </span>

                  <h3>What's included</h3>
                </div>

                <ShieldCheck size={22} />
              </div>

              {features.length > 0 ? (
                <div className="features-list">
                  {features.map((feature: string) => (
                    <div key={feature}>
                      <Check size={17} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="features-empty">
                  Standard vehicle features are included with this
                  rental.
                </p>
              )}
            </div>

            {/* Booking */}
            {isAvailable ? (
              <Link
                href={`/booking?carId=${car.id}`}
                className="btn btn-large booking-btn"
              >
                <CalendarCheck size={19} />
                Book This Car
                <ArrowRight size={18} />
              </Link>
            ) : (
              <button
                type="button"
                className="btn btn-large booking-btn"
                disabled
              >
                Currently Unavailable
              </button>
            )}

            <div className="booking-trust">
              <ShieldCheck size={16} />

              <span>
                Secure booking • Transparent pricing • No hidden fees
              </span>
            </div>

          </div>
        </div>

        {/* Bottom reassurance */}
        <div className="details-reassurance">
          <div>
            <ShieldCheck size={21} />

            <div>
              <strong>Verified vehicle</strong>
              <span>Maintained and checked before rental</span>
            </div>
          </div>

          <div>
            <CalendarCheck size={21} />

            <div>
              <strong>Simple booking</strong>
              <span>Reserve your vehicle in just a few steps</span>
            </div>
          </div>

          <div>
            <MapPin size={21} />

            <div>
              <strong>Convenient pickup</strong>
              <span>Pickup location shown before booking</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}