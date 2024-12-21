import { cookies } from "next/headers";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import ProductDetailClient from "@/src/components/productDetail";
type Props = {
  params: { slug: string };
};

export default async function ProductDetail({ params }: Props) {
  const { slug } = params;
  const cookieStore = cookies();
  const hasCookie = cookieStore.has("token");

  // Fetch the product data
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    // Handle errors (e.g., 404, server issues)
    throw new Error("Failed to fetch product details");
  }

  const product = await response.json();

  return (
    <div className="bg-gray-200 text-white min-h-screen">
      <Navbar hasCookie={hasCookie} />
      <div className="max-w-3xl mx-auto px-6 py-10 mt-12">
        {/* Pass product data to the client component */}
        <ProductDetailClient product={product} />
      </div>
      <Footer />
    </div>
  );
}
