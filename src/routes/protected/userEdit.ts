import { Router } from "express";
import { check } from "express-validator";
import _ from "lodash";

import UserService from "@services/UserService";

import csrf from "@util/csrf";

import { RequestOverride } from "ExpressOverride";

const router = Router();

router.get("/dashboard/user/edit/:userId", csrf, async (req: RequestOverride, res) => {
  try {
    const userData = await UserService.getUserById(parseInt(req.params.userId, 10));

    if (req.user.privilege === Privilege.Foreman && userData.privilege === Privilege.Admin) {
      throw new Error("Nie możesz edytować tego użytkownika!");
    }

    return res.render("userEdit", { csrf: req.csrfToken(), user: req.user, userData });
  } catch (err) {
    return res.render("error", { user: req.user, error: err });
  }
});

router.post(
  "/dashboard/user/edit",
  csrf,
  [
    check("id").notEmpty(),
    check("username").notEmpty(),
    check("email")
      .notEmpty()
      .isEmail(),
  ],
  async (req: RequestOverride, res) => {
    const allowedUpdatesList = ["email", "username", "password"];

    if (req.user.privilege === Privilege.Admin) {
      allowedUpdatesList.push("beginningYear", "fieldOfStudy", "privilege");
    }
    const allowedUpdates = _.pick(req.body, allowedUpdatesList);

    try {
      const user = await UserService.getUserById(req.body.id);

      if (
        req.user.privilege === Privilege.Foreman &&
        user &&
        (user.beginningYear !== req.user.beginningYear ||
          user.fieldOfStudy !== req.user.fieldOfStudy ||
          user.privilege === Privilege.Admin)
      ) {
        throw new Error("Nie możesz edytować tego użytkownika.");
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const result = await UserService.updateUser(req.body.id, allowedUpdates);

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
