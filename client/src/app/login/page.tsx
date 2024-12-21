"use client";
import { loginUser } from "./action";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = await loginUser(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.redirectTo) {
      router.push(result.redirectTo); // Redirect ke halaman tujuan
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-red-600 text-center mb-6">
          Buka Warung
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Masukkan email Anda"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              required
              onChange={() => setError(null)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Masukkan password Anda"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-500 transition duration-300"
          >
            Masuk
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <a href="/register" className="text-red-600 hover:underline">
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}
