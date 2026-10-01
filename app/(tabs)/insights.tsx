import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, StatCard, SectionHeader, Badge } from '@/components/CalmUI';
import { useAppData } from '@/context/AppDataContext';
import { Colors } from '@/constants/colors';

export default function InsightsScreen() {
  const { customers, inventory, invoices } = useAppData();

  const paid = invoices.filter((i) => i.status === 'paid');
  const sent = invoices.filter((i) => i.status === 'sent');
  const overdue = invoices.filter((i) => i.status === 'overdue');
  const revenue = paid.reduce((s, i) => s + i.total, 0);
  const outstanding = [...sent, ...overdue].reduce((s, i) => s + i.total, 0);
  const inventoryValue = inventory.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const lowStock = inventory.filter((i) => i.quantity <= (i.lowStockThreshold ?? 5));

  const maxBar = Math.max(revenue, outstanding, inventoryValue, 1);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Insights</Text>
        <Text style={styles.subtitle}>A calm overview of your business</Text>

        <View style={styles.statsRow}>
          <StatCard label="Revenue" value={`$${revenue.toFixed(0)}`} sub="Collected" accent={Colors.success} />
          <StatCard label="Outstanding" value={`$${outstanding.toFixed(0)}`} sub="Awaiting" accent={Colors.warning} />
        </View>
        <View style={[styles.statsRow, { marginTop: 12 }]}>
          <StatCard label="Stock value" value={`$${inventoryValue.toFixed(0)}`} sub={`${inventory.length} SKUs`} />
          <StatCard label="Customers" value={String(customers.length)} sub="On file" />
        </View>

        <SectionHeader title="Invoice health" />
        <Card>
          <Row label="Paid" value={paid.length} color={Colors.success} max={invoices.length || 1} />
          <Row label="Sent" value={sent.length} color={Colors.info} max={invoices.length || 1} />
          <Row label="Overdue" value={overdue.length} color={Colors.error} max={invoices.length || 1} />
        </Card>

        <SectionHeader title="Value snapshot" />
        <Card>
          <Bar label="Revenue" value={revenue} max={maxBar} color={Colors.success} />
          <Bar label="Outstanding" value={outstanding} max={maxBar} color={Colors.warning} />
          <Bar label="Inventory" value={inventoryValue} max={maxBar} color={Colors.primary} />
        </Card>

        {lowStock.length > 0 && (
          <>
            <SectionHeader title="Attention needed" />
            {lowStock.map((item) => (
              <Card key={item.id} style={{ marginBottom: 10 }}>
                <View style={styles.alertRow}>
                  <View>
                    <Text style={styles.alertName}>{item.name}</Text>
                    <Text style={styles.alertMeta}>SKU {item.sku}</Text>
                  </View>
                  <Badge label={`${item.quantity} left`} tone="warning" />
                </View>
              </Card>
            ))}
          </>
        )}

        {invoices.length === 0 && customers.length === 0 && (
          <Card style={{ marginTop: 12 }}>
            <Text style={styles.emptyHint}>
              Add customers, inventory, and invoices to unlock richer insights.
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  label,
  value,
  color,
  max,
}: {
  label: string;
  value: number;
  color: string;
  max: number;
}) {
  const pct = Math.max(4, (value / max) * 100);
  return (
    <View style={styles.row}>
      <View style={styles.rowHead}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function Bar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.max(4, (value / max) * 100);
  return (
    <View style={styles.row}>
      <View style={styles.rowHead}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>${value.toFixed(0)}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
    marginTop: 4,
  },
  statsRow: { flexDirection: 'row', gap: 12 },
  row: { marginBottom: 14 },
  rowHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  rowLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  rowValue: { fontSize: 13, fontWeight: '700', color: Colors.text },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 4 },
  alertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  alertMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  emptyHint: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
