import express, { Router } from "express";
import { Update } from "../Controller/WinOrLoseUpdate";

const route = express.Router();

route.post("/winlose" , Update)

export default route ;