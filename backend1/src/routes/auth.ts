import express, { Router } from "express";
import { registerUser, loginUser } from "../Controller/authController";

const route = express.Router();

route.post("/register", registerUser);
route.post("/login", loginUser);

export default route;
