import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Mock Categories ---
const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Chế độ ăn', icon: 'hamburger', color: '#FBC02D', bg: '#FFF8E1' },
  { id: 'daily', name: 'Hằng ngày', icon: 'coffee', color: '#8D6E63', bg: '#D7CCC8' },
  { id: 'transport', name: 'Giao thông', icon: 'bus', color: '#5C6BC0', bg: '#E8EAF6' },
  { id: 'social', name: 'Xã hội', icon: 'glass-wine', color: '#EC407A', bg: '#FCE4EC' },
  { id: 'home', name: 'Dân cư', icon: 'home', color: '#78909C', bg: '#ECEFF1' },
  { id: 'gift', name: 'Quà tặng', icon: 'gift', color: '#AB47BC', bg: '#F3E5F5' },
  { id: 'comm', name: 'Giao tiếp', icon: 'phone', color: '#42A5F5', bg: '#E3F2FD' },
  { id: 'clothes', name: 'Quần áo', icon: 'tshirt-crew', color: '#26A69A', bg: '#E0F2F1' },
  { id: 'ent', name: 'Giải trí', icon: 'movie', color: '#EF5350', bg: '#FFEBEE' },
  { id: 'beauty', name: 'Sắc đẹp', icon: 'lipstick', color: '#FFA726', bg: '#FFF3E0' },
  { id: 'health', name: 'Y khoa', icon: 'medical-bag', color: '#66BB6A', bg: '#E8F5E9' },
  { id: 'tax', name: 'Thuế', icon: 'cash', color: '#8D6E63', bg: '#EFEBE9' },
];

const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Tiền công', icon: 'cash-multiple', color: '#66BB6A', bg: '#E8F5E9' },
  { id: 'bonus', name: 'Tiền thưởng', icon: 'sack', color: '#FFA726', bg: '#FFF3E0' },
  { id: 'invest', name: 'Đầu tư', icon: 'finance', color: '#29B6F6', bg: '#E1F5FE' },
  { id: 'parttime', name: 'Bán thời gian', icon: 'laptop', color: '#7E57C2', bg: '#EDE7F6' },
];

export default function AddTransactionScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [selectedCategory, setSelectedCategory] = useState<string>('food');
  const [amountStr, setAmountStr] = useState('0');
  const [note, setNote] = useState('');

  const categories = activeTab === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

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

  const handleSave = () => {
    // TODO: Save logic
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="close" size={24} color="#F25D7E" />
        </TouchableOpacity>

        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'expense' && styles.tabActive]}
            onPress={() => { setActiveTab('expense'); setSelectedCategory('food'); }}
          >
            {activeTab === 'expense' && <MaterialCommunityIcons name="cash-minus" size={14} color="#FFF" style={{marginRight: 4}} />}
            <Text style={[styles.tabText, activeTab === 'expense' && styles.tabTextActive]}>Chi tiêu</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'income' && styles.tabActive]}
            onPress={() => { setActiveTab('income'); setSelectedCategory('salary'); }}
          >
            {activeTab === 'income' && <MaterialCommunityIcons name="cash-plus" size={14} color="#FFF" style={{marginRight: 4}} />}
            <Text style={[styles.tabText, activeTab === 'income' && styles.tabTextActive]}>Thu nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tab}>
            <Ionicons name="card-outline" size={20} color="#8FCACA" /> 
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleSave} style={styles.iconButton}>
          <Ionicons name="checkmark" size={24} color="#F25D7E" />
        </TouchableOpacity>
      </View>

      {/* --- SUB HEADER --- */}
      <View style={styles.subHeader}>
        <TouchableOpacity style={styles.subTabActive}>
          <MaterialCommunityIcons name="star-four-points" size={14} color="#F25D7E" />
          <Text style={styles.subTabTextActive}>Đề xuất</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.subTab}>
          <MaterialCommunityIcons name="file-cabinet" size={14} color="#757575" />
          <Text style={styles.subTabText}>Chưa nhóm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.subTab}>
          <Ionicons name="settings-outline" size={14} color="#F25D7E" />
          <Text style={styles.subTabText}>Cài đặt</Text>
        </TouchableOpacity>
      </View>

      {/* --- AID BANNER --- */}
      <View style={styles.aidBanner}>
        <MaterialCommunityIcons name="star-four-points" size={16} color="#F25D7E" />
        <Text style={styles.aidText}>Dựa trên thói quen của bạn, danh mục thường được đề xuất</Text>
        <TouchableOpacity>
          <Ionicons name="close" size={14} color="#F25D7E" />
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
            <Ionicons name="card" size={20} color="#5C6BC0" />
          </View>
          <TextInput 
            style={styles.noteInput} 
            value={note}
            onChangeText={setNote}
            placeholder="Ghi chú"
            placeholderTextColor="#9E9E9E"
          />
          <View style={styles.amountDisplay}>
            <Text style={styles.accountLabel}>Tài khoản mặc định (VND)</Text>
            <Text style={styles.amountText}>{amountStr}</Text>
          </View>
        </View>

        {/* Toolbar Row */}
        <View style={styles.toolbarRow}>
          <TouchableOpacity style={styles.toolBtn}>
            <MaterialCommunityIcons name="emoticon-outline" size={20} color="#FBC02D" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateBtn}>
            <Text style={styles.dateBtnText}>TODAY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn}>
            <Ionicons name="add-circle-outline" size={24} color="#66BB6A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn}>
            <Ionicons name="checkmark-done" size={20} color="#5E6C84" />
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
            <MaterialCommunityIcons name="backspace-outline" size={20} color="#F25D7E" />
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: '#F25D7E',
  } as ViewStyle,
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#BDBDBD',
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
    backgroundColor: '#F5F5F5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
  } as ViewStyle,
  subTabActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
  } as ViewStyle,
  subTabText: {
    fontSize: 12,
    fontWeight: '500', 
    color: '#616161',
  } as TextStyle,
  subTabTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F25D7E',
  } as TextStyle,

  aidBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F9',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  } as ViewStyle,
  aidText: {
    flex: 1,
    fontSize: 12,
    color: '#757575',
  } as TextStyle,

  scrollView: {
    flex: 1,
  } as ViewStyle,
  gridContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  } as ViewStyle,
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
    borderColor: '#F25D7E',
  } as ViewStyle,
  catName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#424242',
  } as TextStyle,
  catNameSelected: {
    fontWeight: '700',
    color: '#F25D7E',
  } as TextStyle,

  keypadContainer: {
    backgroundColor: '#F25D7E',
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
    color: '#333',
  } as TextStyle,
  amountDisplay: {
    alignItems: 'flex-end',
  } as ViewStyle,
  accountLabel: {
    fontSize: 10,
    color: '#BDBDBD',
  } as TextStyle,
  amountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  dateBtn: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 36,
    justifyContent: 'center',
  } as ViewStyle,
  dateBtnText: {
    fontSize: 12, 
    fontWeight: '700',
    color: '#333',
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
    backgroundColor: '#F8BBD0',
  } as ViewStyle,
  keyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  } as TextStyle,
});
