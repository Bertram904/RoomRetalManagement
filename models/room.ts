/**
 * MODEL – Room
 * Định nghĩa kiểu dữ liệu phòng trọ (MVC – Model)
 */

export type RoomStatus = 'AVAILABLE' | 'RENTED';

export interface Room {
  id: string;
  code: string;        // Mã phòng
  name: string;        // Tên phòng
  price: number;       // Giá thuê (VND/tháng)
  status: RoomStatus;  // Tình trạng
  tenantName: string;  // Tên người thuê
  phone: string;       // Số điện thoại người thuê
  area: string;        // Diện tích (m²)
  description: string; // Ghi chú thêm
}

export interface RoomInput {
  code: string;
  name: string;
  price: string;
  status: RoomStatus;
  tenantName: string;
  phone: string;
  area: string;
  description: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof RoomInput, string>>;
}

export const defaultRoomInput: RoomInput = {
  code: '',
  name: '',
  price: '',
  status: 'AVAILABLE',
  tenantName: '',
  phone: '',
  area: '',
  description: '',
};

export const STATUS_LABEL: Record<RoomStatus, string> = {
  AVAILABLE: 'Còn trống',
  RENTED: 'Đã thuê',
};

export const STATUS_COLOR: Record<RoomStatus, string> = {
  AVAILABLE: '#2E7D32',
  RENTED: '#C62828',
};

export const STATUS_BG: Record<RoomStatus, string> = {
  AVAILABLE: '#E8F5E9',
  RENTED: '#FFEBEE',
};

export const STATUS_BORDER: Record<RoomStatus, string> = {
  AVAILABLE: '#A5D6A7',
  RENTED: '#EF9A9A',
};
