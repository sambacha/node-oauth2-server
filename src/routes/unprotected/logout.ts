import { Router } from "express";

const router = Router();

router.get("/logout", (req, res) => {
  req.logOut();
  return res.redirect("/");
});

export default router;
