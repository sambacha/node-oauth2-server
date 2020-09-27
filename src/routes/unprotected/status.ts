import { Router } from "express";

const router = Router();

router.get("/status", (req, res) => {
  res.status(200).send("OK");
});

export default router;
