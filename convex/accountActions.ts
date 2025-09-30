"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { authenticator } from "otplib";
import { api } from "./_generated/api";

// Setup 2FA - Action version
export const setup2FA = action({
  args: {},
  handler: async (ctx): Promise<{
    uri: string;
    secret: string;
    backupCodes: string[];
  }> => {
    // Get user from query
    const user = await ctx.runQuery(api.auth.getCurrentUser);
    
    if (!user?.email) {
      throw new Error("No email found for this account");
    }

    try {
      // Generate secret for TOTP
      const secret = authenticator.generateSecret();

      // Create TOTP URI
      const uri = authenticator.keyuri(user.email, "resumebe", secret);

      // Generate backup codes
      const backupCodes = Array.from({ length: 8 }, () =>
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );

      // Store the 2FA data using a mutation
      await ctx.runMutation(api.account.store2FAData, {
        secret,
        backupCodes: JSON.stringify(backupCodes),
      });

      return {
        uri,
        secret,
        backupCodes,
      };
    } catch (error) {
      throw new Error("Failed to setup 2FA");
    }
  },
});

// Enable 2FA - Action version
export const enable2FA = action({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args): Promise<{
    success: boolean;
    backupCodes: string[];
    message: string;
  }> => {
    // Validate code format
    if (!/^\d{6}$/.test(args.code)) {
      throw new Error("Code must be exactly 6 digits");
    }

    try {
      // Get user's 2FA secret from query
      const twoFactorData: any = await ctx.runQuery(api.account.get2FAData);

      if (!twoFactorData?.secret) {
        throw new Error("2FA setup not found. Please setup 2FA first.");
      }

      // Verify the TOTP code
      const isValid = authenticator.verify({
        token: args.code,
        secret: twoFactorData.secret,
      });

      if (!isValid) {
        throw new Error("Invalid verification code");
      }

      // Enable 2FA for the user using a mutation
      await ctx.runMutation(api.account.enable2FAMutation);

      const backupCodes: string[] = twoFactorData.backupCodes
        ? JSON.parse(twoFactorData.backupCodes)
        : [];

      return {
        success: true,
        backupCodes,
        message: "2FA enabled successfully",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to enable 2FA"
      );
    }
  },
});
