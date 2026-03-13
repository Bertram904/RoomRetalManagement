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
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
    
    // Giả lập một chút độ trễ để hiển thị loading UI (bạn có thể bỏ setTimeout nếu hàm đã là async)
    setTimeout(() => {
      const result = createRoom(formRef.current);
      setSaving(false);

      if (!result.isValid) {
        setErrors(result.errors);
        return;
      }

      setErrors({});
      Alert.alert('Thành công!', 'Phòng đã được thêm vào danh sách.', [
        { text: 'Hoàn tất', onPress: () => router.back() },
      ]);
    }, 400); 
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.formContainer}>
        <RoomFormFields
          errors={errors}
          onChange={(values) => {
            formRef.current = values;
          }}
        />
      </View>

      {/* Floating Footer Area */}
      <View style={styles.footerWrapper}>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
            disabled={saving}
          >
            <Ionicons name="close-circle-outline" size={22} color="#475569" />
            <Text style={styles.cancelText}>Hủy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="checkmark-circle" size={22} color="#fff" />
            )}
            <Text style={styles.saveText}>
              {saving ? 'Đang lưu...' : 'Lưu phòng'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' // Nền màu Slate 50: sáng, sạch và hiện đại hơn
  },
  formContainer: {
    flex: 1,
  },
  footerWrapper: {
    backgroundColor: '#F8FAFC',
    // Căn chỉnh vùng an toàn (Safe Area) cho các dòng điện thoại tai thỏ/home indicator
    paddingBottom: Platform.OS === 'ios' ? 32 : 16, 
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 24, // Bo góc lớn tạo cảm giác mượt mà
    // Đổ bóng mềm mại, không bị gắt
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8, 
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#F1F5F9', // Dùng nền xám nhạt thay vì viền cứng
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#2563EB', // Blue 600 - sắc xanh chuẩn app chuyên nghiệp
    // Nút chính cũng nên có bóng mờ cùng tone màu
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  saveBtnDisabled: { 
    opacity: 0.7,
    shadowOpacity: 0.1,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});