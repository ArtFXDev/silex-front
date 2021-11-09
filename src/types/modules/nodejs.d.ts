/**
 * Declare env variables defined in .env
 * See: https://stackoverflow.com/questions/45194598/using-process-env-in-typescript
 */
declare namespace NodeJS {
  export interface ProcessEnv {
    /** Url of the Zou server */
    REACT_APP_ZOU_API: string;

    /** Url of the silex websocket server */
    REACT_APP_WS_SERVER: string;

    /** Url of the Tractor blade api */
    REACT_APP_TRACTOR_BLADE: string;
  }
}
