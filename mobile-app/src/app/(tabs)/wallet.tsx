import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, Alert, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from "@/store/settings-context";

import { Colors } from "@/constants/theme";

const theme = Colors.light;

// --- Types ---
interface Wallet { id: string; name: string; balance: number; icon: string; color: string; type: string; }
interface Saving { id: string; name: string; balance: number; target: number; icon: string; }
interface GroupFund { id: string; name: string; balance: number; members: number; icon: string; }
interface Debt { id: string; name: string; amount: number; remaining: number; type: 'borrow' | 'lend'; to_other: string; }

// --- Initial Mock Data ---
const INITIAL_WALLETS: Wallet[] = [
  { id: '1', name: 'Tiền mặt', balance: 2500000, icon: 'cash', color: '#10B981', type: 'Cash' },
  { id: '2', name: 'Vietcombank', balance: 15450000, icon: 'bank', color: '#059669', type: 'Bank' },
  { id: '3', name: 'Momo', balance: 850000, icon: 'wallet', color: '#AF156A', type: 'E-Wallet' },
];

const INITIAL_SAVINGS: Saving[] = [
  { id: '1', name: 'Tiết kiệm mua xe', balance: 45000000, target: 120000000, icon: 'car-outline' },
  { id: '2', name: 'Quỹ khẩn cấp', balance: 10000000, target: 50000000, icon: 'shield-checkmark-outline' },
];

const INITIAL_GROUP_FUNDS: GroupFund[] = [
  { id: '1', name: 'Quỹ gia đình', balance: 25000000, members: 4, icon: 'home-group' },
  { id: '2', name: 'Quỹ ăn nhậu', balance: 1200000, members: 8, icon: 'glass-mug-variant' },
];

const INITIAL_DEBTS: Debt[] = [
  { id: '1', name: 'Vay mua laptop', amount: 8000000, remaining: 3500000, type: 'borrow', to_other: 'Nguyễn Văn A' },
  { id: '2', name: 'Cho mượn tiền ăn', amount: 500000, remaining: 500000, type: 'lend', to_other: 'Trần Thị B' },
];

// --- Helper Functions ---
const formatCurrency = (amount: number, config: { showSign?: boolean, showCurrency?: boolean, absolute?: boolean } = {}) => {
  const { showSign = false, showCurrency = true, absolute = false } = config;
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

export default function WalletScreen() {
  const { isBalanceVisible, toggleBalanceVisibility } = useSettings();
  const [wallets, setWallets] = useState<Wallet[]>(INITIAL_WALLETS);
  const [savings, setSavings] = useState<Saving[]>(INITIAL_SAVINGS);
  const [groupFunds, setGroupFunds] = useState<GroupFund[]>(INITIAL_GROUP_FUNDS);
  const [debts, setDebts] = useState<Debt[]>(INITIAL_DEBTS);

  // Modal states
  const [isModalVisible, setModalVisible] = useState(false);
  const [isTypeModalVisible, setTypeModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'wallet' | 'saving' | 'group' | 'debt' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState<any>({});

  const totalAssets = useMemo(() => {
    const walletTotal = wallets.reduce((sum, w) => sum + w.balance, 0);
    const savingsTotal = savings.reduce((sum, s) => sum + s.balance, 0);
    const groupTotal = groupFunds.reduce((sum, g) => sum + g.balance, 0);
    return walletTotal + savingsTotal + groupTotal;
  }, [wallets, savings, groupFunds]);

  const totalDebts = useMemo(() => {
    return debts.filter(d => d.type === 'borrow').reduce((sum, d) => sum + d.remaining, 0);
  }, [debts]);

  const totalLending = useMemo(() => {
    return debts.filter(d => d.type === 'lend').reduce((sum, d) => sum + d.remaining, 0);
  }, [debts]);

  const handleDelete = (type: string, id: string) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa mục này không?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa", 
          style: "destructive",
          onPress: () => {
            if (type === 'wallet') setWallets(prev => prev.filter(item => item.id !== id));
            if (type === 'saving') setSavings(prev => prev.filter(item => item.id !== id));
            if (type === 'group') setGroupFunds(prev => prev.filter(item => item.id !== id));
            if (type === 'debt') setDebts(prev => prev.filter(item => item.id !== id));
            setModalVisible(false);
          }
        }
      ]
    );
  };

  const openModal = (type: 'wallet' | 'saving' | 'group' | 'debt', item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || getInitialFormData(type));
    setModalVisible(true);
  };

  const getInitialFormData = (type: string) => {
    switch(type) {
      case 'wallet': return { name: '', balance: '0', icon: 'cash', color: '#10B981', type: 'Cash' };
      case 'saving': return { name: '', balance: '0', target: '0', icon: 'car-outline' };
      case 'group': return { name: '', balance: '0', members: '1', icon: 'home-group' };
      case 'debt': return { name: '', amount: '0', remaining: '0', type: 'borrow', to_other: '' };
      default: return {};
    }
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.name && modalType !== 'debt') return;
    
    const newItem = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now().toString(),
      balance: Number(formData.balance || 0),
      target: Number(formData.target || 0),
      amount: Number(formData.amount || 0),
      remaining: Number(formData.remaining || 0),
      members: Number(formData.members || 1),
    };

    if (modalType === 'wallet') {
      setWallets(prev => editingItem ? prev.map(w => w.id === newItem.id ? newItem : w) : [...prev, newItem]);
    } else if (modalType === 'saving') {
      setSavings(prev => editingItem ? prev.map(s => s.id === newItem.id ? newItem : s) : [...prev, newItem]);
    } else if (modalType === 'group') {
      setGroupFunds(prev => editingItem ? prev.map(g => g.id === newItem.id ? newItem : g) : [...prev, newItem]);
    } else if (modalType === 'debt') {
      setDebts(prev => editingItem ? prev.map(d => d.id === newItem.id ? newItem : d) : [...prev, newItem]);
    }

    setModalVisible(false);
  };

  const renderRightActions = (type: string, id: string, progress: Animated.AnimatedInterpolation<number>) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });

    return (
      <TouchableOpacity 
        onPress={() => handleDelete(type, id)}
        style={styles.deleteAction}
      >
        <Animated.View style={[styles.deleteActionContent, { transform: [{ translateX: trans }] }]}>
          <Text style={styles.deleteActionText}>Xóa</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Ví của tôi</Text>
            <TouchableOpacity style={styles.headerIconBtn}>
              <Ionicons name="notifications-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.totalBalanceCard}>
            <View style={styles.totalHeaderRow}>
               <Text style={styles.totalLabel}>TỔNG TÀI SẢN</Text>
               <TouchableOpacity onPress={toggleBalanceVisibility}>
                  <Ionicons name={isBalanceVisible ? "eye-outline" : "eye-off-outline"} size={18} color="#94A3B8" />
               </TouchableOpacity>
            </View>
            <Text style={styles.totalAmount}>{isBalanceVisible ? formatCurrency(totalAssets) : '******'}</Text>
            
            <View style={styles.balanceDivider} />
            
            <View style={styles.debtLendRow}>
              <View style={styles.debtItem}>
                <View style={styles.miniLabelRow}>
                   <View style={[styles.dot, {backgroundColor: '#EF4444'}]} />
                   <Text style={styles.debtLabel}>ĐI VAY</Text>
                </View>
                <Text style={styles.debtValue}>{isBalanceVisible ? formatCurrency(totalDebts) : '******'}</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.debtItem}>
                <View style={styles.miniLabelRow}>
                   <View style={[styles.dot, {backgroundColor: '#10B981'}]} />
                   <Text style={styles.lendLabel}>CHO VAY</Text>
                </View>
                <Text style={styles.lendValue}>{isBalanceVisible ? formatCurrency(totalLending) : '******'}</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Wallets Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tài khoản & Ví</Text>
        </View>

        {wallets.map(wallet => (
          <Swipeable
            key={wallet.id}
            renderRightActions={(progress) => renderRightActions('wallet', wallet.id, progress)}
            friction={2}
            rightThreshold={40}
          >
            <TouchableOpacity 
              style={styles.walletCard}
              onPress={() => openModal('wallet', wallet)}
            >
              <View style={[styles.iconBox, { backgroundColor: wallet.color + '10' }]}>
                <MaterialCommunityIcons name={wallet.icon as any} size={24} color={wallet.color} />
              </View>
              <View style={styles.walletInfo}>
                <Text style={styles.walletName}>{wallet.name}</Text>
                <Text style={styles.walletType}>{wallet.type}</Text>
              </View>
              <View style={styles.walletBalanceBox}>
                 <Text style={styles.walletBalance}>{isBalanceVisible ? formatCurrency(wallet.balance) : '******'}</Text>
              </View>
            </TouchableOpacity>
          </Swipeable>
        ))}

        {/* Group Funds Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quỹ nhóm</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupFundsScroll}>
          {groupFunds.map(group => (
            <Swipeable
              key={group.id}
              renderRightActions={(progress) => renderRightActions('group', group.id, progress)}
            >
              <TouchableOpacity 
                style={styles.groupCard}
                onPress={() => openModal('group', group)}
              >
                <View style={styles.groupIconBox}>
                  <MaterialCommunityIcons name={group.icon as any} size={24} color="#6366F1" />
                </View>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupBalance}>{isBalanceVisible ? formatCurrency(group.balance) : '******'}</Text>
                <View style={styles.groupMembers}>
                  <Ionicons name="people" size={12} color="#94A3B8" />
                  <Text style={styles.groupMembersText}>{group.members} thành viên</Text>
                </View>
              </TouchableOpacity>
            </Swipeable>
          ))}
        </ScrollView>

        {/* Savings Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sổ tiết kiệm</Text>
        </View>

          {savings.map(saving => {
            const progress = (saving.balance / saving.target) * 100;
            return (
              <Swipeable
                key={saving.id}
                renderRightActions={(progress) => renderRightActions('saving', saving.id, progress)}
              >
                <TouchableOpacity 
                  style={styles.savingsCard}
                  onPress={() => openModal('saving', saving)}
                >
                  <View style={styles.savingsTop}>
                    <View style={styles.savingsIconBox}>
                      <Ionicons name={saving.icon as any} size={20} color={theme.primary} />
                    </View>
                    <View style={styles.savingsNameBox}>
                      <Text style={styles.savingsName}>{saving.name}</Text>
                      <Text style={styles.savingsTarget}>Mục tiêu: {isBalanceVisible ? formatCurrency(saving.target) : '******'}</Text>
                    </View>
                    <View style={styles.rightActionCol}>
                       <Text style={styles.savingsBalance}>{isBalanceVisible ? formatCurrency(saving.balance) : '******'}</Text>
                    </View>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                  </View>
                  <View style={styles.savingsFooter}>
                     <Text style={styles.progressText}>{progress.toFixed(1)}%</Text>
                     <Text style={[styles.progressText, {color: '#64748B'}]}>Còn {formatCurrency(saving.target - saving.balance)}</Text>
                  </View>
                </TouchableOpacity>
              </Swipeable>
            );
          })}

        {/* Debts Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vay & Nợ</Text>
        </View>

        <View style={styles.debtsContainer}>
          {debts.map((debt, index) => (
            <Swipeable
              key={debt.id}
              renderRightActions={(progress) => renderRightActions('debt', debt.id, progress)}
            >
              <TouchableOpacity 
                style={[
                   styles.debtRow,
                   index === debts.length - 1 && { borderBottomWidth: 0 }
                ]}
                onPress={() => openModal('debt', debt)}
              >
                <View style={[
                  styles.debtTypeBadge, 
                  { backgroundColor: debt.type === 'borrow' ? '#FEF2F2' : '#ECFDF5' }
                ]}>
                  <Ionicons 
                    name={debt.type === 'borrow' ? "arrow-down-outline" : "arrow-up-outline"} 
                    size={14} 
                    color={debt.type === 'borrow' ? "#EF4444" : "#10B981"} 
                  />
                </View>
                <View style={styles.debtMainInfo}>
                  <Text style={styles.debtName}>{debt.name}</Text>
                  <Text style={styles.debtPerson}>{debt.type === 'borrow' ? 'Nợ' : 'Từ'}: {debt.to_other}</Text>
                </View>
                <View style={styles.debtAmountBox}>
                  <Text style={[
                    styles.debtAmount,
                    { color: debt.type === 'borrow' ? '#EF4444' : '#10B981' }
                  ]}>
                    {isBalanceVisible ? formatCurrency(debt.remaining) : '******'}
                  </Text>
                </View>
              </TouchableOpacity>
            </Swipeable>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setTypeModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* Type Selection Modal */}
      <Modal
        visible={isTypeModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setTypeModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setTypeModalVisible(false)}
        >
          <View style={styles.selectionMenu}>
            <Text style={styles.selectionTitle}>Bạn muốn thêm gì?</Text>
            
            <TouchableOpacity 
              style={styles.selectionItem} 
              onPress={() => { setTypeModalVisible(false); openModal('wallet'); }}
            >
              <View style={[styles.selectionIcon, {backgroundColor: '#EEF2FF'}]}>
                <Ionicons name="wallet-outline" size={24} color="#6366F1" />
              </View>
              <Text style={styles.selectionText}>Ví / Tài khoản mới</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.selectionItem} 
              onPress={() => { setTypeModalVisible(false); openModal('saving'); }}
            >
              <View style={[styles.selectionIcon, {backgroundColor: '#ECFDF5'}]}>
                <Ionicons name="save-outline" size={24} color="#10B981" />
              </View>
              <Text style={styles.selectionText}>Sổ tiết kiệm mới</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.selectionItem} 
              onPress={() => { setTypeModalVisible(false); openModal('group'); }}
            >
              <View style={[styles.selectionIcon, {backgroundColor: '#FEF3C7'}]}>
                <Ionicons name="people-outline" size={24} color="#D97706" />
              </View>
              <Text style={styles.selectionText}>Quỹ nhóm mới</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.selectionItem} 
              onPress={() => { setTypeModalVisible(false); openModal('debt'); }}
            >
              <View style={[styles.selectionIcon, {backgroundColor: '#FEF2F2'}]}>
                <Ionicons name="swap-horizontal-outline" size={24} color="#EF4444" />
              </View>
              <Text style={styles.selectionText}>Khoản vay / Nợ mới</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Form Modal */}
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
              <Text style={styles.modalTitle}>
                {editingItem ? 'Sửa' : 'Thêm'} {
                  modalType === 'wallet' ? 'Ví' : 
                  modalType === 'saving' ? 'Tiết kiệm' :
                  modalType === 'group' ? 'Quỹ nhóm' : 'Khoản vay/nợ'
                }
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalForm}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.inputLabel}>Tên gọi</Text>
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: Tiền mặt, Vietcombank..."
                value={formData.name}
                onChangeText={(val) => setFormData({...formData, name: val})}
              />

              {(modalType === 'wallet' || modalType === 'saving' || modalType === 'group') && (
                <>
                  <Text style={styles.inputLabel}>Số dư hiện tại</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    keyboardType="numeric"
                    value={formData.balance?.toString()}
                    onChangeText={(val) => setFormData({...formData, balance: val})}
                  />
                </>
              )}

              {modalType === 'saving' && (
                <>
                  <Text style={styles.inputLabel}>Mục tiêu cần đạt</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    keyboardType="numeric"
                    value={formData.target?.toString()}
                    onChangeText={(val) => setFormData({...formData, target: val})}
                  />
                </>
              )}

              {modalType === 'group' && (
                <>
                  <Text style={styles.inputLabel}>Số thành viên</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1"
                    keyboardType="numeric"
                    value={formData.members?.toString()}
                    onChangeText={(val) => setFormData({...formData, members: val})}
                  />
                </>
              )}

              {modalType === 'debt' && (
                <>
                  <Text style={styles.inputLabel}>Loại</Text>
                  <View style={styles.typeRow}>
                    <TouchableOpacity 
                      style={[styles.typeBtn, formData.type === 'borrow' && styles.typeBtnActive]} 
                      onPress={() => setFormData({...formData, type: 'borrow'})}
                    >
                      <Text style={[styles.typeBtnText, formData.type === 'borrow' && styles.typeBtnTextActive]}>Đi vay</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.typeBtn, formData.type === 'lend' && styles.typeBtnActive]} 
                      onPress={() => setFormData({...formData, type: 'lend'})}
                    >
                      <Text style={[styles.typeBtnText, formData.type === 'lend' && styles.typeBtnTextActive]}>Cho vay</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.inputLabel}>Đối tượng</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Tên người vay/cho vay"
                    value={formData.to_other}
                    onChangeText={(val) => setFormData({...formData, to_other: val})}
                  />

                  <Text style={styles.inputLabel}>Tổng số tiền</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    keyboardType="numeric"
                    value={formData.amount?.toString()}
                    onChangeText={(val) => setFormData({...formData, amount: val})}
                  />

                  <Text style={styles.inputLabel}>Số tiền còn lại</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    keyboardType="numeric"
                    value={formData.remaining?.toString()}
                    onChangeText={(val) => setFormData({...formData, remaining: val})}
                  />
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              {editingItem && (
                <TouchableOpacity 
                  style={styles.deleteBtnModal} 
                  onPress={() => handleDelete(modalType!, editingItem.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  <Text style={styles.deleteBtnModalText}>Xóa</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.saveBtn, editingItem && {flex: 1}]} onPress={handleSave}>
                <Text style={styles.saveBtnText}>{editingItem ? 'Cập nhật' : 'Lưu thay đổi'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    backgroundColor: theme.primary,
    paddingBottom: 30,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  safeArea: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalBalanceCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 20,
  },
  totalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  debtLendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  debtItem: {
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
  },
  debtLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  debtValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#EF4444',
  },
  lendLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  lendValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10B981',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  seeAllText: {
    fontSize: 14,
    color: theme.primary,
    fontWeight: '600',
  },
  addBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  walletType: {
    fontSize: 12,
    color: '#64748B',
  },
  walletBalanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionRowMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  deleteAction: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '85%', // Adjusted to not overlap rounding of cards
    alignSelf: 'center',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 12, // Match card margin
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
  rightActionCol: {
    alignItems: 'flex-end',
  },
  walletBalance: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  groupFundsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  groupCard: {
    backgroundColor: '#FFF',
    width: 160,
    padding: 16,
    borderRadius: 24,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    position: 'relative',
  },
  groupActions: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 6,
    zIndex: 10,
  },
  groupIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  groupBalance: {
    fontSize: 15,
    fontWeight: '800',
    color: '#6366F1',
    marginBottom: 8,
  },
  groupMembers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  groupMembersText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  savingsCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  savingsTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  savingsIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  savingsNameBox: {
    flex: 1,
  },
  savingsName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  savingsTarget: {
    fontSize: 11,
    color: '#64748B',
  },
  savingsBalance: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.primary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  savingsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debtsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 20,
  },
  debtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  debtTypeBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  debtMainInfo: {
    flex: 1,
  },
  debtName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  debtPerson: {
    fontSize: 12,
    color: '#64748B',
  },
  debtAmountBox: {
    alignItems: 'flex-end',
  },
  debtAmount: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  debtTotal: {
    fontSize: 10,
    color: '#94A3B8',
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
    fontWeight: '900',
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
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  typeBtnActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  typeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  typeBtnTextActive: {
    color: '#FFF',
  },
  saveBtn: {
    backgroundColor: theme.primary,
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  deleteBtnModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  deleteBtnModalText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
  /* FAB */
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  /* Selection Menu */
  selectionMenu: {
    backgroundColor: '#FFF',
    marginHorizontal: 24,
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 20,
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 20,
    textAlign: 'center',
  },
  selectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  selectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
});
