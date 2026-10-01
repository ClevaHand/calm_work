import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WaveHeader } from '@/components/WaveHeader';
import { FormField, PrimaryButton } from '@/components/CalmUI';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onCreate = async () => {
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await signUp({ name, email, phone, password });
      if (!res.ok) {
        setError(res.error ?? 'Sign up failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <WaveHeader title="Sign up" subtitle="Create your Calm Work account" height={180} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView edges={['bottom']} style={styles.form}>
            <FormField
              label="Full name"
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              autoComplete="name"
              textContentType="name"
            />
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
              label="Phone no"
              placeholder="+1 000 0000 000"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
              textContentType="telephoneNumber"
            />
            <FormField
              label="Password"
              placeholder="At least 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              textContentType="newPassword"
            />
            <FormField
              label="Confirm Password"
              placeholder="Repeat password"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              autoComplete="new-password"
              textContentType="newPassword"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <PrimaryButton
              title="Create Account"
              onPress={onCreate}
              loading={loading}
              style={{ marginTop: 4 }}
            />

            <Pressable
              onPress={() => router.push('/(auth)/sign-in')}
              style={styles.footer}
            >
              <Text style={styles.footerMuted}>Already have an Account? </Text>
              <Text style={styles.footerLink}>Login</Text>
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
  error: {
    color: Colors.error,
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingBottom: 16,
  },
  footerMuted: { fontSize: 14, color: Colors.textSecondary },
  footerLink: { fontSize: 14, fontWeight: '700', color: Colors.primary },
});
