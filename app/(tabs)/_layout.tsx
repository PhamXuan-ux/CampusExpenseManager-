import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F25D7E",
        tabBarInactiveTintColor: "#999",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 70,
          paddingBottom: 16,
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Sổ thu chi',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Ví tiền',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="wallet" color={color} />,
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: 'Phân tích',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="pie-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: 'Ngân sách',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="cash-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Thêm',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="ellipsis-horizontal" color={color} />,
        }}
      />
    </Tabs>
  );
}
