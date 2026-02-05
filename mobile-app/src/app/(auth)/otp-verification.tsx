import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { createRef, useEffect, useRef, useState } from "react";
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

import { Colors, Fonts } from "@/constants/theme";

/* ===== CONFIG ===== */
const OTP_LENGTH = 6;
const theme = Colors.light;

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef(
    Array.from({ length: OTP_LENGTH }, () =>
      createRef<TextInput>()
    )
  );

  /* ===== COUNTDOWN 60s ===== */
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ===== OTP CHANGE ===== */
  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].current?.focus();
    }
  };

  /* ===== BACKSPACE ===== */
  const handleBackspace = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].current?.focus();
    }
  };

  /* ===== RESEND OTP ===== */
  const handleResendCode = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(60);

    setTimeout(() => {
      inputRefs.current[0].current?.focus();
    }, 100);
  };

  /* ===== VERIFY ===== */
  const isOtpComplete = otp.every((d) => d !== "");
  const { email } = useLocalSearchParams<{ email: string }>();

  const handleVerify = () => {
    if (!isOtpComplete) return;

    const targetEmail = email || "test@example.com";
    // Simplified navigation
    router.push({
      pathname: "/(auth)/reset-password",
      params: { email: targetEmail }
    });
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

            <Text style={styles.headerTitle}>
              OTP verification
            </Text>

            <View style={{ width: 24 }} />
          </View>

          {/* ===== ICON ===== */}
          <View style={styles.iconContainer}>
            <Image
              source={require("@/assets/images/lock-icon.png")}
              style={styles.lockIcon}
              resizeMode="contain"
            />
          </View>

          {/* ===== TEXT ===== */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subtitle}>
              Please enter the {OTP_LENGTH}-digit code sent to your
              phone number
            </Text>
          </View>

          {/* ===== OTP INPUT ===== */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs.current[index]}
                value={digit}
                onChangeText={(val) =>
                  handleOtpChange(val, index)
                }
                onKeyPress={({ nativeEvent }) =>
                  handleBackspace(nativeEvent.key, index)
                }
                keyboardType="number-pad"
                maxLength={1}
                autoFocus={index === 0}
                style={[
                  styles.otpInput,
                  {
                    borderColor: digit
                      ? theme.primary
                      : theme.border,
                    backgroundColor: digit
                      ? theme.primaryLight
                      : theme.inputBg,
                    color: theme.textMain,
                  },
                ]}
              />
            ))}
          </View>

          {/* ===== TIMER / RESEND ===== */}
          <View style={styles.timerContainer}>
            <Ionicons
              name="time-outline"
              size={16}
              color={theme.primary}
            />

            {timer > 0 ? (
              <Text style={styles.timerText}>
                Resend code after{" "}
                <Text style={styles.timerBold}>
                  {timer}s
                </Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResendCode}>
                <Text style={styles.resendText}>
                  Resend code
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ===== VERIFY BUTTON ===== */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              !isOtpComplete && { opacity: 0.5 },
            ]}
            disabled={!isOtpComplete}
            onPress={handleVerify}
          >
            <Text style={styles.verifyText}>Verify</Text>
          </TouchableOpacity>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    marginVertical: 28,
  },
  lockIcon: {
    width: 120,
    height: 120,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.rounded,
    fontWeight: "700",
    color: theme.textMain,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.sans,
    color: theme.textSub,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
  },
  otpInput: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    textAlign: "center",
    fontSize: 20,
    fontFamily: Fonts.mono,
    fontWeight: "600",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: theme.primaryLight,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 32,
  },
  timerText: {
    fontSize: 14,
    color: theme.textSub,
  },
  timerBold: {
    color: theme.primary,
    fontWeight: "700",
  },
  resendText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.primary,
  },
  verifyButton: {
    height: 50,
    backgroundColor: theme.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  verifyText: {
    fontSize: 16,
    fontFamily: Fonts.rounded,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
