import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import React, { useState } from "react";

export interface GraphQLClientContext {
  client: ApolloClient<NormalizedCacheObject>;
}

export const graphqlClientContext = React.createContext<GraphQLClientContext>(
  {} as GraphQLClientContext
);

interface ProvideGraphQLClientProps {
  children: JSX.Element;
}

/**
 * Wrapper over the Apollo client provider
 */
export const ProvideGraphQLClient = ({
  children,
}: ProvideGraphQLClientProps): JSX.Element => {
  const [client] = useState(
    new ApolloClient({
      uri: import.meta.env.VITE_ZOU_API + "/api/graphql",
      cache: new InMemoryCache(),
    })
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
