/**
 * VIEW – Edit Room Screen
 * Màn hình sửa thông tin phòng (UPDATE)
 */

import { RoomFormFields } from "@/components/room/RoomFormFields";
import { getRoomById, updateRoom } from "@/controllers/room-controller";
import { RoomInput } from "@/models/room";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

export default function EditRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const room = getRoomById(id);

  const [errors, setErrors] = useState<
    Partial<Record<keyof RoomInput, string>>
  >({});
  const [saving, setSaving] = useState(false);

  const formRef = useRef<RoomInput | null>(null);

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

  if (!room) {
    return (
      <View style={styles.notFound}>
        <Ionicons name="alert-circle-outline" size={60} color="#CBD5F5" />
        <Text style={styles.notFoundText}>Không tìm thấy phòng</Text>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Quay lại</Text>
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

    Alert.alert("Cập nhật thành công", "Thông tin phòng đã được lưu.", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.title}>Chỉnh sửa phòng</Text>

        <View style={{ width: 22 }} />
      </View>

      {/* FORM */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <RoomFormFields
            initialValues={initialValues}
            errors={errors}
            onChange={(values) => {
              formRef.current = values;
            }}
          />
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="close-outline" size={20} color="#475569" />
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.saveText}>
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  scroll: {
    padding: 16,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  cancelBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
  },

  saveBtn: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#2563EB",

    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },

  saveBtnDisabled: {
    opacity: 0.6,
  },

  saveText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },

  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },

  notFoundText: {
    fontSize: 16,
    color: "#64748B",
  },

  backLink: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2563EB",
  },
});