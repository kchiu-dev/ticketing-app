import { ApolloClient, InMemoryCache } from "@apollo/client";

class ApolloClientWrapper {
  private _client?: ApolloClient<any>;

  get client(): ApolloClient<any> {
    if (!this._client) {
      throw new Error("Cannot access client before connecting");
    }

    return this._client;
  }

  connect(uri: string) {
    this._client = new ApolloClient({
      uri,
      cache: new InMemoryCache(),
    });

    return this.client;
  }
}

export const apolloClientWrapper = new ApolloClientWrapper();
