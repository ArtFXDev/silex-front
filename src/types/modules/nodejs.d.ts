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

    /** Url of the tractor TV */
    REACT_APP_TRACTOR_URL: string;

    /** Url for Tractor logs retrieval */
    REACT_APP_TRACTOR_LOG_URL: string;

    /** Url of your ticket system */
    REACT_APP_TICKET_URL: string;

    /** Url of Harvest */
    REACT_APP_HARVEST_URL: string;
  }
}
