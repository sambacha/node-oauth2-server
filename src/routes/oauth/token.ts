import { Router } from "express";
import oauth2Server from "@middleware/oauth";

const router = Router();

router.post("/token", oauth2Server.token());

export default router;
