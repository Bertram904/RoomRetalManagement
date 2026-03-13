import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { createRoom, getRoomById, updateRoom } from '@/controllers/room-controller';
import { Colors } from '@/constants/theme';
import { defaultRoomInput, type RoomInput, type RoomStatus } from '@/models/room';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';

export default function RoomFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const initialData = useMemo<RoomInput>(() => {
    if (!id) {
      return defaultRoomInput;
    }

    const room = getRoomById(id);
    if (!room) {
      return defaultRoomInput;
    }

    return {
      code: room.code,
      name: room.name,
      price: room.price.toString(),
      status: room.status,
      tenantName: room.tenantName,
      phone: room.phone,
      area: room.area ?? '',
      description: room.description ?? '',
    };
  }, [id]);

  const [formData, setFormData] = useState<RoomInput>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof RoomInput, string>>>({});

  const updateField = <K extends keyof RoomInput>(field: K, value: RoomInput[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const changeStatus = (status: RoomStatus) => {
    if (status === 'AVAILABLE') {
      updateField('tenantName', '');
      updateField('phone', '');
    }
    updateField('status', status);
  };

  const handleSubmit = () => {
    const result = isEditMode && id ? updateRoom(id, formData) : createRoom(formData);

    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    Alert.alert('Thành công', isEditMode ? 'Cập nhật phòng thành công.' : 'Thêm phòng thành công.', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: isEditMode ? 'Sửa phòng' : 'Thêm phòng' }} />
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.fieldWrap}>
            <ThemedText>Mã phòng</ThemedText>
            <TextInput
              value={formData.code}
              onChangeText={(text) => updateField('code', text)}
              placeholder="Nhập mã phòng"
              style={[styles.input, { borderColor: theme.icon, color: theme.text }]}
              placeholderTextColor={theme.icon}
            />
            {errors.code ? <ThemedText style={styles.errorText}>{errors.code}</ThemedText> : null}
          </View>

          <View style={styles.fieldWrap}>
            <ThemedText>Tên phòng</ThemedText>
            <TextInput
              value={formData.name}
              onChangeText={(text) => updateField('name', text)}
              placeholder="Nhập tên phòng"
              style={[styles.input, { borderColor: theme.icon, color: theme.text }]}
              placeholderTextColor={theme.icon}
            />
            {errors.name ? <ThemedText style={styles.errorText}>{errors.name}</ThemedText> : null}
          </View>

          <View style={styles.fieldWrap}>
            <ThemedText>Giá thuê</ThemedText>
            <TextInput
              value={formData.price}
              onChangeText={(text) => updateField('price', text)}
              placeholder="Nhập giá thuê"
              keyboardType="numeric"
              style={[styles.input, { borderColor: theme.icon, color: theme.text }]}
              placeholderTextColor={theme.icon}
            />
            {errors.price ? <ThemedText style={styles.errorText}>{errors.price}</ThemedText> : null}
          </View>

          <View style={styles.fieldWrap}>
            <ThemedText>Tình trạng</ThemedText>
            <View style={styles.statusWrap}>
              <Pressable
                style={[
                  styles.statusButton,
                  {
                    borderColor: theme.icon,
                    backgroundColor:
                      formData.status === 'AVAILABLE' ? theme.tint : 'transparent',
                  },
                ]}
                onPress={() => changeStatus('AVAILABLE')}>
                <ThemedText style={formData.status === 'AVAILABLE' ? styles.selectedText : undefined}>
                  Còn trống
                </ThemedText>
              </Pressable>

              <Pressable
                style={[
                  styles.statusButton,
                  {
                    borderColor: theme.icon,
                    backgroundColor: formData.status === 'RENTED' ? theme.tint : 'transparent',
                  },
                ]}
                onPress={() => changeStatus('RENTED')}>
                <ThemedText style={formData.status === 'RENTED' ? styles.selectedText : undefined}>
                  Đã thuê
                </ThemedText>
              </Pressable>
            </View>
          </View>

          {formData.status === 'RENTED' && (
            <>
              <View style={styles.fieldWrap}>
                <ThemedText>Tên người thuê</ThemedText>
                <TextInput
                  value={formData.tenantName}
                  onChangeText={(text) => updateField('tenantName', text)}
                  placeholder="Nhập tên người thuê"
                  style={[styles.input, { borderColor: theme.icon, color: theme.text }]}
                  placeholderTextColor={theme.icon}
                />
                {errors.tenantName ? (
                  <ThemedText style={styles.errorText}>{errors.tenantName}</ThemedText>
                ) : null}
              </View>

              <View style={styles.fieldWrap}>
                <ThemedText>Số điện thoại</ThemedText>
                <TextInput
                  value={formData.phone}
                  onChangeText={(text) => updateField('phone', text)}
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                  style={[styles.input, { borderColor: theme.icon, color: theme.text }]}
                  placeholderTextColor={theme.icon}
                />
                {errors.phone ? <ThemedText style={styles.errorText}>{errors.phone}</ThemedText> : null}
              </View>
            </>
          )}

          <Pressable style={[styles.submitButton, { backgroundColor: theme.tint }]} onPress={handleSubmit}>
            <ThemedText style={styles.submitButtonText}>
              {isEditMode ? 'Lưu thay đổi' : 'Thêm phòng'}
            </ThemedText>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: 12,
    padding: 16,
    paddingBottom: 30,
  },
  fieldWrap: {
    gap: 6,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  statusWrap: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: 10,
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    color: '#d32f2f',
  },
});
