<<<<<<< HEAD

import { useSignIn } from '@clerk/expo'
import { type Href, Link, useRouter } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

export default function Page() {
  const { signIn, errors, fetchStatus } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    })
    if (error) {
      console.error(JSON.stringify(error, null, 2))
      return
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            console.log(session?.currentTask)
            return
          }

          const url = decorateUrl('/')
          if (url.startsWith('http')) {
            window.location.href = url
          } else {
            router.push(url as Href)
          }
        },
      })
    } else if (signIn.status === 'needs_second_factor') {
      // See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
    } else if (signIn.status === 'needs_client_trust') {
      // For other second factor strategies,
      // see https://clerk.com/docs/guides/development/custom-flows/authentication/client-trust
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === 'email_code',
      )

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode()
      }
    } else {
      // Check why the sign-in is not complete
      console.error('Sign-in attempt not complete:', signIn)
    }
  }

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code })

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            console.log(session?.currentTask)
            return
          }

          const url = decorateUrl('/')
          if (url.startsWith('http')) {
            window.location.href = url
          } else {
            router.push(url as Href)
          }
        },
      })
    } else {
      // Check why the sign-in is not complete
      console.error('Sign-in attempt not complete:', signIn)
    }
  }

  if (signIn.status === 'needs_client_trust') {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: 24, fontWeight: 'bold' }]}>
          Verify your account
        </Text>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#666666"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
        />
        {errors.fields.code && (
          <Text style={styles.error}>{errors.fields.code.message}</Text>
        )}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            fetchStatus === 'fetching' && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleVerify}
          disabled={fetchStatus === 'fetching'}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => signIn.mfa.sendEmailCode()}
        >
          <Text style={styles.secondaryButtonText}>I need a new code</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => signIn.reset()}
        >
          <Text style={styles.secondaryButtonText}>Start over</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Sign in
      </Text>

      <Text style={styles.label}>Email address</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#666666"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        keyboardType="email-address"
      />
      {errors.fields.identifier && (
        <Text style={styles.error}>{errors.fields.identifier.message}</Text>
      )}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#666666"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      {errors.fields.password && (
        <Text style={styles.error}>{errors.fields.password.message}</Text>
      )}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          (!emailAddress || !password || fetchStatus === 'fetching') && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleSubmit}
        disabled={!emailAddress || !password || fetchStatus === 'fetching'}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
      {/* For your debugging purposes. You can just console.log errors, but we put them in the UI for convenience */}
      {errors && <Text style={styles.debug}>{JSON.stringify(errors, null, 2)}</Text>}

      <View style={styles.linkContainer}>
        <Text>Don't have an account? </Text>
        <Link href="/sign-up">
          <Text>Sign up</Text>
        </Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  title: {
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  linkContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 12,
    alignItems: 'center',
  },
  error: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: -8,
  },
  debug: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 8,
  },
})
=======
import useSocialAuth from "@/hooks/useSocialAuth";
import { Image } from "expo-image";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

// Unsplash grocery hero photos
const HERO_PHOTOS = [
  // Colourful farmers market produce
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=85",
  // Overhead grocery haul flat lay
  "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=900&q=85",
];
const heroUri = HERO_PHOTOS[Math.floor(Date.now() / 86400000) % HERO_PHOTOS.length];

export default function SignInScreen() {
  const { handleSocialAuth, loadingStrategy } = useSocialAuth();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const isGoogleClicked = loadingStrategy === "oauth_google";
  const isAppleClicked  = loadingStrategy === "oauth_apple";
  const isGitHubClicked = loadingStrategy === "oauth_github";
  const isLoading = isAppleClicked || isGitHubClicked || isGoogleClicked;

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: isDark ? "#0f172a" : "#f8fafc" }]}
      edges={["top"]}
    >
      {/* ── Hero photo section ── */}
      <View style={styles.heroSection}>
        <Image
          source={{ uri: heroUri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={500}
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.18)", "rgba(0,0,0,0.62)"]}
          style={StyleSheet.absoluteFill}
        />

        {/* App wordmark over photo */}
        <View style={styles.wordmarkRow}>
          <View style={styles.wordmarkBadge}>
            <Text style={styles.wordmarkIcon}>🛒</Text>
          </View>
          <Text style={styles.wordmark}>Grocify</Text>
        </View>

        <Text style={styles.tagline}>Plan smarter. Shop happier.</Text>
      </View>

      {/* ── Auth card ── */}
      <View style={[styles.card, { backgroundColor: isDark ? "#0f172a" : "#ffffff" }]}>
        {/* Pull handle */}
        <View style={[styles.handle, { backgroundColor: isDark ? "#1e293b" : "#e2e8f0" }]} />

        <Text style={[styles.welcomeTitle, { color: isDark ? "#f1f5f9" : "#0f172a" }]}>
          Welcome back
        </Text>
        <Text style={[styles.welcomeSub, { color: isDark ? "#64748b" : "#94a3b8" }]}>
          Sign in to your grocery list
        </Text>

        <View style={styles.buttons}>
          {/* Google */}
          <Pressable
            style={[
              styles.authBtn,
              { backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                borderColor: isDark ? "#334155" : "#e2e8f0",
                opacity: isLoading ? 0.7 : 1 },
            ]}
            disabled={isLoading}
            onPress={() => handleSocialAuth("oauth_google")}
          >
            <View style={styles.providerIcon}>
              <Image
                source={require("../../../assets/images/google.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <Text style={[styles.authBtnText, { color: isDark ? "#f1f5f9" : "#0f172a" }]}>
              {isGoogleClicked ? "Connecting…" : "Continue with Google"}
            </Text>
            <FontAwesome name="angle-right" size={16} color={isDark ? "#475569" : "#cbd5e1"} />
          </Pressable>

          {/* GitHub */}
          <Pressable
            style={[
              styles.authBtn,
              { backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                borderColor: isDark ? "#334155" : "#e2e8f0",
                opacity: isLoading ? 0.7 : 1 },
            ]}
            disabled={isLoading}
            onPress={() => handleSocialAuth("oauth_github")}
          >
            <View style={[styles.providerIcon, { backgroundColor: "#111" }]}>
              <FontAwesome name="github" size={20} color="#fff" />
            </View>
            <Text style={[styles.authBtnText, { color: isDark ? "#f1f5f9" : "#0f172a" }]}>
              {isGitHubClicked ? "Connecting…" : "Continue with GitHub"}
            </Text>
            <FontAwesome name="angle-right" size={16} color={isDark ? "#475569" : "#cbd5e1"} />
          </Pressable>

          {/* Apple */}
          <Pressable
            style={[
              styles.authBtn,
              { backgroundColor: "#0f172a",
                borderColor: "#0f172a",
                opacity: isLoading ? 0.7 : 1 },
            ]}
            disabled={isLoading}
            onPress={() => handleSocialAuth("oauth_apple")}
          >
            <View style={[styles.providerIcon, { backgroundColor: "#1e293b" }]}>
              <FontAwesome6 name="apple" size={20} color="#fff" />
            </View>
            <Text style={[styles.authBtnText, { color: "#f1f5f9" }]}>
              {isAppleClicked ? "Connecting…" : "Continue with Apple"}
            </Text>
            <FontAwesome name="angle-right" size={16} color="#475569" />
          </Pressable>
        </View>

        <Text style={[styles.legalText, { color: isDark ? "#475569" : "#cbd5e1" }]}>
          By continuing you agree to our Terms & Privacy Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  heroSection: {
    height: 320,
    justifyContent: "flex-end",
    padding: 24,
    gap: 6,
  },
  wordmarkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  wordmarkBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#a3e635",
    alignItems: "center",
    justifyContent: "center",
  },
  wordmarkIcon: {
    fontSize: 20,
  },
  wordmark: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "500",
  },
  card: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  welcomeSub: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 24,
  },
  buttons: {
    gap: 10,
  },
  authBtn: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    gap: 12,
  },
  providerIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  authBtnText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  legalText: {
    marginTop: 20,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});
>>>>>>> origin/v2
