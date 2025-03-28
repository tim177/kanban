import { authOptions } from "@/lib/auth";
import NextAuth, { NextAuthOptions } from "next-auth";
// import type { JWT } from "next-auth/jwt";
// import type { Session } from "next-auth";

// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import User from "@/models/user";
// import { connectToDatabase } from "@/lib/db";

// Define the authentication handler
// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Missing email or password");
//         }

//         try {
//           await connectToDatabase();

//           const user = await User.findOne({ email: credentials.email });
//           if (!user) {
//             throw new Error("User not found");
//           }

//           const isPasswordValid = await bcrypt.compare(
//             credentials.password,
//             user.password
//           );

//           if (!isPasswordValid) {
//             throw new Error("Invalid password");
//           }

//           return {
//             id: user._id.toString(),
//             name: user.name,
//             email: user.email,
//           };
//         } catch (error) {
//           console.error("Authorization error:", error);
//           throw new Error("Authentication failed");
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//     signOut: "/",
//     error: "/login",
//     newUser: "/register",
//   },
//   callbacks: {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     async jwt({ token, user }: { token: JWT; user?: any }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }: { session: Session; token: JWT }) {
//       if (token) {
//         session.user.id = token.id as string;
//       }
//       return session;
//     },
//     async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
//       if (url.startsWith("/")) return `${baseUrl}${url}`;
//       else if (new URL(url).origin === baseUrl) return url;
//       return baseUrl;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   debug: process.env.NODE_ENV === "development",
// };

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
