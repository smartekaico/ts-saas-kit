# HomeNuvo AI Interior Redesigner: Architecture Overview

## Overview

HomeNuvo is a web application that allows users to upload interior photos and use AI (via Replicate.com) to generate redesigned versions based on selected styles or prompts.

## High-Level Architecture

- **Frontend:** React (Tanstack Start), Tailwind CSS, Shadcn UI
- **Backend/API Gateway:** Convex DB (handles user/project data, backend logic, and secure API calls)
- **AI Model:** Replicate.com (image-to-image diffusion, e.g., ControlNet)
- **Image Storage:** (Recommended) Vercel Blob, AWS S3, Cloudinary, or Convex file storage (for small assets)

## Data Flow

1. User uploads an image via the frontend.
2. Image is uploaded to storage (directly or via Convex).
3. Frontend calls a Convex action to trigger AI redesign, passing the image reference and options.
4. Convex securely calls Replicate API, waits for the result, and stores the output image URL and metadata in the database.
5. Frontend subscribes to Convex data and displays both the original and redesigned images.

## Key Features

- Image upload and preview
- Style/prompt selection
- AI-powered redesign via Replicate
- Result display and download
- (Optional) User authentication and project management

## Technologies Used

- **React + Tanstack Router:** Routing, UI logic
- **Tailwind CSS + Shadcn UI:** Styling and components
- **Convex:** Database, backend logic, secure API calls
- **Replicate.com:** AI model inference
- **Cloud Storage:** For images

## Extensibility

- Add more AI models or style options
- Integrate user authentication for SaaS features
- Expand dashboard/project management capabilities

---

For more details, see the other docs in this folder.
