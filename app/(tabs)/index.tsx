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
          <View style={styles.headerTextWrap}>
            <Text style={styles.greeting}>Xin chào, Chủ nhà! 👋</Text>
            <Text style={styles.subtitle}>Quản lý nhà trọ của bạn</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="home" size={26} color="#fff" />
          </View>
        </View>

        {/* Stats */}
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
            color="#15803D"
            bg="#DCFCE7"
          />
          <StatCard
            icon="people-outline"
            label="Đã thuê"
            value={stats.rented}
            color="#B91C1C"
            bg="#FEE2E2"
          />
        </View>

        {/* Occupancy */}
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
                  width: `${Math.min(occupancyRate, 100)}%`,
                  backgroundColor:
                    occupancyRate >= 70
                      ? '#15803D'
                      : occupancyRate >= 40
                        ? '#D97706'
                        : '#B91C1C',
                },
              ]}
            />
          </View>
          <Text style={styles.occupancyNote}>
            {stats.rented}/{stats.total} phòng đang cho thuê
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

        {/* Hint */}
        <View style={styles.hint}>
          <Ionicons name="information-circle-outline" size={18} color="#64748B" />
          <Text style={styles.hintText}>Nhấn giữ một phòng trong danh sách để xóa nhanh</Text>
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
  safe: { flex: 1, backgroundColor: '#F1F5F9' },
  scroll: { flex: 1 },
  container: { padding: 16, paddingBottom: 40 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1D4ED8',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  headerTextWrap: { flex: 1 },
  greeting: {
    fontSize: 19,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
    fontWeight: '500',
  },
  headerIcon: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 12,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
    marginTop: 4,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    borderRadius: 10,
    padding: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Occupancy
  occupancyCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  occupancyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  occupancyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  occupancyPercent: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  progressBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  occupancyNote: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'right',
  },

  // Quick actions
  actionsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 88,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
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
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginTop: 4,
  },
  hintText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
});
