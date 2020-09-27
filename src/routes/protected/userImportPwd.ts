import { Router } from "express";
import { check } from "express-validator";
import { readFile, unlink } from "fs";
import multer from "multer";
import { promisify } from "util";

import UserService from "@services/UserService";

import csrf from "@util/csrf";

import { RequestOverride } from "ExpressOverride";

const router = Router();
const upload = multer({ dest: "uploads/" });

const readFileAsync = promisify(readFile);
const unlinkAsync = promisify(unlink);

router.get("/dashboard/user/importpwd", csrf, (req: RequestOverride, res) => {
  return res.render("userImportPwd", { csrf: req.csrfToken(), user: req.user });
});

router.post(
  "/dashboard/user/importpwd",
  upload.single("pwd"),
  csrf,
  [
    check("beginningYear")
      .notEmpty()
      .isNumeric(),
    check("fieldOfStudy").notEmpty(),
  ],
  async (req: RequestOverride, res) => {
    try {
      const fileContents = await readFileAsync(req.file.path);

      const users = fileContents
        .toString()
        .split("\n")
        .map(line => {
          const splitted = line.split(" ");
          return splitted[1];
        })
        .filter(user => user);

      const result = await UserService.importUsersFromArray(
        users,
        parseInt(req.body.beginningYear, 10),
        req.body.fieldOfStudy,
      );

      if (!result) {
        throw new Error("Nie udało się zaimportować danych - administratorzy zostali poinformowani o błędzie.");
      }

      await unlinkAsync(req.file.path);

      return res.render("changesApplied", { user: req.user });
    } catch (err) {
      return res.render("error", { user: req.user, error: err });
    }
  },
);

export default router;
