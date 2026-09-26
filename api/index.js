import { createApp } from '../backend/dist/app.js';

let appInstance = null;

function getApp() {
  if (!appInstance) {
    appInstance = createApp();
  }
  return appInstance;
}

export default function handler(req, res) {
  // Ensure req.url starts with /api so all backend Express routes match
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? req.url : `/${req.url}`}`;
  }
  const app = getApp();
  return app(req, res);
}
