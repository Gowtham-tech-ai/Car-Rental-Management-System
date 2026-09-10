const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// =====================================================
// GET ALL CARS
// =====================================================

export async function getCars() {
  const response = await fetch(`${API_URL}/cars`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cars");
  }

  const data = await response.json();

  return data.cars;
}

// =====================================================
// GET SINGLE CAR
// =====================================================

export async function getCarById(id: string) {
  const response = await fetch(`${API_URL}/cars/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch car");
  }

  const data = await response.json();

  return data.car;
}

// =====================================================
// CREATE BOOKING
// =====================================================

export async function createBooking(bookingData: {
  car_id: number;
  pickup_location: string;
  pickup_date: string;
  return_date: string;
}) {
  const token = localStorage.getItem("driveease_token");

  if (!token) {
    throw new Error(
      "Please login before creating a booking"
    );
  }

  const response = await fetch(
    `${API_URL}/bookings`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(bookingData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to create booking"
    );
  }

  return data;
}

// =====================================================
// CANCEL BOOKING
// =====================================================

export async function cancelBooking(
  bookingId: number
) {
  const token = localStorage.getItem(
    "driveease_token"
  );

  if (!token) {
    throw new Error(
      "Please login before cancelling a booking"
    );
  }

  const response = await fetch(
    `${API_URL}/bookings/${bookingId}/cancel`,
    {
      method: "PATCH",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to cancel booking"
    );
  }

  return data;
}

export async function getBookingById(bookingId: string) {
  const token = localStorage.getItem("driveease_token");

  if (!token) {
    throw new Error("Please login to view booking details");
  }

  const response = await fetch(
    `${API_URL}/bookings/${bookingId}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch booking details");
  }

  return data.booking;
}

export async function updateProfile(profileData: {
  name: string;
  phone: string;
}) {
  const token = localStorage.getItem("driveease_token");

  if (!token) {
    throw new Error("Please login to update your profile");
  }

  const response = await fetch(
    `${API_URL}/auth/profile`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update profile"
    );
  }

  return data;
}