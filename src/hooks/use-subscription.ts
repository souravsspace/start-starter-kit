import { api } from "convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import { useState } from "react";
import { type SubscriptionPlan, plans } from "../../convex/polar";

/**
 * Custom hook for managing user subscriptions with Polar integration
 */
export function useSubscription() {
	const subscriptionStatus = useQuery(api.polar.getSubscriptionStatus);

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
	const handlePlanChange = async (targetPlan: SubscriptionPlan) => {
		if (!subscriptionStatus?.isAuthenticated) {
			throw new Error("User not authenticated");
		}

		setIsLoading(true);
		try {
			if (targetPlan === "starter") {
				// Cancel current subscription to downgrade to free tier
				await cancelCurrentSubscription({ revokeImmediately: false });
			} else {
				if (subscriptionStatus.currentPlan === "starter") {
					// Create new subscription for free users
					const productIds =
						targetPlan === "professional"
							? [plans.PROFESSIONAL_MONTHLY.name]
							: [plans.PROFESSIONAL_LIFETIME.name];

					const result = await generateCheckoutLink({
						productIds,
						origin: window.location.origin,
						successUrl: `${window.location.origin}/dashboard?success=true`,
					});

					if (result.url) {
						window.location.href = result.url;
						return;
					}
				} else {
					// Change existing subscription
					const productId =
						targetPlan === "professional"
							? plans.PROFESSIONAL_MONTHLY.name
							: plans.PROFESSIONAL_LIFETIME.name;

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
	const canUpgrade = (targetPlan: SubscriptionPlan) => {
		return subscriptionStatus?.canUpgradeTo.includes(targetPlan) || false;
	};

	/**
	 * Check if user can downgrade to a specific plan
	 */
	const canDowngrade = (targetPlan: SubscriptionPlan) => {
		return subscriptionStatus?.canDowngradeTo.includes(targetPlan) || false;
	};

	/**
	 * Get user-friendly display name for subscription plans
	 */
	const getPlanDisplayName = (plan: SubscriptionPlan) => {
		switch (plan) {
			case "starter":
				return "Starter";
			case "professional":
				return "Professional";
			case "premiumLifetime":
				return "Premium Lifetime";
			default:
				return plan;
		}
	};

	/**
	 * Get formatted price for subscription plans
	 */
	const getPlanPrice = (plan: SubscriptionPlan) => {
		switch (plan) {
			case "starter":
				return "$0";
			case "professional":
				return "$5/mo";
			case "premiumLifetime":
				return "$49";
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

	return {
		subscriptionStatus,
		isLoading,
		handlePlanChange,
		canUpgrade,
		canDowngrade,
		getPlanDisplayName,
		getPlanPrice,
		getCustomerPortalUrl,
	};
}
