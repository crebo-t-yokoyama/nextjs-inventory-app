import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { inventoryTransactionSchema } from "@/lib/validations";

// 入出庫履歴一覧取得
export async function GET(request: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const productId = searchParams.get("productId");
		const transactionType = searchParams.get("transactionType");
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");
		const limit = parseInt(searchParams.get("limit") || "50", 10);

		const supabase = await createServerSupabaseClient();
		let query = supabase
			.from("inventory_transactions")
			.select(`
				*,
				products (
					id,
					name,
					categories (
						id,
						name
					)
				)
			`)
			.order("transaction_date", { ascending: false });

		// フィルタリング
		if (productId) {
			query = query.eq("product_id", productId);
		}
		
		if (transactionType && (transactionType === "IN" || transactionType === "OUT")) {
			query = query.eq("transaction_type", transactionType);
		}

		if (startDate) {
			query = query.gte("transaction_date", startDate);
		}

		if (endDate) {
			query = query.lte("transaction_date", endDate);
		}

		query = query.limit(limit);

		const { data: transactions, error } = await query;

		if (error) {
			console.error("入出庫履歴取得エラー:", error);
			return NextResponse.json(
				{ error: "履歴の取得に失敗しました" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ transactions });
	} catch (error) {
		console.error("入出庫履歴一覧取得エラー:", error);
		return NextResponse.json(
			{ error: "サーバーエラーが発生しました" },
			{ status: 500 }
		);
	}
}

// 入出庫記録作成
export async function POST(request: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
		}

		const body = await request.json();
		const validatedData = inventoryTransactionSchema.parse(body);

		const supabase = await createServerSupabaseClient();

		// 1. 商品の現在在庫を取得
		const { data: product, error: productError } = await supabase
			.from("products")
			.select("id, name, current_stock")
			.eq("id", validatedData.productId)
			.single();

		if (productError || !product) {
			console.error("商品取得エラー:", productError);
			return NextResponse.json(
				{ error: "商品が見つかりません" },
				{ status: 404 }
			);
		}

		// 2. 新しい在庫数を計算
		let newStock: number;
		if (validatedData.transactionType === "IN") {
			newStock = product.current_stock + validatedData.quantity;
		} else if (validatedData.transactionType === "OUT") {
			newStock = product.current_stock - validatedData.quantity;
			
			// 在庫不足チェック
			if (newStock < 0) {
				return NextResponse.json(
					{ error: `在庫数が不足しています。現在在庫: ${product.current_stock}, 出庫予定: ${validatedData.quantity}` },
					{ status: 400 }
				);
			}
		} else {
			return NextResponse.json(
				{ error: "無効な取引種別です" },
				{ status: 400 }
			);
		}

		// 3. 在庫更新と履歴記録を同時実行（簡易トランザクション）
		const userId = session.user.id?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) 
			? session.user.id 
			: null;

		// まず履歴を記録
		const { data: transactionData, error: insertError } = await supabase
			.from("inventory_transactions")
			.insert({
				product_id: validatedData.productId,
				user_id: userId,
				transaction_type: validatedData.transactionType,
				quantity: validatedData.quantity,
				notes: validatedData.notes || null,
				transaction_date: new Date().toISOString()
			})
			.select()
			.single();

		if (insertError) {
			console.error("履歴記録エラー:", insertError);
			return NextResponse.json(
				{ error: "履歴の記録に失敗しました" },
				{ status: 500 }
			);
		}

		// 続いて在庫数を更新
		const { error: updateError } = await supabase
			.from("products")
			.update({ 
				current_stock: newStock,
				updated_at: new Date().toISOString()
			})
			.eq("id", validatedData.productId);

		if (updateError) {
			console.error("在庫更新エラー:", updateError);
			// 履歴を削除（ロールバック）
			await supabase
				.from("inventory_transactions")
				.delete()
				.eq("id", transactionData.id);
			
			return NextResponse.json(
				{ error: "在庫の更新に失敗しました" },
				{ status: 500 }
			);
		}

		// 5. 作成された履歴を詳細情報付きで取得
		const { data: transaction, error: fetchError } = await supabase
			.from("inventory_transactions")
			.select(`
				*,
				products (
					id,
					name,
					current_stock,
					categories (
						id,
						name
					)
				)
			`)
			.eq("id", transactionData.id)
			.single();

		if (fetchError) {
			console.error("履歴詳細取得エラー:", fetchError);
			return NextResponse.json(
				{ error: "履歴の取得に失敗しました" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ transaction }, { status: 201 });

	} catch (error) {
		console.error("入出庫記録作成エラー:", error);
		if (error instanceof Error && "issues" in error) {
			return NextResponse.json(
				{ error: "入力データが正しくありません", details: error },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ error: "サーバーエラーが発生しました" },
			{ status: 500 }
		);
	}
}