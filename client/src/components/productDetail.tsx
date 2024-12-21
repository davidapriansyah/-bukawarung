"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { getHasCookie } from "../app/products/action"; // Pastikan path benar

interface Product {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
  excerpt: string;
  description: string;
  tag: string;
}

type Props = {
  product: Product;
};

export default function ProductDetailClient({ product }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddWishlist = async (productId: string) => {
    try {
      // Periksa apakah token ada
      const hasToken = await getHasCookie();

      if (!hasToken) {
        // Jika token tidak ada, arahkan ke halaman login
        Swal.fire({
          icon: "warning",
          title: "Login Required",
          text: "You must log in to add products to your wishlist.",
          showConfirmButton: true,
        }).then(() => {
          window.location.href = "/login"; // Redirect ke halaman login
        });
        return; // Hentikan eksekusi berikutnya
      }

      setIsLoading(true);

      // Jika token ada, lanjutkan dengan request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Added to Wishlist",
          text: "The product has been added to your wishlist!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.error || "Could not add product to wishlist.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col lg:flex-row gap-6">
      {/* Image Section */}
      <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>

      {/* Product Info Section */}
      <div className="w-full lg:w-1/2">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {product.name}
        </h1>
        <p className="text-lg text-gray-700 mb-6">{product.description}</p>
        <p className="text-sm text-gray-600 mb-2">{product.excerpt}</p>
        <p className="text-sm text-gray-600 mb-4">{product.tag}</p>
        <p className="text-2xl font-bold text-green-600 mb-4">
          Rp {product.price.toLocaleString()}
        </p>

        {/* Add to Wishlist Button */}
        <button
          onClick={() => handleAddWishlist(product._id)}
          className={`bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add to Wishlist"}
        </button>
      </div>
    </div>
  );
}
