import config from "config";
import OAuth2Server from "express-oauth-server";

import OauthModel from "@middleware/oauth.model";

const oauth = new OAuth2Server({
  model: OauthModel,
  debug: config.get("oauth.debug"),
  allowBearerTokensInQueryString: true,
});

export default oauth;
