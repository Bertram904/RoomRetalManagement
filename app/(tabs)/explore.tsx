import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export default function InfoScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Thông tin bài tập</ThemedText>

      <View style={styles.block}>
        <ThemedText type="defaultSemiBold">Mô hình áp dụng</ThemedText>
        <ThemedText>- Model: `models/room.ts`</ThemedText>
        <ThemedText>- Controller: `controllers/room-controller.ts`</ThemedText>
        <ThemedText>- View: các màn hình trong thư mục `app/`</ThemedText>
      </View>

      <View style={styles.block}>
        <ThemedText type="defaultSemiBold">Chức năng đã có</ThemedText>
        <ThemedText>- Thêm phòng (Create)</ThemedText>
        <ThemedText>- Hiển thị danh sách phòng bằng FlatList (Read)</ThemedText>
        <ThemedText>- Bấm vào item để sửa (Update)</ThemedText>
        <ThemedText>- Xóa phòng có xác nhận Alert (Delete)</ThemedText>
      </View>

      <View style={styles.block}>
        <ThemedText type="defaultSemiBold">Lưu dữ liệu</ThemedText>
        <ThemedText>Dữ liệu được lưu tạm thời bằng List trong bộ nhớ, không dùng SQLite/Room.</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 56,
  },
  block: {
    gap: 4,
  },
});
