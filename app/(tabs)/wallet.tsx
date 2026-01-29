import { StyleSheet, Text, View } from 'react-native';

export default function WalletScreen() {
  return (
    <View style={styles.container}>
      <Text>Ví tiền</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
