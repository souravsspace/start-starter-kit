import { PLANS } from "@/app-config";
import { api } from "convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import { useState } from "react";

/**
 * Custom hook for managing user subscriptions with Polar integration
 * Simplified implementation following official Convex Polar docs
 */
export function useSubscription() {
	const subscriptionStatus = useQuery(api.polar.getSubscriptionStatus);
	const products = useQuery(api.polar.getConfiguredProducts);

	// Polar actions for subscription management
	const generateCheckoutLink = useAction(api.polar.generateCheckoutLink);
	const changeCurrentSubscription = useAction(
		api.polar.changeCurrentSubscription,
	);
	const cancelCurrentSubscription = useAction(
		api.polar.cancelCurrentSubscription,
	);
	const generateCustomerPortalUrl = useAction(
		api.polar.generateCustomerPortalUrl,
	);

	const [isLoading, setIsLoading] = useState(false);

	/**
	 * Handle subscription plan changes (upgrades, downgrades, cancellations)
	 */
	const handlePlanChange = async (
		targetPlan: keyof typeof PLANS | "starter",
	) => {
		setIsLoading(true);
		try {
			if (targetPlan === "starter") {
				// Cancel current subscription to downgrade to free tier
				try {
					await cancelCurrentSubscription({ revokeImmediately: false });
				} catch (error) {
					if (
						error instanceof Error &&
						error.message.includes("Subscription not updated")
					) {
						console.log("Subscription may already be cancelled or processing");
					} else {
						throw error;
					}
				}
			} else {
				// Handle premium plan changes - check if user has no active subscription
				if (
					!subscriptionStatus ||
					subscriptionStatus.status === "canceled" ||
					subscriptionStatus.status === "incomplete"
				) {
					// Map frontend plan IDs to PLANS keys
					let planKey: keyof typeof PLANS;
					if (targetPlan === "PREMIUM_MONTHLY") {
						planKey = "PREMIUM_MONTHLY";
					} else if (targetPlan === "PREMIUM_YEARLY") {
						planKey = "PREMIUM_YEARLY";
					} else {
						throw new Error(`Invalid plan: ${targetPlan}`);
					}

					const productId = PLANS[planKey].id;

					try {
						const result = await generateCheckoutLink({
							productIds: [productId],
							origin:
								typeof window !== "undefined" ? window.location.origin : "",
							successUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/dashboard?success=true&plan=${targetPlan}`,
						});
						window.location.href = result.url;
					} catch (error) {
						console.error("Checkout link generation failed:", error);
						throw error;
					}
				} else {
					// Change existing subscription between premium plans
					// Map frontend plan IDs to PLANS keys
					let planKey: keyof typeof PLANS;
					if (targetPlan === "PREMIUM_MONTHLY") {
						planKey = "PREMIUM_MONTHLY";
					} else if (targetPlan === "PREMIUM_YEARLY") {
						planKey = "PREMIUM_YEARLY";
					} else {
						throw new Error(`Invalid plan: ${targetPlan}`);
					}

					const productId = PLANS[planKey].id;
					await changeCurrentSubscription({ productId });
				}
			}
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Check if user can upgrade to a specific plan
	 */
	const canUpgrade = (
		targetPlan?: "premiumMonthly" | "premiumYearly" | "starter",
	) => {
		// Can upgrade if no subscription or subscription is canceled/incomplete
		if (
			!subscriptionStatus ||
			subscriptionStatus.status === "canceled" ||
			subscriptionStatus.status === "incomplete" ||
			subscriptionStatus.status === "past_due"
		) {
			return true;
		}

		// If user has active subscription, check if they can upgrade to a different tier
		if (
			subscriptionStatus.status === "active" ||
			subscriptionStatus.status === "trialing"
		) {
			// Can always upgrade from monthly to yearly
			if (
				subscriptionStatus.productId === PLANS.PREMIUM_MONTHLY.id &&
				targetPlan === "premiumYearly"
			) {
				return true;
			}
			// Can downgrade from yearly to monthly
			if (
				subscriptionStatus.productId === PLANS.PREMIUM_YEARLY.id &&
				targetPlan === "premiumMonthly"
			) {
				return true;
			}
		}

		return false; // Already has the same plan or cannot upgrade
	};

	/**
	 * Check if user can downgrade to a specific plan
	 */
	const canDowngrade = () => {
		// Can downgrade (cancel) if has active subscription
		if (
			!subscriptionStatus ||
			subscriptionStatus.status === "canceled" ||
			subscriptionStatus.status === "incomplete" ||
			subscriptionStatus.status === "past_due"
		) {
			return false;
		}
		return true; // Has active subscription that can be canceled
	};

	/**
	 * Get user-friendly display name for subscription plans
	 */
	const getPlanDisplayName = (plan: keyof typeof PLANS | "starter") => {
		switch (plan) {
			case "starter":
				return "Starter";
			case "PREMIUM_MONTHLY":
				return "Premium Monthly";
			case "PREMIUM_YEARLY":
				return "Premium Yearly";
			default:
				return plan;
		}
	};

	/**
	 * Get formatted price for subscription plans
	 */
	const getPlanPrice = (plan: keyof typeof PLANS | "starter") => {
		switch (plan) {
			case "starter":
				return "$0";
			case "PREMIUM_MONTHLY":
				return `$${PLANS.PREMIUM_MONTHLY.price}/mo`;
			case "PREMIUM_YEARLY":
				return `$${PLANS.PREMIUM_YEARLY.price}/yr`;
			default:
				return "";
		}
	};

	/**
	 * Generate customer portal URL for subscription management
	 */
	const getCustomerPortalUrl = async () => {
		const result = await generateCustomerPortalUrl({});
		return result.url;
	};

	/**
	 * Get formatted price from product data
	 */
	const getProductPrice = (productKey: string) => {
		if (!products) return "";
		// Map frontend IDs to PLANS keys
		const planMap: Record<string, keyof typeof PLANS> = {
			premiumMonthly: "PREMIUM_MONTHLY",
			premiumYearly: "PREMIUM_YEARLY",
		};
		const planKey = planMap[productKey];
		if (!planKey) return "";
		const plan = PLANS[planKey];
		return plan ? `$${plan.price}` : "";
	};

	/**
	 * Get current plan from subscription status
	 */
	const getCurrentPlan = (): keyof typeof PLANS | "starter" => {
		if (
			!subscriptionStatus ||
			subscriptionStatus.status === "canceled" ||
			subscriptionStatus.status === "incomplete" ||
			subscriptionStatus.status === "past_due"
		) {
			return "starter";
		}

		// Check if subscription has product information to determine the specific plan
		if (subscriptionStatus.productId) {
			const productId = subscriptionStatus.productId;
			// Match the product ID to our plans
			if (productId === PLANS.PREMIUM_MONTHLY.id) {
				return "PREMIUM_MONTHLY";
			}
			if (productId === PLANS.PREMIUM_YEARLY.id) {
				return "PREMIUM_YEARLY";
			}
		}

		// Fallback to starter if we can't determine the specific premium plan
		return "starter";
	};

	/**
	 * Get subscription product key from current subscription
	 */
	const getSubscriptionProductKey = () => {
		if (!subscriptionStatus || !subscriptionStatus.productId) return null;

		if (subscriptionStatus.productId === PLANS.PREMIUM_MONTHLY.id) {
			return PLANS.PREMIUM_MONTHLY.frontendId;
		}
		if (subscriptionStatus.productId === PLANS.PREMIUM_YEARLY.id) {
			return PLANS.PREMIUM_YEARLY.frontendId;
		}

		return null;
	};

	return {
		subscriptionStatus,
		products,
		isLoading,
		handlePlanChange,
		canUpgrade,
		canDowngrade,
		getPlanDisplayName,
		getPlanPrice,
		getCustomerPortalUrl,
		getProductPrice,
		getCurrentPlan,
		getSubscriptionProductKey,
	};
}
