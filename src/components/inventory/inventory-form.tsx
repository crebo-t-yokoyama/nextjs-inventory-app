"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inventoryTransactionSchema, type InventoryTransactionSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Package, Plus, Minus } from "lucide-react";

interface Product {
	id: string;
	name: string;
	current_stock: number;
	categories?: {
		name: string;
	};
}

interface InventoryFormProps {
	products: Product[];
	onSuccess: () => void;
}

export function InventoryForm({ products, onSuccess }: InventoryFormProps) {
	const [loading, setLoading] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm<InventoryTransactionSchema>({
		resolver: zodResolver(inventoryTransactionSchema),
	});

	const transactionType = watch("transactionType");

	const onSubmit = async (data: InventoryTransactionSchema) => {
		try {
			setLoading(true);

			const response = await fetch("/api/inventory", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "処理に失敗しました");
			}

			const result = await response.json();
			
			toast.success(
				`${transactionType === "IN" ? "入庫" : "出庫"}処理が完了しました`,
				{
					description: `商品: ${result.transaction.products.name} / 数量: ${data.quantity}`,
				}
			);

			reset();
			setSelectedProduct(null);
			onSuccess();
		} catch (error) {
			console.error("入出庫処理エラー:", error);
			toast.error(error instanceof Error ? error.message : "処理に失敗しました");
		} finally {
			setLoading(false);
		}
	};

	const handleProductSelect = (productId: string) => {
		const product = products.find(p => p.id === productId);
		setSelectedProduct(product || null);
		setValue("productId", productId);
	};

	return (
		<Card className="p-6">
			<div className="flex items-center gap-2 mb-6">
				<Package className="h-5 w-5 text-slate-600" />
				<h3 className="text-lg font-semibold text-slate-900">入出庫処理</h3>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{/* 商品選択 */}
				<div className="space-y-2">
					<Label htmlFor="productId">商品</Label>
					<Select onValueChange={handleProductSelect}>
						<SelectTrigger>
							<SelectValue placeholder="商品を選択してください" />
						</SelectTrigger>
						<SelectContent>
							{products.map((product) => (
								<SelectItem key={product.id} value={product.id}>
									<div className="flex items-center justify-between w-full">
										<span>{product.name}</span>
										<span className="text-sm text-slate-500 ml-2">
											在庫: {product.current_stock}
										</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.productId && (
						<p className="text-sm text-red-600">{errors.productId.message}</p>
					)}
				</div>

				{/* 現在在庫表示 */}
				{selectedProduct && (
					<Card className="p-3 bg-slate-50">
						<div className="flex items-center justify-between text-sm">
							<span className="text-slate-600">現在在庫</span>
							<span className="font-semibold text-slate-900">
								{selectedProduct.current_stock.toLocaleString()}
							</span>
						</div>
						{selectedProduct.categories && (
							<div className="text-xs text-slate-500 mt-1">
								カテゴリ: {selectedProduct.categories.name}
							</div>
						)}
					</Card>
				)}

				{/* 入出庫種別 */}
				<div className="space-y-2">
					<Label>入出庫種別</Label>
					<div className="grid grid-cols-2 gap-2">
						<Button
							type="button"
							variant={transactionType === "IN" ? "default" : "outline"}
							className={transactionType === "IN" ? "bg-green-600 hover:bg-green-700" : ""}
							onClick={() => setValue("transactionType", "IN")}
						>
							<Plus className="h-4 w-4 mr-2" />
							入庫
						</Button>
						<Button
							type="button"
							variant={transactionType === "OUT" ? "default" : "outline"}
							className={transactionType === "OUT" ? "bg-red-600 hover:bg-red-700" : ""}
							onClick={() => setValue("transactionType", "OUT")}
						>
							<Minus className="h-4 w-4 mr-2" />
							出庫
						</Button>
					</div>
					{errors.transactionType && (
						<p className="text-sm text-red-600">{errors.transactionType.message}</p>
					)}
				</div>

				{/* 数量 */}
				<div className="space-y-2">
					<Label htmlFor="quantity">数量</Label>
					<Input
						id="quantity"
						type="number"
						min="1"
						placeholder="数量を入力"
						{...register("quantity", { valueAsNumber: true })}
					/>
					{errors.quantity && (
						<p className="text-sm text-red-600">{errors.quantity.message}</p>
					)}
					{/* 出庫時の在庫不足警告 */}
					{selectedProduct && transactionType === "OUT" && (
						<div className="text-sm text-slate-600">
							※ 最大出庫可能数: {selectedProduct.current_stock}
						</div>
					)}
				</div>

				{/* 備考 */}
				<div className="space-y-2">
					<Label htmlFor="notes">備考（任意）</Label>
					<Textarea
						id="notes"
						placeholder="備考を入力してください"
						{...register("notes")}
					/>
				</div>

				{/* 送信ボタン */}
				<Button
					type="submit"
					disabled={loading || !selectedProduct}
					className="w-full"
				>
					{loading ? (
						<>
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							処理中...
						</>
					) : (
						<>
							{transactionType === "IN" ? "入庫" : "出庫"}処理を実行
						</>
					)}
				</Button>
			</form>
		</Card>
	);
}