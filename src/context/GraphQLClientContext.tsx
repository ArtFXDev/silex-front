import React, { useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  NormalizedCacheObject,
} from "@apollo/client";

export interface GraphQLClientContext {
  client: ApolloClient<NormalizedCacheObject>;
}

export const graphqlClientContext = React.createContext<GraphQLClientContext>(
  {} as GraphQLClientContext
);

export const ProvideGraphQLClient: React.FC = ({ children }) => {
  const [client] = useState(
    new ApolloClient({
      uri: process.env.REACT_APP_ZOU_GRAPHQL_API,
      cache: new InMemoryCache(),
    })
  );

  console.log("rerender here");

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
