import { db } from "../config";
import { ObjectId, WithId } from "mongodb";
import { z } from "zod";
import { hashText, compareTextWithHash } from "../utils/hash";

export type UserModel = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type IUser = WithId<UserModel>;

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default class User {
  static getUserCollection() {
    return db.collection<UserModel>("users");
  }

  // Fungsi Register
  static async Register(data: UserModel): Promise<IUser> {
    const collection = this.getUserCollection();

    // Validasi input data
    const validatedData = userSchema.parse(data);

    // Cek apakah email sudah digunakan
    const existingUser = await collection.findOne({
      email: validatedData.email,
    });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await hashText(validatedData.password);

    // Simpan data pengguna ke database
    const result = await collection.insertOne({
      ...validatedData,
      password: hashedPassword,
    });

    // Kembalikan pengguna yang baru saja disimpan
    return {
      ...validatedData,
      _id: result.insertedId,
    };
  }

  // Fungsi Login
  static async Login(email: string, password: string): Promise<IUser> {
    const collection = this.getUserCollection();

    if (!z.string().email().safeParse(email).success) {
      throw new Error("Invalid email format");
    }

    if (!z.string().min(6).safeParse(password).success) {
      throw new Error("Password must be at least 6 characters long");
    }

    const user = await collection.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    if (!user || !(await compareTextWithHash(password, user.password))) {
      throw new Error("Invalid email or password");
    }

    return user;
  }

  static async getUserById(id: string): Promise<IUser | null> {
    const collection = this.getUserCollection();

    // Validate ID format
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }

    const user = await collection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
