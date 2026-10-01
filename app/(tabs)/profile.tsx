import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Logo } from '@/components/Logo';
import { Card, FormField, PrimaryButton, SectionHeader, Badge } from '@/components/CalmUI';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { AppConfig } from '@/constants/config';
import { Colors as Fallback } from '@/constants/colors';

export default function ProfileScreen() {
  const { user, signOut, updateProfile } = useAuth();
  const { colors, preference, setPreference, isDark } = useTheme();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [businessName, setBusinessName] = useState(user?.businessName ?? '');
  const [saving, setSaving] = useState(false);

  const c = colors ?? Fallback;

  const onSave = async () => {
    setSaving(true);
    const res = await updateProfile({
      name: name.trim() || user?.name,
      phone: phone.trim() || undefined,
      businessName: businessName.trim() || undefined,
    });
    setSaving(false);
    if (!res.ok) {
      Alert.alert('Error', res.error ?? 'Could not update profile');
      return;
    }
    setEditing(false);
  };

  const onSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: c.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: c.text }]}>Profile</Text>

        <Card style={styles.hero}>
          <View style={styles.heroRow}>
            <View style={[styles.avatar, { backgroundColor: c.primaryBg }]}>
              <Text style={[styles.avatarText, { color: c.primary }]}>
                {(user?.name ?? 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: c.text }]}>{user?.name}</Text>
              <Text style={[styles.email, { color: c.textSecondary }]}>{user?.email}</Text>
              {user?.businessName ? (
                <Text style={[styles.biz, { color: c.primary }]}>{user.businessName}</Text>
              ) : null}
            </View>
            <Logo size={36} />
          </View>
          <Badge
            label={AppConfig.USE_REMOTE_API ? 'Cloud sync' : 'Local storage'}
            tone={AppConfig.USE_REMOTE_API ? 'info' : 'default'}
          />
        </Card>

        <SectionHeader
          title="Account"
          actionLabel={editing ? 'Cancel' : 'Edit'}
          onAction={() => {
            if (editing) {
              setName(user?.name ?? '');
              setPhone(user?.phone ?? '');
              setBusinessName(user?.businessName ?? '');
            }
            setEditing(!editing);
          }}
        />

        {editing ? (
          <Card>
            <FormField label="Name" value={name} onChangeText={setName} placeholder="Your name" />
            <FormField
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              placeholder="Optional"
              keyboardType="phone-pad"
            />
            <FormField
              label="Business name"
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="Optional"
            />
            <PrimaryButton title="Save changes" onPress={onSave} loading={saving} />
          </Card>
        ) : (
          <Card>
            <InfoRow icon="person-outline" label="Name" value={user?.name ?? '—'} colors={c} />
            <InfoRow icon="mail-outline" label="Email" value={user?.email ?? '—'} colors={c} />
            <InfoRow icon="call-outline" label="Phone" value={user?.phone ?? 'Not set'} colors={c} />
            <InfoRow
              icon="briefcase-outline"
              label="Business"
              value={user?.businessName ?? 'Not set'}
              colors={c}
              last
            />
          </Card>
        )}

        <SectionHeader title="Appearance" />
        <Card>
          {(['system', 'light', 'dark'] as const).map((opt, idx, arr) => (
            <Pressable
              key={opt}
              onPress={() => setPreference(opt)}
              style={[
                styles.themeRow,
                idx < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: c.borderLight },
              ]}
            >
              <View style={styles.themeLeft}>
                <Ionicons
                  name={
                    opt === 'system' ? 'phone-portrait-outline' : opt === 'light' ? 'sunny-outline' : 'moon-outline'
                  }
                  size={20}
                  color={c.textSecondary}
                />
                <Text style={[styles.themeLabel, { color: c.text }]}>
                  {opt === 'system' ? 'System' : opt === 'light' ? 'Light' : 'Dark'}
                </Text>
              </View>
              <View
                style={[
                  styles.radio,
                  { borderColor: preference === opt ? c.primary : c.border },
                  preference === opt && { backgroundColor: c.primary },
                ]}
              >
                {preference === opt ? (
                  <Ionicons name="checkmark" size={12} color={c.white} />
                ) : null}
              </View>
            </Pressable>
          ))}
        </Card>

        <SectionHeader title="About" />
        <Card>
          <InfoRow icon="sparkles-outline" label="App" value={AppConfig.name} colors={c} />
          <InfoRow icon="code-slash-outline" label="Version" value={AppConfig.version} colors={c} />
          <InfoRow
            icon="cloud-outline"
            label="Backend"
            value={AppConfig.USE_REMOTE_API ? 'Remote API' : 'On-device (ready for backend)'}
            colors={c}
            last
          />
        </Card>

        <Pressable
          onPress={onSignOut}
          style={[styles.signOut, { backgroundColor: c.errorBg, borderColor: c.error }]}
        >
          <Ionicons name="log-out-outline" size={20} color={c.error} />
          <Text style={[styles.signOutText, { color: c.error }]}>Sign out</Text>
        </Pressable>

        <Text style={[styles.footer, { color: c.textMuted }]}>{AppConfig.tagline}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
  colors,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  colors: typeof Fallback;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.infoRow,
        !last && { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
      ]}
    >
      <Ionicons name={icon} size={18} color={colors.textMuted} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 48 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  hero: { marginBottom: 8, gap: 14 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '800' },
  name: { fontSize: 18, fontWeight: '800' },
  email: { fontSize: 13, marginTop: 2 },
  biz: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  infoLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  infoValue: { fontSize: 15, fontWeight: '600', marginTop: 2 },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  themeLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  themeLabel: { fontSize: 15, fontWeight: '600' },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOut: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  signOutText: { fontSize: 16, fontWeight: '700' },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 13,
  },
});
