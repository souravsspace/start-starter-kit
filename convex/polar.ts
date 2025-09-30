import { Polar } from "@convex-dev/polar";
import { api, components } from "./_generated/api";
import { ConvexError, v } from "convex/values";
import { QueryCtx, query, action } from "./_generated/server";
import { RunQueryCtx } from "@convex-dev/better-auth";
import { PLANS } from "./constants/plans";

async function getUserInfo(
  ctx: QueryCtx | RunQueryCtx,
): Promise<{ userId: string; email: string }> {
  const user = await ctx.runQuery(api.auth.getCurrentUser);

  if (!user || !user.email) {
    throw new ConvexError("Please sign in to manage your subscription");
  }

  // Use the user's _id as userId if userId field is not set
  const userId = user.userId || user._id;

  if (!userId) {
    throw new ConvexError("Please sign in to manage your subscription");
  }

  return {
    userId: userId,
    email: user.email,
  };
}

export const polar = new Polar(components.polar, {
  getUserInfo: async (ctx): Promise<{ userId: string; email: string }> => {
    return await getUserInfo(ctx);
  },

  products: {
    [PLANS.PREMIUM_MONTHLY.frontendId]: PLANS.PREMIUM_MONTHLY.id,
    [PLANS.PREMIUM_YEARLY.frontendId]: PLANS.PREMIUM_YEARLY.id,
  },
});

export const {
  changeCurrentSubscription,
  cancelCurrentSubscription,
  getConfiguredProducts,
  listAllProducts,
  generateCheckoutLink,
  generateCustomerPortalUrl,
} = polar.api();

export const getSubscriptionStatus = query({
  handler: async (ctx) => {
    try {
      const { userId } = await getUserInfo(ctx);

      const subscription = await polar.getCurrentSubscription(ctx, { userId });
      return subscription;
    } catch (error) {
      // If the product lookup fails (known issue with Convex Polar integration),
      // return null so the UI can handle it gracefully
      console.error("Subscription lookup failed:", error);
      return null;
    }
  },
});

// Add a proper sync function according to official docs
export const syncProducts = action({
  handler: async (ctx) => {
    await polar.syncProducts(ctx);
  },
});

