/// <reference types="vite/client" />

declare const __APP_NAME__: string;
declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  /** Url of the Zou server */
  readonly VITE_ZOU_API: string;

  /** Url of the silex websocket server */
  readonly VITE_WS_SERVER: string;

  /** Url of the Tractor blade api */
  readonly VITE_TRACTOR_BLADE: string;

  /** Url of the tractor TV */
  readonly VITE_TRACTOR_URL: string;

  /** Url for Tractor logs retrieval */
  readonly VITE_TRACTOR_LOG_URL: string;

  /** Url of your ticket system */
  readonly VITE_TICKET_URL: string;

  /** Url of Harvest */
  readonly VITE_HARVEST_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
