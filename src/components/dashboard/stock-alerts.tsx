"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Package } from "lucide-react";
import Link from "next/link";

interface StockAlert {
	id: string;
	name: string;
	currentStock: number;
	minStockThreshold: number;
	category: string;
}

interface StockAlertsProps {
	alerts: StockAlert[];
}

export function StockAlerts({ alerts }: StockAlertsProps) {
	if (alerts.length === 0) {
		return (
			<Card className="p-6">
				<div className="flex items-center gap-2 text-green-600">
					<Package className="h-5 w-5" />
					<h3 className="font-semibold">在庫状況良好</h3>
				</div>
				<p className="text-sm text-slate-600 mt-2">
					すべての商品が適正在庫レベルを維持しています
				</p>
			</Card>
		);
	}

	return (
		<Card className="p-6">
			<div className="flex items-center gap-2 mb-4">
				<AlertTriangle className="h-5 w-5 text-amber-600" />
				<h3 className="font-semibold text-slate-900">在庫警告</h3>
			</div>
			<div className="space-y-3">
				{alerts.slice(0, 5).map((alert) => (
					<Alert key={alert.id} className="border-amber-200 bg-amber-50">
						<AlertTriangle className="h-4 w-4 text-amber-600" />
						<AlertTitle className="text-sm font-medium">
							{alert.name}
						</AlertTitle>
						<AlertDescription className="mt-2">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<p className="text-sm">
										現在庫: <span className="font-semibold">{alert.currentStock}</span>
										{" / "}
										下限値: <span className="font-semibold">{alert.minStockThreshold}</span>
									</p>
									<Badge variant="outline" className="text-xs">
										{alert.category}
									</Badge>
								</div>
								<Link
									href={`/products/${alert.id}/edit`}
									className="text-sm text-blue-600 hover:text-blue-800"
								>
									編集
								</Link>
							</div>
						</AlertDescription>
					</Alert>
				))}
			</div>
			{alerts.length > 5 && (
				<div className="mt-4 text-center">
					<Link
						href="/products?filter=low-stock"
						className="text-sm text-blue-600 hover:text-blue-800"
					>
						すべての警告を見る ({alerts.length}件)
					</Link>
				</div>
			)}
		</Card>
	);
}