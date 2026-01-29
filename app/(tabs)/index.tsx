import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// --- Types & Interfaces ---
interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number; // positive for income, negative for expense
  account: string;
  category: string;
  date: string; // ISO YYYY-MM-DD
}

interface DayData {
  day: number | null;
  dateStr: string;
  hasData?: boolean;
  dailyTotal?: number;
}

// --- Mock Data Generator ---
const generateMockData = (): Record<string, Transaction[]> => {
  const data: Record<string, Transaction[]> = {};
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const monthStr = month < 10 ? `0${month}` : `${month}`;

  // Helper to add
  const addTx = (day: number, title: string, sub: string, amt: number, cat: string, acc: string = 'Tài khoản mặc định') => {
    const dStr = day < 10 ? `0${day}` : `${day}`;
    const dateKey = `${year}-${monthStr}-${dStr}`; // Current month mock
    if (!data[dateKey]) data[dateKey] = [];
    data[dateKey].push({
      id: Math.random().toString(),
      title,
      subtitle: sub,
      amount: amt,
      category: cat,
      account: acc,
      date: dateKey,
    });
  };

  // Populate some data for current month
  addTx(5, 'Lương tháng', 'Công ty', 15000000, 'salary');
  addTx(12, 'Cafe bạn bè', 'Giải trí', -55000, 'food');
  addTx(27, 'Tiền công', 'Riêng tôi', 500220, 'salary');
  addTx(27, 'Chế độ ăn', 'Riêng tôi', -700000, 'food');
  // Some random data
  addTx(15, 'Mua sắm', 'Shopee', -250000, 'shopping');
  addTx(20, 'Đổ xăng', 'Di chuyển', -80000, 'transport');
  
  return data;
};

const MOCK_DATA = generateMockData();

// --- Helper Functions ---
const formatCurrency = (amount: number) => {
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${amount >= 0 ? '+' : '-'}₫${formatted}`;
};

const formatShortCurrency = (amount: number) => {
  const abs = Math.abs(amount);
  if (abs >= 1000000) return `${amount < 0 ? '-' : ''}${(abs / 1000000).toFixed(1)}tr`;
  if (abs >= 1000) return `${amount < 0 ? '-' : ''}${(abs / 1000).toFixed(0)}k`;
  return `${amount}`;
};

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month: number, year: number) => {
  return new Date(year, month, 1).getDay(); // 0 = Sunday
};

export default function DashboardScreen() {
  const router = useRouter();
  // Goals: Track viewing month/year AND selected date
  const now = new Date();
  const [viewDate, setViewDate] = useState(now); // For Month Navigation
  const [selectedDate, setSelectedDate] = useState(now); // For Detail Selection
  const [isCalendarMode, setIsCalendarMode] = useState(false);

  // Derived State
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth(); // 0-indexed
  const daysInMonth = getDaysInMonth(viewMonth, viewYear);
  const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
  
  // Format MM/YYYY
  const currentMonthStr = `${viewMonth + 1}/${viewYear}`;

  // Generate Grid
  const calendarGrid = useMemo(() => {
    const grid: DayData[] = [];
    // Padding
    for (let i = 0; i < firstDay; i++) {
        grid.push({ day: null, dateStr: '' });
    }
    // Days
    for (let d = 1; d <= daysInMonth; d++) {
        const m = viewMonth + 1;
        const mStr = m < 10 ? `0${m}` : `${m}`;
        const dStr = d < 10 ? `0${d}` : `${d}`;
        const isoDate = `${viewYear}-${mStr}-${dStr}`;
        
        // Calculate daily total
        const dayTxs = MOCK_DATA[isoDate] || [];
        const total = dayTxs.reduce((acc, curr) => acc + curr.amount, 0);

        grid.push({
            day: d,
            dateStr: isoDate,
            hasData: dayTxs.length > 0,
            dailyTotal: dayTxs.length > 0 ? total : undefined
        });
    }
    return grid;
  }, [viewMonth, viewYear]);

  // Calculations for Summary
  const monthlyStats = useMemo(() => {
      let income = 0;
      let expense = 0;
      
      // Iterate all keys in mock data that match current month/year
      Object.keys(MOCK_DATA).forEach(key => {
          const [y, m] = key.split('-');
          if (parseInt(y) === viewYear && parseInt(m) === viewMonth + 1) {
              MOCK_DATA[key].forEach(tx => {
                  if (tx.amount > 0) income += tx.amount;
                  else expense += tx.amount;
              });
          }
      });
      return { income, expense, total: income + expense };
  }, [viewYear, viewMonth]);

  // Selection Logic
  const selectedDateStr = useMemo(() => {
     const y = selectedDate.getFullYear();
     const m = selectedDate.getMonth() + 1;
     const d = selectedDate.getDate();
     return `${y}-${m < 10 ? `0${m}` : `${m}`}-${d < 10 ? `0${d}` : `${d}`}`;
  }, [selectedDate]);

  const selectedTransactions = MOCK_DATA[selectedDateStr] || [];
  
  const selectedDaySummary = useMemo(() => {
     let inc = 0; let exp = 0;
     selectedTransactions.forEach(t => {
         if (t.amount > 0) inc += t.amount;
         else exp += t.amount;
     });
     return { inc, exp };
  }, [selectedTransactions]);


  // Handlers
  const handlePrevMonth = () => {
      setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };
  
  const handleNextMonth = () => {
      setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const handleDateSelect = (day: number) => {
      setSelectedDate(new Date(viewYear, viewMonth, day));
  };

  const toggleViewMode = () => {
      setIsCalendarMode(!isCalendarMode);
  };

  // Weekdays Labels
  const weekDays = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header Container (Pink Background) */}
      <View style={styles.headerContainer}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.topLeft}>
               <TouchableOpacity style={styles.searchButton}>
                  <Ionicons name="search" size={24} color="#FFF" />
               </TouchableOpacity>
               
               <TouchableOpacity style={styles.walletSelector}>
                  <Text style={styles.walletSelectorText}>cung</Text>
                  <Ionicons name="chevron-down" size={16} color="#FFF" />
               </TouchableOpacity>
            </View>

            <View style={styles.topRight}>
               <TouchableOpacity style={styles.vipButton} onPress={() => router.push('/(tabs)/budget')}>
                  <FontAwesome5 name="crown" size={10} color="#F25D7E" />
                  <Text style={styles.vipButtonText}>Chi tiết</Text>
               </TouchableOpacity>
               
               {isCalendarMode ? (
                  <TouchableOpacity style={styles.calendarActiveButton} onPress={toggleViewMode}>
                     <Ionicons name="calendar" size={16} color="#F25D7E" />
                     <Text style={styles.calendarActiveText}>Lịch</Text>
                  </TouchableOpacity>
               ) : (
                   <TouchableOpacity style={styles.calendarButton} onPress={toggleViewMode}>
                      <Ionicons name="calendar" size={20} color="#F25D7E" />
                   </TouchableOpacity>
               )}
            </View>
          </View>

          {/* Account/Piggy List Horizontal */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.accountList}
            style={{flexGrow: 0}}
          >
            <View style={styles.accountItem}>
               <View style={styles.accountIconWrapper}>
                  <View style={[styles.accountIconBg, {backgroundColor: isCalendarMode ? '#FFF' : '#FFF'}]}>
                    <MaterialCommunityIcons 
                       name="piggy-bank" 
                       size={28} 
                       color={isCalendarMode ? "#FBC02D" : "#F25D7E"} // Yellow piggy in calendar mode
                    />
                  </View>
               </View>
               <Text style={styles.accountName}>cung</Text>
            </View>

            <TouchableOpacity style={styles.accountItem}>
               <View style={styles.addAccountBg}>
                  <Ionicons name="add" size={24} color="#FFF" />
               </View>
               <Text style={styles.addAccountText}>Thêm ...</Text>
            </TouchableOpacity>
          </ScrollView>

        </SafeAreaView>
      </View>

      {/* Main Content Overlay */}
      <View style={styles.mainContentContainer}>
        <ScrollView 
           style={styles.scrollView}
           contentContainerStyle={styles.scrollContent}
           showsVerticalScrollIndicator={false}
        >
          {isCalendarMode ? (
            /* ================= CALENDAR MODE ================= */
            <View style={styles.calendarCard}>
               {/* Month Nav */}
               <View style={styles.calendarHeader}>
                  <TouchableOpacity onPress={handlePrevMonth}>
                    <Ionicons name="chevron-back" size={24} color="#F25D7E" />
                  </TouchableOpacity>
                  
                  <View style={styles.calendarTitleRow}>
                     <Text style={styles.calendarTitle}>tháng {viewMonth + 1} năm {viewYear}</Text>
                     <View style={styles.monthBadge}>
                        <Text style={styles.monthBadgeText}>Month</Text>
                     </View>
                  </View>

                  <TouchableOpacity onPress={handleNextMonth}>
                    <Ionicons name="chevron-forward" size={24} color="#F25D7E" />
                  </TouchableOpacity>
               </View>

               {/* Week Days */}
               <View style={styles.weekRow}>
                  {weekDays.map((day, index) => (
                     <Text key={index} style={[
                        styles.weekDayText, 
                        (index === 0 || index === 6) && styles.textRed
                     ]}>{day}</Text>
                  ))}
               </View>

               {/* Grid */}
               <View style={styles.daysGrid}>
                  {calendarGrid.map((item, index) => {
                     const isSelected = item.day ? (
                         item.day === selectedDate.getDate() && 
                         viewMonth === selectedDate.getMonth() &&
                         viewYear === selectedDate.getFullYear()
                     ) : false;

                     return (
                     <TouchableOpacity 
                        key={index} 
                        style={styles.dayCell}
                        disabled={!item.day}
                        onPress={() => item.day && handleDateSelect(item.day)}
                     >
                        {item.day !== null && (
                           <>
                              <View style={[
                                 styles.dayCircle,
                                 isSelected && styles.dayCircleSelected
                              ]}>
                                 <Text style={[
                                    styles.dayText,
                                    (index % 7 === 0 || index % 7 === 6) && styles.textRed,
                                    isSelected && styles.textWhite
                                 ]}>{item.day}</Text>
                              </View>
                              {item.dailyTotal !== undefined && (
                                 <Text style={[
                                     styles.dayExpenseText,
                                     isSelected && { color: '#FFF', backgroundColor: 'rgba(0,0,0,0.1)' }
                                 ]}>
                                     {formatShortCurrency(item.dailyTotal)}
                                 </Text>
                              )}
                           </>
                        )}
                     </TouchableOpacity>
                  )})}
               </View>

               {/* Tabs */}
               <View style={styles.filterTabs}>
                  <TouchableOpacity style={styles.filterTab}>
                     <Text style={styles.filterTabText}>Chi phí</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterTab}>
                     <Text style={styles.filterTabText}>Thu nhập</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.filterTab, styles.filterTabActive]}>
                     <Text style={[styles.filterTabText, styles.filterTabTextActive]}>Toàn bộ</Text>
                  </TouchableOpacity>
               </View>

               {/* Stats */}
               <View style={styles.calendarStatsRow}>
                   <View style={styles.calStatItem}>
                      <Text style={styles.calStatValueRed}>{formatCurrency(monthlyStats.total)}</Text>
                      <Text style={styles.calStatLabel}>TOÀN BỘ</Text>
                   </View>
                   <View style={styles.calStatItem}>
                      <Text style={styles.calStatValueGreen}>{formatCurrency(monthlyStats.income)}</Text>
                      <Text style={styles.calStatLabel}>THU NHẬP</Text>
                   </View>
                   <View style={styles.calStatItem}>
                      <Text style={styles.calStatValueRedLight}>{formatCurrency(Math.abs(monthlyStats.expense))}</Text>
                      <Text style={styles.calStatLabel}>CHI TIÊU</Text>
                   </View>
               </View>
            </View>

          ) : (
            /* ================= DASHBOARD MODE ================= */
            <View style={styles.summaryCard}>
              <View style={styles.watermarkContainer}>
                 <Image 
                    source={require('@/assets/images/piggy-mascot.png')}
                    style={styles.watermarkImage}
                    resizeMode="contain"
                 />
              </View>

              <View style={styles.monthSelector}>
                 <TouchableOpacity onPress={handlePrevMonth}>
                    <Ionicons name="chevron-back" size={20} color="#9E9E9E" />
                 </TouchableOpacity>
                 <View style={styles.monthDisplay}>
                    <Text style={styles.monthText}>{currentMonthStr}</Text>
                    <Ionicons name="caret-down" size={12} color="#F25D7E" style={{marginLeft: 4}} />
                 </View>
                 <TouchableOpacity onPress={handleNextMonth}>
                    <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
                 </TouchableOpacity>
              </View>

              <View style={styles.statsRow}>
                 <View style={styles.statItem}>
                    <Text style={styles.statValueRed}>{formatCurrency(monthlyStats.total)}</Text>
                    <View style={styles.statLabelRow}>
                       <MaterialCommunityIcons name="file-document-outline" size={12} color="#757575" />
                       <Text style={styles.statLabel}>TOÀN BỘ</Text>
                    </View>
                 </View>
                 <View style={styles.statItem}>
                    <Text style={styles.statValueGreen}>{formatCurrency(monthlyStats.income)}</Text>
                    <View style={styles.statLabelRow}>
                       <Ionicons name="time-outline" size={12} color="#757575" />
                       <Text style={styles.statLabel}>THU NHẬP</Text>
                    </View>
                 </View>
                 <View style={styles.statItem}>
                    <Text style={styles.statValueRedLight}>{formatCurrency(Math.abs(monthlyStats.expense))}</Text>
                    <View style={styles.statLabelRow}>
                       <Ionicons name="pie-chart-outline" size={12} color="#757575" />
                       <Text style={styles.statLabel}>CHI TIÊU</Text>
                    </View>
                 </View>
              </View>

              <View style={styles.cardActions}>
                 <TouchableOpacity style={styles.actionCircleButton}>
                    <Ionicons name="mail-outline" size={14} color="#F25D7E" />
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.actionCircleButton}>
                    <Ionicons name="eye-outline" size={14} color="#F25D7E" />
                 </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ================= TRANSACTION LIST ================= */}
          <View style={styles.dateHeader}>
             <Text style={styles.dateTitle}>
                {`Th ${selectedDate.getDay() + 1}, ${selectedDate.getDate()}/${selectedDate.getMonth() + 1}`}
             </Text>
             <View style={styles.dateSummary}>
                <Text style={styles.dateSummaryText}>
                   Thu nhập: <Text style={styles.textGreen}>{formatCurrency(selectedDaySummary.inc)}</Text> {' '}
                   Chi tiêu: <Text style={styles.textRed}>{formatCurrency(Math.abs(selectedDaySummary.exp))}</Text>
                </Text>
             </View>
          </View>

          {selectedTransactions.length === 0 ? (
              <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>Không có giao dịch</Text>
              </View>
          ) : (
              selectedTransactions.map((tx) => (
                <View key={tx.id} style={styles.transactionCard}>
                    <View style={[styles.transIconBg, {
                        backgroundColor: tx.category === 'salary' ? '#E3F2FD' : 
                                         tx.category === 'food' ? '#FFF8E1' : 
                                         tx.category === 'shopping' ? '#FCE4EC' : '#F3E5F5'
                    }]}>
                        {tx.category === 'salary' && <Ionicons name="person" size={24} color="#5C6BC0" />}
                        {tx.category === 'food' && <MaterialCommunityIcons name="hamburger" size={24} color="#FBC02D" />}
                        {tx.category === 'shopping' && <Ionicons name="cart" size={24} color="#EC407A" />}
                        {tx.category === 'transport' && <Ionicons name="car" size={24} color="#AB47BC" />}
                    </View>
                    <View style={styles.transContent}>
                        <Text style={styles.transTitle}>{tx.title}</Text>
                        <Text style={styles.transSubtitle}>{tx.subtitle}</Text>
                    </View>
                    <View style={styles.transAmount}>
                        <Text style={tx.amount >= 0 ? styles.amountGreen : styles.amountRed}>
                            {formatCurrency(tx.amount)}
                        </Text>
                        <Text style={styles.transAccount}>{tx.account}</Text>
                    </View>
                </View>
              ))
          )}

          <View style={{height: 80}} />
        </ScrollView>
      </View>

      <TouchableOpacity 
          style={styles.fab} 
          onPress={() => router.push("/add-transaction")}
      >
         {isCalendarMode ? (
            <MaterialCommunityIcons name="pencil" size={24} color="#F25D7E" /> 
         ) : (
            <MaterialIcons name="edit" size={24} color="#F25D7E" />
         )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF69B4', 
  },
  headerContainer: {
    backgroundColor: '#F76C9B',
    paddingBottom: 20,
  },
  safeArea: {
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchButton: {
    padding: 4,
  },
  walletSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  walletSelectorText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 18,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  vipButtonText: {
    color: '#F25D7E',
    fontWeight: 'bold',
    fontSize: 12,
  },
  calendarButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarActiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  calendarActiveText: {
    color: '#F25D7E',
    fontWeight: 'bold',
    fontSize: 12,
  },
  
  accountList: {
    paddingBottom: 10,
  },
  accountItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  accountIconWrapper: {
    marginBottom: 6,
  },
  accountIconBg: {
    width: 60,
    height: 60,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountName: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  addAccountBg: {
    width: 60,
    height: 60,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#FFF',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  addAccountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },

  /* Main Content Overlay */
  mainContentContainer: {
    flex: 1,
    backgroundColor: '#FFF0F5', 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 10,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24,
  },
  
  /* SUMMARY CARD (Standard) */
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#F25D7E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  watermarkContainer: {
    position: 'absolute',
    top: -20,
    left: -40,
    opacity: 0.08,
    transform: [{ rotate: '-10deg' }]
  },
  watermarkImage: {
    width: 180,
    height: 180,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  monthDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333',
    marginRight: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValueRed: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5252',
    marginBottom: 6,
  },
  statValueRedLight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8A80',
    marginBottom: 6,
  },
  statValueGreen: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 6,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#9E9E9E',
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionCircleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* CALENDAR CARD */
  calendarCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#F25D7E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
    textTransform: 'lowercase',
  },
  monthBadge: {
    backgroundColor: '#FFF0F4',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  monthBadgeText: {
    fontSize: 10,
    color: '#F25D7E',
    fontWeight: '600',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDayText: {
    fontSize: 12,
    color: '#BDBDBD',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  dayCell: {
    width: '14.28%', 
    alignItems: 'center',
    marginBottom: 10,
    minHeight: 40,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleSelected: {
    backgroundColor: '#FF8A80',
    shadowColor: '#F25D7E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  textRed: {
    color: '#FF5252',
  },
  textGreen: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  textWhite: {
    color: '#FFF',
  },
  dayExpenseText: {
    fontSize: 8,
    color: '#FF5252',
    marginTop: -2,
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 3,
    borderRadius: 4,
    fontWeight: '600',
    overflow: 'hidden',
  },
  
  filterTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  filterTabActive: {
    backgroundColor: '#FFF0F4',
  },
  filterTabText: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: '#F25D7E',
  },
  calendarStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  calStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  calStatValueRed: {
     fontSize: 14,
     fontWeight: '700',
     color: '#FF5252',
     marginBottom: 2,
  },
  calStatValueRedLight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF8A80',
    marginBottom: 2,
 },
  calStatValueGreen: {
     fontSize: 14,
     fontWeight: '700',
     color: '#4CAF50',
     marginBottom: 2,
  },
  calStatLabel: {
     fontSize: 9, 
     color: '#9E9E9E',
     fontWeight: '600',
  },

  /* Common Transactions */
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  dateTitle: {
    fontSize: 13,
    color: '#9E9E9E', 
    fontWeight: '500',
  },
  dateSummary: {
    flexDirection: 'row',
  },
  dateSummaryText: {
    fontSize: 11,
    color: '#9E9E9E',
  },
  
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  transIconBg: {
    width: 48,
    height: 48,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transContent: {
    flex: 1,
  },
  transTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  transSubtitle: {
    fontSize: 13,
    color: '#9E9E9E',
  },
  transAmount: {
    alignItems: 'flex-end',
  },
  amountGreen: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00C853',
    marginBottom: 2,
  },
  amountRed: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF5252',
    marginBottom: 2,
  },
  transAccount: {
    fontSize: 10,
    color: '#BDBDBD',
  },

  /* FAB */
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 20, 
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F25D7E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyState: {
      alignItems: 'center',
      padding: 20,
  },
  emptyStateText: {
      color: '#BDBDBD',
      fontStyle: 'italic',
  }
});
