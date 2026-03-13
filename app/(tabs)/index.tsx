/**
 * VIEW – Home / Dashboard Screen
 * Màn hình tổng quan: thống kê phòng trọ
 */

import { getRoomStats } from '@/controllers/room-controller';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [stats, setStats] = useState({ total: 0, available: 0, rented: 0 });

  // Refresh stats every time screen is focused (sau khi thêm/sửa/xóa)
  useFocusEffect(
    useCallback(() => {
      setStats(getRoomStats());
    }, [])
  );

  const occupancyRate =
    stats.total > 0 ? Math.round((stats.rented / stats.total) * 100) : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Xin chào, Chủ nhà! 👋</Text>
            <Text style={styles.subtitle}>Quản lý nhà trọ của bạn</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="home" size={28} color="#fff" />
          </View>
        </View>

        {/* Stats cards */}
        <Text style={styles.sectionTitle}>Thống kê tổng quan</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="business-outline"
            label="Tổng phòng"
            value={stats.total}
            color="#1D4ED8"
            bg="#EFF6FF"
          />
          <StatCard
            icon="checkmark-circle-outline"
            label="Còn trống"
            value={stats.available}
            color="#2E7D32"
            bg="#E8F5E9"
          />
          <StatCard
            icon="people-outline"
            label="Đã thuê"
            value={stats.rented}
            color="#C62828"
            bg="#FFEBEE"
          />
        </View>

        {/* Occupancy rate */}
        <View style={styles.occupancyCard}>
          <View style={styles.occupancyHeader}>
            <Text style={styles.occupancyLabel}>Tỷ lệ lấp phòng</Text>
            <Text style={styles.occupancyPercent}>{occupancyRate}%</Text>
          </View>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${occupancyRate}%`,
                  backgroundColor: occupancyRate >= 70 ? '#2E7D32' : occupancyRate >= 40 ? '#F59E0B' : '#C62828',
                },
              ]}
            />
          </View>
          <Text style={styles.occupancyNote}>
            {stats.rented}/{stats.total} phòng được thuê
          </Text>
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
        <View style={styles.actionsGrid}>
          <QuickAction
            icon="add-circle-outline"
            label="Thêm phòng"
            color="#1D4ED8"
            bg="#EFF6FF"
            onPress={() => router.push('/rooms/add' as any)}
          />
          <QuickAction
            icon="list-outline"
            label="Xem danh sách"
            color="#7C3AED"
            bg="#F5F3FF"
            onPress={() => router.push('/(tabs)/rooms' as any)}
          />
        </View>

        {/* Footer hint */}
        <View style={styles.hint}>
          <Ionicons name="information-circle-outline" size={16} color="#94A3B8" />
          <Text style={styles.hintText}>Nhấn giữ một phòng để xóa nhanh</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  color: string;
  bg: string;
}

function StatCard({ icon, label, value, color, bg }: StatCardProps) {
  return (
    <View style={[styles.statCard, { backgroundColor: bg }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

interface QuickActionProps {
  icon: string;
  label: string;
  color: string;
  bg: string;
  onPress: () => void;
}

function QuickAction({ icon, label, color, bg, onPress }: QuickActionProps) {
  return (
    <TouchableOpacity
      style={[styles.actionCard, { backgroundColor: bg, borderColor: color + '40' }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon as any} size={28} color={color} />
      <Text style={[styles.actionLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FB' },
  scroll: { flex: 1 },
  container: { padding: 20, paddingBottom: 32 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1D4ED8',
    borderRadius: 20,
    padding: 22,
    marginBottom: 24,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: {
    fontSize: 13,
    color: '#BFDBFE',
    marginTop: 4,
  },
  headerIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    padding: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 14,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statIcon: {
    borderRadius: 10,
    padding: 8,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Occupancy
  occupancyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  occupancyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  occupancyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  occupancyPercent: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  progressBg: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  occupancyNote: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'right',
  },

  // Quick actions
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Hint
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  hintText: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
