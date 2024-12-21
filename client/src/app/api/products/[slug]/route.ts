import Product from "@/src/db/models/product";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  console.log(params);
  const product = await Product.getProductBySlug(params.slug);

  console.log(product, "=============");

  if (!product) {
    return new Response(JSON.stringify({ message: "Product not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(product), { status: 200 });
}
