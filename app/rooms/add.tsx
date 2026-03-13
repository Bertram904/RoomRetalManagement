/**
 * VIEW – Add Room Screen
 * Màn hình thêm phòng mới (CREATE)
 */

import { RoomFormFields } from '@/components/room/RoomFormFields';
import { createRoom } from '@/controllers/room-controller';
import { defaultRoomInput, RoomInput } from '@/models/room';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddRoomScreen() {
  const formRef = useRef<RoomInput>(defaultRoomInput);
  const [errors, setErrors] = useState<Partial<Record<keyof RoomInput, string>>>({});
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    const result = createRoom(formRef.current);
    setSaving(false);

    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    Alert.alert('Thành công!', 'Phòng đã được thêm vào danh sách.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  return (
    <View style={styles.container}>
      <RoomFormFields
        errors={errors}
        onChange={(values) => {
          formRef.current = values;
        }}
      />

      {/* Save button */}
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
          <Ionicons name="checkmark-outline" size={20} color="#fff" />
          <Text style={styles.saveText}>Lưu phòng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FB' },
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
