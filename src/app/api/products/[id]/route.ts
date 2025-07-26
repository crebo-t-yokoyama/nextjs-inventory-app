import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { productSchema } from "@/lib/validations";

interface Params {
	id: string;
}

// 商品詳細取得
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<Params> }
) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
		}

		const { id } = await params;
		const supabase = await createServerSupabaseClient();
		const { data: product, error } = await supabase
			.from("products")
			.select(`
				*,
				categories (
					id,
					name
				)
			`)
			.eq("id", id)
			.single();

		if (error) {
			console.error("商品取得エラー:", error);
			return NextResponse.json(
				{ error: "商品が見つかりません" },
				{ status: 404 },
			);
		}

		return NextResponse.json({ product });
	} catch (error) {
		console.error("商品詳細取得エラー:", error);
		return NextResponse.json(
			{ error: "サーバーエラーが発生しました" },
			{ status: 500 },
		);
	}
}

// 商品更新
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<Params> }
) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
		}

		const { id } = await params;
		const body = await request.json();
		const validatedData = productSchema.parse(body);

		const supabase = await createServerSupabaseClient();
		const { data: product, error } = await supabase
			.from("products")
			.update({
				name: validatedData.name,
				category_id: validatedData.categoryId,
				price: validatedData.price,
				min_stock_threshold: validatedData.minStockThreshold,
				description: validatedData.description,
				updated_by: session.user.id,
				updated_at: new Date().toISOString(),
			})
			.eq("id", id)
			.select(`
				*,
				categories (
					id,
					name
				)
			`)
			.single();

		if (error) {
			console.error("商品更新エラー:", error);
			return NextResponse.json(
				{ error: "商品の更新に失敗しました" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ product });
	} catch (error) {
		console.error("商品更新エラー:", error);
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

// 商品削除
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<Params> }
) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
		}

		const { id } = await params;
		const supabase = await createServerSupabaseClient();
		const { error } = await supabase.from("products").delete().eq("id", id);

		if (error) {
			console.error("商品削除エラー:", error);
			return NextResponse.json(
				{ error: "商品の削除に失敗しました" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ message: "商品を削除しました" });
	} catch (error) {
		console.error("商品削除エラー:", error);
		return NextResponse.json(
			{ error: "サーバーエラーが発生しました" },
			{ status: 500 },
		);
	}
}