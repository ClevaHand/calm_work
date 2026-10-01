import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, Badge, PrimaryButton, SecondaryButton } from '@/components/CalmUI';
import { useAppData } from '@/context/AppDataContext';
import { Colors } from '@/constants/colors';

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCustomer, invoices, removeCustomer } = useAppData();
  const router = useRouter();
  const customer = getCustomer(id);

  if (!customer) {
    return (
      <SafeAreaView style={styles.root}>
        <Stack.Screen options={{ title: 'Customer', headerShown: true }} />
        <View style={styles.missing}>
          <Text style={styles.missingTitle}>Customer not found</Text>
          <PrimaryButton title="Go back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const related = invoices.filter((i) => i.customerId === customer.id);
  const totalSpent = related
    .filter((i) => i.status === 'paid')
    .reduce((s, i) => s + i.total, 0);

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: customer.name,
          headerShown: true,
          headerTintColor: Colors.primary,
          headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{customer.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{customer.name}</Text>
          {customer.company ? <Text style={styles.company}>{customer.company}</Text> : null}
        </View>

        <Card style={styles.block}>
          <Row
            icon="mail-outline"
            label="Email"
            value={customer.email}
            onPress={() => Linking.openURL(`mailto:${customer.email}`)}
          />
          {customer.phone ? (
            <Row
              icon="call-outline"
              label="Phone"
              value={customer.phone}
              onPress={() => Linking.openURL(`tel:${customer.phone}`)}
            />
          ) : null}
          <Row
            icon="calendar-outline"
            label="Added"
            value={new Date(customer.createdAt).toLocaleDateString()}
            last
          />
        </Card>

        <View style={styles.stats}>
          <Card style={styles.stat}>
            <Text style={styles.statLabel}>Invoices</Text>
            <Text style={styles.statValue}>{related.length}</Text>
          </Card>
          <Card style={styles.stat}>
            <Text style={styles.statLabel}>Paid total</Text>
            <Text style={[styles.statValue, { color: Colors.success }]}>
              ${totalSpent.toFixed(0)}
            </Text>
          </Card>
        </View>

        {related.length > 0 && (
          <>
            <Text style={styles.section}>Related invoices</Text>
            {related.map((inv) => (
              <Pressable
                key={inv.id}
                onPress={() => router.push(`/invoice/${inv.id}`)}
              >
                <Card style={styles.invCard}>
                  <View style={styles.invRow}>
                    <View>
                      <Text style={styles.invTotal}>${inv.total.toFixed(2)}</Text>
                      <Text style={styles.invMeta}>
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Badge
                      label={inv.status}
                      tone={
                        inv.status === 'paid'
                          ? 'success'
                          : inv.status === 'overdue'
                            ? 'error'
                            : inv.status === 'sent'
                              ? 'info'
                              : 'default'
                      }
                    />
                  </View>
                </Card>
              </Pressable>
            ))}
          </>
        )}

        <SecondaryButton
          title="Delete customer"
          onPress={() =>
            Alert.alert('Delete', `Remove ${customer.name}?`, [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                  removeCustomer(customer.id);
                  router.back();
                },
              },
            ])
          }
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  icon,
  label,
  value,
  onPress,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress?: () => void;
  last?: boolean;
}) {
  const content = (
    <View
      style={[
        styles.row,
        !last && { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
      ]}
    >
      <Ionicons name={icon} size={18} color={Colors.textMuted} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={[styles.rowValue, onPress && { color: Colors.primary }]}>{value}</Text>
      </View>
      {onPress ? <Ionicons name="open-outline" size={16} color={Colors.textMuted} /> : null}
    </View>
  );
  return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  missingTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  hero: { alignItems: 'center', marginBottom: 20 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: '800', color: Colors.primary },
  name: { fontSize: 24, fontWeight: '800', color: Colors.text },
  company: { fontSize: 15, color: Colors.primary, fontWeight: '600', marginTop: 4 },
  block: { marginBottom: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  rowLabel: { fontSize: 11, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase' },
  rowValue: { fontSize: 15, fontWeight: '600', color: Colors.text, marginTop: 2 },
  stats: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  stat: { flex: 1 },
  statLabel: { fontSize: 12, fontWeight: '600', color: Colors.textMuted, marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.text },
  section: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 10,
  },
  invCard: { marginBottom: 10 },
  invRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  invTotal: { fontSize: 16, fontWeight: '800', color: Colors.text },
  invMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
});
