import { Router } from "express";
import { body, check } from "express-validator";
import _ from "lodash";

import UserService from "@services/UserService";

import csrf from "@util/csrf";

import { RequestOverride } from "ExpressOverride";

const router = Router();

router.get("/dashboard/user/add", csrf, (req: RequestOverride, res) => {
  return res.render("userAdd", { csrf: req.csrfToken(), user: req.user });
});

router.post(
  "/dashboard/user/add",
  csrf,
  [
    check("username").notEmpty(),
    check("email")
      .notEmpty()
      .isEmail(),
    check("password").notEmpty(),
  ],
  [
    body("beginningYear").customSanitizer((value, { req }) => {
      if (req.user.privilege === Privilege.Foreman) {
        return req.user.beginningYear;
      }
      return parseInt(value, 10);
    }),
    body("fieldOfStudy").customSanitizer((value, { req }) => {
      if (req.user.privilege === Privilege.Foreman) {
        return req.user.fieldOfStudy;
      }
      return value;
    }),
    body("privilege").customSanitizer((value, { req }) => {
      if (req.user.privilege === Privilege.Foreman) {
        return Privilege.Student;
      }
      return value;
    }),
  ],
  async (req: RequestOverride, res) => {
    const allowedInserts = _.pick(req.body, [
      "email",
      "username",
      "password",
      "beginningYear",
      "fieldOfStudy",
      "privilege",
    ]);

    try {
      const result = await UserService.addUser(allowedInserts);

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
