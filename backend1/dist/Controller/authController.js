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
exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_KEY || "default_secret";
// Register User
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure function returns void
    try {
        const { username, email, password } = req.body;
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const newUser = new User_1.default({ username, email, password });
        yield newUser.save();
        res.status(201).json({ message: "User Registered Successfully" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.registerUser = registerUser;
// Login User
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure function returns void
    try {
        console.log("Inside login user");
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user || !(yield user.comparePassword(password))) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, username: user.username }, SECRET_KEY, { expiresIn: "7d" });
        res
            .status(200)
            .json({ token, user: { username: user.username, email: user.email } });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.loginUser = loginUser;
