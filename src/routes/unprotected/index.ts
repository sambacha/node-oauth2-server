import { Router } from "express";

import loginRoutes from "@routes/unprotected/login";
import logoutRoutes from "@routes/unprotected/logout";
import statusRoutes from "@routes/unprotected/status";

const router = Router();

router.use(loginRoutes);
router.use(logoutRoutes);
router.use(statusRoutes);

export default router;
