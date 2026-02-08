// src/types.ts

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

/**
 * Hệ thống mã lỗi và thông báo tập trung
 * Được Cloud Functions trả về qua node users/{uid}/notify
 */
export const SYSTEM_MESSAGES: Record<string, { msg: string; type: "success" | "error" | "info" }> = {
  'error_01': { msg: 'Hệ thống quá tải, vui lòng thử lại sau!', type: 'error' },
  'error_02': { msg: 'Mất kết nối với trạm sạc!', type: 'error' },
  'error_03': { msg: 'Số dư không đủ để thực hiện!', type: 'error' },
  'done': { msg: 'Đã hoàn thành gói sạc!', type: 'success' },
  'full': { msg: 'Pin đã đầy, hệ thống đã ngắt sạc.', type: 'success' },
  'stop_success': { msg: 'Đã dừng sạc và hoàn tiền thừa.', type: 'success' }
};

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