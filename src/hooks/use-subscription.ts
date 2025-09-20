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

    // Check if the plan change is allowed
    if (!canUpgrade(targetPlan) && !canDowngrade(targetPlan)) {
      throw new Error("This plan change is not allowed");
    }

    setIsLoading(true);
    try {
      if (targetPlan === "starter") {
        // Cancel current subscription to downgrade to free tier
        try {
          await cancelCurrentSubscription({ revokeImmediately: false });
        } catch (error) {
          // If the error is "Subscription not updated", it might already be cancelled
          // Check if we should proceed or show a user-friendly message
          if (error instanceof Error && error.message.includes("Subscription not updated")) {
            console.log("Subscription may already be cancelled or processing");
            // Don't throw the error to user - the cancellation might have succeeded
            // The subscription status will update on next refresh
          } else {
            throw error; // Re-throw other errors
          }
        }
      } else {
        if (subscriptionStatus.currentPlan === "starter") {
          // Create new subscription for free users
          const productIds =
            targetPlan === "professional"
              ? [plans.PROFESSIONAL_MONTHLY.id]
              : [];

          const result = await generateCheckoutLink({
            productIds,
            origin: window.location.origin,
            successUrl: `${window.location.origin}/dashboard?success=true&plan=${targetPlan}`,
          });

          if (result.url) {
            window.location.href = result.url;
            return;
          }
        } else {
          // Handle different subscription changes for existing users
          if (targetPlan === "starter") {
            // Cancel current subscription to downgrade to starter
            try {
              await cancelCurrentSubscription({ revokeImmediately: false });
            } catch (error) {
              // If the error is "Subscription not updated", it might already be cancelled
              if (error instanceof Error && error.message.includes("Subscription not updated")) {
                console.log("Subscription may already be cancelled or processing");
              } else {
                throw error; // Re-throw other errors
              }
            }
          } else {
            // Change existing subscription (professional to professional)
            const productId = plans.PROFESSIONAL_MONTHLY.id;
            await changeCurrentSubscription({ productId });
          }
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
