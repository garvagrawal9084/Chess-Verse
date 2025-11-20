import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/chessVerse";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
