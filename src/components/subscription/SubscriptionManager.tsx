import { PLANS } from "@/app-config";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { usePostHogTracking } from "@/hooks/use-posthog-tracking";
import { useSubscription } from "@/hooks/use-subscription";
import {
	AlertTriangle,
	Calendar,
	CheckCircle,
	CreditCard,
	Crown,
	ExternalLink,
	Loader2,
	Settings,
	Zap,
} from "lucide-react";
import { toast } from "sonner";

// Types for subscription display
interface SubscriptionInfo {
	plan: string;
	tier: {
		id: string;
		name: string;
		description: string;
		priceMonthly: string;
		billingPeriod: string;
	};
	subscription: {
		status: string;
		current_period_end: string | null;
		current_period_start: string | null;
		cancel_at_period_end: boolean;
		price?: {
			amount: number;
			currency: string;
			interval: string;
		};
	};
}

export function SubscriptionManager() {
	const {
		subscriptionStatus,
		isLoading,
		handlePlanChange,
		getCustomerPortalUrl,
		getCurrentPlan,
	} = useSubscription();
	const { trackPageView, trackButtonClick } = usePostHogTracking();
	trackPageView({ page: "billing" });

	// Get current subscription details
	const getCurrentSubscription = (): SubscriptionInfo | null => {
		const currentPlan = getCurrentPlan();

		if (!currentPlan || currentPlan === "starter") {
			return null;
		}

		// Map Convex plan to our tiers
		let tierId: string;
		if (currentPlan === "PREMIUM_MONTHLY") {
			tierId = "premiumMonthly";
		} else if (currentPlan === "PREMIUM_YEARLY") {
			tierId = "premiumYearly";
		} else {
			return null;
		}

		const tierName =
			tierId === "premiumMonthly" ? "Premium Monthly" : "Premium Yearly";
		const price =
			tierId === "premiumMonthly"
				? `$${PLANS.PREMIUM_MONTHLY.price}/mo`
				: `$${PLANS.PREMIUM_YEARLY.price}/yr`;

		return {
			plan: currentPlan,
			tier: {
				id: tierId,
				name: tierName,
				description: "Premium subscription plan",
				priceMonthly: price,
				billingPeriod: tierId === "premiumMonthly" ? "per month" : "per year",
			},
			subscription: {
				status: subscriptionStatus?.status || "active",
				current_period_end: subscriptionStatus?.currentPeriodEnd
					? new Date(subscriptionStatus.currentPeriodEnd).toISOString()
					: null,
				current_period_start: subscriptionStatus?.currentPeriodStart
					? new Date(subscriptionStatus.currentPeriodStart).toISOString()
					: null,
				cancel_at_period_end: subscriptionStatus?.cancelAtPeriodEnd || false,
				price: subscriptionStatus?.amount,
			},
		};
	};

	const currentSub = getCurrentSubscription();

	const handleCheckout = async (tierId: string) => {
		try {
			trackButtonClick("checkout_start", { tier: tierId });
			await handlePlanChange(tierId as keyof typeof PLANS | "starter");
			toast.success("Redirecting to checkout...");
		} catch (error) {
			console.error("Checkout error:", error);

			// Handle cross-product customer scenarios with user-friendly messaging
			if (error instanceof Error) {
				if (
					error.message.includes("Polar account from another product") ||
					error.message.includes("already have a Polar account") ||
					error.message.includes("Customer not created")
				) {
					toast.error(error.message, {
						duration: 10000, // Show longer for this specific case
						action: {
							label: "Open Dashboard",
							onClick: () =>
								window.open("https://polar.sh/dashboard", "_blank"),
						},
					});
					return;
				}

				// Handle confirmation cancellation
				if (
					error.message.includes(
						"subscribe to this product, please access your Polar customer dashboard",
					)
				) {
					toast.error(
						"You can manage all your Polar subscriptions in one place at https://polar.sh/dashboard",
						{
							duration: 8000,
							action: {
								label: "Open Dashboard",
								onClick: () =>
									window.open("https://polar.sh/dashboard", "_blank"),
							},
						},
					);
					return;
				}
			}

			toast.error(
				error instanceof Error
					? error.message
					: "Failed to start checkout. Please try again.",
			);
		}
	};

	const handlePortal = async () => {
		try {
			trackButtonClick("billing_portal_access");
			const portalUrl = await getCustomerPortalUrl();
			if (portalUrl) {
				window.location.href = portalUrl;
			} else {
				toast.error("Failed to generate portal URL");
			}
		} catch (error) {
			console.error("Portal error:", error);
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to open billing portal. Please try again.",
			);
		}
	};

	const formatDate = (dateString: string | null) => {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getDaysRemaining = (endDate: string | null) => {
		if (!endDate) return 0;
		const end = new Date(endDate);
		const now = new Date();
		const diffTime = end.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const getStatusBadge = (status?: string) => {
		const statusConfig = {
			active: {
				variant: "default" as const,
				color: "bg-green-100 text-green-800",
				icon: CheckCircle,
			},
			trialing: {
				variant: "secondary" as const,
				color: "bg-primary/10 text-primary",
				icon: Zap,
			},
			canceled: {
				variant: "destructive" as const,
				color: "bg-red-100 text-red-800",
				icon: AlertTriangle,
			},
			past_due: {
				variant: "destructive" as const,
				color: "bg-orange-100 text-orange-800",
				icon: AlertTriangle,
			},
		};

		const config =
			statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
		const Icon = config.icon;

		return (
			<Badge
				variant={config.variant}
				className={`flex items-center gap-1 ${config.color}`}
			>
				<Icon className="h-3 w-3" />
				{status
					? status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")
					: "Active"}
			</Badge>
		);
	};

	const formatPrice = (price?: {
		amount: number;
		currency: string;
		interval: string;
	}) => {
		if (!price) return "";
		return `${price.amount / 100}/${price.interval}`;
	};

	return (
		<div className="space-y-6">
			{/* Current Subscription Card */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Crown className="h-5 w-5" />
						Current Subscription
					</CardTitle>
					<CardDescription>
						Your active plan and subscription details
					</CardDescription>
				</CardHeader>
				<CardContent>
					{currentSub ? (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-primary/10 rounded-lg">
										<Crown className="h-5 w-5 text-primary" />
									</div>
									<div>
										<h3 className="font-semibold text-lg">
											{currentSub.tier?.name} Plan
										</h3>
										<p className="text-sm text-muted-foreground">
											{currentSub.tier?.description}
										</p>
									</div>
								</div>
								{getStatusBadge(currentSub.subscription.status)}
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-lg border border-primary/20 bg-primary/5">
								<div>
									<p className="text-sm font-medium text-primary/70">Price</p>
									<p className="text-lg font-semibold text-primary">
										{formatPrice(currentSub.subscription.price) ||
											`${currentSub.tier?.priceMonthly}`}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-primary/70">
										{currentSub.subscription.cancel_at_period_end ||
										currentSub.subscription.status === "canceled"
											? "Days Until Expiry"
											: "Days Remaining"}
									</p>
									<p className="text-lg font-semibold text-primary">
										{currentSub.subscription.current_period_end
											? getDaysRemaining(
													currentSub.subscription.current_period_end,
												)
											: "N/A"}{" "}
										days
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-primary/70">
										{currentSub.subscription.cancel_at_period_end ||
										currentSub.subscription.status === "canceled"
											? "Access Ends"
											: "Next Renewal"}
									</p>
									<p className="text-lg font-semibold text-primary">
										{formatDate(currentSub.subscription.current_period_end)}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-primary/70">Status</p>
									<p className="text-sm font-medium text-primary/80">
										{currentSub.subscription.status}
									</p>
								</div>
							</div>

							{currentSub.tier &&
								(currentSub.subscription.cancel_at_period_end ||
								currentSub.subscription.status === "canceled" ? (
									<Alert>
										<AlertTriangle className="h-4 w-4" />
										<AlertDescription>
											Your subscription has been canceled and will end on{" "}
											{formatDate(currentSub.subscription.current_period_end)}
											{currentSub.subscription.current_period_end && (
												<span>
													{" "}
													(
													{getDaysRemaining(
														currentSub.subscription.current_period_end,
													)}{" "}
													days remaining)
												</span>
											)}
											. You'll continue to have access until then. No renewal
											charge will be processed.
										</AlertDescription>
									</Alert>
								) : (
									currentSub.subscription.current_period_end && (
										<Alert>
											<CheckCircle className="h-4 w-4" />
											<AlertDescription>
												Your subscription will automatically renew on{" "}
												{formatDate(currentSub.subscription.current_period_end)}{" "}
												for{" "}
												{formatPrice(currentSub.subscription.price) ||
													`${currentSub.tier?.priceMonthly}`}
												. Your payment method will be charged on this date.
											</AlertDescription>
										</Alert>
									)
								))}

							<div className="flex gap-3">
								<Button
									onClick={handlePortal}
									disabled={isLoading}
									variant="outline"
								>
									{isLoading ? "Loading..." : "Manage Subscription"}
								</Button>
							</div>
						</div>
					) : (
						<div className="text-center py-8">
							<div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-4">
								<CreditCard className="h-6 w-6 text-gray-400" />
							</div>
							<h3 className="font-semibold text-lg mb-2">Free Plan</h3>
							<p className="text-muted-foreground mb-6">
								You're currently on the free Starter plan. Upgrade to Premium to
								unlock all features.
							</p>
							<div className="flex gap-3 justify-center">
								<Button
									onClick={() => handleCheckout("PREMIUM_MONTHLY")}
									disabled={isLoading}
									variant="outline"
								>
									{isLoading ? "Loading..." : "Subscribe to Premium"}
								</Button>
								<Button
									onClick={() => handleCheckout("PREMIUM_YEARLY")}
									disabled={isLoading}
								>
									{isLoading ? "Loading..." : "Subscribe to Expert"}
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Available Plans */}
			{!currentSub && (
				<Card>
					<CardHeader>
						<CardTitle>Available Plans</CardTitle>
						<CardDescription>
							Choose the plan that best fits your needs
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							<div className="rounded-2xl bg-background/50 p-8 shadow-sm ring-1 ring-border/50">
								<div className="space-y-4">
									<div>
										<h2 className="font-medium">Premium Monthly</h2>
										<span className="my-3 block text-2xl font-semibold">
											${PLANS.PREMIUM_MONTHLY.price} / mo
										</span>
										<p className="text-muted-foreground text-sm">
											For professionals and growing teams
										</p>
									</div>

									<Button
										onClick={() => handleCheckout("PREMIUM_MONTHLY")}
										disabled={isLoading}
										className="w-full"
										size="lg"
									>
										{isLoading ? "Loading..." : "Subscribe to Premium"}
									</Button>

									<ul className="mt-8 space-y-3 text-sm">
										{[
											"Everything in Starter",
											"Advanced analytics & reporting",
											"Priority support",
											"API access",
										].map((item) => (
											<li key={item} className="flex items-center gap-2">
												<CheckCircle className="h-4 w-4 text-green-500" />
												{item}
											</li>
										))}
									</ul>
								</div>
							</div>

							<div className="rounded-2xl bg-gradient-to-br from-primary/5 via-background to-card ring-2 ring-primary/20 shadow-lg shadow-primary/10 scale-[1.02] border border-primary/10 p-8">
								<div className="space-y-4">
									<div className="flex items-center gap-2">
										<h2 className="font-medium">Premium Yearly</h2>
										<span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-medium">
											Best Value
										</span>
									</div>
									<span className="my-3 block text-2xl font-semibold">
										${PLANS.PREMIUM_YEARLY.price} / yr
									</span>
									<p className="text-muted-foreground text-sm">
										Save with annual billing
									</p>

									<Button
										onClick={() => handleCheckout("PREMIUM_YEARLY")}
										disabled={isLoading}
										className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02]"
										size="lg"
									>
										{isLoading ? "Loading..." : "Subscribe to Expert"}
									</Button>

									<ul className="mt-8 space-y-3 text-sm">
										{[
											"Everything in Premium Monthly",
											"Best annual savings",
											"Priority feature access",
											"Enhanced support",
										].map((item) => (
											<li key={item} className="flex items-center gap-2">
												<CheckCircle className="h-4 w-4 text-green-500" />
												{item}
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Billing Management */}
			{currentSub && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="h-5 w-5" />
							Billing Management
						</CardTitle>
						<CardDescription>
							Access your billing portal for payment methods and invoices
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-center py-8">
							<div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
								<CreditCard className="h-6 w-6 text-primary" />
							</div>
							<h3 className="font-semibold text-lg mb-2">
								Manage Billing Details
							</h3>
							<p className="text-muted-foreground mb-6">
								Access your complete transaction history and manage billing
								details through the customer portal
							</p>
							<Button
								onClick={handlePortal}
								disabled={isLoading}
								variant="outline"
							>
								{isLoading ? "Loading..." : "Open Billing Portal"}
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
