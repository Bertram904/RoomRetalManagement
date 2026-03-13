/**
 * CONTROLLER – RoomController
 * Xử lý logic nghiệp vụ CRUD phòng trọ (MVC – Controller)
 * Dữ liệu lưu tạm trong mảng (in-memory List)
 */

import {
  Room,
  RoomInput,
  ValidationResult,
} from '@/models/room';

// ──────────────────────────────────────────────
// In-memory data store (List)
// ──────────────────────────────────────────────
let roomList: Room[] = [
  {
    id: '1',
    code: 'P101',
    name: 'Phòng 101',
    price: 2500000,
    status: 'AVAILABLE',
    tenantName: '',
    phone: '',
    area: '25',
    description: 'Phòng thoáng mát, có ban công',
  },
  {
    id: '2',
    code: 'P102',
    name: 'Phòng 102',
    price: 3000000,
    status: 'RENTED',
    tenantName: 'Nguyễn Văn A',
    phone: '0912345678',
    area: '30',
    description: 'Phòng rộng, full nội thất',
  },
  {
    id: '3',
    code: 'P103',
    name: 'Phòng 103',
    price: 2000000,
    status: 'AVAILABLE',
    tenantName: '',
    phone: '',
    area: '20',
    description: '',
  },
];

const PHONE_REGEX = /^(0|\+84)[0-9]{9,10}$/;

// ──────────────────────────────────────────────
// READ
// ──────────────────────────────────────────────
export function getRooms(): Room[] {
  return [...roomList];
}

export function getRoomById(id: string): Room | undefined {
  return roomList.find((r) => r.id === id);
}

// ──────────────────────────────────────────────
// VALIDATE
// ──────────────────────────────────────────────
function toPriceNumber(value: string): number {
  return Number(value.replace(/\./g, '').replace(/,/g, ''));
}

export function validateRoomInput(
  input: RoomInput,
  currentId?: string
): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  const code = input.code.trim();
  const name = input.name.trim();
  const tenant = input.tenantName.trim();
  const phone = input.phone.trim();
  const priceVal = toPriceNumber(input.price);

  if (!code) {
    errors.code = 'Mã phòng không được để trống.';
  } else if (
    roomList.some(
      (r) =>
        r.code.toLowerCase() === code.toLowerCase() && r.id !== currentId
    )
  ) {
    errors.code = 'Mã phòng đã tồn tại.';
  }

  if (!name) {
    errors.name = 'Tên phòng không được để trống.';
  }

  if (!input.price.trim()) {
    errors.price = 'Giá thuê không được để trống.';
  } else if (Number.isNaN(priceVal) || priceVal <= 0) {
    errors.price = 'Giá thuê phải là số lớn hơn 0.';
  }

  if (input.status === 'RENTED') {
    if (!tenant) {
      errors.tenantName =
        'Tên người thuê không được để trống khi phòng đã thuê.';
    }
    if (!phone) {
      errors.phone =
        'Số điện thoại không được để trống khi phòng đã thuê.';
    } else if (!PHONE_REGEX.test(phone)) {
      errors.phone = 'Số điện thoại không hợp lệ (VD: 0912345678).';
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// ──────────────────────────────────────────────
// CREATE
// ──────────────────────────────────────────────
export function createRoom(input: RoomInput): ValidationResult {
  const result = validateRoomInput(input);
  if (!result.isValid) return result;

  const newRoom: Room = {
    id: Date.now().toString(),
    code: input.code.trim(),
    name: input.name.trim(),
    price: toPriceNumber(input.price),
    status: input.status,
    tenantName: input.status === 'RENTED' ? input.tenantName.trim() : '',
    phone: input.status === 'RENTED' ? input.phone.trim() : '',
    area: input.area.trim(),
    description: input.description.trim(),
  };

  roomList = [newRoom, ...roomList];
  return result;
}

// ──────────────────────────────────────────────
// UPDATE
// ──────────────────────────────────────────────
export function updateRoom(id: string, input: RoomInput): ValidationResult {
  const result = validateRoomInput(input, id);
  if (!result.isValid) return result;

  roomList = roomList.map((r) =>
    r.id !== id
      ? r
      : {
          id,
          code: input.code.trim(),
          name: input.name.trim(),
          price: toPriceNumber(input.price),
          status: input.status,
          tenantName:
            input.status === 'RENTED' ? input.tenantName.trim() : '',
          phone: input.status === 'RENTED' ? input.phone.trim() : '',
          area: input.area.trim(),
          description: input.description.trim(),
        }
  );

  return result;
}

// ──────────────────────────────────────────────
// DELETE
// ──────────────────────────────────────────────
export function deleteRoom(id: string): void {
  roomList = roomList.filter((r) => r.id !== id);
}

// ──────────────────────────────────────────────
// STATS (dùng cho Dashboard)
// ──────────────────────────────────────────────
export function getRoomStats() {
  const total = roomList.length;
  const available = roomList.filter((r) => r.status === 'AVAILABLE').length;
  const rented = roomList.filter((r) => r.status === 'RENTED').length;
  return { total, available, rented };
}
