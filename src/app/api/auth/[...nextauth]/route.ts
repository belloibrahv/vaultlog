import { authOptions } from "@/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions as any);

export const GET = handler;
export const POST = handler;
