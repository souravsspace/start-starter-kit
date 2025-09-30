import { useSubscription } from "./use-subscription";

/**
 * Hook to determine user subscription tier with simplified mapping
 * Returns: "premium" (for premiumMonthly), "expert" (for premiumYearly), or "none"
 */
export function useUserTier() {
	const { getCurrentPlan } = useSubscription();

	const currentPlan = getCurrentPlan();

	// Map the plan to the user-friendly tier names
	const getUserTier = (): "premium" | "expert" | "none" => {
		switch (currentPlan) {
			case "PREMIUM_MONTHLY":
				return "premium";
			case "PREMIUM_YEARLY":
				return "expert";
			default:
				return "none";
		}
	};

	// Check if user has a premium tier (either premium or expert)
	const isPremium = (): boolean => {
		return (
			currentPlan === "PREMIUM_MONTHLY" || currentPlan === "PREMIUM_YEARLY"
		);
	};

	// Get user-friendly display name for current tier
	const getTierDisplayName = (): string => {
		switch (currentPlan) {
			case "PREMIUM_MONTHLY":
				return "Premium";
			case "PREMIUM_YEARLY":
				return "Expert";
			default:
				return "Free";
		}
	};

	// Get tier features based on current plan
	const getTierFeatures = (): string[] => {
		switch (currentPlan) {
			case "PREMIUM_MONTHLY":
				return ["Unlimited resumes", "Priority support"];
			case "PREMIUM_YEARLY":
				return [
					"Unlimited resumes",
					"AI-powered improvements",
					"Priority support",
					"Advanced analytics",
					"Custom domains",
				];
			default:
				return ["1 resume", "Basic templates", "PDF export"];
		}
	};

	return {
		tier: getUserTier(),
		currentPlan,
		isPremium: isPremium(),
		getTierDisplayName,
		getTierFeatures,
	};
}
