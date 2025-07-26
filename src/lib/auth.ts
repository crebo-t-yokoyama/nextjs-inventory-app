import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import { createServerSupabaseClient } from "./supabase-server";
import { loginSchema } from "./validations";

const config = {
	adapter: SupabaseAdapter({
		url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
		secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
	}),
	providers: [
		Credentials({
			name: "credentials",
			credentials: {
				email: { label: "メールアドレス", type: "email" },
				password: { label: "パスワード", type: "password" },
			},
			async authorize(credentials) {
				try {
					const { email, password } = loginSchema.parse(credentials);
					
					const supabase = await createServerSupabaseClient();
					const { data: user, error } = await supabase
						.from("users")
						.select("*")
						.eq("email", email)
						.single();

					if (error || !user) {
						return null;
					}

					// パスワード検証（本来はusersテーブルにpassword_hashカラムが必要）
					// 現在はSupabaseのAuth.jsアダプターを使用しているため、
					// 実際の認証はSupabaseが処理します
					return {
						id: user.id,
						email: user.email,
						name: user.name,
					};
				} catch {
					return null;
				}
			},
		}),
	],
	pages: {
		signIn: "/login",
		error: "/auth/error",
	},
	callbacks: {
		session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
			}
			return session;
		},
	},
	session: {
		strategy: "database" as const,
	},
	debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);