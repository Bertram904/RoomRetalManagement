/**
 * VIEW – Room List Screen (Tab 2)
 * Danh sách phòng dùng FlatList (tương đương RecyclerView)
 * Hỗ trợ: xem, thêm (FAB), xóa nhanh (long press)
 */

import { EmptyList } from '@/components/room/EmptyList';
import { RoomCard } from '@/components/room/RoomCard';
import { deleteRoom, getRooms } from '@/controllers/room-controller';
import { Room } from '@/models/room';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RoomsScreen() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState('');

  // Refresh danh sách mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      setRooms(getRooms());
    }, [])
  );

  // Lọc theo tên/mã phòng
  const filtered = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.tenantName.toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(room: Room) {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa "${room.name}" không?\nThao tác này không thể hoàn tác.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            deleteRoom(room.id);
            setRooms(getRooms());
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách phòng</Text>
        <Text style={styles.headerCount}>{rooms.length} phòng</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={18} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên, mã, người thuê..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter chips */}
      <View style={styles.chipsRow}>
        <Chip
          label={`Tất cả (${rooms.length})`}
          active={search === ''}
          onPress={() => {}}
        />
        <Chip
          label={`Còn trống (${rooms.filter((r) => r.status === 'AVAILABLE').length})`}
          active={false}
          color="#2E7D32"
          onPress={() => {}}
        />
        <Chip
          label={`Đã thuê (${rooms.filter((r) => r.status === 'RENTED').length})`}
          active={false}
          color="#C62828"
          onPress={() => {}}
        />
      </View>

      {/* Room list – FlatList (RecyclerView equivalent) */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RoomCard
            room={item}
            onPress={() => router.push(`/rooms/${item.id}` as any)}
            onLongPress={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={<EmptyList />}
        contentContainerStyle={filtered.length === 0 ? { flex: 1 } : { paddingVertical: 8 }}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB – Nút thêm phòng */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/rooms/add' as any)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function Chip({
  label,
  active,
  color = '#1D4ED8',
  onPress,
}: {
  label: string;
  active: boolean;
  color?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && { backgroundColor: color, borderColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, active && { color: '#fff' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerCount: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  // Search
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: { marginRight: 2 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    padding: 0,
  },

  // Chips
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
});
