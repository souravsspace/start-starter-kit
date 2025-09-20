import { betterAuth } from "better-auth";
import {
  AuthFunctions,
  createClient,
  GenericCtx,
} from "@convex-dev/better-auth";
import { anonymous, emailOTP, magicLink, twoFactor } from "better-auth/plugins";
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
import { query, QueryCtx } from "./_generated/server";
import { withoutSystemFields } from "convex-helpers";

const authFunctions: AuthFunctions = internal.auth;
const siteUrl = process.env.SITE_URL || process.env.VITE_SITE_URL;

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
        await sendEmailVerification(requireMutationCtx(ctx), {
          to: user.email,
          url,
        });
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }) => {
        await sendResetPassword(requireMutationCtx(ctx), {
          to: user.email,
          url,
        });
      },
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
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
      anonymous(),
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
  // Return the auth user directly since it contains all user data
  return withoutSystemFields(authUser);
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

export { createAuth as auth };
