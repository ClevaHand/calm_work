import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Card, Badge, PrimaryButton, SecondaryButton } from '@/components/CalmUI';
import { useAppData } from '@/context/AppDataContext';
import { Colors } from '@/constants/colors';

const TONE = {
  draft: 'default' as const,
  sent: 'info' as const,
  paid: 'success' as const,
  overdue: 'error' as const,
};

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getInvoice, updateInvoiceStatus, removeInvoice } = useAppData();
  const router = useRouter();
  const inv = getInvoice(id);

  if (!inv) {
    return (
      <SafeAreaView style={styles.root}>
        <Stack.Screen options={{ title: 'Invoice', headerShown: true }} />
        <View style={styles.missing}>
          <Text style={styles.missingTitle}>Invoice not found</Text>
          <PrimaryButton title="Go back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: `Invoice`,
          headerShown: true,
          headerTintColor: Colors.primary,
          headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.top}>
          <Text style={styles.customer}>{inv.customerName}</Text>
          <Badge label={inv.status} tone={TONE[inv.status]} />
        </View>
        <Text style={styles.total}>${inv.total.toFixed(2)}</Text>
        <Text style={styles.meta}>
          Created {new Date(inv.createdAt).toLocaleDateString()} · Due{' '}
          {new Date(inv.dueDate).toLocaleDateString()}
        </Text>

        <Text style={styles.section}>Line items</Text>
        <Card>
          {inv.items.map((line, idx) => (
            <View
              key={`${line.name}-${idx}`}
              style={[
                styles.line,
                idx < inv.items.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.borderLight,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.lineName}>{line.name}</Text>
                <Text style={styles.lineMeta}>
                  {line.qty} × ${line.price.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.lineTotal}>${(line.qty * line.price).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${inv.total.toFixed(2)}</Text>
          </View>
        </Card>

        {inv.status !== 'paid' && (
          <PrimaryButton
            title="Mark as paid"
            onPress={() => updateInvoiceStatus(inv.id, 'paid')}
            style={{ marginTop: 20 }}
          />
        )}
        {inv.status === 'paid' && (
          <SecondaryButton
            title="Mark as sent"
            onPress={() => updateInvoiceStatus(inv.id, 'sent')}
            style={{ marginTop: 20 }}
          />
        )}

        <SecondaryButton
          title="Delete invoice"
          onPress={() =>
            Alert.alert('Delete invoice', 'Remove this invoice permanently?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                  removeInvoice(inv.id);
                  router.back();
                },
              },
            ])
          }
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  missingTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customer: { fontSize: 20, fontWeight: '800', color: Colors.text, flex: 1 },
  total: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -1,
    marginBottom: 6,
  },
  meta: { fontSize: 13, color: Colors.textSecondary, marginBottom: 24 },
  section: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 10,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  lineName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  lineMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  lineTotal: { fontSize: 15, fontWeight: '700', color: Colors.text },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalLabel: { fontSize: 15, fontWeight: '700', color: Colors.textSecondary },
  totalAmount: { fontSize: 18, fontWeight: '800', color: Colors.primary },
});
