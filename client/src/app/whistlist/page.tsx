"use client";

import { useEffect, useState } from "react";

interface WishlistItem {
  _id: string;
  productDetails: {
    _id: string;
    name: string;
    thumbnail: string;
    price: number;
    slug: string;
  };
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Ambil userId dari localStorage atau session
        if (!userId) {
          throw new Error("User is not logged in");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": userId, // Kirim userId di header
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setWishlist(data);
        } else if (response.status === 401) {
          alert("You need to log in first.");
          window.location.href = "/login"; // Redirect ke login jika belum login
        } else {
          alert("Failed to fetch wishlist.");
        }
      } catch (error) {
        console.log(error);
        alert("Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (wishlist.length === 0) {
    return <div>Your wishlist is empty.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlist.map((item) => (
          <div key={item._id} className="border p-4 rounded-lg shadow-md">
            <img
              src={item.productDetails.thumbnail}
              alt={item.productDetails.name}
              className="h-40 w-full object-cover"
            />
            <h2 className="text-lg font-semibold mt-2">
              {item.productDetails.name}
            </h2>
            <p className="text-green-600 font-bold">
              Rp {item.productDetails.price.toLocaleString()}
            </p>
            <a
              href={`/products/${item.productDetails.slug}`}
              className="text-blue-500 underline mt-2 block"
            >
              View Product
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
