import Client from "@models/Client";
import User from "@models/User";

export default interface AuthorizationCode {
  authorizationCode: string;
  client: Partial<Client>;
  expiresAt: Date;
  user: Partial<User>;
  scope: string;
}
