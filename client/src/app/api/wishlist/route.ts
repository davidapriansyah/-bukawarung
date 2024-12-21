import { NextRequest, NextResponse } from "next/server";
import Wishlist from "@/src/db/models/whishlist";

// GET method for fetching the wishlist
export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const wishlist = await Wishlist.getUserWishlist(userId);
    return NextResponse.json(wishlist);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to fetch wishlist" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

// POST method for adding a product to the wishlist
export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  const { productId } = await req.json();

  if (!userId || !productId) {
    return NextResponse.json(
      { error: "User ID and Product ID are required" },
      { status: 400 }
    );
  }

  try {
    const newWishlist = await Wishlist.addProductToWishlist(userId, productId);
    return NextResponse.json(newWishlist, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to add to wishlist" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

// DELETE method for removing a product from the wishlist
export async function DELETE(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  const { productId } = await req.json();

  if (!userId || !productId) {
    return NextResponse.json(
      { error: "User ID and Product ID are required" },
      { status: 400 }
    );
  }

  try {
    const result = await Wishlist.removeProductFromWishlist(userId, productId);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Product not found in wishlist" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Product removed from wishlist" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to remove from wishlist" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
