import { Client, User } from '.';
export interface AuthorizationCode {
    authorizationCode: string;
    expiresAt: Date;
    redirectUri: string;
    scope?: string;
    client: Client;
    user: User;
    [key: string]: any;
}
