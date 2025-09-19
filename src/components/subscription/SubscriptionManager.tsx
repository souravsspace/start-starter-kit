import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useSubscription } from "@/hooks/use-subscription";
import { api } from "convex/_generated/api";
import type { SubscriptionPlan } from "convex/polar";
import { useQuery } from "convex/react";
import { ExternalLink, Loader2 } from "lucide-react";

export function SubscriptionManager() {
	const {
		subscriptionStatus,
		isLoading,
		handlePlanChange,
		getPlanDisplayName,
		getPlanPrice,
	} = useSubscription();
	const customerPortalUrl = useQuery(api.polar.getCustomerPortalUrl);

	if (!subscriptionStatus?.isAuthenticated) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Subscription Management</CardTitle>
					<CardDescription>
						Please log in to manage your subscription
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	const currentPlan = subscriptionStatus.currentPlan;
	const availablePlans: SubscriptionPlan[] = [
		"starter",
		"professional",
		"premiumLifetime",
	];

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						Current Subscription
						{currentPlan !== "starter" && (
							<Badge variant="secondary">
								{getPlanDisplayName(currentPlan)} - {getPlanPrice(currentPlan)}
							</Badge>
						)}
					</CardTitle>
					<CardDescription>
						{currentPlan === "starter" &&
							"You're currently on the free Starter plan"}
						{currentPlan === "professional" &&
							"You're currently on the Professional monthly plan"}
						{currentPlan === "premiumLifetime" &&
							"You have lifetime access to all premium features"}
					</CardDescription>
				</CardHeader>
				{subscriptionStatus.subscription && (
					<CardContent>
						<div className="space-y-2 text-sm text-muted-foreground">
							<div>
								Status:{" "}
								<span className="font-medium">
									{subscriptionStatus.subscription.status}
								</span>
							</div>
							{subscriptionStatus.subscription.currentPeriodEnd && (
								<div>
									Next billing date:{" "}
									<span className="font-medium">
										{new Date(
											subscriptionStatus.subscription.currentPeriodEnd * 1000,
										).toLocaleDateString()}
									</span>
								</div>
							)}
							{subscriptionStatus.subscription.cancelAtPeriodEnd && (
								<div className="text-orange-600">
									Your subscription will cancel at the end of the current
									billing period
								</div>
							)}
						</div>
					</CardContent>
				)}
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Available Plans</CardTitle>
					<CardDescription>
						{currentPlan === "starter" && "Upgrade to unlock premium features"}
						{currentPlan === "professional" &&
							"Upgrade to lifetime or downgrade to starter"}
						{currentPlan === "premiumLifetime" &&
							"You can downgrade to the starter plan if needed"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						{availablePlans.map((plan) => {
							const isCurrentPlan = plan === currentPlan;
							const canChange =
								subscriptionStatus.canUpgradeTo.includes(plan) ||
								subscriptionStatus.canDowngradeTo.includes(plan);

							return (
								<Card
									key={plan}
									className={isCurrentPlan ? "border-primary" : ""}
								>
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center justify-between text-lg">
											{getPlanDisplayName(plan)}
											{isCurrentPlan && (
												<Badge variant="default">Current</Badge>
											)}
										</CardTitle>
										<CardDescription className="text-2xl font-bold">
											{getPlanPrice(plan)}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{plan === "starter" && (
												<ul className="text-sm space-y-1">
													<li>• Core platform features</li>
													<li>• Basic analytics</li>
													<li>• Community support</li>
												</ul>
											)}
											{plan === "professional" && (
												<ul className="text-sm space-y-1">
													<li>• Everything in Starter</li>
													<li>• Advanced analytics</li>
													<li>• Priority support</li>
													<li>• API access</li>
												</ul>
											)}
											{plan === "premiumLifetime" && (
												<ul className="text-sm space-y-1">
													<li>• Everything in Professional</li>
													<li>• Lifetime access</li>
													<li>• All future updates</li>
													<li>• No recurring fees</li>
												</ul>
											)}

											<Button
												className="w-full"
												variant={isCurrentPlan ? "outline" : "default"}
												disabled={!canChange || isLoading || isCurrentPlan}
												onClick={() => handlePlanChange(plan)}
											>
												{isLoading && (
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												)}
												{isCurrentPlan
													? "Current Plan"
													: subscriptionStatus.canUpgradeTo.includes(plan)
														? "Upgrade"
														: subscriptionStatus.canDowngradeTo.includes(plan)
															? "Downgrade"
															: "Not Available"}
											</Button>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{customerPortalUrl && currentPlan !== "starter" && (
				<Card>
					<CardHeader>
						<CardTitle>Manage Billing</CardTitle>
						<CardDescription>
							Access your customer portal to update payment methods, view
							invoices, and manage billing information
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild>
							<a
								href={customerPortalUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								<ExternalLink className="mr-2 h-4 w-4" />
								Open Customer Portal
							</a>
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
