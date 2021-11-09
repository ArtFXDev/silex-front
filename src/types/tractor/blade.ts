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
  pids: number[];

  // Added by silex-desktop
  nimbyAutoMode: boolean;
}
