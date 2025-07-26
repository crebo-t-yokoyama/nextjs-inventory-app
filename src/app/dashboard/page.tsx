import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className="min-h-screen bg-slate-50">
			<div className="container mx-auto p-6">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-slate-900">ダッシュボード</h1>
					<p className="text-slate-600 mt-1">在庫状況の概要</p>
				</div>
				<DashboardContent />
			</div>
		</div>
	);
}