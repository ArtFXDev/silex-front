/// <reference types="react-scripts" />

/**
 * Declare env variables defined in .env
 * See: https://stackoverflow.com/questions/45194598/using-process-env-in-typescript
 */
declare namespace NodeJS {
  export interface ProcessEnv {
    /** Url of the Zou server */
    REACT_APP_ZOU_API: string;

    /** Url of the GraphQL api */
    REACT_APP_ZOU_GRAPHQL_API: string;

    /** Url of the silex websocket server */
    REACT_APP_WS_SERVER: string;
  }
}

/**
 * Declare fonts as module in order to import them
 * See: https://stackoverflow.com/questions/53742766/cannot-import-local-fonts-with-typescript/54101503#54101503
 */
declare module "*.woff";
declare module "*.woff2";
