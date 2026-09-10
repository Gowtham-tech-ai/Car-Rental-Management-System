import Link from "next/link";
import {
  ArrowUpRight,
  CarFront,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="driveease-footer">
      <div className="driveease-footer-main">
        <div className="container driveease-footer-grid">
          <div className="driveease-footer-brand-column">
            <Link href="/" className="driveease-footer-brand">
              <span className="driveease-footer-brand-mark">
                <CarFront size={22} />
              </span>
              <span>
                Drive<span>Ease</span>
              </span>
            </Link>

            <p className="driveease-footer-description">
              Premium cars. Simple bookings. Better journeys. DriveEase makes
              renting a car convenient, reliable, and stress-free.
            </p>

            <div className="driveease-footer-trust">
              <ShieldCheck size={16} />
              <span>Reliable car rental experience</span>
            </div>
          </div>

          <FooterColumn title="Explore">
            <FooterLink href="/" label="Home" />
            <FooterLink href="/cars" label="Our Fleet" />
            <FooterLink href="/about" label="About Us" />
            <FooterLink href="/contact" label="Contact" />
          </FooterColumn>

          <FooterColumn title="Customer">
            <FooterLink href="/login" label="Login" />
            <FooterLink href="/register" label="Create Account" />
            <FooterLink href="/dashboard" label="Dashboard" />
            <FooterLink href="/booking" label="Book a Car" />
          </FooterColumn>

          <div className="driveease-footer-column driveease-footer-contact">
            <h4>Get in Touch</h4>

            <ContactItem
              icon={<Phone size={16} />}
              label="Call us"
              value="+91 90000 00000"
            />
            <ContactItem
              icon={<Mail size={16} />}
              label="Email us"
              value="support@driveease.com"
            />
            <ContactItem
              icon={<MapPin size={16} />}
              label="Location"
              value="Hyderabad, India"
            />
          </div>
        </div>
      </div>

      <div className="driveease-footer-bottom">
        <div className="container driveease-footer-bottom-inner">
          <span>© 2026 DriveEase. All rights reserved.</span>

          <div className="driveease-footer-bottom-links">
            <span>Car Rental Management System</span>
            <span className="driveease-footer-dot">•</span>
            <span>Built for better journeys</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="driveease-footer-column">
      <h4>{title}</h4>
      <nav className="driveease-footer-links" aria-label={title}>
        {children}
      </nav>
    </div>
  );
}

function FooterLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link href={href} className="driveease-footer-link">
      <span>{label}</span>
      <ArrowUpRight size={14} />
    </Link>
  );
}

function ContactItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="driveease-footer-contact-item">
      <span className="driveease-footer-contact-icon">{icon}</span>
      <div>
        <small>{label}</small>
        <span>{value}</span>
      </div>
    </div>
  );
}
