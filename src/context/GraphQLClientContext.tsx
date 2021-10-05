import React, { useState } from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";

export interface GraphQLClientContext {
  client: ApolloClient<NormalizedCacheObject>;
}

export const graphqlClientContext = React.createContext<GraphQLClientContext>(
  {} as GraphQLClientContext
);

interface ProvideGraphQLClientProps {
  children: JSX.Element;
}

export const ProvideGraphQLClient = ({
  children,
}: ProvideGraphQLClientProps): JSX.Element => {
  const [client] = useState(
    new ApolloClient({
      uri: process.env.REACT_APP_ZOU_GRAPHQL_API,
      cache: new InMemoryCache(),
    })
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
