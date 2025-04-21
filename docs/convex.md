# Convex Integration Guide

## What is Convex?

Convex is a backend-as-a-service platform that provides a serverless database, real-time queries, and backend functions for modern web apps. It is used here for storing user data, project information, and securely handling backend logic (including API calls to Replicate).

## Key Concepts

- **Database:** Convex provides a document-based database with real-time subscriptions.
- **Mutations:** Functions that modify data in the database.
- **Queries:** Functions that fetch data from the database.
- **Actions:** Server-side functions for side effects (e.g., calling external APIs like Replicate).
- **File Storage:** Convex supports file uploads (experimental), useful for storing images.

## Project Setup

1. Install Convex:
   ```bash
   npm install convex
   ```
2. Initialize Convex in your project:
   ```bash
   npx convex init
   ```
3. Add your Convex deployment URL to `.env.local`:
   ```env
   VITE_CONVEX_URL=your-convex-url
   ```

## Example Schema

See `convex/schema.ts` for the main data model. Example:

```ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  designs: defineTable({
    originalImageId: v.string(),
    parameters: v.optional(v.any()),
    status: v.union(
      v.literal("pending"),
      v.literal("generating"),
      v.literal("completed"),
      v.literal("failed")
    ),
    resultImageUrl: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    createdAt: v.number(),
  }),
});
```

## Backend Functions

- **Mutations:** For creating/updating design entries.
- **Actions:** For calling Replicate API securely.
- **Queries:** For fetching user/project/design data.

## Usage in Frontend

- Use `convex/react` hooks (`useQuery`, `useMutation`) to interact with backend.
- Example:
  ```ts
  const createDesign = useMutation(api.replicate.createDesignEntry);
  const designs = useQuery(api.replicate.listUserDesigns);
  ```

## Resources

- [Convex Docs](https://docs.convex.dev/)
- [Convex File Storage](https://docs.convex.dev/file-storage/uploading-from-client)
