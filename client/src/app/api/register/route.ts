import { NextRequest, NextResponse } from "next/server";
import User from "@/src/db/models/user";
import { z } from "zod";

type MyResponse<T> = {
  statusCode: number;
  message?: string;
  data?: T;
  error?: string;
};

// Schema validasi data registrasi
const registerInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const POST = async (request: NextRequest) => {
  try {
    // Ambil data dari request body
    const body = await request.json();

    // Validasi input menggunakan schema Zod
    const parsedData = registerInputSchema.safeParse(body);

    if (!parsedData.success) {
      throw parsedData.error;
    }

    // Gunakan fungsi Register dari model User
    const newUser = await User.Register(parsedData.data);

    // Respons jika berhasil
    return NextResponse.json<MyResponse<unknown>>(
      {
        statusCode: 201,
        message: "User registered successfully!",
        data: newUser,
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error(err);

      // Ambil detail error dari Zod
      const errPath = err.issues[0].path[0];
      const errMessage = err.issues[0].message;

      return NextResponse.json<MyResponse<never>>(
        {
          statusCode: 400,
          error: `${errPath} - ${errMessage}`,
        },
        {
          status: 400,
        }
      );
    }

    if (err instanceof Error && err.message === "Email already registered") {
      return NextResponse.json<MyResponse<never>>(
        {
          statusCode: 409,
          error: err.message,
        },
        {
          status: 409,
        }
      );
    }

    console.error(err);

    // Respons jika terjadi error lain
    return NextResponse.json<MyResponse<never>>(
      {
        statusCode: 500,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
};
