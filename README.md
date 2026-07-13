<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/f71ee29e-37b1-4e7d-84df-e71b5e64c7d2

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Production

Build and serve locally:

```bash
npm ci          # or npm install
npm run build   # outputs static site to dist/
npm start       # serves dist/ on http://0.0.0.0:3000
```

## Deploy to Render

This repo includes a [`render.yaml`](render.yaml) Blueprint (static site, publishes `dist/`, SPA rewrite included).

1. Push to `main` (auto-deploy is enabled once the service exists).
2. Create the service: go to https://dashboard.render.com/blueprints → **New Blueprint Instance** → select `mbergo/TIM-BEGOOL`, or via CLI:

```bash
render blueprint launch   # requires `render login` first
```

