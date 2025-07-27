import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ItemsPage() {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Items</h1>
				<button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
					Add New Item
				</button>
			</div>
			
			{/* Sample table */}
			<div className="bg-white rounded-lg shadow overflow-hidden">
				<table className="w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Description
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Created At
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						<tr>
							<td colSpan={4} className="px-6 py-4 text-center text-gray-500">
								No items found. This is a template - connect to your database to show real data.
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}