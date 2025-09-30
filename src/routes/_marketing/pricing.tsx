import type { PLANS } from "@/app-config";
import { Button } from "@/components/ui/button";
import { usePostHogTracking } from "@/hooks/use-posthog-tracking";
import { useSubscription } from "@/hooks/use-subscription";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_marketing/pricing")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const {
		subscriptionStatus,
		isLoading,
		handlePlanChange,
		canUpgrade,
		canDowngrade,
		getCurrentPlan,
		getPlanDisplayName,
		getPlanPrice,
	} = useSubscription();
	const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
	const { trackEvent, trackButtonClick, trackPageView } = usePostHogTracking();

	trackPageView({ page: "pricing_page" });

	// Get current subscription plan
	const currentPlan = getCurrentPlan();
	const hasActiveSubscription = currentPlan !== "starter";

	/**
	 * Handle checkout process for subscription plans
	 */
	const handleCheckout = async (tierId: string) => {
		if (!subscriptionStatus) {
			trackButtonClick("pricing_redirect_to_login", { tier: tierId });
			navigate({ to: "/auth/login" });
			return;
		}

		setLoadingPlan(tierId);
		try {
			trackButtonClick("pricing_checkout_start", { tier: tierId });
			await handlePlanChange(tierId as keyof typeof PLANS | "starter");
			toast.success("Redirecting to checkout...");
		} catch (error) {
			trackEvent("pricing_checkout_failed", {
				tier: tierId,
				error: error instanceof Error ? error.message : "unknown",
			});
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
		} finally {
			setLoadingPlan(null);
		}
	};

	// Check if user has active subscription for a tier
	const hasActiveTier = (tierId: string): boolean => {
		if (tierId === "premiumMonthly") {
			return currentPlan === "PREMIUM_MONTHLY";
		}
		if (tierId === "premiumYearly") {
			return currentPlan === "PREMIUM_YEARLY";
		}
		return false;
	};

	// Check if user can upgrade to a tier using Convex logic
	const canUpgradeToTier = (tierId: string): boolean => {
		if (!subscriptionStatus) return true;
		return canUpgrade(tierId as keyof typeof PLANS | "starter");
	};

	const getButtonState = (tierId: string) => {
		const hasThisTier = hasActiveTier(tierId);
		const canUpgrade = canUpgradeToTier(tierId);

		if (!subscriptionStatus) {
			return { disabled: false, text: "Get Started" };
		}

		// If user has this tier active
		if (hasThisTier) {
			return { disabled: true, text: "Current Plan" };
		}

		// If user cannot upgrade to this tier (already has active subscription)
		if (!canUpgrade && subscriptionStatus && !hasThisTier) {
			return { disabled: true, text: "Already Subscribed" };
		}

		return {
			disabled: false,
			text: hasActiveSubscription ? "Switch Plan" : "Get Started",
		};
	};
	return (
		<section className="py-16 md:py-32">
			<div className="mx-auto max-w-5xl px-6">
				<div className="mx-auto max-w-2xl space-y-6 text-center">
					<h1 className="text-center text-4xl font-semibold lg:text-5xl">
						Simple, Transparent Pricing
					</h1>
					<p className="text-lg text-muted-foreground">
						Start for free, upgrade when you need more power. No hidden fees, no
						surprises.
					</p>
				</div>

				{/* Show subscription status if user has any subscription */}
				{subscriptionStatus && currentPlan && (
					<div className="mt-8 p-4 rounded-lg border border-primary/20 bg-primary/5">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="font-semibold text-primary">
									{hasActiveSubscription ? "Active Subscription" : "Free Plan"}
								</h3>
								<p className="text-sm text-primary/80">
									{(() => {
										let tierName = null;
										if (currentPlan === "PREMIUM_YEARLY") {
											tierName = "Premium Yearly";
										} else if (currentPlan === "PREMIUM_MONTHLY") {
											tierName = "Premium Monthly";
										}

										if (tierName) {
											return `You're currently on the ${tierName} plan`;
										}
										if (currentPlan === "starter") {
											return "You're currently on the free Starter plan";
										}
										return "You have an active subscription";
									})()}
								</p>
							</div>
						</div>
					</div>
				)}

				<div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0">
					<div className="rounded-(--radius) flex flex-col justify-between space-y-8 border p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10">
						<div className="space-y-4">
							<div>
								<h2 className="font-medium">Starter</h2>
								<span className="my-3 block text-2xl font-semibold">
									{getPlanPrice("starter")}
								</span>
								<p className="text-muted-foreground text-sm">
									Perfect for trying out our platform
								</p>
							</div>

							<Button
								variant="outline"
								className="w-full"
								disabled={
									getButtonState("starter").disabled ||
									loadingPlan === "starter" ||
									isLoading
								}
								onClick={async () => {
									trackButtonClick("pricing_plan_button", { tier: "starter" });
									if (!subscriptionStatus) {
										trackEvent("pricing_redirect_to_register", {
											tier: "starter",
										});
										navigate({ to: "/auth/register" });
									} else if (canDowngrade()) {
										// Handle downgrade to starter
										setLoadingPlan("starter");
										try {
											trackEvent("pricing_downgrade_initiated", {
												from: currentPlan,
												to: "starter",
											});
											await handlePlanChange("starter");
										} catch (error) {
											trackEvent("pricing_downgrade_failed", {
												from: currentPlan,
												to: "starter",
												error:
													error instanceof Error ? error.message : "unknown",
											});
											console.error("Downgrade error:", error);
											toast.error(
												error instanceof Error
													? error.message
													: "Failed to downgrade subscription",
											);
										} finally {
											setLoadingPlan(null);
										}
									}
								}}
							>
								{loadingPlan === "starter" ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : null}
								{getButtonState("starter").text}
							</Button>

							<hr className="border-dashed" />

							<ul className="list-outside space-y-3 text-sm">
								{[
									"Core platform features",
									"Basic analytics & insights",
									"Community support",
									"1 project workspace",
									"Standard templates",
								].map((item) => (
									<li key={item} className="flex items-center gap-2">
										<Check className="size-3" />
										{item}
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="dark:bg-muted rounded-(--radius) border p-6 shadow-lg shadow-gray-950/5 md:col-span-3 lg:p-10 dark:[--color-muted:var(--color-zinc-900)]">
						<div className="grid gap-6 sm:grid-cols-2">
							<div className="space-y-4">
								<div>
									<div className="flex items-center gap-2">
										<h2 className="font-medium">Premium Monthly</h2>
										<span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-medium">
											Most Popular
										</span>
										{hasActiveTier("premiumMonthly") && (
											<span className="bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs font-medium">
												Active
											</span>
										)}
									</div>
									<span className="my-3 block text-2xl font-semibold">
										{getPlanPrice("PREMIUM_MONTHLY")}
									</span>
									<p className="text-muted-foreground text-sm">
										For professionals and growing teams
									</p>
								</div>

								<div className="space-y-2">
									<Button
										className="w-full"
										onClick={() => handleCheckout("PREMIUM_MONTHLY")}
										disabled={
											getButtonState("premiumMonthly").disabled ||
											loadingPlan === "premiumMonthly"
										}
									>
										{loadingPlan === "premiumMonthly" ? (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										) : null}
										{getButtonState("premiumMonthly").text}
									</Button>
								</div>
							</div>

							<div>
								<div className="text-sm font-medium">
									Everything in Starter, plus:
								</div>

								<ul className="mt-4 list-outside space-y-3 text-sm">
									{[
										"Unlimited projects & workspaces",
										"Advanced analytics & reporting",
										"Priority email & chat support",
										"Custom integrations & API access",
										"Team collaboration features",
										"Advanced security & compliance",
										"Custom branding options",
										"Early access to new features",
										"Priority bug fixes & support",
									].map((item) => (
										<li key={item} className="flex items-center gap-2">
											<Check className="size-3" />
											{item}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-12 text-center">
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Still have questions?</h3>
						<p className="text-muted-foreground">
							Our team is here to help you choose the right plan for your needs.
						</p>
						<Button asChild variant="outline">
							<Link to="/contact">Contact Support</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
