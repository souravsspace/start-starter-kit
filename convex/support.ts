import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitSupportRequest = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    type: v.union(v.literal("help"), v.literal("contact")),
    category: v.optional(
      v.union(
        v.literal("getting-started"),
        v.literal("account"),
        v.literal("billing"),
        v.literal("technical"),
        v.literal("features"),
        v.literal("api"),
        v.literal("other"),
      ),
    ),
    topic: v.optional(
      v.union(
        v.literal("technical"),
        v.literal("billing"),
        v.literal("account"),
        v.literal("feature"),
        v.literal("other"),
      ),
    ),
    subject: v.string(),
    message: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent"),
    ),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();

    // Save to database
    const supportRequestId = await ctx.db.insert("supportRequests", {
      name: args.name,
      email: args.email,
      type: args.type,
      category: args.category,
      topic: args.topic,
      subject: args.subject,
      message: args.message,
      priority: args.priority,
      status: "pending",
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    
    return supportRequestId;
  },
});
