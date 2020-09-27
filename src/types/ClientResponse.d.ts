export default interface ClientResponse {
  id: number;
  clientId: string;
  clientSecret: string;
  grants: string[];
  redirectUris: string[];
}
