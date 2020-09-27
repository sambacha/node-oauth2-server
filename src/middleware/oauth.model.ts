import User from "@models/User";

import AccessTokenService from "@services/AccessTokenService";
import AuthorizationCodeService from "@services/AuthorizationCodeService";
import ClientsService from "@services/ClientsService";
import UserService from "@services/UserService";

import AccessToken from "AccessToken";
import AuthorizationCode from "AuthorizationCode";
import ClientResponse from "ClientResponse";
import RefreshToken from "RefreshToken";

const model = {
  getAccessToken: async function(accessToken: string): Promise<AccessToken> {
    try {
      const token = await AccessTokenService.getTokenByAccessToken(accessToken);

      if (!token) {
        return null;
      }

      return {
        accessToken: token.accessToken,
        client: token.client.toJSON(),
        accessTokenExpiresAt: token.accessTokenExpirationDate,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpirationDate,
        scope: token.scope,
        user: token.user.toJSON(),
      };
    } catch (err) {
      return null;
    }
  },

  getAuthorizationCode: async function(authorizationCode: string): Promise<AuthorizationCode> {
    try {
      const authorizationCodeModel = await AuthorizationCodeService.getCode(authorizationCode);

      if (!authorizationCodeModel) {
        return null;
      }

      return {
        authorizationCode: authorizationCodeModel.authorizationCode,
        expiresAt: authorizationCodeModel.authorizationCodeExpirationDate,
        scope: authorizationCodeModel.scope,
        client: authorizationCodeModel.client.toJSON(),
        user: authorizationCodeModel.user.toJSON(),
      };
    } catch (err) {
      return null;
    }
  },

  getRefreshToken: async function(bearerToken: string): Promise<RefreshToken> {
    try {
      const refreshToken = await AccessTokenService.getRefreshToken(bearerToken);

      if (!refreshToken) {
        return null;
      }

      return {
        refreshToken: refreshToken.accessToken,
        client: refreshToken.client.toJSON(),
        expires: refreshToken.accessTokenExpirationDate,
        user: refreshToken.user.toJSON(),
      };
    } catch (err) {
      return null;
    }
  },

  getClient: async function(clientId: string, clientSecret?: string): Promise<ClientResponse> {
    try {
      const client = await ClientsService.getClientByIdAndSecret(clientId, clientSecret);

      if (!client) {
        return null;
      }

      return {
        id: client.id,
        clientId: client.clientId,
        clientSecret: client.clientSecret,
        grants: client.grants.split(","),
        redirectUris: client.redirectUris.split(","),
      };
    } catch (err) {
      return null;
    }
  },

  getUser: async function(login: string, password: string): Promise<User> {
    return await UserService.getUserByLoginAndPassword(login, password);
  },

  saveToken: async function(token, client, user): Promise<AccessToken> {
    return await AccessTokenService.saveToken(token, client, user);
  },

  revokeToken: async function(token): Promise<number> {
    return await AccessTokenService.deleteToken(token);
  },

  saveAuthorizationCode: async function(code, client, user): Promise<AuthorizationCode> {
    return await AuthorizationCodeService.saveCode(code, client, user);
  },

  revokeAuthorizationCode: async function(code): Promise<number> {
    return await AuthorizationCodeService.deleteCode(code);
  },
};

export default model;
