import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProductList } from "@/components/products/product-list";
import { AppLayout } from "@/components/layout/app-layout";

export default async function ProductsPage() {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<AppLayout 
			title="商品管理" 
			description="商品の登録・編集・削除を行います"
		>
			<ProductList />
		</AppLayout>
	);
}