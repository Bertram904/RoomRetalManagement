/**
 * VIEW – RoomFormFields
 * Form dùng chung cho màn hình Thêm / Sửa phòng
 */

import { defaultRoomInput, RoomInput, RoomStatus, STATUS_BG, STATUS_COLOR, STATUS_LABEL } from '@/models/room';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  initialValues?: Partial<RoomInput>;
  errors: Partial<Record<keyof RoomInput, string>>;
  onChange: (values: RoomInput) => void;
}

export function RoomFormFields({ initialValues, errors, onChange }: Props) {
  const [form, setForm] = useState<RoomInput>({
    ...defaultRoomInput,
    ...initialValues,
  });

  useEffect(() => {
    onChange(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  function set(field: keyof RoomInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function setStatus(status: RoomStatus) {
    setForm((prev) => ({
      ...prev,
      status,
      tenantName: status === 'AVAILABLE' ? '' : prev.tenantName,
      phone: status === 'AVAILABLE' ? '' : prev.phone,
    }));
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Section: Thông tin phòng */}
      <SectionHeader icon="home-outline" title="Thông tin phòng" />

      <FieldLabel label="Mã phòng *" />
      <TextInput
        style={[styles.input, errors.code && styles.inputError]}
        placeholder="VD: P101"
        value={form.code}
        onChangeText={(v) => set('code', v)}
        autoCapitalize="characters"
      />
      {errors.code ? <ErrorText msg={errors.code} /> : null}

      <FieldLabel label="Tên phòng *" />
      <TextInput
        style={[styles.input, errors.name && styles.inputError]}
        placeholder="VD: Phòng 101"
        value={form.name}
        onChangeText={(v) => set('name', v)}
      />
      {errors.name ? <ErrorText msg={errors.name} /> : null}

      <FieldLabel label="Giá thuê (VNĐ/tháng) *" />
      <TextInput
        style={[styles.input, errors.price && styles.inputError]}
        placeholder="VD: 3000000"
        value={form.price}
        onChangeText={(v) => set('price', v)}
        keyboardType="numeric"
      />
      {errors.price ? <ErrorText msg={errors.price} /> : null}

      <FieldLabel label="Diện tích (m²)" />
      <TextInput
        style={styles.input}
        placeholder="VD: 25"
        value={form.area}
        onChangeText={(v) => set('area', v)}
        keyboardType="numeric"
      />

      <FieldLabel label="Ghi chú" />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ghi chú thêm về phòng..."
        value={form.description}
        onChangeText={(v) => set('description', v)}
        multiline
        numberOfLines={3}
      />

      {/* Section: Tình trạng */}
      <SectionHeader icon="information-circle-outline" title="Tình trạng phòng" />

      <View style={styles.statusRow}>
        {(['AVAILABLE', 'RENTED'] as RoomStatus[]).map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.statusBtn,
              form.status === s && {
                backgroundColor: STATUS_BG[s],
                borderColor: STATUS_COLOR[s],
              },
            ]}
            onPress={() => setStatus(s)}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: form.status === s ? STATUS_COLOR[s] : '#ccc' },
              ]}
            />
            <Text
              style={[
                styles.statusBtnText,
                form.status === s && { color: STATUS_COLOR[s], fontWeight: '700' },
              ]}
            >
              {STATUS_LABEL[s]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Section: Người thuê (chỉ hiện khi RENTED) */}
      {form.status === 'RENTED' && (
        <>
          <SectionHeader icon="person-outline" title="Thông tin người thuê" />

          <FieldLabel label="Tên người thuê *" />
          <TextInput
            style={[styles.input, errors.tenantName && styles.inputError]}
            placeholder="VD: Nguyễn Văn A"
            value={form.tenantName}
            onChangeText={(v) => set('tenantName', v)}
          />
          {errors.tenantName ? <ErrorText msg={errors.tenantName} /> : null}

          <FieldLabel label="Số điện thoại *" />
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder="VD: 0912345678"
            value={form.phone}
            onChangeText={(v) => set('phone', v)}
            keyboardType="phone-pad"
          />
          {errors.phone ? <ErrorText msg={errors.phone} /> : null}
        </>
      )}
    </ScrollView>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon as any} size={18} color="#1D4ED8" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function FieldLabel({ label }: { label: string }) {
  return <Text style={styles.label}>{label}</Text>;
}

function ErrorText({ msg }: { msg: string }) {
  return (
    <View style={styles.errorRow}>
      <Ionicons name="alert-circle" size={14} color="#C62828" />
      <Text style={styles.errorText}>{msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#F5F7FB' },
  container: { padding: 16, paddingBottom: 40 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1D4ED8',
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: '#1a1a2e',
    marginBottom: 4,
  },
  inputError: {
    borderColor: '#C62828',
    backgroundColor: '#FFF5F5',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#C62828',
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  statusBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusBtnText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});
