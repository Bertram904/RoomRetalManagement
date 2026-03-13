/**
 * VIEW – EmptyList
 * Hiển thị khi danh sách phòng trống
 */

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export function EmptyList() {
  return (
    <View style={styles.container}>
      <Ionicons name="home-outline" size={72} color="#C8D6E5" />
      <Text style={styles.title}>Chưa có phòng nào</Text>
      <Text style={styles.subtitle}>
        Nhấn nút <Text style={styles.plus}>＋</Text> để thêm phòng đầu tiên
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  plus: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
});
