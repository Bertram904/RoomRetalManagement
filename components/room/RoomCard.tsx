/**
 * VIEW – RoomCard
 * Item hiển thị trong danh sách phòng (tương đương RecyclerView item)
 */

import { Room, STATUS_LABEL, STATUS_COLOR, STATUS_BG, STATUS_BORDER } from '@/models/room';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  room: Room;
  onPress: () => void;
  onLongPress: () => void;
}

export function RoomCard({ room, onPress, onLongPress }: Props) {
  const statusColor = STATUS_COLOR[room.status];
  const statusBg = STATUS_BG[room.status];
  const statusBorder = STATUS_BORDER[room.status];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.85}
    >
      {/* Left accent bar */}
      <View style={[styles.accentBar, { backgroundColor: statusColor }]} />

      <View style={styles.content}>
        {/* Header row */}
        <View style={styles.headerRow}>
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

        {/* Room name */}
        <Text style={styles.roomName}>{room.name}</Text>

        {/* Info row */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="cash-outline" size={14} color="#666" />
            <Text style={styles.infoText}>
              {room.price.toLocaleString('vi-VN')} đ/tháng
            </Text>
          </View>
          {room.area ? (
            <View style={styles.infoItem}>
              <Ionicons name="resize-outline" size={14} color="#666" />
              <Text style={styles.infoText}>{room.area} m²</Text>
            </View>
          ) : null}
        </View>

        {/* Tenant info (if rented) */}
        {room.status === 'RENTED' && room.tenantName ? (
          <View style={styles.tenantRow}>
            <Ionicons name="person-outline" size={14} color="#888" />
            <Text style={styles.tenantText}>{room.tenantName}</Text>
            {room.phone ? (
              <>
                <Text style={styles.separator}>·</Text>
                <Ionicons name="call-outline" size={14} color="#888" />
                <Text style={styles.tenantText}>{room.phone}</Text>
              </>
            ) : null}
          </View>
        ) : null}
      </View>

      <Ionicons name="chevron-forward" size={18} color="#ccc" style={styles.arrow} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    alignItems: 'center',
  },
  accentBar: {
    width: 5,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  codeTag: {
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  codeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  roomName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
  },
  tenantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  tenantText: {
    fontSize: 13,
    color: '#777',
  },
  separator: {
    color: '#bbb',
    marginHorizontal: 2,
  },
  arrow: {
    marginRight: 12,
  },
});
