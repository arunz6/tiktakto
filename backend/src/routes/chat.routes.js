import { Router } from "express";
import { sendMessage, getMessages } from "../controller/chat.controller.js";

const router = Router();

router.post("/send", sendMessage);

router.get("/all", getMessages);

export default router;
