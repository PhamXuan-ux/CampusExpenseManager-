import { Colors } from "@/constants/theme";
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
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];

  const [email, setEmail] = useState("");

  const handleSendCode = () => {
    // Only navigation remains
    router.push({
      pathname: "/(auth)/otp-verification",
      params: { email }
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ===== Header ===== */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.textMain}
              />
            </TouchableOpacity>

            <Text
              style={[
                styles.headerTitle,
                { color: theme.textMain },
              ]}
            >
              Forgot your password?
            </Text>

            <View style={styles.placeholder} />
          </View>

          {/* ===== Mascot (NO CIRCLE) ===== */}
          <View style={styles.mascotWrapper}>
            <Image
              source={require("@/assets/images/sad-mascot.png")}
              style={styles.mascot}
              resizeMode="contain"
            />
          </View>

          {/* ===== Title ===== */}
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.titleText,
                { color: theme.textMain },
              ]}
            >
              Don't worry, we'll help you get your password back!
            </Text>
          </View>

          {/* ===== Form ===== */}
          <View style={styles.formContainer}>
            {/* Email input */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.inputLabel,
                  { color: theme.textSub },
                ]}
              >
                YOUR EMAIL
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Ionicons
                  name="mail"
                  size={20}
                  color={theme.icon}
                  style={{ marginRight: 10 }}
                />

                <TextInput
                  style={[
                    styles.input,
                    { color: theme.textMain },
                  ]}
                  placeholder="example@gmail.com"
                  placeholderTextColor={theme.placeholder}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Send button */}
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: theme.primary },
              ]}
              onPress={handleSendCode}
            >
              <Text style={styles.sendButtonText}>
                Send verification code
              </Text>
            </TouchableOpacity>

            {/* Back to login */}
            <TouchableOpacity
              style={styles.backLoginContainer}
              onPress={() => router.replace("/(auth)/login")}
            >
              <Ionicons
                name="log-in-outline"
                size={20}
                color={theme.primaryDark}
              />
              <Text
                style={[
                  styles.backLoginText,
                  { color: theme.primaryDark },
                ]}
              >
                Back to Login
              </Text>
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
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  /* ===== Header ===== */
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
  },

  placeholder: {
    width: 40,
  },

  /* ===== Mascot ===== */
  mascotWrapper: {
    alignItems: "center",
    marginVertical: 24,
  },

  mascot: {
    width: 160,
    height: 160,
  },

  /* ===== Title ===== */
  textContainer: {
    alignItems: "center",
    marginBottom: 32,
  },

  titleText: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 28,
  },

  /* ===== Form ===== */
  formContainer: {
    flex: 1,
  },

  inputGroup: {
    marginBottom: 24,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 52,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  /* ===== Button ===== */
  sendButton: {
    borderRadius: 16,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  sendButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },

  /* ===== Back to login ===== */
  backLoginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  backLoginText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
