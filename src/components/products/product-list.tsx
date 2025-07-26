"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { LoadingDisplay } from "@/components/ui/loading-display";
import { ErrorDisplay } from "@/components/ui/error-display";
import { NoProductsState } from "@/components/ui/empty-state";
import { columns } from "./columns";
import type { Database } from "@/types/database";
import { useRouter } from "next/navigation";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
	categories: {
		id: string;
		name: string;
	} | null;
};

export function ProductList() {
	const router = useRouter();
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
		return <LoadingDisplay message="商品データを読み込み中..." />;
	}

	if (error) {
		return (
			<ErrorDisplay
				message={error}
				onRetry={fetchProducts}
			/>
		);
	}

	if (products.length === 0) {
		return (
			<NoProductsState 
				onAddProduct={() => router.push('/products/new')}
			/>
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div />
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