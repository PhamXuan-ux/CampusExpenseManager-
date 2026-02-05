import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Fonts } from "@/constants/theme";

const theme = Colors.light;

export default function MoreScreen() {
  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => {
          // Simplifying logout for UI-only mode
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const renderMenuItem = (icon: any, title: string, showChevron = true) => (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={22} color={theme.textSub} style={styles.menuIcon} />
        <Text style={styles.menuText}>{title}</Text>
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={theme.border} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* ===== HEADER BACKGROUND ===== */}
      <View style={styles.headerBg} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* ===== TOP NAVIGATION ===== */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Tài chính cá nhân</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* ===== SAVINGS GOAL CARD ===== */}
          <View style={[styles.card, styles.shadow]}>
            <Text style={styles.cardTitle}>Mục tiêu tiết kiệm</Text>
            
            <View style={styles.progressBarBg}>
               <View style={[styles.progressBarFill, { width: '60%' }]} />
            </View>
            
            <View style={styles.cardFooter}>
              <Text style={styles.amountText}>4.500.000</Text>
              <Text style={styles.amountText}>7.500.000</Text>
            </View>
          </View>

          {/* ===== ACCOUNT GAUGE CARD ===== */}
          <View style={[styles.card, styles.shadow, styles.gaugeCard]}>
            <View style={styles.gaugeContainer}>
              <View style={styles.gaugeOuter}>
                {/* Simulated semicircular gauge using borders and rotation */}
                <View style={styles.gaugeHalf} />
                <View style={[styles.gaugeHalfOverlay, { transform: [{ rotate: '45deg' }] }]} />
                
                <View style={styles.gaugeInner}>
                  <Text style={styles.gaugeLabel}>Tài khoản</Text>
                  <Text style={styles.gaugeValue}>4.500.000</Text>
                  <Text style={styles.gaugeStatus}>Tốt</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ===== MENU LIST ===== */}
          <View style={styles.menuList}>
            {renderMenuItem("person-outline", "Thông tin cá nhân")}
            {renderMenuItem("stats-chart-outline", "Báo cáo trong năm")}
            {renderMenuItem("grid-outline", "Báo cáo danh mục trong năm")}
            {renderMenuItem("calendar-outline", "Chi phí cố định và thu nhập định kì")}
            {renderMenuItem("help-circle-outline", "Trợ giúp")}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: theme.primary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    fontFamily: Fonts.rounded,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textMain,
    marginBottom: 15,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountText: {
    fontSize: 14,
    color: theme.textSub,
    fontWeight: '500',
  },
  gaugeCard: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  gaugeContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugeOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 15,
    borderColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gaugeHalf: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 15,
    borderColor: theme.primary,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  gaugeHalfOverlay: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 15,
    borderColor: theme.primary,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  gaugeInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugeLabel: {
    fontSize: 16,
    color: theme.textSub,
    marginBottom: 5,
  },
  gaugeValue: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.textMain,
    fontFamily: Fonts.rounded,
  },
  gaugeStatus: {
    fontSize: 18,
    color: theme.success,
    fontWeight: '600',
    marginTop: 5,
  },
  menuList: {
    borderTopWidth: 1,
    borderTopColor: theme.divider,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 15,
    color: theme.textMain,
    fontWeight: '500',
  },
});
