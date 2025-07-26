import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { AppLayout } from "@/components/layout/app-layout";

export default async function DashboardPage() {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<AppLayout 
			title="ダッシュボード" 
			description="在庫状況の概要"
			showBreadcrumb={false}
		>
			<DashboardContent />
		</AppLayout>
	);
}