import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">Dashboard</h1>
			
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{/* Sample dashboard cards */}
				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-2">Total Items</h2>
					<p className="text-3xl font-bold text-blue-600">--</p>
				</div>
				
				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-2">Active Users</h2>
					<p className="text-3xl font-bold text-green-600">--</p>
				</div>
				
				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
					<p className="text-3xl font-bold text-purple-600">--</p>
				</div>
			</div>
			
			<div className="mt-8">
				<h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
				<div className="space-y-4">
					<p className="text-muted-foreground">
						This is a template dashboard. Customize it based on your project needs.
					</p>
					<p className="text-muted-foreground">
						Add your own metrics, charts, and quick action buttons here.
					</p>
				</div>
			</div>
		</div>
	);
}