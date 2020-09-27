import { Router } from "express";
import { body } from "express-validator";
import _ from "lodash";

import UserService from "@services/UserService";

import csrf from "@util/csrf";

import { RequestOverride } from "ExpressOverride";

const router = Router();

router.get("/dashboard/user/change", csrf, (req: RequestOverride, res) => {
  return res.render("userChange", { csrf: req.csrfToken(), user: req.user });
});

router.post(
  "/dashboard/user/change",
  csrf,
  [
    body("email")
      .customSanitizer((value, { req }) => {
        if (value.length === 0) {
          return req.user.email;
        }
        return value;
      })
      .isEmail()
      .normalizeEmail(),
    body("username").customSanitizer((value, { req }) => {
      if (value.length === 0) {
        return req.user.username;
      }
      return value;
    }),
  ],
  async (req: RequestOverride, res) => {
    const allowedUpdates = _.pick(req.body, ["email", "username", "password"]);

    try {
      const result = await UserService.updateUser(req.user.id, allowedUpdates);

      if (!result) {
        throw new Error("Nie udało się zapisać danych - administratorzy zostali poinformowani o błędzie.");
      }

      return res.render("changesApplied", { user: req.user });
    } catch (err) {
      return res.render("error", { user: req.user, error: err });
    }
  },
);

export default router;
