"use client";

import { useEffect, useState } from "react";
import { StatCard } from "./stat-card";
import { StockAlerts } from "./stock-alerts";
import { CategoryStats } from "./category-stats";
import { 
	Package, 
	ShoppingCart, 
	AlertTriangle, 
	TrendingDown
} from "lucide-react";
import { LoadingDisplay } from "@/components/ui/loading-display";
import { ErrorDisplay } from "@/components/ui/error-display";
import { StatsGrid } from "@/components/ui/responsive-grid";

interface DashboardData {
	overview: {
		totalProducts: number;
		totalStock: number;
		outOfStock: number;
		lowStock: number;
	};
	categoryStats: Array<{
		id: string;
		name: string;
		totalProducts: number;
		totalStock: number;
		lowStockCount: number;
	}>;
	lowStockProducts?: Array<{
		id: string;
		name: string;
		currentStock: number;
		minStockThreshold: number;
		category: string;
	}>;
}

export function DashboardContent() {
	const [data, setData] = useState<DashboardData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchDashboardData();
	}, []);

	const fetchDashboardData = async () => {
		try {
			setLoading(true);
			// 統計データを取得
			const [statsResponse, productsResponse] = await Promise.all([
				fetch("/api/dashboard/stats"),
				fetch("/api/products"),
			]);

			if (!statsResponse.ok || !productsResponse.ok) {
				throw new Error("データの取得に失敗しました");
			}

			const statsData = await statsResponse.json();
			const productsData = await productsResponse.json();

			// 在庫警告商品を抽出
			const lowStockProducts = productsData.products
				?.filter((p: any) => p.current_stock <= p.min_stock_threshold)
				.map((p: any) => ({
					id: p.id,
					name: p.name,
					currentStock: p.current_stock,
					minStockThreshold: p.min_stock_threshold,
					category: p.categories?.name || "未分類",
				})) || [];

			setData({
				...statsData,
				lowStockProducts,
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "エラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <LoadingDisplay message="ダッシュボードデータを読み込み中..." />;
	}

	if (error || !data) {
		return (
			<ErrorDisplay
				message={error || "ダッシュボードデータの取得に失敗しました"}
				onRetry={fetchDashboardData}
			/>
		);
	}

	return (
		<div className="space-y-6">
			{/* 統計カード */}
			<StatsGrid>
				<StatCard
					title="総商品数"
					value={data.overview.totalProducts}
					description="登録済み商品"
					icon={Package}
					iconColor="text-blue-600"
				/>
				<StatCard
					title="総在庫数"
					value={data.overview.totalStock.toLocaleString()}
					description="全商品の合計"
					icon={ShoppingCart}
					iconColor="text-green-600"
				/>
				<StatCard
					title="在庫切れ"
					value={data.overview.outOfStock}
					description="在庫が0の商品"
					icon={TrendingDown}
					iconColor="text-red-600"
				/>
				<StatCard
					title="在庫警告"
					value={data.overview.lowStock}
					description="下限値以下の商品"
					icon={AlertTriangle}
					iconColor="text-amber-600"
				/>
			</StatsGrid>

			{/* メインコンテンツエリア */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* カテゴリ別統計 */}
				<CategoryStats stats={data.categoryStats} />
				
				{/* 在庫警告 */}
				<StockAlerts alerts={data.lowStockProducts || []} />
			</div>
		</div>
	);
}