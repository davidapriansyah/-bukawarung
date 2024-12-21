"use server";
import { z } from "zod";
import User from "@/src/db/models/user";
import { compareTextWithHash } from "@/src/db/utils/hash";
import { cookies } from "next/headers";
import { createToken } from "@/src/db/utils/jwt";
import { redirect } from "next/navigation";

export const loginUser = async (formData: FormData) => {
  const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  // Validasi input
  if (!email || !password) {
    return { error: "Email atau password tidak valid", redirectTo: "/login" };
  }

  const parsedData = loginSchema.safeParse({ email, password });
  if (!parsedData.success) {
    return {
      error: parsedData.error.issues[0].message,
      redirectTo: `/login?error=${encodeURIComponent(
        parsedData.error.issues[0].message
      )}`,
    };
  }

  try {
    const user = await User.getUserCollection().findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await compareTextWithHash(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const payload = { id: user._id, email: user.email };
    const token = createToken(payload);

    cookies().set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 jam
    });

    return { success: true, redirectTo: "/" };
  } catch (error: unknown) {
    console.error("Login Error:", error);
    return {
      error: error instanceof Error ? error.message : "Login failed",
      redirectTo: `/login?error=${encodeURIComponent(
        error instanceof Error ? error.message : "Login failed"
      )}`,
    };
  }
};

export async function doLogout() {
  cookies().delete("token");
  redirect("/");
}
