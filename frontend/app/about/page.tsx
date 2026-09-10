"use client";

import Link from "next/link";
import {
  ArrowRight,
  Car,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  WalletCards,
} from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Verified Vehicles",
    description:
      "Choose from a carefully organized fleet with clear vehicle information and essential specifications.",
  },
  {
    icon: WalletCards,
    title: "Transparent Pricing",
    description:
      "See the daily rental rate and booking cost clearly before confirming your reservation.",
  },
  {
    icon: Clock3,
    title: "Easy Booking",
    description:
      "Find your preferred vehicle, select your dates, and complete your booking through a simple process.",
  },
  {
    icon: Users,
    title: "Customer Focused",
    description:
      "DriveEase is designed around a smooth rental experience for customers and efficient management for administrators.",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose Your Car",
    description:
      "Browse the available fleet and select a vehicle that matches your requirements.",
  },
  {
    number: "02",
    title: "Select Your Dates",
    description:
      "Enter your pickup location and rental dates to plan your journey.",
  },
  {
    number: "03",
    title: "Confirm Booking",
    description:
      "Review your booking details and submit your reservation securely.",
  },
  {
    number: "04",
    title: "Enjoy Your Journey",
    description:
      "Get on the road with a vehicle that fits your travel needs.",
  },
];

const highlights = [
  "Organized vehicle management",
  "Online booking system",
  "Customer dashboard",
  "Secure authentication",
  "Booking availability validation",
  "Dedicated admin management",
];

export default function AboutPage() {
  return (
    <main className="de-about-page">
      <section className="de-about-hero">
        <div className="de-about-hero-glow de-glow-one" />
        <div className="de-about-hero-glow de-glow-two" />

        <div className="de-about-container de-about-hero-inner">
          <div className="de-about-hero-content">
            <div className="de-about-eyebrow-pill">
              <Sparkles size={15} />
              About DriveEase
            </div>

            <h1>
              Making car rental{" "}
              <span>simple and convenient.</span>
            </h1>

            <p>
              DriveEase is a modern car rental management platform designed to
              make discovering vehicles, checking availability, and managing
              bookings easier for customers and administrators.
            </p>

            <div className="de-about-actions">
              <Link href="/cars" className="de-about-primary-btn">
                Explore Our Fleet
                <ArrowRight size={17} />
              </Link>
              <Link href="/contact" className="de-about-secondary-btn">
                Contact Us
              </Link>
            </div>

            <div className="de-about-trust-row">
              <div>
                <ShieldCheck size={17} />
                Secure authentication
              </div>
              <div>
                <CheckCircle2 size={17} />
                Availability validation
              </div>
            </div>
          </div>

          <div className="de-about-hero-visual">
            <div className="de-visual-card de-visual-main">
              <div className="de-visual-top">
                <span className="de-visual-label">DRIVEEASE</span>
                <span className="de-visual-status">
                  <span />
                  Available
                </span>
              </div>
              <div className="de-visual-car">
                <Car size={88} strokeWidth={1.2} />
              </div>
              <div className="de-visual-info">
                <div>
                  <span>RENTAL PLATFORM</span>
                  <strong>Built around simplicity</strong>
                </div>
                <div className="de-visual-rate">
                  <small>FLEET</small>
                  <strong>25+</strong>
                </div>
              </div>
            </div>

            <div className="de-floating-card de-floating-one">
              <CheckCircle2 size={18} />
              <div>
                <strong>Easy Booking</strong>
                <span>Simple reservation flow</span>
              </div>
            </div>

            <div className="de-floating-card de-floating-two">
              <MapPin size={18} />
              <div>
                <strong>Flexible Pickup</strong>
                <span>Choose your location</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="de-about-section de-who-section">
        <div className="de-about-container de-two-column">
          <div className="de-section-copy">
            <span className="de-section-label">WHO WE ARE</span>
            <h2>A smarter way to manage car rentals</h2>
            <p>
              DriveEase brings the important parts of a car rental experience
              together in one platform. Customers can explore vehicles,
              compare their details, choose rental dates, and manage their
              bookings from a dedicated dashboard.
            </p>
            <p>
              Behind the scenes, administrators can manage vehicles, monitor
              bookings, and manage customer accounts through a dedicated
              administration system.
            </p>

            <div className="de-inline-feature">
              <div className="de-inline-icon">
                <Car size={22} />
              </div>
              <div>
                <strong>Built for a better rental experience</strong>
                <span>Simple, organized and customer-focused.</span>
              </div>
            </div>
          </div>

          <div className="de-fact-panel">
            <div className="de-fact-grid">
              <div className="de-fact-card">
                <Car size={22} />
                <strong>25+</strong>
                <span>Vehicles in the fleet</span>
              </div>
              <div className="de-fact-card">
                <Users size={22} />
                <strong>Customer</strong>
                <span>Focused experience</span>
              </div>
              <div className="de-fact-card">
                <MapPin size={22} />
                <strong>Flexible</strong>
                <span>Pickup location support</span>
              </div>
              <div className="de-fact-card">
                <ShieldCheck size={22} />
                <strong>Secure</strong>
                <span>Account authentication</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="de-about-story">
        <div className="de-about-container de-centered-copy">
          <span className="de-section-label">OUR STORY</span>
          <h2>Designed around simplicity</h2>
          <p>
            Traditional rental processes can involve multiple steps and
            disconnected information. DriveEase aims to bring those
            interactions into a single digital experience where customers can
            discover vehicles and manage their reservations with less friction.
          </p>
          <p>
            The platform combines a customer-facing rental experience with
            administrative tools, creating a structured solution for managing
            the complete booking lifecycle.
          </p>
        </div>
      </section>

      <section className="de-about-section">
        <div className="de-about-container de-mission-grid">
          <article className="de-mission-card">
            <div className="de-mission-icon">
              <Target size={25} />
            </div>
            <span className="de-card-kicker">PURPOSE</span>
            <h2>Our Mission</h2>
            <p>
              To provide a straightforward and reliable digital platform that
              simplifies vehicle discovery, booking, and rental management.
            </p>
          </article>

          <article className="de-mission-card">
            <div className="de-mission-icon de-vision-icon">
              <Sparkles size={25} />
            </div>
            <span className="de-card-kicker">DIRECTION</span>
            <h2>Our Vision</h2>
            <p>
              To create a modern car rental ecosystem where technology makes
              transportation more accessible, organized, and convenient.
            </p>
          </article>
        </div>
      </section>

      <section className="de-about-benefits">
        <div className="de-about-container">
          <div className="de-centered-copy de-benefits-heading">
            <span className="de-section-label">WHY CHOOSE DRIVE EASE</span>
            <h2>Everything you need for a smoother rental journey</h2>
            <p>
              A focused platform built to keep the rental process clear and
              convenient.
            </p>
          </div>

          <div className="de-benefits-grid">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article className="de-benefit-card" key={benefit.title}>
                  <div className="de-benefit-icon">
                    <Icon size={22} />
                  </div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="de-about-section">
        <div className="de-about-container">
          <div className="de-centered-copy">
            <span className="de-section-label">HOW IT WORKS</span>
            <h2>Four simple steps</h2>
          </div>

          <div className="de-steps-grid">
            {steps.map((step) => (
              <article className="de-step-card" key={step.number}>
                <span className="de-step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="de-about-highlights">
        <div className="de-about-container de-two-column de-highlight-layout">
          <div className="de-section-copy">
            <span className="de-section-label">PLATFORM HIGHLIGHTS</span>
            <h2>More than just a car listing website</h2>
            <p>
              DriveEase combines customer-facing features with backend
              management capabilities to create a complete car rental
              management solution.
            </p>
          </div>

          <div className="de-highlight-grid">
            {highlights.map((highlight) => (
              <div className="de-highlight-item" key={highlight}>
                <CheckCircle2 size={18} />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="de-about-container de-about-cta-section">
        <div className="de-about-cta">
          <div>
            <span className="de-cta-kicker">START YOUR JOURNEY</span>
            <h2>Ready to find your next ride?</h2>
            <p>
              Explore available vehicles and start your booking journey with
              DriveEase.
            </p>
          </div>

          <div className="de-about-actions de-cta-actions">
            <Link href="/cars" className="de-cta-light-btn">
              Browse Cars
              <ArrowRight size={17} />
            </Link>
            <Link href="/register" className="de-cta-outline-btn">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
