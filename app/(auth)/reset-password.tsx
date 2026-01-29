import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mock password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return 0;
    if (pass.length < 6) return 1;
    if (pass.length < 10) return 2;
    return 3;
  };

  const strength = getPasswordStrength(password);
  const strengthColors = ["#E0E0E0", "#FF5252", "#FFC107", "#4CAF50"];
  const strengthLabels = ["", "Yếu", "Trung bình", "Tuyệt vời!"];

  const handleResetPassword = () => {
    console.log("Reset password logic");
    // TODO: Implement reset logic
    router.replace("/(auth)/login");
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
              <Ionicons name="chevron-back" size={24} color="#F25D7E" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Bảo mật</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Lock Icon */}
          <View style={styles.iconContainer}>
            <Image
              source={require("@/assets/images/lock-icon.png")}
              style={styles.lockIcon}
              resizeMode="contain"
            />
          </View>

          {/* Title Text */}
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>Thiết lập mật khẩu mới</Text>
            <Text style={styles.subtitleText}>
              Hãy chọn một mật khẩu thật bảo mật để bảo vệ 'heo đất' của bạn nhé!
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* New Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mật khẩu mới</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••••••"
                  placeholderTextColor="#BDBDBD"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color="#9E9E9E"
                  />
                </Pressable>
              </View>
            </View>

            {/* Password Strength */}
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthHeader}>
                  <View style={styles.strengthLabelRow}>
                    <Ionicons name="shield-checkmark" size={16} color={strengthColors[strength]} />
                    <Text style={styles.strengthTitle}>Độ mạnh mật khẩu</Text>
                  </View>
                  <Text style={[styles.strengthValue, { color: strengthColors[strength] }]}>
                    {strengthLabels[strength]}
                  </Text>
                </View>
                <View style={styles.strengthBarBg}>
                  <View
                    style={[
                      styles.strengthBarFill,
                      {
                        width: `${(strength / 3) * 100}%`,
                        backgroundColor: strengthColors[strength],
                      },
                    ]}
                  />
                </View>
                <View style={styles.strengthHint}>
                  <Ionicons name="information-circle" size={14} color="#9E9E9E" />
                  <Text style={styles.strengthHintText}>Mật khẩu của bạn rất an toàn rồi đó!</Text>
                </View>
              </View>
            )}

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
              <View style={[styles.inputWrapper, { marginTop: 8 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••••••"
                  placeholderTextColor="#BDBDBD"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                 {confirmPassword.length > 0 && confirmPassword === password && (
                  <Ionicons name="checkmark-circle" size={22} color="#F25D7E" style={{ marginRight: 8 }} />
                )}
              </View>
            </View>

            {/* Security Tips */}
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>MẸO BẢO MẬT:</Text>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>Ít nhất 8 ký tự</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>Bao gồm chữ cái và số</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>Tránh dùng ngày sinh của bạn</Text>
              </View>
            </View>

            {/* Complete Button */}
            <TouchableOpacity style={styles.completeButton} onPress={handleResetPassword}>
              <Text style={styles.completeButtonText}>Hoàn tất</Text>
              <Ionicons name="sparkles" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
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
    backgroundColor: "#FFFAFA",
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
  iconContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  lockIcon: {
    width: 100,
    height: 100,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 25, // Round border
    borderColor: "#FCE4EC",
    borderWidth: 1,
    paddingHorizontal: 20,
    height: 52,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    letterSpacing: 2, // For password dots spacing
  },
  strengthContainer: {
    marginBottom: 20,
  },
  strengthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  strengthLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  strengthTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  strengthValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  strengthBarBg: {
    height: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  strengthBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  strengthHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  strengthHintText: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  tipsContainer: {
    backgroundColor: "#FFF0F4",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    marginTop: 10,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#F25D7E",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  tipBullet: {
    fontSize: 14,
    color: "#F25D7E",
    marginRight: 8,
    fontWeight: "bold",
  },
  tipText: {
    fontSize: 13,
    color: "#5D4037",
  },
  completeButton: {
    backgroundColor: "#F25D7E",
    borderRadius: 25,
    height: 52,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F25D7E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 30,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
