import { Response, NextFunction } from "express";
import passport from "passport";
import LocalStrategy from "passport-local";

import User from "@models/User";

import UserService from "@services/UserService";

import { RequestOverride } from "ExpressOverride";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const localStrategyVerifyCallback = async (login: string, password: string, done: any): Promise<void> => {
  const user = await UserService.getUserByLoginAndPassword(login, password);

  if (!user) {
    return done(null, false);
  }

  return done(null, user.toJSON());
};

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const localStrategy = new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password",
  },
  localStrategyVerifyCallback,
);

passport.serializeUser((user: User, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  const user = await UserService.getUserById(id);

  if (!user) {
    return done("No such user");
  }

  return done(null, user.toJSON());
});

const isAuthenticated = (req: RequestOverride, res: Response, next: NextFunction): void => {
  if (req.isAuthenticated() && req.user) {
    return next();
  }

  return res.redirect("/");
};

const isAuthenticatedAsForeman = (req: RequestOverride, res: Response, next: NextFunction): void => {
  if (
    req.isAuthenticated() &&
    req.user &&
    (req.user.privilege === Privilege.Foreman || req.user.privilege === Privilege.Admin)
  ) {
    return next();
  }

  return res.redirect("/dashboard");
};

const isAuthenticatedAsAdmin = (req: RequestOverride, res: Response, next: NextFunction): void => {
  if (req.isAuthenticated() && req.user && req.user.privilege === Privilege.Admin) {
    return next();
  }

  return res.redirect("/dashboard");
};

export { localStrategy, isAuthenticated, isAuthenticatedAsForeman, isAuthenticatedAsAdmin };
