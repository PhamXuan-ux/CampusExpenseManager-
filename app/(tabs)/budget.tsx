import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
    iconColor: "#FBC02D",
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

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="camera-outline" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ngân sách</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="options-outline" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* --- MONTH SELECTOR --- */}
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={prevMonth} style={styles.monthArrow}>
          <Ionicons name="chevron-back" size={24} color="#757575" />
        </TouchableOpacity>
        <View style={styles.monthTextWrapper}>
          <Text style={styles.monthText}>{monthYear}</Text>
          <Text style={styles.dateRangeText}>{dateRange}</Text>
        </View>
        <TouchableOpacity onPress={nextMonth} style={styles.monthArrow}>
          <Ionicons name="chevron-forward" size={24} color="#757575" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* --- TOTAL BUDGET CARD --- */}
        <TouchableOpacity style={styles.budgetCard}>
          <View style={styles.budgetCardHeader}>
            <Text style={styles.budgetCardTitle}>Tổng ngân sách</Text>
            <View style={styles.budgetCardRight}>
              <Text style={styles.remainingLabel}>Còn lại </Text>
              <Text style={styles.remainingAmount}>
                {formatCurrency(totalRemaining)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#BDBDBD" />
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${totalPercentage}%`, backgroundColor: "#FBC02D" },
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
                <View style={styles.categoryIconWrapper}>
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
                <Ionicons name="chevron-forward" size={18} color="#BDBDBD" />
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${percentage}%`,
                      backgroundColor:
                        percentage > 80
                          ? "#EF5350"
                          : percentage > 50
                            ? "#FFA726"
                            : "#FBC02D",
                    },
                  ]}
                />
              </View>
              <View style={styles.budgetCardFooter}>
                <Text style={styles.budgetLabel}>
                  Ngân sách {formatCurrency(budget.budgetAmount)}
                </Text>
                <Text style={styles.percentageText}>{percentage}%</Text>
                <Text style={styles.spentLabel}>
                  Chi tiêu {formatCurrency(budget.spentAmount)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* --- ADD BUDGET BUTTON --- */}
        <TouchableOpacity style={styles.addBudgetBtn}>
          <Ionicons name="add-circle-outline" size={24} color="#F25D7E" />
          <Text style={styles.addBudgetText}>Thêm ngân sách mới</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  } as ViewStyle,
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8BBD0",
    paddingHorizontal: 16,
    paddingVertical: 14,
  } as ViewStyle,
  headerBtn: {
    padding: 4,
  } as ViewStyle,
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  } as TextStyle,

  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
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
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  } as TextStyle,
  dateRangeText: {
    fontSize: 12,
    color: "#9E9E9E",
    marginLeft: 8,
  } as TextStyle,

  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  } as ViewStyle,

  budgetCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } as ViewStyle,
  budgetCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  } as ViewStyle,
  budgetCardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  } as TextStyle,
  categoryIconWrapper: {
    marginRight: 10,
  } as ViewStyle,
  categoryName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  } as TextStyle,
  budgetCardRight: {
    flexDirection: "row",
    alignItems: "baseline",
    marginRight: 8,
  } as ViewStyle,
  remainingLabel: {
    fontSize: 12,
    color: "#9E9E9E",
  } as TextStyle,
  remainingAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F25D7E",
  } as TextStyle,

  progressBarContainer: {
    height: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 4,
    marginBottom: 10,
    overflow: "hidden",
  } as ViewStyle,
  progressBar: {
    height: "100%",
    borderRadius: 4,
  } as ViewStyle,

  budgetCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,
  budgetLabel: {
    fontSize: 11,
    color: "#9E9E9E",
  } as TextStyle,
  percentageText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#757575",
  } as TextStyle,
  spentLabel: {
    fontSize: 11,
    color: "#9E9E9E",
  } as TextStyle,

  addBudgetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F4",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    gap: 8,
  } as ViewStyle,
  addBudgetText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F25D7E",
  } as TextStyle,

  promoBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  } as ViewStyle,
  promoLeft: {
    flex: 1,
  } as ViewStyle,
  promoCredit: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  } as TextStyle,
  promoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  } as ViewStyle,
  promoText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  } as TextStyle,
  promoBtn: {
    backgroundColor: "#F25D7E",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  } as ViewStyle,
  promoBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFF",
  } as TextStyle,
});
