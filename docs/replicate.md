# Replicate.com AI Model Integration

## What is Replicate?

Replicate is a platform for running machine learning models in the cloud via a simple API. In this project, it is used to generate redesigned interior images using image-to-image diffusion models (e.g., ControlNet).

## Key Concepts

- **Model:** An AI model hosted on Replicate (e.g., ControlNet for interior design).
- **Prediction:** A request to run a model with specific inputs (image, prompt, etc.).
- **API Token:** Required for authentication; should be kept secret and used only server-side (e.g., in Convex actions).

## Integration Steps

1. **Get a Replicate API Token:**
   - Sign up at [Replicate.com](https://replicate.com/).
   - Generate an API token from your account settings.
   - Store it in your backend environment (e.g., `.env.local` as `REPLICATE_API_TOKEN`).
2. **Choose a Model:**
   - Find a suitable image-to-image model for interior design (e.g., ControlNet, Stable Diffusion variants).
   - Note the model owner, name, and version (e.g., `owner/model:version`).
3. **Call the API:**
   - Use a Convex action to POST to `https://api.replicate.com/v1/predictions` with the required inputs.
   - Example payload:
     ```json
     {
       "version": "MODEL_VERSION",
       "input": {
         "image": "IMAGE_URL",
         "prompt": "modern living room"
       }
     }
     ```
   - Pass the API token in the `Authorization` header.
4. **Handle the Response:**
   - The response includes a prediction ID and status.
   - Poll the prediction endpoint or use webhooks to get the result image URL when ready.
5. **Store Results:**
   - Save the result image URL and metadata in Convex for frontend display.

## Example Convex Action

See `convex/replicate.ts` for a sample implementation of the API call and result handling.

## Resources

- [Replicate API Reference](https://replicate.com/docs/reference/http)
- [Replicate Model Explorer](https://replicate.com/explore)
