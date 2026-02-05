import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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

import { Colors, Fonts } from "@/constants/theme";

const theme = Colors.light;

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ===== PASSWORD STRENGTH ===== */
  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return 0;
    if (pass.length < 6) return 1;
    if (pass.length < 10) return 2;
    return 3;
  };

  const strength = getPasswordStrength(password);
  const strengthColors = [
    theme.border,
    theme.error,
    theme.warning,
    theme.success,
  ];
  const strengthLabels = ["", "Weak", "Average", "Strong"];

  const handleResetPassword = () => {
    // Only navigation remains
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ===== HEADER ===== */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.primary}
              />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Security</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* ===== ICON ===== */}
          <View style={styles.iconContainer}>
            <Image
              source={require("@/assets/images/lock-icon.png")}
              style={styles.lockIcon}
            />
          </View>

          {/* ===== TEXT ===== */}
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>
              Set a new password
            </Text>
            <Text style={styles.subtitleText}>
              Choose a strong password to protect your account
            </Text>
          </View>

          {/* ===== FORM ===== */}
          <View>
            {/* New password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                New password
              </Text>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••••"
                  placeholderTextColor={theme.placeholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color={theme.icon}
                  />
                </Pressable>
              </View>
            </View>

            {/* Strength */}
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthHeader}>
                  <Text style={styles.strengthTitle}>
                    Password strength
                  </Text>
                  <Text
                    style={[
                      styles.strengthValue,
                      { color: strengthColors[strength] },
                    ]}
                  >
                    {strengthLabels[strength]}
                  </Text>
                </View>

                <View style={styles.strengthBarBg}>
                  <View
                    style={[
                      styles.strengthBarFill,
                      {
                        width: `${(strength / 3) * 100}%`,
                        backgroundColor:
                          strengthColors[strength],
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Confirm */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Confirm password
              </Text>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••••"
                  placeholderTextColor={theme.placeholder}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />

                {confirmPassword.length > 0 &&
                  confirmPassword === password && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={theme.success}
                    />
                  )}
              </View>
            </View>

            {/* Tips */}
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>
                PASSWORD SECURITY TIPS
              </Text>
              <Text style={styles.tipText}>
                • At least 8 characters{"\n"}
                • Include letters and numbers{"\n"}
                • Do not use personal information
              </Text>
            </View>

            {/* Button */}
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleResetPassword}
            >
              <Text style={styles.completeButtonText}>Complete</Text>
              <Ionicons
                name="checkmark"
                size={18}
                color="#FFF"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.rounded,
    fontWeight: "600",
    color: theme.textMain,
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
    fontFamily: Fonts.rounded,
    fontWeight: "700",
    color: theme.textMain,
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: Fonts.sans,
    color: theme.textSub,
    textAlign: "center",
    marginTop: 6,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.textMain,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.inputBg,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 20,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.textMain,
  },
  strengthContainer: {
    marginBottom: 20,
  },
  strengthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  strengthTitle: {
    fontSize: 13,
    color: theme.textSub,
  },
  strengthValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  strengthBarBg: {
    height: 8,
    backgroundColor: theme.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  strengthBarFill: {
    height: "100%",
  },
  tipsContainer: {
    backgroundColor: theme.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.primary,
    marginBottom: 6,
  },
  tipText: {
    fontSize: 13,
    color: theme.textMain,
    lineHeight: 18,
  },
  completeButton: {
    backgroundColor: theme.primary,
    borderRadius: 25,
    height: 52,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: Fonts.rounded,
    fontWeight: "600",
    color: "#FFF",
  },
});
