import { ApolloClient, InMemoryCache } from "@apollo/client";

const graphqlUri =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4002/graphql";

export const apolloClient = new ApolloClient({
  uri: graphqlUri,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-and-network" },
    query: { fetchPolicy: "network-only" },
  },
});
