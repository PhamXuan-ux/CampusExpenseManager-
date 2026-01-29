import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const handleSendCode = () => {
    // TODO: Send verification code logic
    console.log("Send code to:", email);
    router.push("/(auth)/otp-verification");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Quên mật khẩu?</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Mascot */}
          <View style={styles.mascotContainer}>
            <Image
              source={require("@/assets/images/sad-mascot.png")}
              style={styles.mascot}
              resizeMode="contain"
            />
          </View>

          {/* Title Text */}
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>
              Đừng lo, chúng mình sẽ giúp bạn lấy lại mật khẩu!
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL CỦA BẠN</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail" size={20} color="#8D6E63" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.input}
                  placeholder="example@gmail.com"
                  placeholderTextColor="#D7CCC8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Send Button */}
            <TouchableOpacity style={styles.sendButton} onPress={handleSendCode}>
              <Text style={styles.sendButtonText}>Gửi mã xác nhận</Text>
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity 
              style={styles.backLoginContainer} 
              onPress={() => router.replace("/(auth)/login")}
            >
              <Ionicons name="log-in-outline" size={20} color="#8D6E63" />
              <Text style={styles.backLoginText}>Quay lại Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAFA", // Very light pink background
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  mascotContainer: {
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: "#F0F4F4", // Light circle background color approximation
    borderRadius: 100,
    width: 200,
    height: 200,
    alignSelf: "center",
    justifyContent: "center",
  },
  mascot: {
    width: 150,
    height: 150,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    lineHeight: 28,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A1887F",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    borderWidth: 1, // Optional: add border if needed, or shadow
    borderColor: "#FCE4EC",
    paddingHorizontal: 20,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#5D4037",
  },
  sendButton: {
    backgroundColor: "#F25D7E",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F25D7E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 40,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  backLoginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  backLoginText: {
    fontSize: 14,
    color: "#8D6E63",
    fontWeight: "500",
  },
});
