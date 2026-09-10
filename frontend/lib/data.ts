export type Car = {
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
  image: string;
  features: string[];
};

export const cars: Car[] = [
  {
    id: 1,
    brand: "Toyota",
    model: "Camry",
    category: "Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    price: 4500,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=85",
    features: ["AC", "Bluetooth", "GPS", "Rear Camera"],
  },

  {
    id: 2,
    brand: "BMW",
    model: "X5",
    category: "Luxury SUV",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    price: 7000,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85",
    features: ["AC", "GPS", "Cruise Control", "Leather Seats"],
  },

  {
    id: 3,
    brand: "Audi",
    model: "A4",
    category: "Luxury Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    price: 6000,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85",
    features: ["AC", "GPS", "Sunroof", "Bluetooth"],
  },

  {
    id: 4,
    brand: "Mercedes-Benz",
    model: "C-Class",
    category: "Luxury Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    price: 7500,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85",
    features: ["Leather", "GPS", "Sunroof", "Parking Sensors"],
  },

  {
    id: 5,
    brand: "Tesla",
    model: "Model 3",
    category: "Electric",
    seats: 5,
    transmission: "Automatic",
    fuel: "Electric",
    price: 6500,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=85",
    features: ["Autopilot", "GPS", "Touchscreen", "Fast Charging"],
  },

  {
    id: 6,
    brand: "Hyundai",
    model: "Creta",
    category: "SUV",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    price: 3200,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85",
    features: ["AC", "Bluetooth", "GPS", "Rear Camera"],
  },

  {
    id: 7,
    brand: "Kia",
    model: "Seltos",
    category: "SUV",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    price: 3500,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85",
    features: ["AC", "GPS", "Bluetooth", "Cruise Control"],
  },

  {
    id: 8,
    brand: "Toyota",
    model: "Fortuner",
    category: "SUV",
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    price: 5500,
    year: 2024,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85",
    features: ["7 Seats", "4WD", "GPS", "Rear Camera"],
  },

  {
    id: 9,
    brand: "Honda",
    model: "City",
    category: "Sedan",
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    price: 2800,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=85",
    features: ["AC", "Bluetooth", "USB", "Rear Camera"],
  },

  {
    id: 10,
    brand: "Tata",
    model: "Nexon",
    category: "SUV",
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    price: 2600,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=85",
    features: ["AC", "Bluetooth", "GPS", "Airbags"],
  },

  {
    id: 11,
    brand: "Mahindra",
    model: "XUV700",
    category: "SUV",
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    price: 4200,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85",
    features: ["7 Seats", "ADAS", "GPS", "Sunroof"],
  },

  {
    id: 12,
    brand: "Skoda",
    model: "Slavia",
    category: "Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    price: 3000,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1200&q=85",
    features: ["AC", "Bluetooth", "Cruise Control", "GPS"],
  },

  {
    id: 13,
    brand: "Volkswagen",
    model: "Virtus",
    category: "Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    price: 3100,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=85",
    features: ["AC", "GPS", "Bluetooth", "USB"],
  },

  {
    id: 14,
    brand: "BMW",
    model: "3 Series",
    category: "Luxury Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    price: 6800,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1200&q=85",
    features: ["Leather", "GPS", "Sunroof", "Parking Sensors"],
  },

  {
    id: 15,
    brand: "Audi",
    model: "Q5",
    category: "Luxury SUV",
    seats: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    price: 7200,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85",
    features: ["Quattro", "GPS", "Leather", "Sunroof"],
  },

  {
    id: 16,
    brand: "Mercedes-Benz",
    model: "GLC",
    category: "Luxury SUV",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    price: 7800,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85",
    features: ["Leather", "GPS", "Sunroof", "360 Camera"],
  },

  {
    id: 17,
    brand: "Volvo",
    model: "XC60",
    category: "Luxury SUV",
    seats: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    price: 7000,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=85",
    features: ["Hybrid", "Safety Assist", "GPS", "Leather"],
  },

  {
    id: 18,
    brand: "Jeep",
    model: "Compass",
    category: "SUV",
    seats: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    price: 3800,
    year: 2024,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85",
    features: ["4WD", "GPS", "Bluetooth", "Rear Camera"],
  },

  {
    id: 19,
    brand: "MG",
    model: "Hector",
    category: "SUV",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    price: 3600,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85",
    features: ["ADAS", "Sunroof", "GPS", "360 Camera"],
  },

  {
    id: 20,
    brand: "Hyundai",
    model: "Verna",
    category: "Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    price: 2900,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=85",
    features: ["AC", "ADAS", "GPS", "Bluetooth"],
  },

  {
    id: 21,
    brand: "Kia",
    model: "Carnival",
    category: "MPV",
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    price: 5200,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85",
    features: ["7 Seats", "Captain Seats", "GPS", "Rear Entertainment"],
  },

  {
    id: 22,
    brand: "Toyota",
    model: "Innova Hycross",
    category: "MPV",
    seats: 7,
    transmission: "Automatic",
    fuel: "Hybrid",
    price: 4800,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85",
    features: ["Hybrid", "7 Seats", "GPS", "Cruise Control"],
  },

  {
    id: 23,
    brand: "Porsche",
    model: "718 Cayman",
    category: "Sports",
    seats: 2,
    transmission: "Automatic",
    fuel: "Petrol",
    price: 12000,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
    features: ["Sport Mode", "GPS", "Premium Audio", "Leather"],
  },

  {
    id: 24,
    brand: "Jaguar",
    model: "F-PACE",
    category: "Luxury SUV",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    price: 8500,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85",
    features: ["AWD", "Leather", "GPS", "Panoramic Roof"],
  },

  {
    id: 25,
    brand: "Range Rover",
    model: "Evoque",
    category: "Luxury SUV",
    seats: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    price: 9000,
    year: 2025,
    location: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85",
    features: ["AWD", "Leather", "GPS", "Panoramic Roof"],
  },
];