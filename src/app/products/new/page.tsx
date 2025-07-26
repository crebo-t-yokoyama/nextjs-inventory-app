import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ProductForm } from "@/components/products/product-form";

export default async function NewProductPage() {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	// カテゴリ一覧を取得
	const supabase = await createServerSupabaseClient();
	const { data: categories } = await supabase
		.from("categories")
		.select("*")
		.order("name");

	return (
		<div className="min-h-screen bg-slate-50">
			<div className="container mx-auto p-6">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-3xl font-bold text-slate-900">商品登録</h1>
						<p className="text-slate-600 mt-1">新しい商品を登録します</p>
					</div>
				</div>
				<div className="max-w-2xl">
					<ProductForm categories={categories || []} />
				</div>
			</div>
		</div>
	);
}