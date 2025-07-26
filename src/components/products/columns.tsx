"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Database } from "@/types/database";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
	categories: {
		id: string;
		name: string;
	} | null;
};

export const columns: ColumnDef<Product>[] = [
	{
		accessorKey: "product_code",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="h-auto p-0 font-semibold hover:bg-transparent"
				>
					商品コード
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="font-mono text-xs">{row.getValue("product_code")}</div>
		),
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="h-auto p-0 font-semibold hover:bg-transparent"
				>
					商品名
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
	},
	{
		accessorKey: "categories",
		header: "カテゴリ",
		cell: ({ row }) => {
			const category = row.getValue("categories") as Product["categories"];
			return category ? (
				<Badge variant="secondary">{category.name}</Badge>
			) : (
				<span className="text-muted-foreground">未設定</span>
			);
		},
		filterFn: (row, id, value) => {
			const category = row.getValue(id) as Product["categories"];
			return value.includes(category?.name || "");
		},
	},
	{
		accessorKey: "price",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="h-auto p-0 font-semibold hover:bg-transparent"
				>
					価格
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const price = parseFloat(row.getValue("price"));
			return (
				<div className="text-right font-medium">
					¥{price.toLocaleString()}
				</div>
			);
		},
	},
	{
		accessorKey: "current_stock",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="h-auto p-0 font-semibold hover:bg-transparent"
				>
					在庫数
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const stock = row.getValue("current_stock") as number;
			const threshold = row.original.min_stock_threshold;
			
			return (
				<div className="text-right">
					<Badge 
						variant={stock <= threshold ? "destructive" : stock <= threshold * 2 ? "secondary" : "default"}
					>
						{stock}
					</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: "min_stock_threshold",
		header: "下限値",
		cell: ({ row }) => (
			<div className="text-right text-muted-foreground">
				{row.getValue("min_stock_threshold")}
			</div>
		),
	},
	{
		id: "actions",
		header: "操作",
		cell: ({ row }) => {
			const product = row.original;

			return (
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						asChild
					>
						<Link href={`/products/${product.id}/edit`}>
							<Pencil className="h-4 w-4" />
							編集
						</Link>
					</Button>
				</div>
			);
		},
	},
];