import { Router } from "express";

import authorizeRoutes from "@routes/oauth/authorize";
import tokenRoutes from "@routes/oauth/token";
import profileRoutes from "@routes/oauth/profile";

const router = Router();

router.use(tokenRoutes);
router.use(authorizeRoutes);
router.use(profileRoutes);

export default router;
