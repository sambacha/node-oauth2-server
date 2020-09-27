import { AuthorizationCode, Client, Model, User } from '../interfaces';
import { Request } from '../request';
export declare class CodeResponseType {
    code: any;
    authorizationCodeLifetime: number;
    model: Model;
    constructor(options?: any);
    handle(request: Request, client: Client, user: User, uri: string, scope: string): Promise<AuthorizationCode>;
    getAuthorizationCodeExpiresAt(client: Client): Date;
    getAuthorizationCodeLifetime(client: Client): any;
    saveAuthorizationCode(authorizationCode: string, expiresAt: Date, scope: string, client: Client, redirectUri: any, user: User): Promise<AuthorizationCode>;
    generateAuthorizationCode(client: Client, user: User, scope: string): Promise<string>;
    buildRedirectUri(redirectUri: any): any;
    setRedirectUriParam(redirectUri: any, key: string, value: string): any;
}
