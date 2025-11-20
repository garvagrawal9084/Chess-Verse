import { WebSocket, WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import connectDB from "./Config/db";
import jwt from "jsonwebtoken";
import winloseRouter from "./routes/update_win_lose";
import User from "./models/User";
import { ATOMIC_CHESS, FISHER_CHESS, STANDARD } from "./messages";

// Load environment variable
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const SECRET_KEY = process.env.SECRET_KEY || "default_secret";

// MiddleWare
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/update_win_lose", winloseRouter);

connectDB();

const wss = new WebSocketServer({ port: 8000 });

const gameManager = new GameManager();

wss.on("connection", function connection(ws: WebSocket, req) {
  // Extract token from url query parameter

  const url = new URL(req.url || "", `http://localhost:${port}`);

  const token = url.searchParams.get("token");

  if (!token) {
    ws.close();
    return;
  }

  try {
    const decode = jwt.verify(token, SECRET_KEY) as {
      userID: string;
      username: string;
    };
    (ws as any).username = decode.username;
    (ws as any).userID = decode.userID;
    gameManager.addUser(ws);
  } catch (error) {
    console.error("Websocket token verification failed : ", error);
    ws.close();
  }

  ws.on("close", () => gameManager.removeUser(ws));
});

app.get("/api/Dashboard", async (req, res) => {
  const gameType = req.query.gameType;
  try {
    if (gameType === STANDARD) {
      const data = await User.find().sort({ rating: -1 });

      res.json(data);
    } else if (gameType === FISHER_CHESS) {
      const data = await User.find().sort({ rating: -1 });

      res.json(data);
    } else if (gameType === ATOMIC_CHESS) {
      const data = await User.find().sort({ rating: -1 });

      res.json(data);
    }
  } catch (e) {
    console.log(e);
  }
});

app.get("/api/profile", async (req, res) => {
  const username = req.query.username;
  try {
    const data = await User.findOne({ username: username });
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
