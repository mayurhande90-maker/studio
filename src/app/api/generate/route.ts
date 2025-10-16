console.log("Firebase config check:", {
  key: process.env.FIREBASE_API_KEY ? "✅ present" : "❌ missing",
  project: process.env.FIREBASE_PROJECT_ID,
});

import app from "../../../../lib/firebase";

    
