import { Router } from "express";
import { check } from "express-validator";

import UserService from "@services/UserService";

import csrf from "@util/csrf";

import { RequestOverride } from "ExpressOverride";

const router = Router();

router.get("/dashboard/user/import", csrf, (req: RequestOverride, res) => {
  return res.render("userImport", { csrf: req.csrfToken(), user: req.user });
});

router.post(
  "/dashboard/user/import",
  csrf,
  [
    check("beginningYear")
      .notEmpty()
      .isNumeric(),
    check("taurusLogin").notEmpty(),
    check("taurusPassword").notEmpty(),
  ],
  async (req: RequestOverride, res) => {
    try {
      const result = await UserService.importUsers(
        parseInt(req.body.beginningYear, 10),
        req.body.taurusLogin,
        req.body.taurusPassword,
      );

      if (!result) {
        throw new Error("Nie udało się zaimportować danych - administratorzy zostali poinformowani o błędzie.");
      }

      return res.render("changesApplied", { user: req.user });
    } catch (err) {
      return res.render("error", { user: req.user, error: err });
    }
  },
);

export default router;
