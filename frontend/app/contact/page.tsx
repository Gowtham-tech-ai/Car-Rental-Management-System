"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero-glow contact-hero-glow-one" />
        <div className="contact-hero-glow contact-hero-glow-two" />

        <div className="contact-container contact-hero-inner">
          <div className="contact-hero-copy">
            <div className="contact-eyebrow">
              <MessageSquare size={16} />
              <span>DriveEase Support</span>
            </div>

            <h1>
              Let&apos;s make your
              <span> journey easier.</span>
            </h1>

            <p>
              Have a question about a vehicle, booking, or the DriveEase
              platform? Our support team is ready to help you get moving.
            </p>

            <div className="contact-hero-points">
              <div>
                <CheckCircle2 size={17} />
                <span>Friendly customer support</span>
              </div>
              <div>
                <CheckCircle2 size={17} />
                <span>Fast booking assistance</span>
              </div>
              <div>
                <CheckCircle2 size={17} />
                <span>Secure &amp; reliable service</span>
              </div>
            </div>
          </div>

          <div className="contact-hero-card">
            <div className="contact-hero-card-icon">
              <Sparkles size={22} />
            </div>
            <p className="contact-hero-card-label">Need assistance?</p>
            <h2>We&apos;re one message away.</h2>
            <p>
              Tell us what you need and we&apos;ll help you find the right
              next step.
            </p>

            <a href="#contact-form" className="contact-primary-button">
              Contact Support
              <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      {/* Contact information + form */}
      <section className="contact-section">
        <div className="contact-container contact-main-grid">
          <div className="contact-info-column">
            <div className="contact-section-label">Contact Information</div>

            <h2>We&apos;re here when you need us.</h2>

            <p className="contact-intro">
              Whether you need help with a booking or simply want to learn
              more about DriveEase, choose the support channel that works
              best for you.
            </p>

            <div className="contact-info-list">
              <ContactInfoCard
                icon={<Phone size={20} />}
                title="Phone"
                value="+91 90000 00000"
                detail="Mon - Sat, 9:00 AM - 7:00 PM"
              />

              <ContactInfoCard
                icon={<Mail size={20} />}
                title="Email"
                value="support@driveease.com"
                detail="We aim to respond within 24 hours."
              />

              <ContactInfoCard
                icon={<MapPin size={20} />}
                title="Location"
                value="Hyderabad, Telangana, India"
                detail="DriveEase Customer Support"
              />

              <ContactInfoCard
                icon={<Clock3 size={20} />}
                title="Business Hours"
                value="Monday - Saturday"
                detail="9:00 AM - 7:00 PM"
              />
            </div>

            <div className="contact-support-note">
              <ShieldCheck size={19} />
              <div>
                <strong>Your information stays protected.</strong>
                <span>
                  We use your details only to respond to your support request.
                </span>
              </div>
            </div>
          </div>

          <div className="contact-form-card" id="contact-form">
            <div className="contact-form-heading">
              <div>
                <div className="contact-form-icon">
                  <Send size={18} />
                </div>
                <h2>Send us a message</h2>
                <p>
                  Fill in the details below and our team will get back to you.
                </p>
              </div>

              <span className="contact-form-badge">Support</span>
            </div>

            {submitted ? (
              <div className="contact-success">
                <div className="contact-success-icon">
                  <CheckCircle2 size={36} />
                </div>

                <span className="contact-success-label">Message received</span>

                <h3>Thanks for reaching out!</h3>

                <p>
                  Your message has been submitted successfully. Our team will
                  review it and get back to you soon.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="contact-secondary-button"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-row">
                  <FormField
                    id="name"
                    name="name"
                    label="Full Name"
                    placeholder="Enter your name"
                    required
                  />

                  <FormField
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="contact-form-row">
                  <FormField
                    id="phone"
                    name="phone"
                    label="Phone Number"
                    type="tel"
                    placeholder="+91 98765 43210"
                  />

                  <FormField
                    id="subject"
                    name="subject"
                    label="Subject"
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <div className="contact-form-footer">
                  <div className="contact-form-security">
                    <ShieldCheck size={16} />
                    <span>Secure support request</span>
                  </div>

                  <button type="submit" className="contact-submit-button">
                    Send Message
                    <Send size={17} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Quick help */}
      <section className="contact-help-section">
        <div className="contact-container">
          <div className="contact-centered-heading">
            <div className="contact-section-label">Quick Help</div>
            <h2>Looking for something specific?</h2>
            <p>
              Jump directly to the part of DriveEase you need.
            </p>
          </div>

          <div className="contact-help-grid">
            <HelpCard
              icon={<span>🚗</span>}
              title="Browse Cars"
              description="Explore available vehicles and compare their details."
              href="/cars"
              action="View Fleet"
            />

            <HelpCard
              icon={<CalendarDays size={25} />}
              title="Book a Car"
              description="Start your rental journey by selecting a vehicle and dates."
              href="/booking"
              action="Start Booking"
            />

            <HelpCard
              icon={<span>👤</span>}
              title="Your Account"
              description="Sign in to manage your bookings and account information."
              href="/login"
              action="Sign In"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="contact-cta-section">
        <div className="contact-container">
          <div className="contact-cta">
            <div className="contact-cta-content">
              <span className="contact-cta-label">Start your next trip</span>
              <h2>Ready to get on the road?</h2>
              <p>
                Explore the DriveEase fleet and find a vehicle that fits your
                journey.
              </p>
            </div>

            <Link href="/cars" className="contact-cta-button">
              Explore Cars
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactInfoCard({
  icon,
  title,
  value,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="contact-info-card">
      <div className="contact-info-icon">{icon}</div>
      <div className="contact-info-content">
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function FormField({
  id,
  name,
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="contact-field">
      <label htmlFor={id}>
        {label}
        {required && <span>*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}

function HelpCard({
  icon,
  title,
  description,
  href,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <Link href={href} className="contact-help-card">
      <div className="contact-help-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span>
        {action}
        <ArrowRight size={16} />
      </span>
    </Link>
  );
}
