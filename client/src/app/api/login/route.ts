import { NextRequest, NextResponse } from "next/server";
import User from "@/src/db/models/user";
import { createToken } from "@/src/db/utils/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password diperlukan" },
        { status: 400 }
      );
    }

    const user = await User.Login(email, password);

    const token = createToken({ id: user._id, email: user.email });

    const response = NextResponse.json({ success: true });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 3600, // 1 jam
    });

    return response;
  } catch (error: unknown) {
    // Use unknown instead of Error
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
