import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// カテゴリ一覧取得
export async function GET() {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
		}

		const supabase = await createServerSupabaseClient();
		const { data: categories, error } = await supabase
			.from("categories")
			.select("*")
			.order("name");

		if (error) {
			console.error("カテゴリ取得エラー:", error);
			return NextResponse.json(
				{ error: "カテゴリの取得に失敗しました" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ categories });
	} catch (error) {
		console.error("カテゴリ一覧取得エラー:", error);
		return NextResponse.json(
			{ error: "サーバーエラーが発生しました" },
			{ status: 500 },
		);
	}
}