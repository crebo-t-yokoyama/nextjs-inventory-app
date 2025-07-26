"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { InventoryForm } from "./inventory-form";
import { inventoryColumns, type InventoryTransaction } from "./inventory-columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, Search, Filter, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Product {
	id: string;
	name: string;
	current_stock: number;
	categories?: {
		name: string;
	};
}

export function InventoryContent() {
	const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	
	// フィルター状態
	const [searchQuery, setSearchQuery] = useState("");
	const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>("");
	const [selectedProductFilter, setSelectedProductFilter] = useState<string>("");

	useEffect(() => {
		fetchInitialData();
	}, []);

	const fetchInitialData = async () => {
		try {
			setLoading(true);
			await Promise.all([
				fetchTransactions(),
				fetchProducts(),
			]);
		} catch (error) {
			console.error("初期データ取得エラー:", error);
			toast.error("データの取得に失敗しました");
		} finally {
			setLoading(false);
		}
	};

	const fetchTransactions = async () => {
		try {
			const params = new URLSearchParams();
			if (transactionTypeFilter) params.append("transactionType", transactionTypeFilter);
			if (selectedProductFilter) params.append("productId", selectedProductFilter);
			params.append("limit", "100");

			const response = await fetch(`/api/inventory?${params}`);
			if (!response.ok) throw new Error("履歴の取得に失敗しました");
			
			const data = await response.json();
			setTransactions(data.transactions || []);
		} catch (error) {
			console.error("履歴取得エラー:", error);
			throw error;
		}
	};

	const fetchProducts = async () => {
		try {
			const response = await fetch("/api/products");
			if (!response.ok) throw new Error("商品の取得に失敗しました");
			
			const data = await response.json();
			setProducts(data.products || []);
		} catch (error) {
			console.error("商品取得エラー:", error);
			throw error;
		}
	};

	const handleFormSuccess = async () => {
		try {
			setSubmitting(true);
			await Promise.all([
				fetchTransactions(),
				fetchProducts(), // 在庫数更新のため商品データも再取得
			]);
		} catch (error) {
			console.error("データ更新エラー:", error);
			toast.error("データの更新に失敗しました");
		} finally {
			setSubmitting(false);
		}
	};

	const handleRefresh = async () => {
		await fetchInitialData();
		toast.success("データを更新しました");
	};

	const handleFilterChange = () => {
		fetchTransactions();
	};

	// 検索・フィルタリング
	const filteredTransactions = transactions.filter(transaction => {
		const matchesSearch = searchQuery === "" || 
			transaction.products.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(transaction.notes && transaction.notes.toLowerCase().includes(searchQuery.toLowerCase()));
		
		return matchesSearch;
	});

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="h-8 w-8 animate-spin text-slate-600" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* 入出庫フォーム */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-1">
					<InventoryForm 
						products={products} 
						onSuccess={handleFormSuccess}
					/>
				</div>
				
				{/* 履歴一覧 */}
				<div className="lg:col-span-2">
					<Card className="p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-slate-900">入出庫履歴</h3>
							<Button
								variant="outline"
								size="sm"
								onClick={handleRefresh}
								disabled={submitting}
							>
								<RefreshCw className={`h-4 w-4 mr-2 ${submitting ? "animate-spin" : ""}`} />
								更新
							</Button>
						</div>

						{/* 検索・フィルター */}
						<div className="flex gap-4 mb-4">
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
									<Input
										placeholder="商品名または備考で検索..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10"
									/>
								</div>
							</div>
							<Select value={transactionTypeFilter || "all"} onValueChange={(value) => {
								setTransactionTypeFilter(value === "all" ? "" : value);
								setTimeout(handleFilterChange, 100);
							}}>
								<SelectTrigger className="w-[120px]">
									<Filter className="h-4 w-4 mr-2" />
									<SelectValue placeholder="種別" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">全て</SelectItem>
									<SelectItem value="IN">入庫</SelectItem>
									<SelectItem value="OUT">出庫</SelectItem>
								</SelectContent>
							</Select>
							<Select value={selectedProductFilter || "all"} onValueChange={(value) => {
								setSelectedProductFilter(value === "all" ? "" : value);
								setTimeout(handleFilterChange, 100);
							}}>
								<SelectTrigger className="w-[200px]">
									<SelectValue placeholder="商品で絞り込み" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">全商品</SelectItem>
									{products.map((product) => (
										<SelectItem key={product.id} value={product.id}>
											{product.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* データテーブル */}
						<DataTable
							columns={inventoryColumns}
							data={filteredTransactions}
						/>
					</Card>
				</div>
			</div>
		</div>
	);
}