import Product, { IProduct } from "@/src/db/models/product";

export async function GET() {
  try {
    const products: IProduct[] = await Product.getProduct();

    const formattedProducts = products.map((product) => ({
      ...product,
      id: product._id, // Salin _id ke properti baru bernama `id`
    }));

    // Mengembalikan response dengan data produk yang sudah diformat
    return new Response(JSON.stringify(formattedProducts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch products" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
