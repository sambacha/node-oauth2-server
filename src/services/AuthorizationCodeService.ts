import AuthorizationCodeModel from "@models/AuthorizationCode";
import User from "@models/User";

import Logger from "@util/logger";

import AuthorizationCode from "AuthorizationCode";
import ClientResponse from "ClientResponse";
import Client from "@models/Client";

export default class AuthorizationTokenService {
  /**
   * Removes authorization code from the database
   * @param authorizationCode
   */
  public static async deleteCode(authorizationCode): Promise<number> {
    return AuthorizationCodeModel.destroy({
      where: {
        authorizationCode: authorizationCode.authorizationCode,
      },
    });
  }

  /**
   * Returns authorization code from the database
   * @param authorizationCode
   */
  public static async getCode(authorizationCode: string): Promise<AuthorizationCodeModel> {
    return AuthorizationCodeModel.findOne({
      where: {
        authorizationCode,
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
   * Saves authorization code into the database
   * @param code
   * @param client
   * @param user
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static async saveCode(code: any, client: ClientResponse, user: User): Promise<AuthorizationCode> {
    try {
      const codeModel = AuthorizationCodeModel.build({
        authorizationCode: code.authorizationCode,
        authorizationCodeExpirationDate: code.expiresAt,
        scope: code.scope,
        clientId: client.id,
        userId: user.id,
      });

      await codeModel.save();
      await codeModel.reload({
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
        authorizationCode: codeModel.authorizationCode,
        client: codeModel.client.toJSON(),
        expiresAt: codeModel.authorizationCodeExpirationDate,
        scope: codeModel.scope,
        user: codeModel.user.toJSON(),
      };
    } catch (err) {
      Logger.log("error", "AuthorizationCodeService saveCode error", { err });
      return null;
    }
  }
}
