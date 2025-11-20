"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const db_1 = __importDefault(require("./Config/db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const update_win_lose_1 = __importDefault(require("./routes/update_win_lose"));
const User_1 = __importDefault(require("./models/User"));
const messages_1 = require("./messages");
// Load environment variable
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
const SECRET_KEY = process.env.SECRET_KEY || "default_secret";
// MiddleWare
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/auth", auth_1.default);
app.use("/update_win_lose", update_win_lose_1.default);
(0, db_1.default)();
const wss = new ws_1.WebSocketServer({ port: 8000 });
const gameManager = new GameManager_1.GameManager();
wss.on("connection", function connection(ws, req) {
    // Extract token from url query parameter
    const url = new URL(req.url || "", `http://localhost:${port}`);
    const token = url.searchParams.get("token");
    if (!token) {
        ws.close();
        return;
    }
    try {
        const decode = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        ws.username = decode.username;
        ws.userID = decode.userID;
        console.log(`User ${decode.username} connected via WebSocket`);
        gameManager.addUser(ws);
    }
    catch (error) {
        console.error("Websocket token verification failed : ", error);
        ws.close();
    }
    ws.on("close", () => gameManager.removeUser(ws));
});
app.get("/api/Dashboard", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("OUTSIDE TRY");
    const gameType = req.query.gameType;
    try {
        if (gameType === messages_1.STANDARD) {
            console.log("INSIDE INDEX.js");
            const data = yield User_1.default.find().sort({ rating: -1 });
            console.log(data);
            res.json(data);
        }
        else if (gameType === messages_1.FISHER_CHESS) {
            console.log("INSIDE GAMETYPE FITCHER");
            const data = yield User_1.default.find().sort({ rating: -1 });
            console.log(data);
            res.json(data);
        }
        else if (gameType === messages_1.ATOMIC_CHESS) {
            console.log("INSIDE GAMETYPE FITCHER");
            const data = yield User_1.default.find().sort({ rating: -1 });
            console.log(data);
            res.json(data);
        }
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/api/profile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.query.username;
    try {
        const data = yield User_1.default.findOne({ username: username });
        console.log(data);
        res.json(data);
    }
    catch (error) {
    }
}));
app.listen(port, () => console.log(`Server is running on port ${port}`));
