import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ProductForm } from "@/components/products/product-form";
import { AppLayout } from "@/components/layout/app-layout";

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
		<AppLayout 
			title="商品登録" 
			description="新しい商品を登録します"
			className="max-w-2xl"
		>
			<ProductForm categories={categories || []} />
		</AppLayout>
	);
}