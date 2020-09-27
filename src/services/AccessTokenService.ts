import AccessTokenModel from "@models/AccessToken";
import Client from "@models/Client";
import User from "@models/User";

import Logger from "@util/logger";

import AccessToken from "AccessToken";
import ClientResponse from "ClientResponse";

export default class AccessTokenService {
  /**
   * Removes token from the database
   * @param refreshToken
   */
  public static async deleteToken(refreshToken: string): Promise<number> {
    return AccessTokenModel.destroy({
      where: {
        refreshToken,
      },
    });
  }

  /**
   * Gets whole token object by refreshToken
   * @param refreshToken
   */
  public static async getRefreshToken(refreshToken: string): Promise<AccessTokenModel> {
    return AccessTokenModel.findOne({
      where: {
        refreshToken,
      },
      include: [
        {
          model: Client,
        },
        {
          model: User,
        },
      ],
    });
  }

  /**
   * Gets whole token object by accessToken
   * @param accessToken
   */
  public static async getTokenByAccessToken(accessToken: string): Promise<AccessTokenModel> {
    return AccessTokenModel.findOne({
      where: {
        accessToken,
      },
      include: [
        {
          model: Client,
        },
        {
          model: User,
        },
      ],
    });
  }

  /**
   * Saves new token to the database
   * @param token
   * @param client
   * @param user
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static async saveToken(token: any, client: ClientResponse, user: User): Promise<AccessToken> {
    try {
      const tokenModel = AccessTokenModel.build({
        accessToken: token.accessToken,
        accessTokenExpirationDate: token.accessTokenExpiresAt,
        clientId: client.id,
        refreshToken: token.refreshToken,
        refreshTokenExpirationDate: token.refreshTokenExpiresAt,
        scope: token.scope,
        userId: user.id,
      });

      await tokenModel.save();
      await tokenModel.reload({
        include: [
          {
            model: Client,
          },
          {
            model: User,
          },
        ],
      });

      return {
        accessToken: tokenModel.accessToken,
        client: tokenModel.client.toJSON(),
        accessTokenExpiresAt: tokenModel.accessTokenExpirationDate,
        refreshToken: tokenModel.refreshToken,
        refreshTokenExpiresAt: tokenModel.refreshTokenExpirationDate,
        scope: tokenModel.scope,
        user: tokenModel.user.toJSON(),
      };
    } catch (err) {
      Logger.log("error", "TokenService saveToken error", { err });
      return null;
    }
  }
}
