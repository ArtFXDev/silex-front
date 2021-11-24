export interface RunningJob {
  uat: string;
  login: string;
  pid: number;
  jid: number;
  tid: number;
  cid: number;
  rev: number;
  slots: number;
  flags: number;
  spoolhost: string;
  elapsed: number;
  secs: number;
  tuser: number;
  tsys: number;
  maxRSS: number;
  maxVSZ: number;
  maxCPU: number;
  id: string;
  logref: string;
  udir: string;
  expands: number;
  svckey: string;
  envkey: string[];
  dirmaps: string[];
  yieldchkpt: number;
  srv: string[];
  rc: number;
  exitcode: number;
  state: string;
  argv: string[];
}

export interface BladeStatus {
  status: string;
  nimby: string;
  hnm: string;
  port: number;
  uptime: number;
  now: number;
  vers: string;
  build: string;
  engine: string;
  profile: string;
  svckeys: string;
  cpuCount: 8;
  cpuLoad: 0.07;
  memFree: 18.06;
  memPhys: 32.0;
  diskFree: 24.5;
  slotsMax: 1;
  slotsInUse: 0;
  platform: string;
  pyversion: string;
  invoc: string;
  bladeUser: string;
  pids: RunningJob[];

  // Added by silex-desktop
  nimbyAutoMode: boolean;
}
