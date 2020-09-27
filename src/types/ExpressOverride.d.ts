import { Request } from "express";

import User from "@models/User";

export interface RequestOverride extends Request {
  csrfToken?: () => string;
  user: User;
}
