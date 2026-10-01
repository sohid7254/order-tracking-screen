# Order Tracking Screen

A mobile-first order tracking screen (360–430px) built with React (Vite) and Tailwind CSS. It uses mock data only; no backend is needed.

## States
- **On the way**: normal in-transit order with a live-location sheet
- **Delayed**: new estimate, reason, notify and refund options
- **Not received**: delivered but missing, with guided steps and an issue report
- **No tracking yet**: confirmed order with a notify toggle
- **Loading** and **Error**, with retry

A pill bar at the top of the screen switches states for demo purposes.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```
Production build: `npm run build` (output in `dist/`), preview with `npm run preview`.

## Deploy
Import the repo into Vercel or Netlify. Build command `npm run build`, output directory `dist`.

## Structure
- `src/index.css`: Tailwind layers and light/dark theme tokens
- `src/components/TrackingScreen.jsx`: screen, states and sheets
- `src/components/ui.jsx`: Btn, Card, Sheet, Toast, Skeleton
- `src/components/data.js`: mock order data
