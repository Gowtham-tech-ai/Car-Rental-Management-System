import Link from "next/link";
import { Fuel, Settings2, Users } from "lucide-react";
type Car = {
  id: number;
  brand: string;
  model: string;
  category: string;
  seats: number;
  transmission: string;
  fuel: string;
  price: number;
  year: number;
  location: string;
  image_url: string;
  description: string | null;
  features: string[];
  status: string;
};

export default function CarCard({ car }: { car: Car }) {
  return (
    <article className="car-card">

      <Link href={`/cars/${car.id}`} className="car-image-link">

        <img
          src={car.image_url}
          alt={`${car.brand} ${car.model}`}
          className="car-image"
        />

        <span className="availability">
          Available
        </span>

      </Link>

      <div className="car-body">

        <div className="car-top">

          <div>
            <span className="car-category">
              {car.category}
            </span>

            <h3>
              {car.brand} {car.model}
            </h3>
          </div>

          <div className="car-price">
            ₹{car.price}
            <small>/day</small>
          </div>

        </div>

        <div className="car-meta">

          <span>
            <Users size={15} />
            {car.seats}
          </span>

          <span>
            <Settings2 size={15} />
            {car.transmission}
          </span>

          <span>
            <Fuel size={15} />
            {car.fuel}
          </span>

        </div>

        <Link
          href={`/cars/${car.id}`}
          className="btn btn-outline btn-wide"
        >
          View Details
        </Link>

      </div>

    </article>
  );
}