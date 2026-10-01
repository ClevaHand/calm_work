import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '@/components/Logo';
import { Card, StatCard, SectionHeader, Badge } from '@/components/CalmUI';
import { useAuth } from '@/context/AuthContext';
import { useAppData } from '@/context/AppDataContext';
import { Colors } from '@/constants/colors';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const { customers, inventory, invoices } = useAppData();
  const router = useRouter();

  const paid = invoices.filter((i) => i.status === 'paid');
  const revenue = paid.reduce((s, i) => s + i.total, 0);
  const lowStock = inventory.filter(
    (i) => i.quantity <= (i.lowStockThreshold ?? 5)
  );
  const pending = invoices.filter((i) => i.status === 'sent' || i.status === 'overdue');

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good day,</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
          <View style={styles.headerRight}>
            <Logo size={40} />
            <Pressable onPress={() => router.push('/(tabs)/profile')} style={styles.logout} hitSlop={12}>
              <Ionicons name="person-circle-outline" size={24} color={Colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        <Text style={styles.brand}>
          <Text style={styles.brandCalm}>Calm</Text>
          <Text style={styles.brandWork}> Work</Text>
        </Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            label="Revenue"
            value={`$${revenue.toFixed(0)}`}
            sub={`${paid.length} paid`}
            accent={Colors.success}
          />
          <StatCard
            label="Customers"
            value={String(customers.length)}
            sub="Active"
          />
        </View>
        <View style={[styles.statsRow, { marginTop: 12 }]}>
          <StatCard
            label="Inventory"
            value={String(inventory.length)}
            sub={lowStock.length ? `${lowStock.length} low stock` : 'Healthy'}
            accent={lowStock.length ? Colors.warning : undefined}
          />
          <StatCard
            label="Pending"
            value={String(pending.length)}
            sub="Invoices"
            accent={pending.length ? Colors.info : undefined}
          />
        </View>

        {/* Quick actions */}
        <SectionHeader title="Quick actions" />
        <View style={styles.actions}>
          {[
            { label: 'Customers', icon: 'people' as const, route: '/(tabs)/customers' },
            { label: 'Inventory', icon: 'cube' as const, route: '/(tabs)/inventory' },
            { label: 'Invoices', icon: 'document-text' as const, route: '/(tabs)/invoices' },
            { label: 'Insights', icon: 'stats-chart' as const, route: '/(tabs)/insights' },
          ].map((a) => (
            <Pressable
              key={a.label}
              style={({ pressed }) => [styles.action, pressed && { opacity: 0.85 }]}
              onPress={() => router.push(a.route as any)}
            >
              <View style={styles.actionIcon}>
                <Ionicons name={a.icon} size={22} color={Colors.primary} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Recent invoices */}
        <SectionHeader
          title="Recent invoices"
          actionLabel="See all"
          onAction={() => router.push('/(tabs)/invoices')}
        />
        {invoices.slice(0, 3).map((inv) => (
          <Card key={inv.id} style={styles.invCard}>
            <View style={styles.invRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.invName}>{inv.customerName}</Text>
                <Text style={styles.invMeta}>
                  {new Date(inv.createdAt).toLocaleDateString()} · {inv.items.length} item
                  {inv.items.length !== 1 ? 's' : ''}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                <Text style={styles.invTotal}>${inv.total.toFixed(2)}</Text>
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
            </View>
          </Card>
        ))}

        {lowStock.length > 0 && (
          <>
            <SectionHeader title="Low stock" />
            {lowStock.map((item) => (
              <Card key={item.id} style={styles.invCard}>
                <View style={styles.invRow}>
                  <View>
                    <Text style={styles.invName}>{item.name}</Text>
                    <Text style={styles.invMeta}>SKU {item.sku}</Text>
                  </View>
                  <Badge label={`${item.quantity} left`} tone="warning" />
                </View>
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  greeting: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logout: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  brand: {
    marginBottom: 20,
    marginTop: 4,
  },
  brandCalm: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  brandWork: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  statsRow: { flexDirection: 'row', gap: 12 },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  action: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: 14, fontWeight: '600', color: Colors.text },
  invCard: { marginBottom: 10 },
  invRow: { flexDirection: 'row', alignItems: 'center' },
  invName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  invMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  invTotal: { fontSize: 16, fontWeight: '800', color: Colors.text },
});
