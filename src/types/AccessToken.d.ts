import Client from "@models/Client";
import User from "@models/User";

export default interface AccessToken {
  accessToken: string;
  client: Partial<Client>;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  scope: string;
  user: Partial<User>;
}
