import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import hệ thống màu mới
import { Colors } from "@/constants/theme";

// --- Types ---
interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  budgetAmount: number;
  spentAmount: number;
}

// --- Mock Data ---
const MOCK_BUDGETS: BudgetCategory[] = [
  {
    id: "food",
    name: "Ăn uống",
    icon: "food",
    iconColor: "#FBC02D", // Vẫn giữ màu đặc trưng của category
    budgetAmount: 50000000,
    spentAmount: 5000000,
  },
  {
    id: "daily",
    name: "Chi tiêu hằng ngày",
    icon: "shopping",
    iconColor: "#66BB6A",
    budgetAmount: 5000000,
    spentAmount: 0,
  },
  {
    id: "clothes",
    name: "Quần áo",
    icon: "tshirt-crew",
    iconColor: "#5C6BC0",
    budgetAmount: 500000000,
    spentAmount: 0,
  },
  {
    id: "beauty",
    name: "Mỹ phẩm",
    icon: "lipstick",
    iconColor: "#EC407A",
    budgetAmount: 5000000,
    spentAmount: 0,
  },
  {
    id: "social",
    name: "Phí giao lưu",
    icon: "gift",
    iconColor: "#FFA726",
    budgetAmount: 5000000,
    spentAmount: 0,
  },
];

// --- Helper ---
const formatCurrency = (amount: number) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
};

export default function BudgetScreen() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const totalBudget = MOCK_BUDGETS.reduce((sum, b) => sum + b.budgetAmount, 0);
  const totalSpent = MOCK_BUDGETS.reduce((sum, b) => sum + b.spentAmount, 0);
  const totalRemaining = totalBudget - totalSpent;
  const totalPercentage =
    totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const prevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const monthYear = `${String(currentMonth.getMonth() + 1).padStart(2, "0")}/${currentMonth.getFullYear()}`;
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const dateRange = `(01/${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${daysInMonth}/${String(currentMonth.getMonth() + 1).padStart(2, "0")})`;

  // Helper function để lấy màu thanh progress bar
  const getProgressBarColor = (percentage: number) => {
      if (percentage >= 100) return Colors.light.error;
      if (percentage > 80) return Colors.light.warning; // Cam/Vàng cảnh báo
      return Colors.light.primary; // Xanh an toàn
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* --- HEADER --- */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="home-outline" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ngân sách</Text>
            <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="options-outline" size={22} color="#FFF" />
            </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* --- MONTH SELECTOR --- */}
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={prevMonth} style={styles.monthArrow}>
          <Ionicons name="chevron-back" size={24} color={Colors.light.textSub} />
        </TouchableOpacity>
        <View style={styles.monthTextWrapper}>
          <Text style={styles.monthText}>{monthYear}</Text>
          <Text style={styles.dateRangeText}>{dateRange}</Text>
        </View>
        <TouchableOpacity onPress={nextMonth} style={styles.monthArrow}>
          <Ionicons name="chevron-forward" size={24} color={Colors.light.textSub} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* --- TOTAL BUDGET CARD --- */}
        <TouchableOpacity style={styles.budgetCard}>
          <View style={styles.budgetCardHeader}>
            <Text style={styles.budgetCardTitle}>Tổng ngân sách</Text>
            <View style={styles.budgetCardRight}>
              <Text style={styles.remainingLabel}>Còn lại </Text>
              <Text style={styles.remainingAmountMain}>
                {formatCurrency(totalRemaining)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.light.placeholder} />
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { 
                    width: `${Math.min(totalPercentage, 100)}%`, 
                    backgroundColor: getProgressBarColor(totalPercentage)
                },
              ]}
            />
          </View>
          <View style={styles.budgetCardFooter}>
            <Text style={styles.budgetLabel}>
              Ngân sách {formatCurrency(totalBudget)}
            </Text>
            <Text style={styles.percentageText}>{totalPercentage}%</Text>
            <Text style={styles.spentLabel}>
              Chi tiêu {formatCurrency(totalSpent)}
            </Text>
          </View>
        </TouchableOpacity>

        {/* --- BUDGET CATEGORIES LIST --- */}
        {MOCK_BUDGETS.map((budget) => {
          const remaining = budget.budgetAmount - budget.spentAmount;
          const percentage =
            budget.budgetAmount > 0
              ? Math.round((budget.spentAmount / budget.budgetAmount) * 100)
              : 0;

          return (
            <TouchableOpacity key={budget.id} style={styles.budgetCard}>
              <View style={styles.budgetCardHeader}>
                <View style={[styles.categoryIconWrapper, { backgroundColor: `${budget.iconColor}15` }]}>
                  <MaterialCommunityIcons
                    name={budget.icon as any}
                    size={20}
                    color={budget.iconColor}
                  />
                </View>
                <Text style={styles.categoryName}>{budget.name}</Text>
                <View style={styles.budgetCardRight}>
                  <Text style={styles.remainingLabel}>Còn lại </Text>
                  <Text style={styles.remainingAmount}>
                    {formatCurrency(remaining)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.light.placeholder} />
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: getProgressBarColor(percentage),
                    },
                  ]}
                />
              </View>
              <View style={styles.budgetCardFooter}>
                <Text style={styles.budgetLabel}>
                  {formatCurrency(budget.budgetAmount)}
                </Text>
                <Text style={styles.percentageText}>{percentage}%</Text>
                <Text style={styles.spentLabel}>
                  -{formatCurrency(budget.spentAmount)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* --- ADD BUDGET BUTTON --- */}
        <TouchableOpacity style={styles.addBudgetBtn}>
          <Ionicons name="add-circle" size={24} color={Colors.light.primary} />
          <Text style={styles.addBudgetText}>Thêm ngân sách mới</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  } as ViewStyle,
  
  /* Header Styles */
  headerSafeArea: {
    backgroundColor: Colors.light.primary,
  } as ViewStyle,
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  } as ViewStyle,
  headerBtn: {
    padding: 4,
  } as ViewStyle,
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  } as TextStyle,

  /* Month Selector */
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  } as ViewStyle,
  monthArrow: {
    padding: 8,
  } as ViewStyle,
  monthTextWrapper: {
    flexDirection: "row",
    alignItems: "baseline",
    marginHorizontal: 16,
  } as ViewStyle,
  monthText: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.light.textMain,
  } as TextStyle,
  dateRangeText: {
    fontSize: 12,
    color: Colors.light.textSub,
    marginLeft: 8,
  } as TextStyle,

  /* ScrollView */
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  } as ViewStyle,

  /* Budget Card */
  budgetCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    // Clean shadow style
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.light.border,
  } as ViewStyle,
  budgetCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  } as ViewStyle,
  budgetCardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.textMain,
  } as TextStyle,
  categoryIconWrapper: {
    marginRight: 12,
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  categoryName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.textMain,
  } as TextStyle,
  budgetCardRight: {
    flexDirection: "row",
    alignItems: "baseline",
    marginRight: 8,
  } as ViewStyle,
  remainingLabel: {
    fontSize: 11,
    color: Colors.light.textSub,
    marginRight: 4,
  } as TextStyle,
  remainingAmountMain: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.primary, // Xanh da trời cho số dư tổng
  },
  remainingAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.primaryDark, // Xanh đậm hơn chút cho item con
  } as TextStyle,

  /* Progress Bar */
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.light.inputBg,
    borderRadius: 4,
    marginBottom: 10,
    overflow: "hidden",
  } as ViewStyle,
  progressBar: {
    height: "100%",
    borderRadius: 4,
  } as ViewStyle,

  /* Card Footer */
  budgetCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,
  budgetLabel: {
    fontSize: 11,
    color: Colors.light.textSub,
  } as TextStyle,
  percentageText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.textSub,
  } as TextStyle,
  spentLabel: {
    fontSize: 11,
    color: Colors.light.textSub,
  } as TextStyle,

  /* Add Button */
  addBudgetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.inputBg, // Nền xám xanh nhạt
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderStyle: 'dashed', // Viền nét đứt tạo phong cách thêm mới
  } as ViewStyle,
  addBudgetText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.primary, // Chữ xanh
  } as TextStyle,
});