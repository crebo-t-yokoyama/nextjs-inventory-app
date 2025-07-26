"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export interface InventoryTransaction {
	id: string;
	transaction_type: "IN" | "OUT";
	quantity: number;
	notes?: string;
	transaction_date: string;
	products: {
		id: string;
		name: string;
		categories?: {
			id: string;
			name: string;
		};
	};
}

export const inventoryColumns: ColumnDef<InventoryTransaction>[] = [
	{
		accessorKey: "transaction_date",
		header: "日時",
		cell: ({ row }) => {
			const date = new Date(row.getValue("transaction_date"));
			return (
				<div className="text-sm">
					{format(date, "yyyy/MM/dd HH:mm", { locale: ja })}
				</div>
			);
		},
	},
	{
		accessorKey: "transaction_type",
		header: "種別",
		cell: ({ row }) => {
			const type = row.getValue("transaction_type") as string;
			return (
				<Badge
					variant={type === "IN" ? "default" : "destructive"}
					className={
						type === "IN"
							? "bg-green-100 text-green-800 hover:bg-green-200"
							: "bg-red-100 text-red-800 hover:bg-red-200"
					}
				>
					{type === "IN" ? "入庫" : "出庫"}
				</Badge>
			);
		},
	},
	{
		accessorKey: "products",
		header: "商品名",
		cell: ({ row }) => {
			const product = row.getValue("products") as InventoryTransaction["products"];
			return (
				<div>
					<div className="font-medium text-slate-900">{product.name}</div>
					{product.categories && (
						<div className="text-sm text-slate-500">{product.categories.name}</div>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "quantity",
		header: "数量",
		cell: ({ row }) => {
			const quantity = row.getValue("quantity") as number;
			const type = row.getValue("transaction_type") as string;
			return (
				<div className={`font-medium ${type === "IN" ? "text-green-600" : "text-red-600"}`}>
					{type === "IN" ? "+" : "-"}{quantity.toLocaleString()}
				</div>
			);
		},
	},
	{
		accessorKey: "notes",
		header: "備考",
		cell: ({ row }) => {
			const notes = row.getValue("notes") as string;
			return notes ? (
				<div className="text-sm text-slate-600 max-w-xs truncate" title={notes}>
					{notes}
				</div>
			) : (
				<span className="text-slate-400">-</span>
			);
		},
	},
];