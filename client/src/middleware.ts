import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readPayloadJose } from "./db/utils/jwt";

export const middleware = async (request: NextRequest) => {
  if (
    request.url.includes("/api/wishlist") ||
    request.url.includes("/wishlist")
  ) {
    console.log("Checking wishlist access:", request.method, request.url);

    const cookiesStore = cookies();
    const token = cookiesStore.get("token");

    if (!token) {
      if (request.url.includes("/api/wishlist")) {
        return NextResponse.json({
          statusCode: 401,
          error: "Unauthorized - You must log in to access the wishlist.",
        });
      } else {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    try {
      const tokenData = await readPayloadJose<{ id: string; email: string }>(
        token.value
      );

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", tokenData.id);
      requestHeaders.set("x-user-email", tokenData.email);

      return NextResponse.next({
        headers: requestHeaders,
      });
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json({
        statusCode: 401,
        error: "Invalid or expired token.",
      });
    }
  }

  return NextResponse.next();
};
