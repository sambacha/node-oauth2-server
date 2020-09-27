import "module-alias/register";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import config from "config";
import express from "express";

import database from "@/database";
import routes from "@routes/index";
import Logger from "@util/logger";

const app = express();

app.set("view engine", "ejs");
app.set("x-powered-by", false);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.get("oauth.cookieSecret")));
app.use(routes);

app.listen(
  config.get("oauth.port"),
  async (err): Promise<void> => {
    if (err) {
      Logger.log("error", "App error", { err });
      return;
    }
    await database.sync({ force: false });
    Logger.log("info", `App is running at 0.0.0.0:${config.get("oauth.port")}`);
  },
);
