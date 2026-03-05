import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// HASH PASSWORD (REGISTER)
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

// VERIFY PASSWORD (LOGIN)
export async function verifyPassword(
  password: string,
  hashedPassword: string
) {
  return bcrypt.compare(password, hashedPassword);
}

// CREATE JWT TOKEN
export function createToken(userId: string, email: string, role: string) {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
}

// SET AUTH COOKIE
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

// CLEAR AUTH COOKIE
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("token", { path: "/" });
}

// GET SESSION (THIS FIXES YOUR ERROR)
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
    };

    return decoded;
  } catch (error) {
    return null;
  }
}