"use server";
import { cookies } from "next/headers";

export async function getHasCookie() {
  const cookieStore = cookies();
  const hasToken = cookieStore.has("token");
  return hasToken;
}
