import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { InventoryContent } from "@/components/inventory/inventory-content";

export default async function InventoryPage() {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className="min-h-screen bg-slate-50">
			<div className="container mx-auto p-6">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-3xl font-bold text-slate-900">入出庫管理</h1>
						<p className="text-slate-600 mt-1">在庫の入出庫履歴を管理します</p>
					</div>
				</div>
				<InventoryContent />
			</div>
		</div>
	);
}