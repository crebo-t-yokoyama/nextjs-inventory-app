"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import type { Database } from "@/types/database";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
	categories: {
		id: string;
		name: string;
	} | null;
};

export function ProductList() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/products");
			
			if (!response.ok) {
				throw new Error("商品の取得に失敗しました");
			}

			const data = await response.json();
			setProducts(data.products || []);
		} catch (error) {
			console.error("商品取得エラー:", error);
			setError(error instanceof Error ? error.message : "エラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center h-64">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
						<p className="text-muted-foreground">読み込み中...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center h-64">
					<div className="text-center">
						<p className="text-destructive mb-4">{error}</p>
						<Button onClick={fetchProducts} variant="outline">
							再試行
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>商品一覧</CardTitle>
					<Button asChild>
						<Link href="/products/new">
							<Plus className="mr-2 h-4 w-4" />
							新規登録
						</Link>
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<DataTable
					columns={columns}
					data={products}
					searchKey="name"
					searchPlaceholder="商品名で検索..."
				/>
			</CardContent>
		</Card>
	);
}