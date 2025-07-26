import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ProductForm } from "@/components/products/product-form";
import { AppLayout } from "@/components/layout/app-layout";

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
		<AppLayout 
			title="商品編集" 
			description="商品情報を編集します"
			className="max-w-2xl"
		>
			<ProductForm 
				categories={categoriesResult.data || []} 
				initialData={productResult.data}
			/>
		</AppLayout>
	);
}