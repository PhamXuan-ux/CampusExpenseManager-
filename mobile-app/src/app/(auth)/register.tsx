import { Colors } from "@/constants/theme";
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
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  /* ===== THEME ===== */
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  /* ===== STATE ===== */
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = () => {
    // Only navigation remains
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#FFFFFF" }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ===== HEADER ===== */}
          <View style={styles.header}>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: theme.inputBg }]}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color={theme.textMain} />
            </TouchableOpacity>

            <Text style={[styles.headerTitle, { color: theme.textMain }]}>
              CampusExpense
            </Text>

            <View style={{ width: 40 }} />
          </View>

          {/* ===== MASCOT ===== */}
          <View style={styles.mascotContainer}>
            <Image
              source={require("@/assets/images/piggy-mascot.png")}
              style={styles.mascot}
              resizeMode="contain"
            />
          </View>

          {/* ===== WELCOME ===== */}
          <View style={styles.welcomeContainer}>
            <Text style={[styles.welcomeTitle, { color: theme.textMain }]}>
              Create an account
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: theme.textSub }]}>
              Start managing your expenses smartly today
            </Text>
          </View>

          {/* ===== INPUTS ===== */}
          {/** Full name */}
          <Input
            label="Full name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            theme={theme}
          />

          {/** Email */}
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            theme={theme}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/** Password */}
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            visible={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
            theme={theme}
          />

          {/** Confirm Password */}
          <PasswordInput
            label="Confirm password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            visible={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            theme={theme}
          />

          {/* ===== REGISTER BUTTON ===== */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              {
                backgroundColor: theme.primary,
                shadowColor: theme.primary,
              },
            ]}
            onPress={handleRegister}
            activeOpacity={0.85}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          {/* ===== SOCIAL LOGIN ===== */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[
                styles.socialButton,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: "https://www.google.com/favicon.ico" }}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
          </View>

          {/* ===== LOGIN ===== */}
          <View style={styles.loginContainer}>
            <Text style={{ color: theme.textSub }}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text
                style={{
                  color: theme.primary,
                  fontWeight: "600",
                }}
              >
                {" "}
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ===== INPUT COMPONENTS ===== */

function Input(props: any) {
  const { label, theme } = props;
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: theme.textMain }]}>
        {label}
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
        <TextInput
          {...props}
          style={[styles.input, { color: theme.textMain }]}
          placeholderTextColor={theme.placeholder}
        />
      </View>
    </View>
  );
}

function PasswordInput(props: any) {
  const { label, visible, onToggle, theme } = props;
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: theme.textMain }]}>
        {label}
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
        <TextInput
          {...props}
          secureTextEntry={!visible}
          style={[styles.input, { color: theme.textMain }]}
          placeholderTextColor={theme.placeholder}
        />
        <Pressable onPress={onToggle} hitSlop={10}>
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={22}
            color={theme.icon || theme.textMain}
          />
        </Pressable>
      </View>
    </View>
  );
}

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  container: { flex: 1 },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  mascotContainer: {
    alignItems: "center",
    marginVertical: 12,
  },

  mascot: {
    width: 100,
    height: 100,
  },

  welcomeContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
  },

  welcomeSubtitle: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },

  inputGroup: {
    marginBottom: 12,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 6,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 48,
  },

  input: {
    flex: 1,
    fontSize: 15,
  },

  registerButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  registerButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },

  socialContainer: {
    alignItems: "center",
    marginTop: 16,
  },

  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
});
