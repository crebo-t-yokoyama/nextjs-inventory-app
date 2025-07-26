import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProductList } from "@/components/products/product-list";

export default async function ProductsPage() {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className="min-h-screen bg-slate-50">
			<div className="container mx-auto p-6">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-3xl font-bold text-slate-900">商品管理</h1>
						<p className="text-slate-600 mt-1">商品の登録・編集・削除を行います</p>
					</div>
				</div>
				<ProductList />
			</div>
		</div>
	);
}