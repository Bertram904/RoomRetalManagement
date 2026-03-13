/**
 * VIEW – Room Detail Screen
 * Màn hình chi tiết phòng (READ – full info)
 * Có nút Sửa và Xóa
 */

import { deleteRoom, getRoomById } from '@/controllers/room-controller';
import { STATUS_BG, STATUS_BORDER, STATUS_COLOR, STATUS_LABEL } from '@/models/room';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const room = getRoomById(id);

  if (!room) {
    return (
      <View style={styles.notFound}>
        <Ionicons name="alert-circle-outline" size={56} color="#94A3B8" />
        <Text style={styles.notFoundText}>Không tìm thấy phòng này.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function handleDelete() {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa phòng "${room!.name}"?\nThao tác này không thể hoàn tác.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa phòng',
          style: 'destructive',
          onPress: () => {
            deleteRoom(room!.id);
            router.back();
          },
        },
      ]
    );
  }

  const statusColor = STATUS_COLOR[room.status];
  const statusBg = STATUS_BG[room.status];
  const statusBorder = STATUS_BORDER[room.status];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.codeTag}>
              <Text style={styles.codeText}>{room.code}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusBg, borderColor: statusBorder }]}>
              <View style={[styles.dot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {STATUS_LABEL[room.status]}
              </Text>
            </View>
          </View>
          <Text style={styles.roomName}>{room.name}</Text>
          <Text style={styles.price}>
            {room.price.toLocaleString('vi-VN')} đ
            <Text style={styles.priceUnit}> / tháng</Text>
          </Text>
        </View>

        {/* Info section */}
        <InfoSection title="Thông tin phòng" icon="home-outline">
          <InfoRow icon="barcode-outline" label="Mã phòng" value={room.code} />
          <InfoRow
            icon="resize-outline"
            label="Diện tích"
            value={room.area ? `${room.area} m²` : '—'}
          />
          <InfoRow
            icon="document-text-outline"
            label="Ghi chú"
            value={room.description || '—'}
          />
        </InfoSection>

        {/* Tenant section */}
        {room.status === 'RENTED' ? (
          <InfoSection title="Người thuê" icon="person-outline">
            <InfoRow icon="person-outline" label="Họ tên" value={room.tenantName || '—'} />
            <InfoRow icon="call-outline" label="Điện thoại" value={room.phone || '—'} />
          </InfoSection>
        ) : (
          <View style={styles.emptyTenant}>
            <Ionicons name="person-add-outline" size={28} color="#94A3B8" />
            <Text style={styles.emptyTenantText}>Phòng chưa có người thuê</Text>
          </View>
        )}
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDelete}
          activeOpacity={0.85}
        >
          <Ionicons name="trash-outline" size={20} color="#C62828" />
          <Text style={styles.deleteText}>Xóa phòng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push(`/rooms/edit/${room.id}` as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.editText}>Sửa thông tin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function InfoSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon as any} size={18} color="#1D4ED8" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLabel}>
        <Ionicons name={icon as any} size={15} color="#64748B" />
        <Text style={styles.infoLabelText}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FB' },
  scroll: { padding: 16, paddingBottom: 32 },

  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontSize: 16, color: '#94A3B8' },
  backLink: { fontSize: 15, color: '#1D4ED8', fontWeight: '600' },

  // Hero
  heroCard: {
    backgroundColor: '#1D4ED8',
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
    gap: 10,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeTag: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  codeText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '700' },
  roomName: { fontSize: 24, fontWeight: '800', color: '#fff', marginTop: 4 },
  price: { fontSize: 22, fontWeight: '800', color: '#fff' },
  priceUnit: { fontSize: 14, fontWeight: '400', color: '#BFDBFE' },

  // Sections
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FAFBFF',
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1D4ED8' },
  sectionBody: { padding: 4 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  infoLabelText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  infoValue: { fontSize: 14, color: '#1E293B', fontWeight: '600', flex: 1.2, textAlign: 'right' },

  emptyTenant: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  emptyTenantText: { fontSize: 14, color: '#94A3B8' },

  // Footer buttons
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
    backgroundColor: '#FFEBEE',
  },
  deleteText: { fontSize: 14, fontWeight: '700', color: '#C62828' },
  editBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#1D4ED8',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  editText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
