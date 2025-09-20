import { Polar } from "@convex-dev/polar";
import { api, components } from "./_generated/api";
import { QueryCtx, query, mutation } from "./_generated/server";
import { Id, Doc } from "./_generated/dataModel";
import { v } from "convex/values";

/**
 * Subscription plans configuration with Polar product IDs
 * 
 * IMPORTANT: These product IDs must match the actual products in your Polar dashboard.
 * If you're getting "Customer not created" errors, verify these IDs exist in Polar.
 * 
 * To find your product IDs:
 * 1. Go to your Polar dashboard
 * 2. Navigate to Products
 * 3. Copy the product IDs from there
 */
export const plans = {
	PROFESSIONAL_MONTHLY: {
		id: "d327d9ac-e801-424f-840a-9bcb35522f46",
		name: "premiumMonthly",
		subscription: "monthly",
	},
	PROFESSIONAL_LIFETIME: {
		id: "1f459cd9-0981-4b8f-aad5-aa1aa0b47f7a",
		name: "premiumLifetime",
		subscription: "lifetime",
	},
} as const;


/**
 * Polar integration configuration
 */
export const polar = new Polar(components.polar, {
  products: {
    premiumMonthly: plans.PROFESSIONAL_MONTHLY.id,
    premiumLifetime: plans.PROFESSIONAL_LIFETIME.id,
  },
  getUserInfo: async (ctx): Promise<{ userId: string; email: string }> => {
    // Use the auth API to get the current user
    const user = await ctx.runQuery(api.auth.getCurrentUser);
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Debug logging
    console.log("Polar getUserInfo - User ID:", user.userId);
    console.log("Polar getUserInfo - Email:", user.email);
    console.log("Polar getUserInfo - User object:", JSON.stringify(user, null, 2));
    
    return {
      userId: user.userId as string,
      email: user.email,
    };
  },

  // Environment variables configuration
  // Make sure to set these in your Convex deployment:
  // npx convex env set POLAR_ORGANIZATION_TOKEN your_token
  // npx convex env set POLAR_WEBHOOK_SECRET your_secret  
  // npx convex env set POLAR_SERVER sandbox
  server: "sandbox", // Use sandbox for testing
});

/**
 * Polar API functions for subscription management
 */
export const {
  getConfiguredProducts,
  listAllProducts,
  generateCheckoutLink,
  generateCustomerPortalUrl,
  changeCurrentSubscription,
  cancelCurrentSubscription,
} = polar.api();

/**
 * Debug function to check Polar configuration
 */
export const debugPolarConfig = query({
  handler: async (ctx): Promise<{
    userAuthenticated: boolean;
    userId?: string;
    userEmail?: string;
    expectedProductIds: {
      premiumMonthly: string;
      premiumLifetime: string;
    };
    polarServer: string;
  }> => {
    const user: any = await ctx.runQuery(api.auth.getCurrentUser);
    
    return {
      userAuthenticated: !!user,
      userId: user?._id,
      userEmail: user?.email,
      expectedProductIds: {
        premiumMonthly: plans.PROFESSIONAL_MONTHLY.id,
        premiumLifetime: plans.PROFESSIONAL_LIFETIME.id,
      },
      polarServer: "sandbox", // Current server setting
    };
  },
});

/**
 * Available subscription plan types
 */
export type SubscriptionPlan = "starter" | "professional" | "premiumLifetime";

/**
 * Get current user subscription status with business logic
 */
export const getSubscriptionStatus = query({
  handler: async (ctx) => {
    const user = await ctx.runQuery(api.auth.getCurrentUser);
    if (!user || !user.userId) {
      return {
        isAuthenticated: false,
        currentPlan: null,
        canUpgradeTo: [] as SubscriptionPlan[],
        canDowngradeTo: [] as SubscriptionPlan[],
      };
    }

    const subscription = await polar.getCurrentSubscription(ctx, {
      userId: user.userId,
    });

    const currentPlan = determineCurrentPlan(subscription?.productKey);
    const { canUpgradeTo, canDowngradeTo } = getAvailablePlanChanges(currentPlan);

    return {
      isAuthenticated: true,
      currentPlan,
      subscription: subscription ? {
        productKey: subscription.productKey,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      } : null,
      canUpgradeTo,
      canDowngradeTo,
    };
  },
});

/**
 * Determine current subscription plan from Polar product key
 */
function determineCurrentPlan(productKey?: string): SubscriptionPlan {
  switch (productKey) {
    case plans.PROFESSIONAL_MONTHLY.name:
      return "professional";
    case plans.PROFESSIONAL_LIFETIME.name:
      return "premiumLifetime";
    default:
      return "starter";
  }
}

/**
 * Get available plan upgrade/downgrade options based on current plan
 */
function getAvailablePlanChanges(currentPlan: SubscriptionPlan) {
  const canUpgradeTo: SubscriptionPlan[] = [];
  const canDowngradeTo: SubscriptionPlan[] = [];

  switch (currentPlan) {
    case "starter":
      // Can upgrade to professional or lifetime
      canUpgradeTo.push("professional", "premiumLifetime");
      break;
    case "professional":
      // Can upgrade to lifetime, downgrade to starter
      canUpgradeTo.push("premiumLifetime");
      canDowngradeTo.push("starter");
      break;
    case "premiumLifetime":
      // Can downgrade to starter (but not to professional)
      canDowngradeTo.push("starter");
      break;
  }

  return { canUpgradeTo, canDowngradeTo };
}

/**
 * Validate subscription plan change request
 */
export const createCheckout = mutation({
  args: {
    plan: v.union(v.literal("professional"), v.literal("premiumLifetime")),
  },
  handler: async (ctx, args): Promise<{
    message: string;
    currentPlan: SubscriptionPlan;
    targetPlan: "professional" | "premiumLifetime";
    isUpgrade: boolean;
    isDowngrade: boolean;
    isSamePlan: boolean;
  }> => {
    const user = await ctx.runQuery(api.auth.getCurrentUser);
    if (!user || !user.userId) {
      throw new Error("User not authenticated");
    }

    const currentSubscription = await polar.getCurrentSubscription(ctx, {
      userId: user.userId,
    });
    
    const currentPlan = determineCurrentPlan(currentSubscription?.productKey);
    const validation = validatePlanChange(currentPlan, args.plan);
    
    if (!validation.isValid) {
      throw new Error(validation.error || "Invalid plan change");
    }

    return {
      message: "Checkout validation successful. Use the generateCheckoutLink action to get the URL.",
      currentPlan,
      targetPlan: args.plan,
      isUpgrade: validation.isUpgrade,
      isDowngrade: validation.isDowngrade,
      isSamePlan: validation.isSamePlan,
    };
  },
});

/**
 * Validate if a plan change is allowed
 */
function validatePlanChange(currentPlan: SubscriptionPlan, targetPlan: "professional" | "premiumLifetime") {
  if (currentPlan === targetPlan) {
    return {
      isValid: false,
      error: "You are already subscribed to this plan",
      isUpgrade: false,
      isDowngrade: false,
      isSamePlan: true,
    };
  }

  // Lifetime users cannot downgrade to professional (only to starter)
  if (currentPlan === "premiumLifetime" && targetPlan === "professional") {
    return {
      isValid: false,
      error: "Lifetime subscribers cannot downgrade to monthly plans",
      isUpgrade: false,
      isDowngrade: true,
      isSamePlan: false,
    };
  }

  // Check if this is an upgrade
  const upgrades = [
    { from: "starter", to: "professional" },
    { from: "starter", to: "premiumLifetime" },
    { from: "professional", to: "premiumLifetime" },
  ];

  // Check if this is a downgrade
  const downgrades = [
    { from: "professional", to: "starter" },
    { from: "premiumLifetime", to: "starter" },
  ];

  const isUpgrade = upgrades.some(up => up.from === currentPlan && up.to === targetPlan);
  const isDowngrade = downgrades.some(down => down.from === currentPlan && down.to === targetPlan);

  return {
    isValid: true,
    error: null,
    isUpgrade,
    isDowngrade,
    isSamePlan: false,
  };
}


/**
 * Note: For subscription changes, use the Polar actions directly:
 * - generateCheckoutLink: for creating new subscriptions
 * - changeCurrentSubscription: for changing existing subscriptions  
 * - cancelCurrentSubscription: for canceling subscriptions
 * - generateCustomerPortalUrl: for customer portal access
 * These are available as actions that can be called from your frontend
 */

/**
 * Get current user with comprehensive subscription information
 * Combines user data with their active subscription details from Polar
 */
const getCurrentUserWithSubscription = async (ctx: QueryCtx): Promise<any> => {
  const user = await ctx.runQuery(api.auth.getCurrentUser);
  if (!user || !user.userId) {
    throw new Error("User not authenticated");
  }

  // Retrieve active subscription from Polar for this user
  const subscription = await polar.getCurrentSubscription(ctx, {
    userId: user.userId,
  });

  // Determine premium status based on product key
  const productKey = subscription?.productKey;
  const isPremium = productKey === plans.PROFESSIONAL_MONTHLY.name || 
                   productKey === plans.PROFESSIONAL_LIFETIME.name;
  
  // Return enriched user object with subscription metadata
  return {
    ...user,
    subscription,
    isPremium,
    isFree: !isPremium,
    subscriptionStatus: subscription?.status || "inactive",
    currentPeriodEnd: subscription?.currentPeriodEnd,
    currentPeriodStart: subscription?.currentPeriodStart,
    cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd || false,
  };
};

// Query to get current user with subscription details
export const getCurrentUserWithSub = query({
  handler: async (ctx) => {
    return getCurrentUserWithSubscription(ctx);
  },
});

// Query to check if current user is premium
export const isUserPremium = query({
  handler: async (ctx) => {
    const userWithSub = await getCurrentUserWithSubscription(ctx);
    return {
      isPremium: userWithSub.isPremium,
      productKey: userWithSub.subscription?.productKey,
      status: userWithSub.subscriptionStatus,
    };
  },
});

// Query to get subscription details
export const getSubscriptionDetails = query({
  handler: async (ctx) => {
    const userWithSub = await getCurrentUserWithSubscription(ctx);
    
    if (!userWithSub.subscription) {
      return {
        hasSubscription: false,
        isPremium: false,
      };
    }

    return {
      hasSubscription: true,
      isPremium: userWithSub.isPremium,
      productKey: userWithSub.subscription.productKey,
      status: userWithSub.subscription.status,
      currentPeriodStart: userWithSub.subscription.currentPeriodStart 
        ? new Date(userWithSub.subscription.currentPeriodStart * 1000).toISOString()
        : null,
      currentPeriodEnd: userWithSub.subscription.currentPeriodEnd
        ? new Date(userWithSub.subscription.currentPeriodEnd * 1000).toISOString()
        : null,
      cancelAtPeriodEnd: userWithSub.subscription.cancelAtPeriodEnd,
      amount: userWithSub.subscription.amount,
    };
  },
});