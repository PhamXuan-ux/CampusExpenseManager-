import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
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

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [timer, setTimer] = useState(60); // Mock timer

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    console.log("Verify OTP:", otpCode);
    // TODO: Verify OTP logic
    router.push("/(auth)/reset-password");
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
            <Text style={styles.headerTitle}>Xác thực OTP</Text>
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
            <Text style={styles.titleText}>Nhập mã xác thực</Text>
            <Text style={styles.subtitleText}>
              Vui lòng nhập mã 4 chữ số vừa được gửi đến số điện thoại của bạn.
            </Text>
          </View>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                value={digit}
                onChangeText={(val) => handleOtpChange(val, index)}
                onKeyPress={({ nativeEvent }) => handleBackspace(nativeEvent.key, index)}
                keyboardType="numeric"
                maxLength={1}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                autoFocus={index === 0}
              />
            ))}
          </View>

          {/* Resend Timer */}
          <View style={styles.timerContainer}>
            <Ionicons name="time" size={16} color="#F25D7E" />
            <Text style={styles.timerText}>
              Gửi lại mã sau <Text style={styles.timerBold}>{timer}s</Text>
            </Text>
          </View>

          {/* Verify Button */}
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
            <Text style={styles.verifyButtonText}>Xác thực</Text>
          </TouchableOpacity>

          {/* Support */}
          <View style={styles.supportContainer}>
            <View style={styles.supportIconBg}>
              <Ionicons name="chatbubble-ellipses" size={16} color="#F25D7E" />
            </View>
            <Text style={styles.supportText}>Cần hỗ trợ?</Text>
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
    marginVertical: 30,
  },
  lockIcon: {
    width: 120,
    height: 120,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  subtitleText: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 30, // Circular input
    borderWidth: 1,
    borderColor: "#FFCDD2",
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
  otpInputFilled: {
    borderColor: "#F25D7E",
    backgroundColor: "#FFF0F4",
  },
  timerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF0F4",
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 30,
    gap: 6,
  },
  timerText: {
    fontSize: 14,
    color: "#666",
  },
  timerBold: {
    color: "#F25D7E",
    fontWeight: "700",
  },
  verifyButton: {
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
    marginBottom: 50,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  supportContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  supportIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
  },
  supportText: {
    fontSize: 14,
    color: "#5D4037",
    fontWeight: "500",
  },
});
