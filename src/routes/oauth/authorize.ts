import { Request, Router } from "express";
import { check } from "express-validator";

import User from "@models/User";

import oauth2Server from "@middleware/oauth";
import UserService from "@services/UserService";
import Logger from "@util/logger";

const router = Router();

router.get("/authorize", (req, res) => {
  return res.render("authorize", {
    action: "/oauth/authorize",
    csrf: req.query.state || "notReallyGoodCSRD",
    redirect: req.query.redirect,
    clientId: req.query.client_id,
    redirectUri: req.query.redirect_uri,
    responseType: "code",
    isOauth: true,
    wrongCreds: false,
  });
});

router.post(
  "/authorize",
  [check("username").notEmpty(), check("password").notEmpty()],
  async (req, res, next) => {
    try {
      const user = await UserService.getUserByLoginAndPassword(req.body.username, req.body.password);

      if (!user) {
        return res.render("authorize", {
          action: "/oauth/authorize",
          csrf: req.body.state,
          redirect: req.body.redirect,
          clientId: req.body.client_id,
          redirectUri: req.body.redirect_uri,
          responseType: "code",
          isOauth: true,
          wrongCreds: true,
        });
      }

      req.body.user = user.toJSON();
      return next();
    } catch (err) {
      Logger.log("error", "Error while POST /oauth/authorize", { err });
      return res.status(500).send();
    }
  },
  oauth2Server.authorize({
    authenticateHandler: {
      handle: (req: Request): User => {
        return req.body.user;
      },
    },
  }),
);

export default router;
