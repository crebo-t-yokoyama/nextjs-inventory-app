import type { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
		} & DefaultSession["user"];
	}

	interface User {
		id: string;
		email: string;
		name?: string | null;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
	}
}