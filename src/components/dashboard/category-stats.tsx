"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategoryStat {
	id: string;
	name: string;
	totalProducts: number;
	totalStock: number;
	lowStockCount: number;
}

interface CategoryStatsProps {
	stats: CategoryStat[];
}

export function CategoryStats({ stats }: CategoryStatsProps) {
	return (
		<Card className="p-6">
			<h3 className="font-semibold text-slate-900 mb-4">カテゴリ別統計</h3>
			<div className="space-y-4">
				{stats.map((stat) => (
					<div key={stat.id} className="border-b border-slate-100 pb-3 last:border-0">
						<div className="flex items-center justify-between mb-2">
							<h4 className="font-medium text-slate-700">{stat.name}</h4>
							{stat.lowStockCount > 0 && (
								<Badge variant="outline" className="text-xs text-amber-600 border-amber-200">
									警告 {stat.lowStockCount}
								</Badge>
							)}
						</div>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-slate-500">商品数</p>
								<p className="font-semibold text-slate-900">{stat.totalProducts}</p>
							</div>
							<div>
								<p className="text-slate-500">在庫数</p>
								<p className="font-semibold text-slate-900">{stat.totalStock.toLocaleString()}</p>
							</div>
						</div>
						<div className="mt-2">
							<div className="flex items-center gap-2">
								<div className="flex-1 bg-slate-100 rounded-full h-2">
									<div
										className="bg-blue-600 h-2 rounded-full"
										style={{
											width: `${Math.min((stat.totalStock / 1000) * 100, 100)}%`,
										}}
									/>
								</div>
								<span className="text-xs text-slate-500">
									{Math.round((stat.totalStock / 1000) * 100)}%
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</Card>
	);
}