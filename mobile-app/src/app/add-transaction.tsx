import { Colors } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity, // Import Modal
  TouchableWithoutFeedback // Import để đóng modal khi click ra ngoài
  ,







  View,
  ViewStyle
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars'; // Import Calendar
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Mock Categories ---
const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Diet', icon: 'hamburger', color: '#FBC02D', bg: '#FFF8E1' },
  { id: 'daily', name: 'Daily', icon: 'coffee', color: '#8D6E63', bg: '#D7CCC8' },
  { id: 'transport', name: 'Transport', icon: 'bus', color: '#5C6BC0', bg: '#E8EAF6' },
  { id: 'social', name: 'Social', icon: 'glass-wine', color: '#EC407A', bg: '#FCE4EC' },
  { id: 'home', name: 'Residents', icon: 'home', color: '#78909C', bg: '#ECEFF1' },
  { id: 'gift', name: 'Gift', icon: 'gift', color: '#AB47BC', bg: '#F3E5F5' },
  { id: 'comm', name: 'Communication', icon: 'phone', color: '#42A5F5', bg: '#E3F2FD' },
  { id: 'clothes', name: 'Clothes', icon: 'tshirt-crew', color: '#26A69A', bg: '#E0F2F1' },
  { id: 'ent', name: 'Entertainment', icon: 'movie', color: '#EF5350', bg: '#FFEBEE' },
  { id: 'beauty', name: 'Beauty', icon: 'lipstick', color: '#FFA726', bg: '#FFF3E0' },
  { id: 'health', name: 'Medical', icon: 'medical-bag', color: '#66BB6A', bg: '#E8F5E9' },
  { id: 'tax', name: 'Tax', icon: 'cash', color: '#8D6E63', bg: '#EFEBE9' },
];

const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', icon: 'cash-multiple', color: '#66BB6A', bg: '#E8F5E9' },
  { id: 'bonus', name: 'Bonus', icon: 'sack', color: '#FFA726', bg: '#FFF3E0' },
  { id: 'invest', name: 'Investment', icon: 'finance', color: '#29B6F6', bg: '#E1F5FE' },
  { id: 'parttime', name: 'Part-time', icon: 'laptop', color: '#7E57C2', bg: '#EDE7F6' },
];

export default function AddTransactionScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [selectedCategory, setSelectedCategory] = useState<string>('food');
  const [amountStr, setAmountStr] = useState('0');
  const [note, setNote] = useState('');

  // --- STATE CHO LỊCH ---
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  // Ngày được chọn (Format: YYYY-MM-DD cho Calendar component)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const categories = activeTab === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // Hàm hiển thị text trên nút (VD: TODAY hoặc 02/02)
  const getDisplayDate = () => {
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate === today) return 'TODAY';
    
    // Format lại thành DD/MM để hiển thị đẹp hơn
    const [year, month, day] = selectedDate.split('-');
    return `${day}/${month}`;
  };

  const formatDisplayAmount = (value: string) => {
    if (!isNaN(Number(value))) {
        return Number(value).toLocaleString('en-US');
    }
    return value;
  };

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setAmountStr(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
      return;
    }
    if (amountStr === '0' && !isNaN(Number(key))) {
      setAmountStr(key);
    } else {
      setAmountStr(prev => prev + key);
    }
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    setCalendarVisible(false); // Đóng lịch sau khi chọn
  };

  const handleSave = () => {
    console.log("Saving transaction for date:", selectedDate);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="close" size={24} color={Colors.light.primary} />
        </TouchableOpacity>

        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'expense' && styles.tabActive]}
            onPress={() => { setActiveTab('expense'); setSelectedCategory('food'); }}
          >
            {activeTab === 'expense' && <MaterialCommunityIcons name="cash-minus" size={14} color="#FFF" style={{marginRight: 4}} />}
            <Text style={[styles.tabText, activeTab === 'expense' && styles.tabTextActive]}>Expense</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'income' && styles.tabActive]}
            onPress={() => { setActiveTab('income'); setSelectedCategory('salary'); }}
          >
            {activeTab === 'income' && <MaterialCommunityIcons name="cash-plus" size={14} color="#FFF" style={{marginRight: 4}} />}
            <Text style={[styles.tabText, activeTab === 'income' && styles.tabTextActive]}>Income</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleSave} style={styles.iconButton}>
          <Ionicons name="checkmark" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      {/* --- SUB HEADER --- */}
      <View style={styles.subHeader}>
        <TouchableOpacity style={styles.subTabActive}>
          <MaterialCommunityIcons name="star-four-points" size={14} color={Colors.light.primary} />
          <Text style={styles.subTabTextActive}>Suggested</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.subTab}>
          <MaterialCommunityIcons name="file-cabinet" size={14} color={Colors.light.textSub} />
          <Text style={styles.subTabText}>Uncategorized</Text>
        </TouchableOpacity>
      </View>

      {/* --- CATEGORIES GRID --- */}
      <ScrollView contentContainerStyle={styles.gridContainer} style={styles.scrollView}>
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat.id} 
            style={styles.catItem}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <View style={[
              styles.catIconBg, 
              { backgroundColor: cat.bg },
              selectedCategory === cat.id && styles.catIconBgSelected
            ]}>
              <MaterialCommunityIcons name={cat.icon as any} size={28} color={cat.color} />
            </View>
            <Text style={[
              styles.catName,
              selectedCategory === cat.id && styles.catNameSelected
            ]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* --- CALCULATOR / KEYPAD AREA --- */}
      <View style={styles.keypadContainer}>
        {/* Input Row */}
        <View style={styles.inputRow}>
          <View style={styles.walletBadge}>
            <Ionicons name="card" size={20} color={Colors.light.primaryDark} />
          </View>
          <TextInput 
            style={styles.noteInput} 
            value={note}
            onChangeText={setNote}
            placeholder="Note"
            placeholderTextColor={Colors.light.placeholder}
          />
          <View style={styles.amountDisplay}>
            <Text style={styles.amountText}>{formatDisplayAmount(amountStr)}</Text>
          </View>
        </View>

        {/* Toolbar Row */}
        <View style={styles.toolbarRow}>
          <TouchableOpacity style={styles.toolBtn}>
            <MaterialCommunityIcons name="emoticon-outline" size={20} color="#FBC02D" />
          </TouchableOpacity>
          
          {/* --- NÚT CHỌN NGÀY --- */}
          <TouchableOpacity 
            style={styles.dateBtn} 
            onPress={() => setCalendarVisible(true)} // Mở modal khi click
          >
            <Text style={styles.dateBtnText}>{getDisplayDate()}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolBtn}>
            <Ionicons name="close" size={24} color={Colors.light.surface} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn} onPress={handleSave}>
            <Ionicons name="checkmark-done" size={20} color={Colors.light.surface} />
          </TouchableOpacity>
        </View>

        {/* Keypad Grid */}
        <View style={styles.keysGrid}>
          <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('*')}><Text style={styles.keyText}>x</Text></TouchableOpacity>
          <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('7')}><Text style={styles.keyText}>7</Text></TouchableOpacity>
          <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('8')}><Text style={styles.keyText}>8</Text></TouchableOpacity>
          <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('9')}><Text style={styles.keyText}>9</Text></TouchableOpacity>
          
          <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('/')}><Text style={styles.keyText}>/</Text></TouchableOpacity>
          <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('4')}><Text style={styles.keyText}>4</Text></TouchableOpacity>
          <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('5')}><Text style={styles.keyText}>5</Text></TouchableOpacity>
          <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('6')}><Text style={styles.keyText}>6</Text></TouchableOpacity>

          <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('-')}><Text style={styles.keyText}>-</Text></TouchableOpacity>
          <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('1')}><Text style={styles.keyText}>1</Text></TouchableOpacity>
          <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('2')}><Text style={styles.keyText}>2</Text></TouchableOpacity>
          <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('3')}><Text style={styles.keyText}>3</Text></TouchableOpacity>

          <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('+')}><Text style={styles.keyText}>+</Text></TouchableOpacity>
          <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('.')}><Text style={styles.keyText}>.</Text></TouchableOpacity>
          <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('0')}><Text style={styles.keyText}>0</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.key, styles.backspaceKey]} onPress={() => handleKeyPress('backspace')}>
            <MaterialCommunityIcons name="backspace-outline" size={20} color={Colors.light.primaryDark} />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- CALENDAR MODAL --- */}
      <Modal
        visible={isCalendarVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setCalendarVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.calendarContainer}>
                {/* Tiêu đề Modal */}
                <View style={styles.calendarHeader}>
                  <MaterialCommunityIcons name="menu" size={24} color={Colors.light.textSub} />
                  <Text style={styles.calendarTitle}>
                    {getDisplayDate() === 'TODAY' ? 'TODAY' : getDisplayDate()}
                  </Text>
                  <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                    <Ionicons name="checkmark-circle" size={28} color={Colors.light.primary} />
                  </TouchableOpacity>
                </View>
                
                {/* Lịch */}
                <Calendar
                  current={selectedDate}
                  onDayPress={handleDayPress}
                  theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: Colors.light.textSub,
                    selectedDayBackgroundColor: Colors.light.primary,
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: Colors.light.primary,
                    dayTextColor: '#2d4150',
                    textDisabledColor: '#d9e1e8',
                    dotColor: Colors.light.primary,
                    selectedDotColor: '#ffffff',
                    arrowColor: Colors.light.textMain,
                    monthTextColor: Colors.light.textMain,
                    indicatorColor: Colors.light.primary,
                    textDayFontWeight: '400',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '500',
                    textDayFontSize: 16,
                    textMonthFontSize: 18,
                    textDayHeaderFontSize: 14
                  }}
                  markedDates={{
                    [selectedDate]: {
                      marked: true,
                      dotColor: 'orange',
                      selected: true,
                      selectedColor: '#E0F2FE',
                    },
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  } as ViewStyle,
  // ... (Giữ nguyên các style cũ của bạn)
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  } as ViewStyle,
  iconButton: {
    padding: 8,
  } as ViewStyle,
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  } as ViewStyle,
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  tabActive: {
    backgroundColor: Colors.light.primary, 
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.tabIconDefault,
  } as TextStyle,
  tabTextActive: {
    color: '#FFF',
  } as TextStyle,
  subHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 16,
  } as ViewStyle,
  subTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.inputBg,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
  } as ViewStyle,
  subTabActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD', 
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
  } as ViewStyle,
  subTabText: {
    fontSize: 12,
    fontWeight: '500', 
    color: Colors.light.textSub,
  } as TextStyle,
  subTabTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
  } as TextStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  gridContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  catItem: {
    width: '23%', 
    alignItems: 'center',
    marginBottom: 20,
  } as ViewStyle,
  catIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  } as ViewStyle,
  catIconBgSelected: {
    borderWidth: 2,
    borderColor: Colors.light.primary,
  } as ViewStyle,
  catName: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.light.textMain,
  } as TextStyle,
  catNameSelected: {
    fontWeight: '700',
    color: Colors.light.primary,
  } as TextStyle,
  keypadContainer: {
    backgroundColor: Colors.light.primary, 
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    paddingBottom: 24,
  } as ViewStyle,
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 8,
    marginBottom: 12,
  } as ViewStyle,
  walletBadge: {
    backgroundColor: '#E3F2FD',
    padding: 6,
    borderRadius: 8,
    marginRight: 12,
  } as ViewStyle,
  noteInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.textMain,
  } as TextStyle,
  amountDisplay: {
    alignItems: 'flex-end',
  } as ViewStyle,
  amountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.textMain,
  } as TextStyle,
  toolbarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  } as ViewStyle,
  toolBtn: {
    width: 48, 
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  dateBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 36,
    justifyContent: 'center',
  } as ViewStyle,
  dateBtnText: {
    fontSize: 12, 
    fontWeight: '700',
    color: '#FFF', 
  } as TextStyle,
  keysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  } as ViewStyle,
  key: {
    width: '23%', 
    height: 44,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 2,
  } as ViewStyle,
  backspaceKey: {
    backgroundColor: Colors.light.primaryLight,
  } as ViewStyle,
  keyText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.textMain,
  } as TextStyle,

  /* --- STYLE MỚI CHO MODAL & CALENDAR --- */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền tối mờ
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  calendarContainer: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  } as ViewStyle,
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 8,
  } as ViewStyle,
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textMain,
    textTransform: 'uppercase',
  } as TextStyle,
});