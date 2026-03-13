/**
 * VIEW – Edit Room Screen
 * Màn hình sửa thông tin phòng (UPDATE)
 */

import { RoomFormFields } from '@/components/room/RoomFormFields';
import { getRoomById, updateRoom } from '@/controllers/room-controller';
import { RoomInput } from '@/models/room';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EditRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const room = getRoomById(id);

  const [errors, setErrors] = useState<Partial<Record<keyof RoomInput, string>>>({});
  const [saving, setSaving] = useState(false);

  // Pre-fill form với dữ liệu từ room hiện tại
  const initialValues: Partial<RoomInput> | undefined = room
    ? {
        code: room.code,
        name: room.name,
        price: room.price.toString(),
        status: room.status,
        tenantName: room.tenantName,
        phone: room.phone,
        area: room.area,
        description: room.description,
      }
    : undefined;

  const formRef = useRef<RoomInput | null>(null);

  if (!room) {
    return (
      <View style={styles.notFound}>
        <Ionicons name="alert-circle-outline" size={56} color="#94A3B8" />
        <Text style={styles.notFoundText}>Không tìm thấy phòng.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function handleSave() {
    if (!formRef.current) return;
    setSaving(true);
    const result = updateRoom(id, formRef.current);
    setSaving(false);

    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    Alert.alert('Cập nhật thành công!', 'Thông tin phòng đã được lưu lại.', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <RoomFormFields
        initialValues={initialValues}
        errors={errors}
        onChange={(values) => {
          formRef.current = values;
        }}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="close-outline" size={20} color="#64748B" />
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.saveText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FB' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontSize: 16, color: '#94A3B8' },
  backLink: { fontSize: 15, color: '#1D4ED8', fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#1D4ED8',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
