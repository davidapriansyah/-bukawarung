"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useState } from "react";
import { getHasCookie } from "../app/products/action";
interface CardProductProps {
  product: {
    _id: string;
    name: string;
    price: number;
    thumbnail: string;
    excerpt: string;
    slug: string;
  };
}

export default function CardProduct({ product }: CardProductProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleAddWishlist = async (productId: string) => {
    try {
      // Panggil fungsi getHasCookie untuk mengecek token
      const hasToken = await getHasCookie();

      if (!hasToken) {
        // Jika token tidak ditemukan, arahkan ke halaman login
        Swal.fire({
          icon: "warning",
          title: "Login Required",
          text: "You need to log in first to add products to your wishlist.",
          showConfirmButton: true,
        }).then(() => {
          router.push("/login");
        });
        return; // Stop further execution
      }

      setIsLoading(true);

      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product added to wishlist!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.error || "Failed to add product to wishlist.",
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
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
          {product.excerpt}
        </p>
        <p className="mt-4 text-green-600 font-bold text-lg">
          Rp {product.price.toLocaleString()}
        </p>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handleAddWishlist(product._id)}
            className={`bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add to Wishlist"}
          </button>
          <Link href={`/products/${product.slug}`}>
            <button className="border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Detail
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
