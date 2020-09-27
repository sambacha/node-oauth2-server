import { Router } from "express";

const router = Router();

router.get("/dashboard", (req, res) => {
  return res.render("dashboard", { user: req.user });
});

export default router;
