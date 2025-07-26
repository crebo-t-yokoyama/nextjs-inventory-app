import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
		}

		const supabase = await createServerSupabaseClient();

		// 並列でデータを取得
		const [
			productsResult,
			categoryStatsResult,
		] = await Promise.all([
			// 商品総数と在庫総数
			supabase
				.from("products")
				.select("id, current_stock, min_stock_threshold"),
			
			// カテゴリ別統計
			supabase
				.from("categories")
				.select(`
					id,
					name,
					products (
						id,
						current_stock,
						min_stock_threshold
					)
				`)
		]);

		if (productsResult.error || categoryStatsResult.error) {
			console.error("ダッシュボードデータ取得エラー:", {
				products: productsResult.error,
				categories: categoryStatsResult.error,
			});
			return NextResponse.json(
				{ error: "データの取得に失敗しました" },
				{ status: 500 }
			);
		}

		// 統計データを計算
		const products = productsResult.data || [];
		const totalProducts = products.length;
		const totalStock = products.reduce((sum, p) => sum + (p.current_stock || 0), 0);

		// 在庫状況をカウント
		const stockStatusCounts = products.reduce((counts, product) => {
			const stock = product.current_stock || 0;
			const threshold = product.min_stock_threshold || 0;
			
			if (stock === 0) {
				counts.out_of_stock++;
			} else if (stock <= threshold) {
				counts.low_stock++;
			}
			return counts;
		}, { out_of_stock: 0, low_stock: 0 });

		// カテゴリ別統計を整形
		const categoryStats = (categoryStatsResult.data || []).map(category => {
			const categoryProducts = category.products || [];
			const totalProducts = categoryProducts.length;
			const totalStock = categoryProducts.reduce((sum, p) => sum + (p.current_stock || 0), 0);
			const lowStockCount = categoryProducts.filter(p => 
				p.current_stock <= p.min_stock_threshold
			).length;

			return {
				id: category.id,
				name: category.name,
				totalProducts,
				totalStock,
				lowStockCount,
			};
		});

		return NextResponse.json({
			overview: {
				totalProducts,
				totalStock,
				outOfStock: stockStatusCounts.out_of_stock,
				lowStock: stockStatusCounts.low_stock,
			},
			categoryStats,
		});
	} catch (error) {
		console.error("ダッシュボードAPI エラー:", error);
		return NextResponse.json(
			{ error: "サーバーエラーが発生しました" },
			{ status: 500 }
		);
	}
}