import dgraph, { DgraphClientStub, DgraphClient } from "dgraph-js-http";

class DgraphClientWrapper {
  private _clientStub?: DgraphClientStub;
  private _client?: DgraphClient;

  get clientStub(): DgraphClientStub {
    if (!this._clientStub) {
      throw new Error("Cannot access clientStub before connecting");
    }

    return this._clientStub;
  }

  get client(): DgraphClient {
    if (!this._client) {
      throw new Error("Cannot access client before client stub");
    }

    return this._client;
  }

  connect(url: string) {
    this._clientStub = new DgraphClientStub(url);
    this._client = new DgraphClient(this.clientStub);

    return this.client;
  }

  async setSchema(schema: string): Promise<dgraph.Payload> {
    return await this.client.alter({ schema });
  }
}

export const dgraphClientWrapper = new DgraphClientWrapper();
