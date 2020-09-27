import { Router } from "express";

import oauth2Server from "@middleware/oauth";

const router = Router();

router.get("/profile", oauth2Server.authenticate(), (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = res.locals.oauth.token.user;
  return res.json(rest);
});

export default router;
