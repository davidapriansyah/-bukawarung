"use client";
import { useEffect, useState, useRef } from "react";
import CardProduct from "@/src/components/CardProduct";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import { IProduct } from "@/src/db/models/product";
import { getHasCookie } from "./action";

export default function ProductPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasCookie, setHasCookie] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCookieStatus = async () => {
      const cookieStatus = await getHasCookie();
      setHasCookie(cookieStatus);
    };
    fetchCookieStatus();
  }, []);

  useEffect(() => {
    if (!searchQuery) fetchProducts(); // Hanya lakukan fetch saat tidak ada query pencarian
  }, [page]);

  const fetchProducts = async () => {
    if (!hasMore) return;

    setIsFetchingMore(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?page=${page}&limit=10`
      );
      const data = await response.json();

      if (data.length > 0) {
        setProducts((prev) => [...prev, ...data]);
        setFilteredProducts((prev) => [...prev, ...data]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredProducts(products); // Kembalikan ke data awal
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?name=${query}`
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        setFilteredProducts(data); // Update hasil pencarian
      } else {
        console.error("Unexpected response format:", data);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setFilteredProducts([]);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [isFetchingMore, hasMore]);

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <Navbar hasCookie={hasCookie} />
      <h1 className="text-3xl font-bold mb-6 text-center">Our Products</h1>
      {isLoading && (
        <div className="text-center py-6 text-gray-500">Loading...</div>
      )}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search products..."
          className="border border-gray-300 px-4 py-2 w-full max-w-md rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <CardProduct
            key={product._id.toString()}
            product={{
              ...product,
              _id: product._id.toString(),
            }}
          />
        ))}
      </div>
      {hasMore && (
        <div ref={loaderRef} className="text-center py-6 text-gray-500">
          {isFetchingMore ? "Loading more products..." : "Scroll to load more"}
        </div>
      )}
      <Footer />
    </div>
  );
}
