import Client from "@models/Client";
import User from "@models/User";

export default interface RefreshToken {
  refreshToken: string;
  client: Partial<Client>;
  expires: Date;
  user: Partial<User>;
}
