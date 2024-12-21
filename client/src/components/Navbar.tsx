"use client";
import Link from "next/link";
import { doLogout } from "../app/login/action";

export default function Navbar({ hasCookie }: { hasCookie: boolean }) {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/">
          <h4 className="text-2xl font-extrabold text-red-600 hover:text-pink-500 transition-all duration-300 cursor-pointer">
            BUKAWARUNG
          </h4>
        </Link>

        {/* Navbar Links */}
        <div className="flex items-center gap-6">
          {/* Common Links */}
          <Link
            href="/products"
            className="text-gray-700 hover:text-black transition duration-300"
          >
            Produk
          </Link>
          <Link
            href="/wishlist"
            className="text-gray-700 hover:text-black transition duration-300"
          >
            Wishlist
          </Link>

          {/* Conditional Rendering */}
          {hasCookie && (
            <>
              <form action={doLogout}>
                <button className="text-gray-700 hover:text-black transition duration-300">
                  Logout
                </button>
              </form>
            </>
          )}

          {!hasCookie && (
            <>
              <Link
                href="/login"
                className="text-gray-700 hover:text-black transition duration-300"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-gray-700 hover:text-black transition duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
