import { mutation, query, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import {  getUser, safeGetUser } from "./auth";
import { ConvexError } from "convex/values";
import { Id } from "./betterAuth/_generated/dataModel";

export const updateUserData = async (ctx: MutationCtx, { userId, data }: { userId: Id<"user">; data: any }) => {
  const userDoc = await ctx.db.get(userId);
  if (!userDoc) {
    throw new Error("User not found");
  }
  
  return await ctx.db.patch(userId, data);
};

export const deleteUserData = async (ctx: MutationCtx, { userId }: { userId: Id<"user"> }) => {
  return await ctx.db.delete(userId);
};

// Update user profile
export const updateUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    picture: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    
    if (!user || !user.userId) {
      throw new ConvexError("User not found");
    }
    
    try {
      // Update user in Better Auth
      await updateUserData(ctx, {
        userId: user.userId as Id<"user">,
        data: {
          name: args.name,
          email: args.email,
          image: args.picture,
        },
      });

      return { success: true, message: "Profile updated successfully" };
    } catch (error) {
      throw new ConvexError(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  },
});

// Upload image (placeholder implementation)
export const uploadImage = mutation({
  args: {
    file: v.any(), // In a real app, you'd handle file upload properly
  },
  handler: async (ctx) => {
    const user = await getUser(ctx);

    try {
      // In a real implementation, you would:
      // 1. Upload file to cloud storage (S3, Cloudinary, etc.)
      // 2. Get the URL back
      // For now, we'll simulate this
      const imageUrl = `https://example.com/uploads/${Date.now()}.jpg`;

      return { url: imageUrl };
    } catch (error) {
      throw new ConvexError("Failed to upload image");
    }
  },
});

// Resend verification email
export const resendVerificationEmail = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getUser(ctx);
    
    if (!user.email) {
      throw new ConvexError("No email found for this account");
    }

    try {
      // In a real implementation, you would send verification email
      // For now, we'll simulate this
      return { message: "Verification email sent successfully" };
    } catch (error) {
      throw new ConvexError("Failed to send verification email");
    }
  },
});

// Update password
export const updatePassword = mutation({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user || !user.userId) {
      throw new ConvexError("User not found");
    }

    try {
      // Get user's current password hash from account table
      const account = await ctx.db
        .query("account")
        .withIndex("userId", (q) => q.eq("userId", user.userId as Id<"user">))
        .first();

      if (!account?.password) {
        throw new ConvexError("No password found for this account");
      }

      // In a real implementation, you would:
      // 1. Verify current password with bcrypt
      // 2. Hash new password
      // 3. Update in database
      // For now, we'll simulate this
      
      return { success: true, message: "Password updated successfully" };
    } catch (error) {
      throw new ConvexError(
        error instanceof Error ? error.message : "Failed to update password"
      );
    }
  },
});

// Delete account
export const deleteAccount = mutation({
  args: {
    confirmText: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

        if (!user || !user.userId) {
          throw new ConvexError("User not found");
        }

    if (args.confirmText !== "delete") {
      throw new ConvexError("Confirmation text must be 'delete'");
    }

    try {
      // Delete user account using Better Auth
      await deleteUserData(ctx, { userId: user.userId as Id<"user"> });

      return { success: true, message: "Account deleted successfully" };
    } catch (error) {
      throw new ConvexError("Failed to delete account");
    }
  },
});

// Store 2FA data (helper mutation for actions)
export const store2FAData = mutation({
  args: {
    secret: v.string(),
    backupCodes: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    
    if (!user || !user.userId) {
      throw new ConvexError("User not found");
    }

    // Check if twoFactor record already exists
    const existingTwoFactor = await ctx.db
      .query("twoFactor")
      .withIndex("userId", (q) => q.eq("userId", user.userId as Id<"user">))
      .first();

    if (existingTwoFactor) {
      // Update existing record
      await ctx.db.patch(existingTwoFactor._id, {
        secret: args.secret,
        backupCodes: args.backupCodes,
      });
    } else {
      // Create new record
      await ctx.db.insert("twoFactor", {
        secret: args.secret,
        backupCodes: args.backupCodes,
        userId: user.userId as Id<"user">,
      });
    }

    return { success: true };
  },
});

// Get 2FA data (helper query for actions)
export const get2FAData = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUser(ctx);
    
    if (!user || !user.userId) {
      throw new ConvexError("User not found");
    }

    const twoFactorRecord = await ctx.db
      .query("twoFactor")
      .withIndex("userId", (q) => q.eq("userId", user.userId as Id<"user">))
      .first();

    return twoFactorRecord;
  },
});

// Enable 2FA (helper mutation for actions)
export const enable2FAMutation = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getUser(ctx);

    if (!user || !user.userId) {
      throw new ConvexError("User not found");
    }

    // Enable 2FA for the user using Better Auth
    await updateUserData(ctx, {
      userId: user.userId as Id<"user">,
      data: {
        twoFactorEnabled: true,
      },
    });

    return { success: true };
  },
});

// Disable 2FA
export const disable2FA = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getUser(ctx);

        if (!user || !user.userId) {
          throw new ConvexError("User not found");
        }

    try {
      // Disable 2FA in user table using Better Auth
      await updateUserData(ctx, {
        userId: user.userId as Id<"user">,
        data: {
          twoFactorEnabled: false,
        },
      });

      // Delete the twoFactor record
      const twoFactorRecord = await ctx.db
        .query("twoFactor")
        .withIndex("userId", (q) => q.eq("userId", user.userId as Id<"user">))
        .first();

      if (twoFactorRecord) {
        await ctx.db.delete(twoFactorRecord._id);
      }

      return {
        success: true,
        message: "2FA disabled successfully",
      };
    } catch (error) {
      throw new ConvexError("Failed to disable 2FA");
    }
  },
});

// Get 2FA status
export const get2FAStatus = query({
  args: {},
  handler: async (ctx) => {
    const user = await safeGetUser(ctx);


    
    if (!user) {
      return { enabled: false };
    }

    try {
      return {
        enabled: user.twoFactorEnabled || false,
      };
    } catch (error) {
      return { enabled: false };
    }
  },
});

// Get user accounts
export const getUserAccounts = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUser(ctx);

        if (!user || !user.userId) {
          throw new ConvexError("User not found");
        }

    try {
      // Get all accounts for the user
      const accounts = await ctx.db
        .query("account")
        .withIndex("userId", (q) => q.eq("userId", user.userId as Id<"user">))
        .collect();

      return accounts.map((account) => ({
        id: account._id,
        providerId: account.providerId,
        accountId: account.accountId,
      }));
    } catch (error) {
      throw new ConvexError("Failed to fetch user accounts");
    }
  },
});