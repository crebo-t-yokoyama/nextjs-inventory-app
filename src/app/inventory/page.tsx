import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { InventoryContent } from "@/components/inventory/inventory-content";
import { AppLayout } from "@/components/layout/app-layout";

export default async function InventoryPage() {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<AppLayout 
			title="入出庫管理" 
			description="在庫の入出庫履歴を管理します"
		>
			<InventoryContent />
		</AppLayout>
	);
}