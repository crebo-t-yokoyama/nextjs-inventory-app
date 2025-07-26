import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function DashboardPage() {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className="min-h-screen bg-slate-50 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-3xl font-bold text-slate-900">ダッシュボード</h1>
						<p className="text-slate-600 mt-1">
							こんにちは、{session.user.name || session.user.email}さん
						</p>
					</div>
					<LogoutButton />
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-base">総商品数</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">0</div>
							<p className="text-xs text-muted-foreground">
								登録済み商品
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-base">総在庫数</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">0</div>
							<p className="text-xs text-muted-foreground">
								現在の在庫数
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-base">在庫切れ商品</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-red-600">0</div>
							<p className="text-xs text-muted-foreground">
								在庫切れ商品数
							</p>
						</CardContent>
					</Card>
				</div>

				<div className="mt-8">
					<Card>
						<CardHeader>
							<CardTitle>最近の入出庫履歴</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-slate-500 text-center py-8">
								まだ入出庫履歴がありません
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}