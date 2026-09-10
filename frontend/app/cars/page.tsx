"use client";

import {
  CarFront,
  CheckCircle2,
  Fuel,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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



export default function CarsPage() {
  const [cars, setCars] = useState<DisplayCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [fuel, setFuel] = useState("All");
  const [transmission, setTransmission] = useState("All");

  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        setError("");

        const data = (await getCars()) as ApiCar[];

        const activeCars: DisplayCar[] = data
          .filter((car) => car.status !== "inactive")
          .map((car) => ({
            ...car,
            image: car.image_url,
          }));

        setCars(activeCars);
      } catch (error) {
        console.error("Failed to load cars:", error);
        setError("Unable to load our fleet. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(cars.map((car) => car.category))
      ),
    ];
  }, [cars]);

  const fuelTypes = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(cars.map((car) => car.fuel))
      ),
    ];
  }, [cars]);

  const transmissionTypes = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(cars.map((car) => car.transmission))
      ),
    ];
  }, [cars]);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const searchMatch =
        `${car.brand} ${car.model}`
          .toLowerCase()
          .includes(search.toLowerCase().trim());

      const categoryMatch =
        category === "All" ||
        car.category === category;

      const fuelMatch =
        fuel === "All" ||
        car.fuel === fuel;

      const transmissionMatch =
        transmission === "All" ||
        car.transmission === transmission;

      return (
        searchMatch &&
        categoryMatch &&
        fuelMatch &&
        transmissionMatch
      );
    });
  }, [
    cars,
    search,
    category,
    fuel,
    transmission,
  ]);

  const hasFilters =
    search.trim() !== "" ||
    category !== "All" ||
    fuel !== "All" ||
    transmission !== "All";

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setFuel("All");
    setTransmission("All");
  };

  if (loading) {
    return (
      <div className="cars-page">
        <section className="page-hero">
          <div className="container">
            <span className="eyebrow">
              <Sparkles size={15} />
              OUR FLEET
            </span>

            <h1>Find the right car for your journey.</h1>

            <p>
              Explore our collection of reliable vehicles for
              every kind of trip.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="fleet-loading">
              <div className="fleet-loading-toolbar">
                <div className="fleet-skeleton search" />
                <div className="fleet-skeleton filter" />
                <div className="fleet-skeleton filter" />
                <div className="fleet-skeleton filter" />
              </div>

              <div className="car-grid">
                {Array.from({ length: 6 }).map(
                  (_, index) => (
                    <div
                      className="car-card fleet-car-skeleton"
                      key={index}
                    >
                      <div className="fleet-skeleton-image" />

                      <div className="fleet-skeleton-content">
                        <div className="fleet-skeleton-line large" />
                        <div className="fleet-skeleton-line medium" />
                        <div className="fleet-skeleton-line small" />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cars-page">
        <section className="page-hero">
          <div className="container">
            <span className="eyebrow">
              <Sparkles size={15} />
              OUR FLEET
            </span>

            <h1>Find the right car for your journey.</h1>

            <p>
              Explore our collection of reliable vehicles for
              every kind of trip.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="fleet-state">
              <div className="fleet-state-icon">
                <CarFront size={28} />
              </div>

              <h3>Unable to load the fleet</h3>

              <p>{error}</p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="cars-page">
      {/* =====================================================
          PAGE HERO
      ====================================================== */}
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">
            <Sparkles size={15} />
            OUR FLEET
          </span>

          <h1>Find the right car for your journey.</h1>

          <p>
            Choose from reliable sedans, spacious SUVs and
            premium vehicles designed for every journey.
          </p>

          <div className="fleet-hero-meta">
            <span>
              <CheckCircle2 size={16} />
              {cars.length} vehicles available
            </span>

            <span>
              <Fuel size={16} />
              Multiple fuel options
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          FLEET
      ====================================================== */}
      <section className="section fleet-section">
        <div className="container">

          {/* Toolbar */}
          <div className="fleet-toolbar-card">
            <div className="fleet-toolbar-heading">
              <div>
                <span className="eyebrow dark">
                  <SlidersHorizontal size={14} />
                  EXPLORE FLEET
                </span>

                <h2>Choose your vehicle</h2>

                <p>
                  Search and filter the fleet to find a car
                  that fits your needs.
                </p>
              </div>

              {hasFilters && (
                <button
                  type="button"
                  className="fleet-clear-top"
                  onClick={clearFilters}
                >
                  <X size={15} />
                  Clear filters
                </button>
              )}
            </div>

            <div className="fleet-toolbar">

              {/* Search */}
              <div className="search-box fleet-search">
                <Search size={19} />

                <input
                  type="text"
                  placeholder="Search by brand or model..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  aria-label="Search cars by brand or model"
                />

                {search && (
                  <button
                    type="button"
                    className="fleet-search-clear"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Category */}
              <div className="fleet-filter">
                <label htmlFor="category-filter">
                  Category
                </label>

                <select
                  id="category-filter"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item === "All"
                        ? "All Categories"
                        : item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fuel */}
              <div className="fleet-filter">
                <label htmlFor="fuel-filter">
                  Fuel
                </label>

                <select
                  id="fuel-filter"
                  value={fuel}
                  onChange={(e) =>
                    setFuel(e.target.value)
                  }
                >
                  {fuelTypes.map((item) => (
                    <option key={item} value={item}>
                      {item === "All"
                        ? "All Fuel Types"
                        : item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transmission */}
              <div className="fleet-filter">
                <label htmlFor="transmission-filter">
                  Transmission
                </label>

                <select
                  id="transmission-filter"
                  value={transmission}
                  onChange={(e) =>
                    setTransmission(e.target.value)
                  }
                >
                  {transmissionTypes.map((item) => (
                    <option key={item} value={item}>
                      {item === "All"
                        ? "All Transmissions"
                        : item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="fleet-result">
            <div>
              <strong>{filteredCars.length}</strong>{" "}
              {filteredCars.length === 1
                ? "vehicle"
                : "vehicles"}{" "}
              found
            </div>

            {hasFilters && (
              <span className="fleet-active-filter">
                Filters applied
              </span>
            )}
          </div>

          {/* Cars */}
          {filteredCars.length > 0 ? (
            <div className="car-grid">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="fleet-state">
              <div className="fleet-state-icon">
                <Search size={27} />
              </div>

              <h3>No vehicles found</h3>

              <p>
                We couldn't find any cars matching your
                current search and filters.
              </p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}