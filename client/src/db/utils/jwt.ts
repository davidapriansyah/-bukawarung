import jwt from "jsonwebtoken";
import * as jose from "jose";

// Pastikan SECRET_KEY diambil dari environment variable, dengan fallback yang lebih aman
const SECRET_KEY = process.env.JWT_SECRET || "fallback-safe-key";

// Fungsi untuk membuat token JWT
export const createToken = (payload: object, expiresIn = "1h"): string => {
  if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined in the environment");
  }
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

// Fungsi untuk membaca payload dari token JWT menggunakan jsonwebtoken
export const readPayload = (token: string): object | string => {
  if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined in the environment");
  }

  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    throw new Error("Invalid or expired token");
  }
};

// Fungsi untuk membaca payload menggunakan jose
export const readPayloadJose = async <T>(token: string): Promise<T> => {
  if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined in the environment");
  }

  try {
    const secretKey = new TextEncoder().encode(SECRET_KEY);
    const { payload } = await jose.jwtVerify(token, secretKey);
    return payload as T;
  } catch {
    throw new Error("Invalid or expired token");
  }
};
