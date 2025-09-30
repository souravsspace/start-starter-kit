import { betterAuth } from "better-auth";
import {
  AuthFunctions,
  createClient,
  GenericCtx,
} from "@convex-dev/better-auth";
import { emailOTP, magicLink, twoFactor } from "better-auth/plugins";
import { convex } from "@convex-dev/better-auth/plugins";
import {
  sendEmailVerification,
  sendMagicLink,
  sendOTPVerification,
  sendResetPassword,
} from "./emails";
import { requireMutationCtx } from "@convex-dev/better-auth/utils";
import { components, internal } from "./_generated/api";
import betterAuthSchema from "./betterAuth/schema";
import { DataModel } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { withoutSystemFields } from "convex-helpers";

const authFunctions: AuthFunctions = internal.auth;
const siteUrl = process.env.SITE_URL;

export const authComponent = createClient<DataModel, typeof betterAuthSchema>(
  components.betterAuth,
  {
    authFunctions,
    local: {
      schema: betterAuthSchema,
    },
    verbose: false,
    triggers: {
      user: {
        onCreate: async (ctx, authUser) => {
          /**
           * The Better Auth user is already created in the auth schema
           * We just need to set the userId reference to the auth user's _id
           **/
          await authComponent.setUserId(ctx, authUser._id, authUser._id);
        },
      },
    },
  },
);

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) =>
  betterAuth({
    baseURL: siteUrl,
    logger: {
      disabled: optionsOnly,
    },
    database: authComponent.adapter(ctx),
    account: {
      accountLinking: {
        enabled: true,
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        try {
          // Send email directly using the emails function
          // Note: This requires the ctx to have mutation capabilities
          await sendEmailVerification(ctx as any, {
            to: user.email,
            url,
          });
        } catch (error) {
          console.error("Failed to send verification email:", error);
          throw error;
        }
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }) => {
        try {
          // Send email directly using the emails function
          // Note: This requires the ctx to have mutation capabilities
          await sendResetPassword(ctx as any, {
            to: user.email,
            url,
          });
        } catch (error) {
          console.error("Failed to send reset password email:", error);
          throw error;
        }
      },
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        accessType: "offline",
        prompt: "select_account consent",
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
    user: {
      deleteUser: {
        enabled: true,
      },
      additionalFields: {
        foo: {
          type: "string",
          required: false,
        },
      },
    },
    rateLimit: {
      enabled: true,
      window: 10, // time window in seconds
      max: 100, // max requests in the window
      customRules: {
        "/register": {
          window: 10, // time window in seconds
          max: 3, // max requests in the window is 3
        },
        "/login": {
          window: 10, // time window in seconds
          max: 3, // max requests in the window is 3
        },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    },
    plugins: [
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          await sendMagicLink(requireMutationCtx(ctx), {
            to: email,
            url,
          });
        },
      }),
      emailOTP({
        async sendVerificationOTP({ email, otp }) {
          await sendOTPVerification(requireMutationCtx(ctx), {
            to: email,
            code: otp,
          });
        },
      }),
      twoFactor(),
      convex(),
    ],
  });

// Below are example functions for getting the current user
// Feel free to edit, omit, etc.
export const safeGetUser = async (ctx: QueryCtx) => {
  const authUser = await authComponent.safeGetAuthUser(ctx);
  
  if (!authUser) {
    return;
  }
  
  // The authUser from Better Auth IS the user record from the user table
  // Just return it with proper structure
  const userWithoutSystemFields = withoutSystemFields(authUser);
  return {
    ...userWithoutSystemFields,
    _id: authUser._id,
  };
};

export const getUser = async (ctx: QueryCtx) => {
  const user = await safeGetUser(ctx);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return safeGetUser(ctx);
  },
});

export const sendVerificationEmail = mutation({
  args: {
    to: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    await sendEmailVerification(ctx, {
      to: args.to,
      url: args.url,
    });
  },
});

export const sendResetPasswordEmail = mutation({
  args: {
    to: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    await sendResetPassword(ctx, {
      to: args.to,
      url: args.url,
    });
  },
});

export { createAuth as auth };
