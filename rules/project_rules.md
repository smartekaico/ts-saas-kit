**App Plan: HomeNuvo AI Interior Redesigner**

**1. Core Concept:**
A web application where users can upload an interior photo and use AI models from Replicate.com to generate redesigned versions based on chosen styles or prompts.

**2. Key Features:**

- **Image Upload:** Allow users to easily upload their interior photo.
- **AI Model Integration:** Connect to a specific interior design or image-to-image diffusion model on Replicate.com.
- **Style/Prompt Selection:** (Optional, depending on the Replicate model) Allow users to select predefined styles (e.g., Modern, Scandinavian, Minimalist) or enter text prompts to guide the AI redesign.
- **Generation Process:** Send the uploaded image and selected options to the Replicate API for processing.
- **Result Display:** Show the original image alongside the AI-generated redesign(s).
- **Loading State:** Indicate when the AI generation is in progress.
- **Save/Download:** Allow users to save generated designs or download the images.
- **User Authentication (Optional but recommended for SaaS):** Allow users to create accounts to save their projects and designs.
- **Project Management:** A dashboard or page to view previously uploaded images and generated designs.

**3. User Flow:**

1.  User arrives at the site.
2.  (Optional) User logs in or signs up.
3.  User navigates to the "Create New Design" page.
4.  User uploads an interior image.
5.  The image is displayed on the page.
6.  (Optional) User selects a style or enters a prompt.
7.  User clicks "Generate Redesign".
8.  A loading state is shown. The frontend sends the image data (or a reference/URL) and options to a backend function (Convex action).
9.  The Convex action calls the Replicate API with the image and options.
10. Replicate processes the request and returns the result (an image URL).
11. The Convex action receives the result and saves it (e.g., linked to the user/project) in the Convex database.
12. The frontend, subscribed to the Convex data, automatically updates when the result is available.
13. The original and generated images are displayed to the user.
14. User can save the design or download the image.

**4. Technical Stack & Architecture:**

- **Frontend:** React with Tanstack Start (for routing, potentially data fetching/mutations via RPC), Tailwind CSS + Shadcn UI (for styling and pre-built components). Handles UI logic, image preview, form input, and calling backend functions.
- **Backend/Database/API Gateway:** Convex DB. Stores user data, project information (original image reference, selected options), and generated results (image URLs). Convex actions/mutations will serve as the secure backend functions to interact with the Replicate API (keeping the API key server-side).
- **AI Model:** Replicate.com (Specifically, a model like ControlNet with an interior design condition, or a different image-to-image model suitable for interior transformations).
- **Image Storage:** You'll need a place to store uploaded images before sending them to Replicate and the generated images received from Replicate. Options include Vercel Blob Storage, AWS S3, Cloudinary, or even storing small images/references in Convex if appropriate (though dedicated storage is usually better for larger assets). Convex actions can handle uploading the image to storage before calling Replicate.

**5. Key Components (Frontend - React):**

- `Layout`: Overall app structure, navigation.
- `Auth Forms`: Login, Signup (if implementing auth).
- `Dashboard`: List of user's projects/designs.
- `Design Editor Page`:
  - `ImageUploadInput`: Component for selecting/dropping an image. Displays preview.
  - `DesignOptionsForm`: Component for selecting styles, entering prompts (if applicable).
  - `GenerateButton`: Triggers the AI process. Handles loading state.
  - `ResultDisplay`: Shows the original and generated images side-by-side.
  - `LoadingSpinner`: Visual feedback during generation.
  - `ActionButtons`: Save, Download.

**Code Prompts (Conceptual, React/Tanstack Start/Convex/Tailwind/Shadcn):**

Here are prompts focusing on the key interactions:

**Prompt 1: Basic Project Structure & UI (Tailwind/Shadcn)**

```typescript
// Prompt: Set up the basic Tanstack Start project structure.
// Integrate Tailwind CSS and Shadcn UI.
// Create a simple page layout with a header using Shadcn components.
// Create a dedicated page component for the interior redesign editor.

// Example Start: src/routes/_layout.tsx or src/routes/index.tsx
// Need to install: @tanstack/start, tanstack/router, tanstack/react-router, tailwindcss, shadcn-ui components (button, card, input, etc.)
// Configure tailwind.config.js and global CSS.
// Use Shadcn CLI to add components.

// src/routes/editor.tsx - Placeholder for the main editor page
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming shadcn path

export const Route = createFileRoute("/editor")({
  component: EditorPage,
});

function EditorPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Redesign Your Interior</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Components for upload, options, results will go here */}
          <p>Editor content goes here...</p>
        </CardContent>
      </Card>
    </div>
  );
}

// src/components/layout/Header.tsx - Example Header using Shadcn
import { Button } from "@/components/ui/button";

function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 shadow-sm">
      <h1 className="text-xl font-bold">Windsurf AI</h1>
      <nav>
        <Button variant="ghost">Dashboard</Button>
        <Button variant="ghost">Editor</Button>
        {/* Add Auth buttons if needed */}
      </nav>
    </header>
  );
}

// Apply Header in _layout.tsx
```

**Prompt 2: Image Upload Component (Frontend)**

```typescript
// Prompt: Create a React component using Shadcn UI that handles image upload.
// It should accept drag-and-drop or file selection.
// Display a preview of the uploaded image.
// Use state to hold the selected file and its preview URL.
// Use Shadcn's Input or a custom drag-and-drop area styled with Tailwind.

// src/components/ImageUploadInput.tsx
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface ImageUploadInputProps {
  onImageSelected: (file: File) => void;
}

function ImageUploadInput({ onImageSelected }: ImageUploadInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelected(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onImageSelected(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Card
      className="w-full cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current?.click()}
    >
      <CardContent className="flex flex-col items-center justify-center p-6">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-64 object-contain mb-4"
          />
        ) : (
          <div className="text-center border-2 border-dashed border-gray-300 p-8 rounded-md">
            <Label htmlFor="file-upload" className="cursor-pointer">
              <p className="text-sm text-gray-600">
                Drag 'n' drop an image here, or click to select
              </p>
            </Label>
          </div>
        )}
        {/* Hidden file input */}
        <Input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}

export default ImageUploadInput;
```

**Prompt 3: Integrating Convex for State & API Calls**

```typescript
// Prompt: Set up Convex in the project.
// Create a Convex mutation or action that will:
// 1. Receive the uploaded image data (or a file reference/URL after uploading to storage).
// 2. Receive any optional design parameters.
// 3. Call the Replicate.com API securely using the API key (stored as an environment variable accessible in Convex).
// 4. Wait for the Replicate result (output image URL).
// 5. Store the original image reference, parameters, and the result image URL in a Convex database table (e.g., 'designs').
// 6. Make the 'designs' table queryable from the frontend.

// --- Convex Setup ---
// Install: convex
// Init: npx convex init (follow instructions)
// Add .env.local for REPLICATE_API_TOKEN

// --- convex/schema.ts ---
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  designs: defineTable({
    originalImageId: v.string(), // Or v.id("storage") if using Convex file storage
    parameters: v.optional(v.any()), // Store style choices, prompts etc.
    status: v.union(
      v.literal("pending"),
      v.literal("generating"),
      v.literal("completed"),
      v.literal("failed")
    ),
    resultImageUrl: v.optional(v.string()),
    userId: v.optional(v.id("users")), // If implementing auth
    createdAt: v.number(),
  }),
  // Add a users table if implementing auth
  // users: defineTable({...})
});

// --- convex/replicate.ts (or actions/replicate.ts) ---
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

// You might need a way to upload files to storage first.
// Convex has experimental file storage: https://docs.convex.dev/file-storage/uploading-from-client
// Or use another service (Vercel Blob, etc.) and pass the URL.
// Let's assume for this prompt you pass a file reference or URL after uploading it.

// Example action to trigger Replicate generation
export const generateRedesign = action({
  args: {
    originalImageId: v.string(), // Reference to the uploaded image
    parameters: v.optional(v.any()), // Optional styles/prompts
  },
  handler: async (ctx, { originalImageId, parameters }) => {
    // Assume originalImageId is a URL or a way to retrieve the image URL
    // If using Convex storage, you'd fetch the URL:
    // const originalImageUrl = await ctx.storage.getUrl(originalImageId);
    // if (!originalImageUrl) throw new Error("Image not found");

    // --- Placeholder for getting image URL ---
    // Replace this with your actual method to get the image URL
    const originalImageUrl = `YOUR_IMAGE_STORAGE_URL/${originalImageId}`;
    // --- End Placeholder ---

    // 1. Create a pending design entry in DB
    const designId = await ctx.runMutation(api.replicate.createDesignEntry, {
      originalImageId,
      parameters,
      status: "generating",
      createdAt: Date.now(),
      // userId: ctx.auth.getUserIdentity() ? ctx.auth.getUserIdentity().subject : undefined, // If using auth
    });

    // 2. Call Replicate API
    const replicateApiToken = process.env.REPLICATE_API_TOKEN; // Ensure this is set in .env.local
    if (!replicateApiToken) {
      console.error("REPLICATE_API_TOKEN not set");
      await ctx.runMutation(api.replicate.updateDesignStatus, {
        designId,
        status: "failed",
      });
      return { success: false, error: "API token missing" };
    }

    const REPLICATE_MODEL = "MODEL_OWNER/MODEL_NAME:MODEL_VERSION"; // Replace with your chosen Replicate model

    try {
      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          Authorization: `Token ${replicateApiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: REPLICATE_MODEL.split(":")[1], // Extract version
          input: {
            image: originalImageUrl,
            // Add other model-specific parameters here based on 'parameters' arg
            // e.g., prompt: parameters?.prompt || "modern interior",
            //      a_prompt: "best quality, high resolution",
            //      n_prompt: "low quality, bad quality",
            //      controlnet_conditioning_scale: parameters?.conditioningScale || 1.0,
            //      ...
          },
          // webhook: `${process.env.CONVEX_URL}/api/webhooks/replicate?designId=${designId}`, // Optional: Replicate can call back
          // webhook_events_filter: ["completed", "canceled", "failed"],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Replicate API error:", response.status, errorBody);
        await ctx.runMutation(api.replicate.updateDesignStatus, {
          designId,
          status: "failed",
        });
        return {
          success: false,
          error: `Replicate API error: ${response.status}`,
        };
      }

      const prediction = await response.json();
      // Replicate predictions might not be ready immediately.
      // You usually need to poll the `prediction.urls.get` endpoint or use webhooks.
      // For simplicity in this prompt, let's assume a webhook updates the status and result.
      // If not using webhooks, you'd need a polling mechanism.

      console.log("Replicate prediction started:", prediction.id);

      // If using webhooks, the rest happens there.
      // If polling, the frontend would need to periodically query this prediction ID.
      // A common pattern is to store the prediction ID in Convex and poll from the client or another action.

      // For this example, let's add the prediction ID to the DB entry
      await ctx.runMutation(api.replicate.updateDesignPredictionId, {
        designId,
        predictionId: prediction.id,
      });

      return { success: true, predictionId: prediction.id };
    } catch (error) {
      console.error("Error calling Replicate:", error);
      await ctx.runMutation(api.replicate.updateDesignStatus, {
        designId,
        status: "failed",
      });
      return { success: false, error: (error as Error).message };
    }
  },
});

// --- convex/replicate.ts (Mutations to update DB) ---
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

export const createDesignEntry = mutation({
  args: {
    originalImageId: v.string(),
    parameters: v.optional(v.any()),
    status: v.union(
      v.literal("pending"),
      v.literal("generating"),
      v.literal("completed"),
      v.literal("failed")
    ),
    createdAt: v.number(),
    // userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const designId = await ctx.db.insert("designs", args);
    return designId;
  },
});

export const updateDesignStatus = mutation({
  args: {
    designId: v.id("designs"),
    status: v.union(
      v.literal("pending"),
      v.literal("generating"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, { designId, status }) => {
    await ctx.db.patch(designId, { status });
  },
});

export const updateDesignResult = mutation({
  args: {
    designId: v.id("designs"),
    resultImageUrl: v.string(),
    status: v.union(
      v.literal("completed"),
      v.literal("failed"),
      v.literal("canceled")
    ),
  },
  handler: async (ctx, { designId, resultImageUrl, status }) => {
    await ctx.db.patch(designId, { resultImageUrl, status });
  },
});

export const updateDesignPredictionId = mutation({
  args: {
    designId: v.id("designs"),
    predictionId: v.string(),
  },
  handler: async (ctx, { designId, predictionId }) => {
    await ctx.db.patch(designId, { predictionId });
  },
});

// --- convex/replicate.ts (Query to fetch designs) ---
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";

export const getDesign = query({
  args: {
    designId: v.id("designs"),
  },
  handler: async (ctx, { designId }) => {
    const design = await ctx.db.get(designId);
    // You might need to fetch the original image URL here if not stored directly
    return design;
  },
});

// Optional: query to list designs for a user/session
export const listUserDesigns = query({
  args: {
    // userId: v.optional(v.id("users")) // If using auth
  },
  handler: async (ctx, args) => {
    // const userId = args.userId || (ctx.auth.getUserIdentity() ? ctx.auth.getUserIdentity().subject : null); // If using auth
    // if (!userId) return []; // Or handle unauthenticated state

    // return ctx.db.query("designs").filter(q => q.eq(q.field("userId"), userId)).collect(); // Filter by user
    return ctx.db.query("designs").collect(); // Simple list all for now
  },
});
```

**Prompt 4: Connecting Frontend to Convex Actions/Queries & Displaying Results**

```typescript
// Prompt: In the EditorPage component:
// - Use the ImageUploadInput component to get the selected file.
// - Handle the 'onImageSelected' event to potentially upload the file to storage (using Convex storage or another method)
// - Use a Convex mutation (like the hypothetical `generateRedesign` action) to send the image reference and parameters to the backend.
// - Show a loading state while the generation is in progress.
// - Use a Convex query (like `getDesign`) to fetch the state of the design entry based on the ID returned by the mutation.
// - Display the original image and the result image using the fetched data.
// - Use Shadcn components for buttons, loading spinners etc.

// src/routes/editor.tsx (Continuing from Prompt 1)
import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ImageUploadInput from "@/components/ImageUploadInput"; // Import the upload component
import { useMutation, useQuery } from "convex/react"; // Import Convex hooks
import { api } from "../../convex/_generated/api"; // Import Convex API methods
import { Id } from "../../convex/_generated/dataModel";
import { Separator } from "@/components/ui/separator"; // Shadcn Separator
import { Progress } from "@/components/ui/progress"; // Shadcn Progress or Spinner

export const Route = createFileRoute("/editor")({
  component: EditorPage,
});

function EditorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [designId, setDesignId] = useState<Id<"designs"> | null>(null);
  const [isUploading, setIsUploading] = useState(false); // State for initial file upload
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Use Convex action to trigger generation
  // The actual file upload before calling this action is critical.
  // Assuming a hypothetical Convex storage upload mutation exists:
  // const uploadFile = useMutation(api.files.uploadFile); // Replace with your upload logic
  const generateRedesignAction = useMutation(api.replicate.generateRedesign);

  // Query the design state reactively
  const design = useQuery(
    api.replicate.getDesign,
    designId ? { designId } : "skip"
  );

  const handleImageSelected = async (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(null); // Clear old preview if any
    setDesignId(null); // Reset previous design state
    setUploadError(null);
    setIsUploading(true);

    // --- File Upload Logic ---
    // This part needs to be implemented based on your storage choice.
    // Example using hypothetical Convex file storage upload:
    /*
    try {
        const storageId = await uploadFile({ file }); // Pass file content
        // Assuming uploadFile returns a storage ID or URL
        const newDesignId = await generateRedesignAction({ originalImageId: storageId, parameters: {} });
        setDesignId(newDesignId); // Store the new design ID to query it
        setIsUploading(false);
    } catch (error) {
        console.error("Upload or generation initiation failed:", error);
        setUploadError("Failed to upload image or start generation.");
        setIsUploading(false);
    }
    */

    // Placeholder: If you have another way to get a URL after upload, use that:
    // For simplicity in this prompt, let's fake a successful upload and trigger generation
    // In a real app, you MUST upload the file first.
    const fakeFileReference = "some-temp-id-or-url"; // Replace with actual upload result
    try {
      const result = await generateRedesignAction({
        originalImageId: fakeFileReference,
        parameters: { style: "modern" },
      });
      if (result.success && result.predictionId) {
        // Action initiated successfully. The webhook/polling will update the design.
        // We still need the initial designId returned by the mutation *within* the action
        // The action needs to return the designId it created. Let's update the action prompt.
        // --- Assuming generateRedesignAction now returns the designId ---
        const newDesignId = await generateRedesignAction({
          originalImageId: fakeFileReference,
          parameters: { style: "modern" },
        }); // Action should return Id<"designs">
        setDesignId(newDesignId as Id<"designs">); // Cast if needed, depends on action return type
      } else {
        setUploadError(result.error || "Failed to start generation.");
      }
      setIsUploading(false);
    } catch (error) {
      console.error("Error initiating generation:", error);
      setUploadError("An unexpected error occurred.");
      setIsUploading(false);
    }
    // --- End Placeholder ---
  };

  const isLoading =
    isUploading ||
    (designId !== null && (!design || design.status === "generating"));
  const hasResult =
    design && design.status === "completed" && design.resultImageUrl;
  const isFailed = design && design.status === "failed";

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Redesign Your Interior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUploadInput onImageSelected={handleImageSelected} />

          {/* Optional: Design Options Form */}
          {/* <DesignOptionsForm onParametersChange={setParameters} /> */}

          {uploadError && <p className="text-red-500">{uploadError}</p>}

          <Button
            onClick={() => {
              /* Trigger logic handled by handleImageSelected */
            }}
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? "Generating..." : "Generate Redesign"}
          </Button>

          {isLoading && (
            <div className="flex flex-col items-center space-y-2">
              <Progress
                value={design?.status === "generating" ? 50 : 0}
                className="w-full"
              />{" "}
              {/* Basic progress */}
              <p className="text-sm text-gray-600">
                Status: {design?.status || "Uploading..."}
              </p>
            </div>
          )}

          {isFailed && (
            <div className="text-center text-red-500">
              Generation Failed. Please try again.
            </div>
          )}

          {hasResult && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Original</h3>
                  {/* You might need to fetch the original image URL again if not in 'design' */}
                  <img
                    src={`YOUR_IMAGE_STORAGE_URL/${design.originalImageId}`}
                    alt="Original Interior"
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Redesigned</h3>
                  <img
                    src={design.resultImageUrl}
                    alt="Redesigned Interior"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
        {hasResult && (
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline">Download Original</Button>
            <Button>Download Redesign</Button>
            {/* Add Save button if implementing user accounts */}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
```

**Prompt 5: Replicate Webhook Handling (Backend - Convex)**

```typescript
// Prompt: Implement a Convex HTTP action to handle webhooks from Replicate.com.
// This action should receive the prediction result from Replicate.
// It should find the corresponding 'designs' entry in the database using the prediction ID or design ID (if passed).
// Update the 'designs' entry with the result image URL and change the status to 'completed' or 'failed'.

// --- convex/http.ts ---
import { httpRouter } from "convex/server";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { v } from "convex/values";

const http = httpRouter();

http.route({
  path: "/webhooks/replicate",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payload = await request.json();
    console.log("Received Replicate webhook:", payload);

    // Validate the webhook payload structure based on Replicate's documentation
    // You might want to add signature verification for security
    if (!payload || !payload.id) {
      console.error("Invalid Replicate webhook payload");
      return new Response("Invalid payload", { status: 400 });
    }

    const predictionId = payload.id as string;
    const status = payload.status as
      | "queued"
      | "processing"
      | "succeeded"
      | "failed"
      | "canceled";
    const outputUrls = payload.output as string[] | null; // Array of output URLs
    const error = payload.error as string | null; // Error message if status is failed

    // Find the design entry based on the predictionId
    // You need to add a query to find a design by prediction ID
    const design = await ctx.runQuery(api.replicate.getDesignByPredictionId, {
      predictionId,
    });

    if (!design) {
      console.warn(`Design entry not found for prediction ID: ${predictionId}`);
      return new Response("Design not found", { status: 404 });
    }

    let newStatus: Doc<"designs">["status"];
    let resultImageUrl: string | undefined = undefined;
    let updateError: string | undefined = undefined;

    switch (status) {
      case "succeeded":
        newStatus = "completed";
        // Replicate output is often an array of URLs. Take the first one, or process as needed.
        resultImageUrl = outputUrls?.[0];
        if (!resultImageUrl) {
          console.error(
            `Replicate succeeded but no output URLs found for prediction ${predictionId}`
          );
          newStatus = "failed"; // Consider it failed if no image URL
          updateError = "Replicate succeeded but no image output received.";
        }
        break;
      case "failed":
        newStatus = "failed";
        updateError = error || "Generation failed on Replicate.";
        console.error(
          `Replicate prediction failed (${predictionId}): ${error}`
        );
        break;
      case "canceled":
        newStatus = "failed"; // Or maybe a separate 'canceled' status
        updateError = "Generation was canceled on Replicate.";
        console.warn(`Replicate prediction canceled (${predictionId})`);
        break;
      case "queued":
      case "processing":
        // These statuses don't require a DB update via webhook typically,
        // as the status was set to 'generating' when initiated.
        // Unless you want to track queueing vs processing distinctly.
        console.log(`Replicate prediction ${predictionId} is still ${status}`);
        return new Response("Processing status received, no update needed", {
          status: 200,
        });
      default:
        console.warn(
          `Unknown Replicate status: ${status} for prediction ${predictionId}`
        );
        return new Response("Unknown status", { status: 200 }); // Acknowledge receipt
    }

    // Update the design entry in the database
    try {
      await ctx.runMutation(api.replicate.updateDesignResult, {
        designId: design._id,
        resultImageUrl: resultImageUrl,
        status: newStatus,
      });
      // If failed status from webhook, maybe also store the error message
      if (newStatus === "failed" && updateError) {
        await ctx.runMutation(api.replicate.patchDesign, {
          // Need a general patch mutation
          designId: design._id,
          patch: { errorMessage: updateError }, // Add error field to schema
        });
      }

      return new Response("Webhook processed successfully", { status: 200 });
    } catch (dbError) {
      console.error(
        `Failed to update database for prediction ${predictionId}:`,
        dbError
      );
      return new Response("Database update failed", { status: 500 });
    }
  }),
});

// --- Add this query to convex/replicate.ts ---
export const getDesignByPredictionId = query({
  args: {
    predictionId: v.string(),
  },
  handler: async (ctx, { predictionId }) => {
    // Assuming you added 'predictionId' field to the 'designs' table schema
    return ctx.db
      .query("designs")
      .filter((q) => q.eq(q.field("predictionId"), predictionId))
      .first();
  },
});

// --- Add this mutation to convex/replicate.ts if you need to store error messages ---
export const patchDesign = mutation({
  args: {
    designId: v.id("designs"),
    patch: v.any(), // Use v.any() for a flexible patch
  },
  handler: async (ctx, { designId, patch }) => {
    await ctx.db.patch(designId, patch);
  },
});

// Export the router
export default http;
```

**Further Steps & Considerations:**

1.  **Image Storage:** You _must_ implement reliable image storage (Convex storage, Vercel Blob, S3, etc.) before calling Replicate. Replicate needs a public URL for the image.
2.  **Replicate Model Specifics:** The `input` parameters for the `generateRedesign` action need to be tailored exactly to the Replicate model you choose. Read the model's documentation carefully.
3.  **Polling vs. Webhooks:** The prompt uses webhooks which is more efficient. If your hosting doesn't support webhooks easily or the Replicate model doesn't offer them, you'll need a client-side or server-side polling mechanism to check the prediction status using Replicate's `GET /predictions/{id}` endpoint. Convex actions could also be used for server-side polling.
4.  **Error Handling:** Implement more robust error handling on both frontend and backend.
5.  **Loading State:** Refine the loading state UI. Show progress if the model provides it.
6.  **Design Options:** Add the `DesignOptionsForm` component and integrate its state into the `generateRedesign` action's parameters.
7.  **Authentication:** Implement user authentication using Convex's auth features or another provider if you need users to save their work.
8.  **Concurrency/Queuing:** Consider how to handle multiple requests, especially if AI generation is slow. Convex actions can help manage server-side tasks.

This structure provides a solid foundation using the requested technologies. Remember to replace placeholders like `YOUR_IMAGE_STORAGE_URL` and the Replicate model details. Good luck!
