import { z } from "zod";

// ログインフォーム
export const loginSchema = z.object({
	email: z
		.string({ message: "メールアドレスは必須です" })
		.email("正しいメールアドレスを入力してください"),
	password: z
		.string({ message: "パスワードは必須です" })
		.min(6, "パスワードは6文字以上で入力してください"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

// 商品登録・編集
export const productSchema = z.object({
	name: z
		.string({ message: "商品名は必須です" })
		.min(1, "商品名は必須です"),
	categoryId: z
		.string({ message: "カテゴリを選択してください" })
		.uuid("カテゴリを選択してください"),
	price: z
		.number({ message: "価格を入力してください" })
		.min(0, "価格は0以上で入力してください"),
	minStockThreshold: z
		.number({ message: "在庫下限値を入力してください" })
		.min(0, "在庫下限値は0以上で入力してください"),
	description: z.string().optional(),
});

export type ProductSchema = z.infer<typeof productSchema>;

// 入出庫記録
export const inventoryTransactionSchema = z.object({
	productId: z
		.string({ message: "商品を選択してください" })
		.uuid("商品を選択してください"),
	transactionType: z.enum(["IN", "OUT"], {
		message: "入出庫種別を選択してください",
	}),
	quantity: z
		.number({ message: "数量を入力してください" })
		.min(1, "数量は1以上で入力してください"),
	notes: z.string().optional(),
});

export type InventoryTransactionSchema = z.infer<typeof inventoryTransactionSchema>;