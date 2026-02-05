import { Colors, Fonts } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const theme = Colors.light;

// --- MOCK DATA ---
const BUDGET_DATA = {
  total: 10000000,
  categories: [
    { name: "Cần thiết", percent: 40, color: "#8E7CF7", amount: 5500000, limit: 5000000 },
    { name: "Đào tạo", percent: 7, color: "#4DABF7", amount: 800000, limit: 1200000 },
    { name: "Hưởng thụ", percent: 8, color: "#FAA2C1", amount: 1200000, limit: 1500000 },
    { name: "Tiết kiệm", percent: 10, color: "#FF8787", amount: 2000000, limit: 2000000 },
    { name: "Từ thiện", percent: 10, color: "#FFD8A8", amount: 500000, limit: 1000000 },
    { name: "Tự do", percent: 10, color: "#C0EB75", amount: 1500000, limit: 3000000 },
  ]
};

const CHART_DATA = [
  { day: '11/6', income: 800, expense: 400 },
  { day: '12/6', income: 600, expense: 480 },
  { day: '13/6', income: 900, expense: 350 },
  { day: '14/6', income: 700, expense: 800 },
  { day: '15/6', income: 850, expense: 650 },
  { day: '16/6', income: 950, expense: 420 },
  { day: '17/6', income: 750, expense: 500 },
];

const formatCurrency = (val: number) => 
  val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// --- COMPONENTS ---

const SectionHeader = ({ title, showMore = true }: { title: string, showMore?: boolean }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {showMore && (
      <TouchableOpacity>
        <Text style={styles.seeMoreText}>Xem thêm</Text>
      </TouchableOpacity>
    )}
  </View>
);

// 1. Line Chart Wrapper (Visual Simulation)
const MonthlySpendingChart = () => {
  const maxVal = 1000;
  const chartHeight = 160; // Chiều cao cố định cho vùng biểu đồ

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartLegend}>
         <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4DABF7' }]} />
            <Text style={styles.legendText}>Thu</Text>
         </View>
         <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF8E6E' }]} />
            <Text style={styles.legendText}>Chi</Text>
         </View>
      </View>

      <View style={styles.chartContent}>
        {/* Y Axis Labels */}
        <View style={styles.yAxis}>
          {[1000, 750, 500, 250, 0].map(val => (
            <Text key={val} style={styles.axisLabel}>{val}</Text>
          ))}
        </View>

        {/* Bar Chart Area */}
        <View style={[styles.chartArea, { height: chartHeight }]}>
           {/* Grid lines */}
           {[0, 25, 50, 75, 100].map(top => (
             <View key={top} style={[styles.gridLine, { top: `${top}%` }]} />
           ))}
           
           <View style={styles.barsContainer}>
              {CHART_DATA.map((d, i) => (
                <View key={i} style={styles.barGroup}>
                  {/* Income Bar (Blue) */}
                  <View style={styles.barColumn}>
                     <View style={[styles.barFill, { height: (d.income / maxVal) * chartHeight, backgroundColor: '#4DABF7' }]} />
                  </View>
                  
                  {/* Expense Bar (Orange) */}
                  <View style={styles.barColumn}>
                     <View style={[styles.barFill, { height: (d.expense / maxVal) * chartHeight, backgroundColor: '#FF8E6E' }]} />
                  </View>
                </View>
              ))}
           </View>
        </View>
      </View>

      {/* X Axis Labels */}
      <View style={styles.xAxis}>
        {CHART_DATA.map((d, i) => (
          <Text key={i} style={styles.axisLabel}>{d.day}</Text>
        ))}
      </View>
    </View>
  );
};

// 2. Budget Overview Card
const BudgetOverview = () => {
  return (
    <View style={styles.overviewCard}>
      <View style={styles.overviewTop}>
        <View style={styles.overviewText}>
          <Text style={styles.overviewLabel}>Thống kê</Text>
          <Text style={styles.overviewDate}>01/06/2023 - 16/06/2023</Text>
          <Text style={styles.overviewAmount}>{formatCurrency(BUDGET_DATA.total)}</Text>
        </View>

        <View style={styles.donutWrapper}>
           {/* Multi-color Donut Simulation */}
           <View style={styles.donutBase}>
              <View style={[styles.donutSegment, { borderColor: '#8E7CF7', transform: [{ rotate: '0deg' }] }]} />
              <View style={[styles.donutSegment, { borderColor: '#4DABF7', transform: [{ rotate: '45deg' }] }]} />
              <View style={[styles.donutSegment, { borderColor: '#A2E667', transform: [{ rotate: '120deg' }] }]} />
              <View style={[styles.donutSegment, { borderColor: '#FF8787', transform: [{ rotate: '200deg' }] }]} />
              <View style={[styles.donutSegment, { borderColor: '#FFD8A8', transform: [{ rotate: '280deg' }] }]} />
              <View style={styles.donutHole} />
           </View>
        </View>
      </View>

      <View style={styles.chipGrid}>
        {BUDGET_DATA.categories.map((cat, i) => (
          <View key={i} style={[styles.chip, { borderColor: cat.color, backgroundColor: cat.color + '15' }]}>
            <Text style={[styles.chipText, { color: cat.color }]}>{cat.percent}% {cat.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// 3. Category Progress Item
const CategoryProgressCard = ({ cat }: { cat: any }) => {
  const progress = Math.min(cat.amount / cat.limit, 1);
  return (
    <View style={styles.catProgressCard}>
      <View style={styles.progressCircleContainer}>
         <View style={styles.circleOuter}>
            <View style={[styles.circleFill, { borderTopColor: cat.color, borderRightColor: cat.color, transform: [{ rotate: `${progress * 180 - 45}deg` }] }]} />
            <View style={styles.circleInner}>
               <Text style={styles.circlePercent}>{Math.round(progress * 100)}%</Text>
            </View>
         </View>
      </View>
      <View style={styles.catDetails}>
        <Text style={styles.catName}>{cat.name}</Text>
        <Text style={styles.catAmount}>{formatCurrency(cat.amount)}</Text>
        <Text style={styles.catLimit}>Hạn mức: {formatCurrency(cat.limit)}</Text>
      </View>
    </View>
  );
};

// --- MAIN SCREEN ---
export default function AnalysisScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* HEADER BACKGROUND */}
      <View style={styles.headerBg}>
         <SafeAreaView>
            <View style={styles.topNav}>
               <TouchableOpacity><Ionicons name="arrow-back" size={24} color="#FFF" /></TouchableOpacity>
               <Text style={styles.navTitle}>Thống kê chi tiêu</Text>
               <TouchableOpacity><Ionicons name="calendar-outline" size={24} color="#FFF" /></TouchableOpacity>
            </View>
         </SafeAreaView>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <MonthlySpendingChart />

        <SectionHeader title="Tổng quan hạn mức" />
        <BudgetOverview />

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {BUDGET_DATA.categories.map((cat, i) => (
             <CategoryProgressCard key={i} cat={cat} />
          ))}
        </ScrollView>

        {/* BOTTOM STATS */}
        <View style={styles.bottomStats}>
           <View style={styles.statRow}>
              <Text style={styles.statLabel}>Trung bình chi theo ngày</Text>
              <View style={styles.statValueRow}>
                 <Text style={styles.statValue}>500.000</Text>
                 <View style={styles.trendRow}>
                    <Ionicons name="caret-down" size={14} color={theme.error} />
                    <Text style={[styles.trendText, { color: theme.error }]}>2%</Text>
                 </View>
              </View>
           </View>

           <View style={styles.divider} />

           <View style={styles.statRow}>
              <Text style={styles.statLabel}>Số dư tháng này</Text>
              <View style={styles.statValueRow}>
                 <Text style={styles.statValue}>2.000.000</Text>
                 <View style={styles.trendRow}>
                    <Ionicons name="caret-up" size={14} color={theme.success} />
                    <Text style={[styles.trendText, { color: theme.success }]}>11%</Text>
                 </View>
              </View>
           </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBg: {
    backgroundColor: theme.primary,
    height: 120,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    zIndex: 10,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  navTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Fonts.rounded,
  },
  scrollView: {
    flex: 1,
    marginTop: -20, // Pull up to overlap with header
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textMain,
  },
  seeMoreText: {
    fontSize: 14,
    color: theme.primary,
    fontWeight: '600',
  },

  // Chart Card
  chartCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: theme.textSub,
  },
  chartContent: {
    flexDirection: 'row',
    height: 200,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingVertical: 10,
  },
  axisLabel: {
    fontSize: 12,
    color: theme.textSub,
  },
  chartArea: {
    flex: 1,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    justifyContent: 'flex-end', // Ensure bars start from bottom
  },
  gridLine: {
    height: 1,
    backgroundColor: '#F1F5F9',
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 0,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    zIndex: 1,
  },
  barGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  barColumn: {
    alignItems: 'center',
    width: 14,
  },
  barFill: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 35,
    marginTop: 15,
  },
  charVisualPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tooltip
  tooltipContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 20,
  },
  tooltipBubble: {
    backgroundColor: '#FF8E6E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  tooltipText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  tooltipPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FF8E6E',
  },

  // Overview Card
  overviewCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  overviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  overviewText: {
    flex: 1,
  },
  overviewLabel: {
    fontSize: 14,
    color: theme.textSub,
    marginBottom: 4,
  },
  overviewDate: {
    fontSize: 12,
    color: theme.placeholder,
    marginBottom: 10,
  },
  overviewAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.textMain,
    fontFamily: Fonts.rounded,
  },
  donutWrapper: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutBase: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  donutSegment: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 12,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  donutHole: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Category Progress
  categoryScroll: {
    marginTop: 20,
    marginHorizontal: -16, // Bleed to edges
    paddingHorizontal: 16,
  },
  categoryScrollContent: {
    paddingRight: 32, // Space at end
    gap: 12,
  },
  catProgressCard: {
    width: width * 0.55, // Fixed width for horizontal scroll
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  progressCircleContainer: {
    width: 50,
    height: 50,
  },
  circleOuter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 6,
    borderColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleFill: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 6,
    borderColor: 'transparent',
  },
  circleInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circlePercent: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.textMain,
  },
  catDetails: {
    flex: 1,
  },
  catName: {
    fontSize: 13,
    color: theme.textSub,
    marginBottom: 2,
  },
  catAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.textMain,
  },
  catLimit: {
    fontSize: 10,
    color: theme.placeholder,
    marginTop: 4,
  },

  // Bottom Stats
  bottomStats: {
    marginTop: 30,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statRow: {
    marginVertical: 10,
  },
  statLabel: {
    fontSize: 14,
    color: theme.textSub,
    marginBottom: 8,
  },
  statValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.textMain,
    fontFamily: Fonts.rounded,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
});