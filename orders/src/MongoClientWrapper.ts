import { MongoClient, Db } from "mongodb";

class MongoClientWrapper {
  private _client?: MongoClient;
  private _database?: Db;

  get client(): MongoClient {
    if (!this._client) {
      throw new Error("Cannot access client before connecting");
    }

    return this._client;
  }

  get database(): Db {
    if (!this._database) {
      throw new Error("Cannot access db before client");
    }

    return this._database;
  }

  async connect(dbName: string, url: string): Promise<Db> {
    this._client = await MongoClient.connect(url, { useUnifiedTopology: true });
    this._database = this.client.db(dbName);

    return this.database;
  }
}

export const ordersMongoClientWrapper = new MongoClientWrapper(),
  ticketsMongoClientWrapper = new MongoClientWrapper();
