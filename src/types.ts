
export enum StationStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  CHARGING = 'charging',
  ERROR = 'error'
}

export interface ChargingStation {
  id: string;
  name: string;
  location: string;
  status: StationStatus;
  voltage: number;
  current: number;
  power: number;
  energyUsed: number;
  relayStatus: boolean;
  lastSeen: number;
  distance: string;
  progress?: number;
  timeRemaining?: string;
}

export interface ChargingPackage {
  id: string;
  name: string;
  price: number;
  value: string;
  type: 'time' | 'kwh' | 'amount';
}

export interface Transaction {
  id: string;
  type: 'charge' | 'deposit';
  amount: number;
  description: string;
  timestamp: number;
  status: 'success' | 'pending';
}

export type TabType = 'home' | 'deposit' | 'history' | 'profile';
export {}

declare global {
  interface Window {
    APP_CONFIG?: {
      appId?: string
      version?: string
      env?: 'dev' | 'prod'
      [key: string]: any
    }
  }
}
