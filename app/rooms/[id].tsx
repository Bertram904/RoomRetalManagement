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
        <Text style={styles.notFoundText}>Không tìm thấy phòng</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function handleDelete() {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa phòng "${room.name}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            deleteRoom(room.id);
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{room.code}</Text>
            </View>

            <View style={[styles.statusBadge, { borderColor: statusBorder, backgroundColor: statusBg }]}>
              <View style={[styles.dot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {STATUS_LABEL[room.status]}
              </Text>
            </View>
          </View>

          <Text style={styles.roomName}>{room.name}</Text>

          <Text style={styles.price}>
            {room.price.toLocaleString('vi-VN')} đ
            <Text style={styles.priceMonth}> / tháng</Text>
          </Text>
        </View>

        {/* ROOM INFO */}
        <Section title="Thông tin phòng" icon="home-outline">
          <InfoRow icon="barcode-outline" label="Mã phòng" value={room.code} />
          <InfoRow icon="resize-outline" label="Diện tích" value={room.area ? `${room.area} m²` : '—'} />
          <InfoRow icon="document-text-outline" label="Ghi chú" value={room.description || '—'} />
        </Section>

        {/* TENANT */}
        {room.status === 'RENTED' ? (
          <Section title="Người thuê" icon="person-outline">
            <InfoRow icon="person-outline" label="Tên" value={room.tenantName || '—'} />
            <InfoRow icon="call-outline" label="Điện thoại" value={room.phone || '—'} />
          </Section>
        ) : (
          <View style={styles.emptyTenant}>
            <Ionicons name="person-outline" size={28} color="#94A3B8" />
            <Text style={styles.emptyTenantText}>Phòng chưa có người thuê</Text>
          </View>
        )}
      </ScrollView>

      {/* FOOTER BUTTONS */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color="#C62828" />
          <Text style={styles.deleteText}>Xóa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push(`/rooms/edit/${room.id}` as any)}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.editText}>Sửa phòng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Section({
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

      {children}
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Ionicons name={icon as any} size={16} color="#64748B" />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>

      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FA' },
  scroll: { padding: 16, paddingBottom: 120 },

  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  notFoundText: { fontSize: 16, color: '#64748B' },
  backLink: { color: '#2563EB', fontWeight: '600' },

  heroCard: {
    backgroundColor: '#2563EB',
    borderRadius: 18,
    padding: 22,
    marginBottom: 16,
  },

  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  codeBox: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  codeText: { color: '#fff', fontWeight: '700' },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.5,
  },

  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 5 },

  statusText: { fontSize: 12, fontWeight: '700' },

  roomName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginTop: 10,
  },

  price: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginTop: 4,
  },

  priceMonth: {
    fontSize: 14,
    fontWeight: '400',
    color: '#BFDBFE',
  },

  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D4ED8',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  infoLabel: {
    fontSize: 14,
    color: '#64748B',
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },

  emptyTenant: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },

  emptyTenantText: {
    fontSize: 14,
    color: '#94A3B8',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  deleteBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },

  deleteText: {
    color: '#C62828',
    fontWeight: '700',
  },

  editBtn: {
    flex: 2,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },

  editText: {
    color: '#fff',
    fontWeight: '700',
  },
});