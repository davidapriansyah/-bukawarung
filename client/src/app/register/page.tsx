"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Gunakan useRouter untuk navigasi

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const userData = {
      name: formData.get("name"),
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Registration failed");
      }

      // Redirect ke halaman login di sisi klien
      router.push("/login");
    } catch (err: unknown) {
      // Narrow down the error type
      if (err instanceof Error) {
        setError(err.message); // Only access `message` if `err` is an instance of `Error`
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 pt-20">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-red-600 text-center mb-6">
          Register - Buka Warung
        </h1>
        {error && (
          <p className="text-center text-red-600 font-semibold mb-4">{error}</p>
        )}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Fullname */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fullname
            </label>
            <input
              name="name"
              type="text"
              placeholder="Enter your fullname"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              name="username"
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Register
          </button>

          {/* Login Link */}
          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-red-600 hover:underline">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
