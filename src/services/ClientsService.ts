import Client from "@models/Client";

export default class ClientsService {
  /**
   * Returns client by clientId and clientSecret
   * @param clientId
   * @param clientSecret
   */
  public static getClientByIdAndSecret(clientId: string, clientSecret?: string): Promise<Client> {
    const params: {
      clientId: string;
      clientSecret?: string;
    } = {
      clientId,
    };

    if (clientSecret) {
      params.clientSecret = clientSecret;
    }

    return Client.findOne({
      where: params,
    });
  }

  /**
   * Returns client by clientId
   * @param clientId
   */
  public static async getClientById(clientId: string): Promise<Client> {
    return Client.findOne({
      where: {
        clientId,
      },
    });
  }
}
