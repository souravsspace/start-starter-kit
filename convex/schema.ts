import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { tables as betterAuthTables } from "./betterAuth/schema";

export default defineSchema({
  ...betterAuthTables,
  supportRequests: defineTable({
    name: v.string(),
    email: v.string(),
    type: v.union(v.literal("help"), v.literal("contact")),
    category: v.optional(v.union(
      v.literal("getting-started"),
      v.literal("account"),
      v.literal("billing"),
      v.literal("technical"),
      v.literal("features"),
      v.literal("api"),
      v.literal("other")
    )),
    topic: v.optional(v.union(
      v.literal("technical"),
      v.literal("billing"),
      v.literal("account"),
      v.literal("feature"),
      v.literal("other")
    )),
    subject: v.string(),
    message: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    status: v.union(v.literal("pending"), v.literal("in-progress"), v.literal("resolved"), v.literal("closed")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_created_at", ["createdAt"]),
});
