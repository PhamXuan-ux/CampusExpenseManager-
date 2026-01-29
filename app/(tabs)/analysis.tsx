import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// --- Types ---
interface CategoryData {
  id: string;
  name: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  amount: number;
  percentage: number;
  color: string;
}

// --- Mock Data ---
const EXPENSE_DATA: CategoryData[] = [
  { id: 'food', name: 'Chế độ ăn', icon: 'hamburger', iconBg: '#FFF8E1', iconColor: '#FBC02D', amount: 700000, percentage: 86, color: '#EF5350' },
  { id: 'transport', name: 'Giao thông', icon: 'bus', iconBg: '#E8EAF6', iconColor: '#5C6BC0', amount: 70000, percentage: 9, color: '#5C6BC0' },
  { id: 'gift', name: 'Quà tặng', icon: 'gift', iconBg: '#FCE4EC', iconColor: '#EC407A', amount: 40000, percentage: 5, color: '#EC407A' },
];

const INCOME_DATA: CategoryData[] = [
  { id: 'salary', name: 'Tiền công', icon: 'account-cash', iconBg: '#E8F5E9', iconColor: '#66BB6A', amount: 7500220, percentage: 99, color: '#EF5350' },
  { id: 'invest', name: 'Đầu tư', icon: 'trending-up', iconBg: '#E3F2FD', iconColor: '#42A5F5', amount: 40000, percentage: 1, color: '#42A5F5' },
];

// --- Helper ---
const formatCurrency = (amount: number) => {
  return '₫' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// --- Simple Donut Chart using View ---
interface DonutChartProps {
  percentage: number;
  centerText: string;
  centerAmount: string;
  mainColor: string;
}

const DonutChart = ({ percentage, centerText, centerAmount, mainColor }: DonutChartProps) => {
  const size = width - 100;
  const strokeWidth = 35;
  
  return (
    <View style={[styles.donutContainer, { width: size, height: size }]}>
      {/* Background ring */}
      <View style={[styles.donutRing, { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: '#F5F5F5' 
      }]} />
      
      {/* Main ring - simulated with conic gradient effect using border */}
      <View style={[styles.donutRingOverlay, { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: mainColor,
        borderRightColor: percentage > 75 ? mainColor : '#F5F5F5',
        borderBottomColor: percentage > 50 ? mainColor : '#F5F5F5',
        borderLeftColor: percentage > 25 ? mainColor : '#F5F5F5',
        transform: [{ rotate: '-45deg' }]
      }]} />
      
      {/* Center content */}
      <View style={styles.donutCenter}>
        <Text style={styles.donutCenterLabel}>{centerText}</Text>
        <Text style={styles.donutCenterAmount}>{centerAmount}</Text>
      </View>
    </View>
  );
};

export default function AnalysisScreen() {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const data = activeTab === 'expense' ? EXPENSE_DATA : INCOME_DATA;
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const mainPercentage = data.length > 0 ? data[0].percentage : 0;

  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthYear = `${currentMonth.getMonth() + 1}/${currentMonth.getFullYear()}`;

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="document-text-outline" size={22} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Phân tích</Text>
          <View style={styles.monthSelector}>
            <TouchableOpacity onPress={prevMonth}>
              <Ionicons name="chevron-back" size={18} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.monthText}>{monthYear}</Text>
            <TouchableOpacity onPress={nextMonth}>
              <Ionicons name="chevron-forward" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="chevron-down" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* --- TABS --- */}
      <View style={styles.tabsRow}>
        <TouchableOpacity style={styles.tabIcon}>
          <Ionicons name="cart-outline" size={20} color={activeTab === 'expense' ? '#F25D7E' : '#9E9E9E'} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabPill, activeTab === 'expense' && styles.tabPillActive]}
          onPress={() => setActiveTab('expense')}
        >
          <MaterialCommunityIcons name="cash-minus" size={14} color={activeTab === 'expense' ? '#FFF' : '#9E9E9E'} />
          <Text style={[styles.tabPillText, activeTab === 'expense' && styles.tabPillTextActive]}>Chi tiêu</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabPill, activeTab === 'income' && styles.tabPillActive]}
          onPress={() => setActiveTab('income')}
        >
          <MaterialCommunityIcons name="cash-plus" size={14} color={activeTab === 'income' ? '#FFF' : '#9E9E9E'} />
          <Text style={[styles.tabPillText, activeTab === 'income' && styles.tabPillTextActive]}>Thu nhập</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabIcon}>
          <Ionicons name="calendar-outline" size={20} color="#9E9E9E" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabIcon}>
          <Ionicons name="business-outline" size={20} color="#9E9E9E" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabIcon}>
          <MaterialCommunityIcons name="chart-bar" size={20} color="#9E9E9E" />
        </TouchableOpacity>
      </View>

      {/* --- FILTER --- */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Theo thể loại</Text>
          <Ionicons name="chevron-down" size={14} color="#66BB6A" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* --- DONUT CHART --- */}
        <View style={styles.chartSection}>
          <DonutChart 
            percentage={mainPercentage}
            centerText={activeTab === 'expense' ? 'Tổng chi phí' : 'Tổng doanh thu'}
            centerAmount={formatCurrency(total)}
            mainColor="#EF5350"
          />
          
          {/* Category badges around chart */}
          <View style={styles.categoryBadges}>
            {data.map((item, index) => (
              <View 
                key={item.id} 
                style={[
                  styles.categoryBadge,
                  index === 0 && styles.categoryBadgeLeft,
                  index === 1 && styles.categoryBadgeTopRight,
                  index === 2 && styles.categoryBadgeRight,
                ]}
              >
                <View style={[styles.badgeIconBg, { backgroundColor: item.iconBg }]}>
                  <MaterialCommunityIcons name={item.icon as any} size={16} color={item.iconColor} />
                </View>
                <Text style={styles.badgePercentage}>{item.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* --- CATEGORY LIST --- */}
        <View style={styles.categoryList}>
          {data.map((item) => (
            <View key={item.id} style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: item.iconBg }]}>
                <MaterialCommunityIcons name={item.icon as any} size={24} color={item.iconColor} />
              </View>
              <Text style={styles.categoryName}>{item.name}</Text>
              <Text style={styles.categoryPercentage}>{item.percentage}%</Text>
              <Text style={styles.categoryAmount}>{formatCurrency(item.amount)}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  } as ViewStyle,
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8BBD0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  } as ViewStyle,
  headerBtn: {
    padding: 4,
  } as ViewStyle,
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  } as ViewStyle,
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  } as TextStyle,
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  } as ViewStyle,
  monthText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  } as TextStyle,

  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  } as ViewStyle,
  tabIcon: {
    padding: 8,
  } as ViewStyle,
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 4,
  } as ViewStyle,
  tabPillActive: {
    backgroundColor: '#F25D7E',
    borderColor: '#F25D7E',
  } as ViewStyle,
  tabPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9E9E9E',
  } as TextStyle,
  tabPillTextActive: {
    color: '#FFF',
  } as TextStyle,

  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  } as ViewStyle,
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
  } as ViewStyle,
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#424242',
  } as TextStyle,

  scrollView: {
    flex: 1,
  } as ViewStyle,

  chartSection: {
    alignItems: 'center',
    paddingVertical: 30,
    position: 'relative',
  } as ViewStyle,
  
  donutContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  } as ViewStyle,
  donutRing: {
    position: 'absolute',
  } as ViewStyle,
  donutRingOverlay: {
    position: 'absolute',
  } as ViewStyle,
  donutCenter: {
    alignItems: 'center',
  } as ViewStyle,
  donutCenterLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  } as TextStyle,
  donutCenterAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  } as TextStyle,
  
  categoryBadges: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  } as ViewStyle,
  categoryBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 4,
  } as ViewStyle,
  categoryBadgeLeft: {
    left: 20,
    top: '45%',
  } as ViewStyle,
  categoryBadgeTopRight: {
    right: 40,
    top: '25%',
  } as ViewStyle,
  categoryBadgeRight: {
    right: 30,
    top: '45%',
  } as ViewStyle,
  badgeIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  badgePercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  } as TextStyle,

  categoryList: {
    paddingHorizontal: 16,
  } as ViewStyle,
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  } as ViewStyle,
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  } as ViewStyle,
  categoryName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  } as TextStyle,
  categoryPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
    marginRight: 16,
    width: 40,
    textAlign: 'right',
  } as TextStyle,
  categoryAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    minWidth: 100,
    textAlign: 'right',
  } as TextStyle,
});
