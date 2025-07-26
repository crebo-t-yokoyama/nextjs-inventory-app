import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
	title: string;
	value: string | number;
	description?: string;
	icon: LucideIcon;
	iconColor?: string;
	trend?: {
		value: number;
		isPositive: boolean;
	};
}

export function StatCard({
	title,
	value,
	description,
	icon: Icon,
	iconColor = "text-slate-600",
	trend,
}: StatCardProps) {
	return (
		<Card className="p-6">
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<p className="text-sm font-medium text-slate-600">{title}</p>
					<p className="text-2xl font-bold text-slate-900">{value}</p>
					{description && (
						<p className="text-sm text-slate-500">{description}</p>
					)}
					{trend && (
						<div className="flex items-center gap-1 text-sm">
							<span
								className={cn(
									"font-medium",
									trend.isPositive ? "text-green-600" : "text-red-600"
								)}
							>
								{trend.isPositive ? "+" : ""}{trend.value}%
							</span>
							<span className="text-slate-500">前月比</span>
						</div>
					)}
				</div>
				<div className={cn("p-3 rounded-full bg-slate-50", iconColor)}>
					<Icon className="h-6 w-6" />
				</div>
			</div>
		</Card>
	);
}