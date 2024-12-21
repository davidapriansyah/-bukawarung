import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Banner from "../components/Banner";
import CardProduct from "../components/CardProduct";
import { IProduct } from "../db/models/product";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Home Page",
  description: "Ini Home Page Bukawarung",
};

export default async function Home() {
  let products: IProduct[] = [];
  const cookieStore = cookies();
  const hasCookie = cookieStore.has("token");

  // Fetch product data
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
      {}
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    products = await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <Navbar hasCookie={hasCookie} />

      <div className="pt-20">
        {/* Banner Section */}
        <section>
          <Banner />
        </section>

        {/* Detail Info E-Commerce */}
        <section className="max-w-7xl mx-auto px-6 mt-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700">
              Belanja Mudah dan Cepat!
            </h2>
            <p className="mt-2 text-gray-500">
              Temukan produk terbaik untuk kebutuhan sehari-hari Anda.
            </p>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="max-w-7xl mx-auto px-6 mt-12">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-700">
              Produk Pilihan
            </h3>
            <a
              href="/products"
              className="text-blue-500 hover:underline text-sm"
            >
              Lihat Semua
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {products.length > 0 ? (
              products.slice(0, 8).map((product) => (
                <CardProduct
                  key={product._id.toString()} // Convert _id to string here
                  product={{
                    ...product,
                    _id: product._id.toString(), // Ensure _id is a string
                  }}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-4">
                Tidak ada produk tersedia.
              </p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
