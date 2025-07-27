"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-display";
import { type ProductSchema, productSchema } from "@/lib/validations";
import type { Database } from "@/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type ProductFormData = ProductSchema;

type Product = Database["public"]["Tables"]["products"]["Row"] & {
	categories: {
		id: string;
		name: string;
	} | null;
};

interface ProductFormProps {
	categories: Category[];
	initialData?: Product;
	onSuccess?: () => void;
}

export function ProductForm({
	categories,
	initialData,
	onSuccess,
}: ProductFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const isEditing = !!initialData;

	const form = useForm<ProductFormData>({
		resolver: zodResolver(productSchema),
		defaultValues: {
			name: initialData?.name || "",
			categoryId: initialData?.category_id || "",
			price: initialData?.price || 0,
			minStockThreshold: initialData?.min_stock_threshold || 0,
			description: initialData?.description || "",
		},
	});

	const onSubmit = async (data: ProductFormData) => {
		try {
			setIsSubmitting(true);

			const url = isEditing
				? `/api/products/${initialData.id}`
				: "/api/products";
			const method = isEditing ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error ||
						`商品の${isEditing ? "更新" : "登録"}に失敗しました`,
				);
			}

			toast.success(`商品を${isEditing ? "更新" : "登録"}しました`);

			if (onSuccess) {
				onSuccess();
			} else {
				router.push("/products");
			}
		} catch (error) {
			console.error("商品登録エラー:", error);
			toast.error(
				error instanceof Error ? error.message : "商品の登録に失敗しました",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{isEditing ? "商品編集" : "商品登録"}</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="product-form">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>商品名</FormLabel>
									<FormControl>
										<Input placeholder="商品名を入力してください" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>カテゴリ</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="カテゴリを選択してください" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categories.map((category) => (
												<SelectItem key={category.id} value={category.id}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>価格</FormLabel>
										<FormControl>
											<Input
												type="number"
												min="0"
												step="1"
												placeholder="0"
												{...field}
												value={field.value}
												onChange={(e) =>
													field.onChange(Number(e.target.value) || 0)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="minStockThreshold"
								render={({ field }) => (
									<FormItem>
										<FormLabel>在庫下限値</FormLabel>
										<FormControl>
											<Input
												type="number"
												min="0"
												step="1"
												placeholder="0"
												{...field}
												value={field.value}
												onChange={(e) =>
													field.onChange(Number(e.target.value) || 0)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>商品説明</FormLabel>
									<FormControl>
										<Textarea
											placeholder="商品の説明を入力してください（任意）"
											className="resize-none"
											rows={4}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex items-center gap-4">
							<Button
								type="submit"
								disabled={isSubmitting}
								className="w-full md:w-auto"
							>
								{isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
								{isSubmitting
									? `${isEditing ? "更新" : "登録"}中...`
									: `${isEditing ? "更新" : "登録"}する`}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => router.push("/products")}
								disabled={isSubmitting}
								className="w-full md:w-auto"
							>
								キャンセル
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
