import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ProductForm } from "@/components/products/product-form";

interface EditProductPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
	const { id } = await params;
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	// 商品データとカテゴリ一覧を取得
	const supabase = await createServerSupabaseClient();
	
	const [productResult, categoriesResult] = await Promise.all([
		supabase
			.from("products")
			.select(`
				*,
				categories (
					id,
					name
				)
			`)
			.eq("id", id)
			.single(),
		supabase
			.from("categories")
			.select("*")
			.order("name")
	]);

	if (productResult.error || !productResult.data) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-slate-50">
			<div className="container mx-auto p-6">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-3xl font-bold text-slate-900">商品編集</h1>
						<p className="text-slate-600 mt-1">商品情報を編集します</p>
					</div>
				</div>
				<div className="max-w-2xl">
					<ProductForm 
						categories={categoriesResult.data || []} 
						initialData={productResult.data}
					/>
				</div>
			</div>
		</div>
	);
}