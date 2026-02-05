import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Alert, Animated, Dimensions, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from "@/store/settings-context";

import { Colors } from "@/constants/theme";

const { width } = Dimensions.get('window');
const theme = Colors.light;

// --- Types & Interfaces ---
interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  account: string;
  category: string;
  date: string;
}

interface DayData {
  day: number | null;
  dateStr: string;
  hasData?: boolean;
  dailyTotal?: number;
}

// --- Mock Data Generator (Giữ nguyên logic) ---
const generateMockData = (): Record<string, Transaction[]> => {
  const data: Record<string, Transaction[]> = {};
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const monthStr = month < 10 ? `0${month}` : `${month}`;

  const addTx = (day: number, title: string, sub: string, amt: number, cat: string, acc: string = 'Tài khoản mặc định') => {
    const dStr = day < 10 ? `0${day}` : `${day}`;
    const dateKey = `${year}-${monthStr}-${dStr}`;
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

  addTx(today.getDate(), 'Lương tháng 2', 'Công ty', 15500220, 'salary');
  addTx(today.getDate(), 'Bán đồ cũ', 'Chợ Tốt', 500000, 'bonus');
  addTx(today.getDate(), 'Tiền siêu thị', 'Chi tiêu hàng ngày', -250000, 'food');
  addTx(today.getDate(), 'Cafe Highlands', 'Daily', -55000, 'daily');
  addTx(today.getDate(), 'Đi ăn lẩu', 'Social', -450000, 'social');
  addTx(today.getDate(), 'Sửa xe', 'Transport', -120000, 'transport');
  addTx(today.getDate(), 'Mua quần áo', 'Clothes', -350000, 'clothes');
  addTx(today.getDate(), 'Netflix', 'Entertainment', -180000, 'ent');
  
  return data;
};

const INITIAL_MOCK_DATA = generateMockData();

// --- Helper Functions ---
const formatCurrency = (amount: number, config: { showSign?: boolean, showCurrency?: boolean, absolute?: boolean } = {}) => {
  const { showSign = true, showCurrency = true, absolute = false } = config;
  const val = absolute ? Math.abs(amount) : amount;
  const absVal = Math.abs(val);
  const formatted = absVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  let result = formatted;
  if (showCurrency) result = `${result} ₫`;
  if (showSign && !absolute) {
    result = `${val >= 0 ? '+' : '-'}${result}`;
  }
  
  return result;
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
  return new Date(year, month, 1).getDay();
};

export default function DashboardScreen() {
  const router = useRouter();
  const { isBalanceVisible, toggleBalanceVisibility } = useSettings();
  const now = new Date();
  const [viewDate, setViewDate] = useState(now);
  const [selectedDate, setSelectedDate] = useState(now);
  const [isCalendarMode, setIsCalendarMode] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'expense' | 'income'>('expense');

  // --- Transactions State ---
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>(INITIAL_MOCK_DATA);

  // --- Modal States ---
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formAmount, setFormAmount] = useState("");

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(viewMonth, viewYear);
  const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
  
  const currentMonthStr = `${viewMonth + 1}/${viewYear}`;

  const calendarGrid = useMemo(() => {
    const grid: DayData[] = [];
    for (let i = 0; i < firstDay; i++) {
        grid.push({ day: null, dateStr: '' });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const m = viewMonth + 1;
        const mStr = m < 10 ? `0${m}` : `${m}`;
        const dStr = d < 10 ? `0${d}` : `${d}`;
        const isoDate = `${viewYear}-${mStr}-${dStr}`;
        
        const dayTxs = transactions[isoDate] || [];
        const total = dayTxs.reduce((acc: number, curr: Transaction) => acc + curr.amount, 0);

        grid.push({
            day: d,
            dateStr: isoDate,
            hasData: dayTxs.length > 0,
            dailyTotal: dayTxs.length > 0 ? total : undefined
        });
    }
    return grid;
  }, [viewMonth, viewYear, transactions]);

  const monthlyStats = useMemo(() => {
      let income = 0;
      let expense = 0;
      Object.keys(transactions).forEach(key => {
          const [y, m] = key.split('-');
          if (parseInt(y) === viewYear && parseInt(m) === viewMonth + 1) {
              transactions[key].forEach((tx: Transaction) => {
                  if (tx.amount > 0) income += tx.amount;
                  else expense += tx.amount;
              });
          }
      });
      return { income, expense, total: income + expense };
  }, [viewYear, viewMonth, transactions]);

  const selectedDateStr = useMemo(() => {
     const y = selectedDate.getFullYear();
     const m = selectedDate.getMonth() + 1;
     const d = selectedDate.getDate();
     return `${y}-${m < 10 ? `0${m}` : `${m}`}-${d < 10 ? `0${d}` : `${d}`}`;
  }, [selectedDate]);

  const selectedTransactions = transactions[selectedDateStr] || [];
  
  const selectedDaySummary = useMemo(() => {
     let inc = 0; let exp = 0;
     selectedTransactions.forEach((t: Transaction) => {
         if (t.amount > 0) inc += t.amount;
         else exp += t.amount;
     });
     return { inc, exp };
  }, [selectedTransactions]);

  // --- Transaction Actions ---
  const handleEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setFormTitle(tx.title);
    setFormSubtitle(tx.subtitle || "");
    setFormAmount(Math.abs(tx.amount).toString());
    setModalVisible(true);
  };

  const handleDelete = (id: string, dateStr: string) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa giao dịch này không?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa", 
          style: "destructive",
          onPress: () => {
            setTransactions(prev => {
              const newData = { ...prev };
              newData[dateStr] = newData[dateStr].filter(tx => tx.id !== id);
              return newData;
            });
          }
        }
      ]
    );
  };

  const handleSave = () => {
    if (!editingTx) return;
    
    setTransactions(prev => {
      const dateStr = editingTx.date;
      const newData = { ...prev };
      
      newData[dateStr] = newData[dateStr].map(tx => {
        if (tx.id === editingTx.id) {
          const isExpense = tx.amount < 0;
          const newAmount = Number(formAmount) * (isExpense ? -1 : 1);
          return {
            ...tx,
            title: formTitle,
            subtitle: formSubtitle,
            amount: newAmount
          };
        }
        return tx;
      });
      
      return newData;
    });
    
    setModalVisible(false);
    setEditingTx(null);
  };

  const renderRightActions = (id: string, dateStr: string, progress: Animated.AnimatedInterpolation<number>) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });

    return (
      <TouchableOpacity 
        onPress={() => handleDelete(id, dateStr)}
        style={styles.deleteAction}
      >
        <Animated.View style={[styles.deleteActionContent, { transform: [{ translateX: trans }] }]}>
          <Text style={styles.deleteActionText}>Xóa</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const handlePrevMonth = () => setViewDate(new Date(viewYear, viewMonth - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewYear, viewMonth + 1, 1));
  const handleDateSelect = (day: number) => setSelectedDate(new Date(viewYear, viewMonth, day));
  const toggleViewMode = () => setIsCalendarMode(!isCalendarMode);

  const weekDays = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* StatusBar style="light" vì header màu xanh đậm */}
        <StatusBar style="light" />
        
        {/* Header Container */}
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

                {isCalendarMode ? (
                    <TouchableOpacity style={styles.calendarActiveButton} onPress={toggleViewMode}>
                        <Ionicons name="calendar" size={16} color={Colors.light.primary} />
                        <Text style={styles.calendarActiveText}>Lịch</Text>
                    </TouchableOpacity>
                ) : (
                      <TouchableOpacity style={styles.calendarButton} onPress={toggleViewMode}>
                        <Ionicons name="calendar" size={20} color="#FFF" />
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
                    <View style={styles.accountIconBg}>
                      <MaterialCommunityIcons 
                        name="piggy-bank" 
                        size={28} 
                        color={Colors.light.primary} 
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
                      <Ionicons name="chevron-back" size={24} color={Colors.light.primary} />
                    </TouchableOpacity>
                    
                    <View style={styles.calendarTitleRow}>
                        <Text style={styles.calendarTitle}>tháng {viewMonth + 1} năm {viewYear}</Text>
                        <View style={styles.monthBadge}>
                          <Text style={styles.monthBadgeText}>Month</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={handleNextMonth}>
                      <Ionicons name="chevron-forward" size={24} color={Colors.light.primary} />
                    </TouchableOpacity>
                </View>

                {/* Week Days */}
                <View style={styles.weekRow}>
                    {weekDays.map((day, index) => (
                        <Text key={index} style={[
                          styles.weekDayText, 
                          (index === 0 || index === 6) && styles.textError
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
                                        (index % 7 === 0 || index % 7 === 6) && styles.textError,
                                        isSelected && styles.textWhite
                                    ]}>{item.day}</Text>
                                </View>
                                {item.dailyTotal !== undefined && (
                                    <Text style={[
                                        styles.dayExpenseText,
                                        isSelected && { color: '#FFF', backgroundColor: 'rgba(255,255,255,0.2)' }
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
                        <Text style={styles.calStatValueMain}>
                            {isBalanceVisible ? formatCurrency(monthlyStats.total) : '******'}
                        </Text>
                        <Text style={styles.calStatLabel}>TOÀN BỘ</Text>
                      </View>
                      <View style={styles.calStatItem}>
                        <Text style={styles.calStatValueGreen}>
                            {isBalanceVisible ? formatCurrency(monthlyStats.income) : '******'}
                        </Text>
                        <Text style={styles.calStatLabel}>THU NHẬP</Text>
                      </View>
                      <View style={styles.calStatItem}>
                        <Text style={styles.calStatValueRed}>
                            {isBalanceVisible ? formatCurrency(Math.abs(monthlyStats.expense)) : '******'}
                        </Text>
                        <Text style={styles.calStatLabel}>CHI TIÊU</Text>
                      </View>
                  </View>
              </View>

            ) : (
              /* ================= DASHBOARD MODE ================= */
              <View style={styles.summaryCard}>

                <View style={styles.monthSelector}>
                    <TouchableOpacity onPress={handlePrevMonth}>
                      <Ionicons name="chevron-back" size={20} color={Colors.light.icon} />
                    </TouchableOpacity>
                    <View style={styles.monthDisplay}>
                      <Text style={styles.monthText}>{currentMonthStr}</Text>
                      <Ionicons name="caret-down" size={12} color={Colors.light.primary} style={{marginLeft: 4}} />
                    </View>
                    <TouchableOpacity onPress={handleNextMonth}>
                      <Ionicons name="chevron-forward" size={20} color={Colors.light.icon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.statsRow}>
                    {/* Left: Total Balance */}
                    <View style={styles.statItemMain}>
                      <Text style={styles.statValueMain} numberOfLines={1} adjustsFontSizeToFit>
                          {isBalanceVisible ? formatCurrency(monthlyStats.total, { showSign: monthlyStats.total < 0 }) : '******'}
                      </Text>
                      <View style={styles.statLabelRow}>
                          <MaterialCommunityIcons name="wallet-outline" size={14} color="#64748B" />
                          <Text style={styles.statLabel}>SỐ DƯ TỔNG</Text>
                      </View>
                    </View>
                    
                    {/* Right: Income & Expense stacked */}
                    <View style={styles.rightStatsCol}>
                      <View style={styles.statItemSubRight}>
                        <Text style={styles.statValueIncomeSmall} numberOfLines={1} adjustsFontSizeToFit>
                            {isBalanceVisible ? formatCurrency(monthlyStats.income, { absolute: true }) : '******'}
                        </Text>
                        <View style={styles.statLabelRow}>
                            <Ionicons name="arrow-down-circle" size={12} color="#059669" />
                            <Text style={[styles.statLabelSmall, {color: '#059669'}]}>THU NHẬP</Text>
                        </View>
                      </View>

                      <View style={styles.statItemSubRight}>
                        <Text style={styles.statValueExpenseSmall} numberOfLines={1} adjustsFontSizeToFit>
                            {isBalanceVisible ? formatCurrency(monthlyStats.expense, { absolute: true }) : '******'}
                        </Text>
                        <View style={styles.statLabelRow}>
                            <Ionicons name="arrow-up-circle" size={12} color="#DC2626" />
                            <Text style={[styles.statLabelSmall, {color: '#DC2626'}]}>CHI TIÊU</Text>
                        </View>
                      </View>
                    </View>
                </View>

                <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.actionCircleButton}>
                      <Ionicons name="mail-outline" size={14} color="#6366F1" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCircleButton} onPress={toggleBalanceVisibility}>
                      <Ionicons name={isBalanceVisible ? "eye-outline" : "eye-off-outline"} size={14} color="#6366F1" />
                    </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ================= TRANSACTION LIST ================= */}
            <View style={styles.transactionsHeaderRow}>
              <Text style={styles.recentTransactionsTitle}>Giao dịch gần đây</Text>
              <TouchableOpacity><Text style={styles.seeMoreLink}>Xem thêm</Text></TouchableOpacity>
            </View>

            {/* Segment Control (Chi/Thu) */}
            <View style={styles.segmentControlContainer}>
              <TouchableOpacity 
                style={[
                  styles.segmentButton, 
                  activeCategoryTab === 'expense' && styles.segmentButtonActive
                ]}
                onPress={() => setActiveCategoryTab('expense')}
              >
                <Text style={[
                  styles.segmentText,
                  activeCategoryTab === 'expense' && styles.segmentTextActive
                ]}>Chi</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.segmentButton, 
                  activeCategoryTab === 'income' && styles.segmentButtonActive
                ]}
                onPress={() => setActiveCategoryTab('income')}
              >
                <Text style={[
                  styles.segmentText,
                  activeCategoryTab === 'income' && styles.segmentTextActive
                ]}>Thu</Text>
              </TouchableOpacity>
            </View>

            {selectedTransactions.filter(tx => 
              activeCategoryTab === 'expense' ? tx.amount < 0 : tx.amount > 0
            ).length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>Không có giao dịch {activeCategoryTab === 'expense' ? 'chi tiêu' : 'thu nhập'}</Text>
                </View>
            ) : (
                selectedTransactions
                  .filter(tx => activeCategoryTab === 'expense' ? tx.amount < 0 : tx.amount > 0)
                  .map((tx) => (
                  <Swipeable
                    key={tx.id}
                    renderRightActions={(progress) => renderRightActions(tx.id, tx.date, progress)}
                    friction={2}
                    rightThreshold={40}
                  >
                    <TouchableOpacity 
                      style={styles.transactionCard}
                      onPress={() => handleEdit(tx)}
                    >
                        <View style={[styles.transIconBg, {
                            backgroundColor: 
                              tx.category === 'salary' ? '#ECFDF5' : 
                              tx.category === 'bonus' ? '#FFFBEB' :
                              tx.category === 'food' ? '#FFF1F2' : 
                              tx.category === 'daily' ? '#F8FAFC' :
                              tx.category === 'social' ? '#FDF2F8' :
                              tx.category === 'transport' ? '#EEF2FF' :
                              tx.category === 'clothes' ? '#F0FDFA' :
                              tx.category === 'ent' ? '#FFF1F2' : '#F1F5F9'
                        }]}>
                            {tx.category === 'salary' && <MaterialCommunityIcons name="cash-multiple" size={24} color="#10B981" />}
                            {tx.category === 'bonus' && <MaterialCommunityIcons name="sack" size={24} color="#F59E0B" />}
                            {tx.category === 'food' && <MaterialCommunityIcons name="hamburger" size={24} color="#F43F5E" />}
                            {tx.category === 'daily' && <MaterialCommunityIcons name="coffee" size={24} color="#64748B" />}
                            {tx.category === 'social' && <MaterialCommunityIcons name="glass-wine" size={24} color="#EC4899" />}
                            {tx.category === 'transport' && <MaterialCommunityIcons name="bus" size={24} color="#6366F1" />}
                            {tx.category === 'clothes' && <MaterialCommunityIcons name="tshirt-crew" size={24} color="#14B8A6" />}
                            {tx.category === 'ent' && <MaterialCommunityIcons name="movie" size={24} color="#F43F5E" />}
                        </View>
                        <View style={styles.transContent}>
                            <Text style={styles.transTitle}>{tx.title}</Text>
                            <Text style={styles.transSubtitle}>{tx.subtitle}</Text>
                        </View>
                        <View style={styles.transAmountCol}>
                            <Text style={styles.transDateText}>{tx.date.split('-').reverse().join('/')}</Text>
                              <Text 
                                style={[
                                  styles.transactionAmountText,
                                  { color: tx.amount > 0 ? '#059669' : '#DC2626' }
                                ]}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                              >
                                  {isBalanceVisible ? formatCurrency(tx.amount, { showSign: true, showCurrency: false }) : '******'}
                              </Text>
                        </View>
                    </TouchableOpacity>
                  </Swipeable>
                ))
            )}

            <View style={{height: 80}} />
          </ScrollView>
        </View>

        {/* Floating Action Button - Sky Blue */}
        <TouchableOpacity 
            style={styles.fab} 
            onPress={() => router.push("/add-transaction")}
        >
          {isCalendarMode ? (
              <MaterialCommunityIcons name="pencil" size={24} color="#FFF" /> 
          ) : (
              <MaterialIcons name="edit" size={24} color="#FFF" />
          )}
        </TouchableOpacity>

        {/* Edit Transaction Modal */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Sửa giao dịch</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#1E293B" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.modalForm}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.inputLabel}>Tên giao dịch</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ví dụ: Tiền siêu thị..."
                  value={formTitle}
                  onChangeText={setFormTitle}
                />

                <Text style={styles.inputLabel}>Ghi chú</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ví dụ: Mua đồ ăn tối..."
                  value={formSubtitle}
                  onChangeText={setFormSubtitle}
                />

                <Text style={styles.inputLabel}>Số tiền</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  value={formAmount}
                  onChangeText={setFormAmount}
                />
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.deleteBtnModal} 
                  onPress={() => handleDelete(editingTx?.id || "", editingTx?.date || "")}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  <Text style={styles.deleteBtnModalText}>Xóa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveBtnText}>Cập nhật</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}

// --- REFACTORED STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.primary, // Xanh chủ đạo
  },
  headerContainer: {
    backgroundColor: Colors.light.primary, // Xanh chủ đạo
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
    color: Colors.light.primary, // Chữ xanh trên nền trắng
    fontWeight: 'bold',
    fontSize: 12,
  },
  calendarButton: {
    backgroundColor: 'rgba(255,255,255,0.2)', // Translucent White
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
    color: Colors.light.primary,
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
    shadowColor: '#000', // Đổi shadow sang đen/xám
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
    borderColor: 'rgba(255,255,255,0.6)',
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
    backgroundColor: Colors.light.inputBg, // Màu nền Clean (Xám rất nhạt)
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
  
  /* SUMMARY CARD */
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F8FAFC',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 12,
  },
  monthDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statItemMain: {
    flex: 1.5,
    alignItems: 'flex-start',
  },
  statValueMain: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 6,
  },
  rightStatsCol: {
    flex: 1.1,
    alignItems: 'flex-end',
    gap: 14,
  },
  statItemSubRight: {
    alignItems: 'flex-end',
  },
  statValueIncomeSmall: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
    marginBottom: 2,
  },
  statValueExpenseSmall: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 2,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statLabelSmall: {
    fontSize: 8,
    color: '#94A3B8',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    backgroundColor: Colors.light.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* CALENDAR CARD */
  calendarCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.border,
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
    color: Colors.light.textMain,
    textTransform: 'lowercase',
  },
  monthBadge: {
    backgroundColor: Colors.light.primaryLight, // Nền badge xanh nhạt
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  monthBadgeText: {
    fontSize: 10,
    color: Colors.light.primaryDark, // Chữ badge xanh đậm
    fontWeight: '600',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDayText: {
    fontSize: 12,
    color: Colors.light.textSub,
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
    backgroundColor: Colors.light.primary, // Selected = Sky Blue
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  dayText: {
    fontSize: 14,
    color: Colors.light.textMain,
    fontWeight: '600',
  },
  textError: {
    color: Colors.light.error,
  },
  textGreen: {
    color: Colors.light.success,
    fontWeight: 'bold',
  },
  textRed: {
    color: Colors.light.error,
    fontWeight: 'bold',
  },
  textWhite: {
    color: '#FFF',
  },
  dayExpenseText: {
    fontSize: 8,
    color: Colors.light.error,
    marginTop: -2,
    backgroundColor: '#FFEBEE', // Giữ nền đỏ rất nhạt cho text chi tiêu
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
    backgroundColor: Colors.light.inputBg,
  },
  filterTabActive: {
    backgroundColor: Colors.light.primaryLight,
  },
  filterTabText: {
    fontSize: 12,
    color: Colors.light.textSub,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: Colors.light.primaryDark,
  },
  calendarStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  calStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  calStatValueMain: {
     fontSize: 14,
     fontWeight: '700',
     color: Colors.light.textMain,
     marginBottom: 2,
  },
  calStatValueRed: {
     fontSize: 14,
     fontWeight: '700',
     color: Colors.light.error,
     marginBottom: 2,
  },
  calStatValueGreen: {
     fontSize: 14,
     fontWeight: '700',
     color: Colors.light.success,
     marginBottom: 2,
  },
  calStatLabel: {
     fontSize: 9, 
     color: Colors.light.textSub,
     fontWeight: '600',
  },

  /* Common Transactions Header */
  transactionsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  recentTransactionsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.textMain,
  },
  seeMoreLink: {
    fontSize: 14,
    color: '#93C5FD',
    fontWeight: '600',
  },

  /* Segment Control */
  segmentControlContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentButtonActive: {
    backgroundColor: Colors.light.primary,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textSub,
  },
  segmentTextActive: {
    color: '#FFF',
  },
  
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F8FAFC',
  },
  transIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transContent: {
    flex: 1,
    paddingRight: 8,
  },
  transTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  transSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  transAmountCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 100,
  },
  transDateText: {
    fontSize: 10,
    color: theme.placeholder,
    marginBottom: 4,
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'System',
    letterSpacing: -0.2,
  },

  /* Swipe Actions */
  deleteAction: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '85%',
    alignSelf: 'center',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 12,
  },
  deleteActionContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteActionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  modalForm: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 20,
  },
  deleteBtnModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 8,
  },
  deleteBtnModalText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  /* FAB */
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 20, 
    backgroundColor: Colors.light.primary, // FAB cũng theo màu Sky Blue
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyState: {
     alignItems: 'center',
     padding: 20,
  },
  emptyStateText: {
     color: Colors.light.placeholder,
     fontStyle: 'italic',
  }
});