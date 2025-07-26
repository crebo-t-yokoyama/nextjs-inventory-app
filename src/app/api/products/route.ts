import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { productSchema } from "@/lib/validations";

// 商品一覧取得
export async function GET() {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
		}

		const supabase = await createServerSupabaseClient();
		const { data: products, error } = await supabase
			.from("products")
			.select(`
				*,
				categories (
					id,
					name
				)
			`)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("商品取得エラー:", error);
			return NextResponse.json(
				{ error: "商品の取得に失敗しました" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ products });
	} catch (error) {
		console.error("商品一覧取得エラー:", error);
		return NextResponse.json(
			{ error: "サーバーエラーが発生しました" },
			{ status: 500 },
		);
	}
}

// 商品作成
export async function POST(request: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
		}

		const body = await request.json();
		const validatedData = productSchema.parse(body);

		const supabase = await createServerSupabaseClient();
		const { data: product, error } = await supabase
			.from("products")
			.insert({
				name: validatedData.name,
				category_id: validatedData.categoryId,
				price: validatedData.price,
				min_stock_threshold: validatedData.minStockThreshold,
				description: validatedData.description,
				created_by: session.user.id,
				updated_by: session.user.id,
			})
			.select(`
				*,
				categories (
					id,
					name
				)
			`)
			.single();

		if (error) {
			console.error("商品作成エラー:", error);
			return NextResponse.json(
				{ error: "商品の作成に失敗しました" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ product }, { status: 201 });
	} catch (error) {
		console.error("商品作成エラー:", error);
		if (error instanceof Error && "issues" in error) {
			return NextResponse.json(
				{ error: "入力データが正しくありません", details: error },
				{ status: 400 },
			);
		}
		return NextResponse.json(
			{ error: "サーバーエラーが発生しました" },
			{ status: 500 },
		);
	}
}