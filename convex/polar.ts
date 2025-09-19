import { Polar } from "@convex-dev/polar";
import { api, components } from "./_generated/api";
import { QueryCtx, query } from "./_generated/server";
import { Id, Doc } from "./_generated/dataModel";

// User query to use in the Polar component
export const getUserInfo = query({
  args: {},
  handler: async (ctx) => {
    // This would be replaced with an actual auth query,
    // eg., ctx.auth.getUserIdentity() or getAuthUserId(ctx)
    const user = await ctx.db.query("user").first();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
});

export const polar = new Polar(components.polar, {
  products: {
    premiumMonthly: "d327d9ac-e801-424f-840a-9bcb35522f46",
    premiumLifetime: "1f459cd9-0981-4b8f-aad5-aa1aa0b47f7a",
  },
  getUserInfo: async (ctx): Promise<{ userId: string; email: string }> => {
    const user = await ctx.runQuery(api.auth.getCurrentUser);
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    return {
      userId: user._id,
      email: user.email,
    };
  },

  // These can be configured in code or via environment variables
  // Uncomment and replace with actual values to configure in code:
  // organizationToken: "your_organization_token", // Or use POLAR_ORGANIZATION_TOKEN env var
  // webhookSecret: "your_webhook_secret", // Or use POLAR_WEBHOOK_SECRET env var
  // server: "sandbox", // "sandbox" or "production", falls back to POLAR_SERVER env var
});


export const {
  // If you configure your products by key in the Polar constructor,
  // this query provides a keyed object of the products.
  getConfiguredProducts,

  // Lists all non-archived products, useful if you don't configure products by key.
  listAllProducts,

  // Generates a checkout link for the given product IDs.
  generateCheckoutLink,

  // Generates a customer portal URL for the current user.
  generateCustomerPortalUrl,

  // Changes the current subscription to the given product ID.
  changeCurrentSubscription,

  // Cancels the current subscription.
  cancelCurrentSubscription,
} = polar.api();

// Helper function to get current user with subscription info
const getCurrentUserWithSubscription = async (ctx: QueryCtx): Promise<Doc<"user"> & {
  subscription: any;
  isPremium: boolean;
  isFree: boolean;
  subscriptionStatus: string;
  currentPeriodEnd: string | null | undefined;
  currentPeriodStart: string | null | undefined;
  cancelAtPeriodEnd: boolean;
}> => {
  const user: Doc<"user"> | null = await ctx.runQuery(api.auth.getCurrentUser);
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get subscription data from Polar using the polar instance
  const subscription = await polar.getCurrentSubscription(ctx, {
    userId: user._id,
  });

  const productKey = subscription?.productKey;
  const isPremium = productKey === "premiumMonthly" || productKey === "premiumLifetime";
  
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