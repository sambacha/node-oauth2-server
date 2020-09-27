import config from "config";
import connectRedis from "connect-redis";
import { Router } from "express";
import expressSession from "express-session";
import passport from "passport";

import redisClient from "@/redis";

import { localStrategy } from "@middleware/auth";

import oauthRoutes from "@routes/oauth/index";
import protectedRoutes from "@routes/protected/index";
import unprotectedRoutes from "@routes/unprotected/index";

const router = Router();
const RedisStore = connectRedis(expressSession);

router.use("/oauth", oauthRoutes);

router.use(
  expressSession({
    secret: config.get("oauth.cookieSecret"),
    store: new RedisStore({
      client: redisClient,
    }),
    resave: false,
    saveUninitialized: false,
  }),
);
router.use(passport.initialize());
router.use(passport.session());
passport.use(localStrategy);
router.use(unprotectedRoutes, protectedRoutes);

export default router;
