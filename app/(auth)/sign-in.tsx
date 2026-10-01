import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WaveHeader } from '@/components/WaveHeader';
import { FormField, PrimaryButton } from '@/components/CalmUI';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await signIn(email, password);
      if (!res.ok) {
        setError(res.error ?? 'Sign in failed');
      }
      // AuthGate will redirect on success
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <WaveHeader title="Sign in" subtitle="Welcome back to Calm Work" height={200} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView edges={['bottom']} style={styles.form}>
            <FormField
              label="Email"
              placeholder="you@email.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
            />
            <FormField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
            />

            <View style={styles.row}>
              <View style={styles.remember}>
                <Switch
                  value={remember}
                  onValueChange={setRemember}
                  trackColor={{ false: Colors.border, true: Colors.primarySoft }}
                  thumbColor={remember ? Colors.primary : Colors.textMuted}
                />
                <Text style={styles.rememberText}>Remember me</Text>
              </View>
              <Pressable>
                <Text style={styles.forgot}>Forgot Password?</Text>
              </Pressable>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <PrimaryButton
              title="Login"
              onPress={onLogin}
              loading={loading}
              style={{ marginTop: 8 }}
            />

            <Pressable
              onPress={() => router.push('/(auth)/sign-up')}
              style={styles.footer}
            >
              <Text style={styles.footerMuted}>Don't have an Account? </Text>
              <Text style={styles.footerLink}>Sign up</Text>
            </Pressable>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  form: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 28,
    marginTop: -28,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  remember: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rememberText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  forgot: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  error: {
    color: Colors.error,
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    paddingBottom: 16,
  },
  footerMuted: { fontSize: 14, color: Colors.textSecondary },
  footerLink: { fontSize: 14, fontWeight: '700', color: Colors.primary },
});
