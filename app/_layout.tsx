/**
 * VIEW – Root Layout
 * Cấu hình Stack navigator gốc, bao gồm nested routes phòng trọ
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="rooms/add"
          options={{
            title: 'Thêm phòng mới',
            headerBackTitle: 'Quay lại',
            headerStyle: { backgroundColor: '#1D4ED8' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700' },
          }}
        />
        <Stack.Screen
          name="rooms/[id]"
          options={{
            title: 'Chi tiết phòng',
            headerBackTitle: 'Quay lại',
            headerStyle: { backgroundColor: '#1D4ED8' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700' },
          }}
        />
        <Stack.Screen
          name="rooms/edit/[id]"
          options={{
            title: 'Sửa thông tin phòng',
            headerBackTitle: 'Quay lại',
            headerStyle: { backgroundColor: '#1D4ED8' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700' },
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
