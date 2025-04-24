import { query } from "./_generated/server";
import { v } from "convex/values";
import type { User } from "./types";

// Example user type, adjust fields as needed for your auth provider
export const getCurrentUser = query({
  args: {},
  handler: async (ctx): Promise<User | null> => {
    const identity = ctx.auth.getUserIdentity();
    if (!identity) return null;
    // You can fetch more user info from your users table if needed
    // For now, just return the identity object
    return {
      id: (await identity)?.subject ?? "",
      name: (await identity)?.name ?? "",
      email: (await identity)?.email ?? "",
      // Add more fields if your auth provider supports them
    };
  },
});
