import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Card,
  PrimaryButton,
  FormField,
  EmptyState,
  SectionHeader,
  Badge,
} from '@/components/CalmUI';
import { useAppData } from '@/context/AppDataContext';
import { Colors } from '@/constants/colors';

const STATUS_TONE = {
  draft: 'default' as const,
  sent: 'info' as const,
  paid: 'success' as const,
  overdue: 'error' as const,
};

export default function InvoicesScreen() {
  const {
    invoices,
    customers,
    inventory,
    addInvoice,
    updateInvoiceStatus,
    removeInvoice,
  } = useAppData();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [itemId, setItemId] = useState('');
  const [qty, setQty] = useState('1');

  const onSave = () => {
    const customer = customers.find((c) => c.id === customerId);
    const item = inventory.find((i) => i.id === itemId);
    const quantity = parseInt(qty, 10);
    if (!customer || !item || isNaN(quantity) || quantity < 1) {
      Alert.alert('Required', 'Select a customer, item, and valid quantity.');
      return;
    }
    addInvoice({
      customerId: customer.id,
      customerName: customer.name,
      items: [{ name: item.name, qty: quantity, price: item.unitPrice }],
      total: item.unitPrice * quantity,
      status: 'sent',
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    });
    setCustomerId('');
    setItemId('');
    setQty('1');
    setOpen(false);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Invoices</Text>
        <Pressable style={styles.addBtn} onPress={() => setOpen(true)}>
          <Ionicons name="add" size={24} color={Colors.white} />
        </Pressable>
      </View>

      <FlatList
        data={invoices}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            title="No invoices"
            message="Create an invoice once you have customers and inventory."
            actionLabel="New invoice"
            onAction={() => setOpen(true)}
          />
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/invoice/${item.id}`)}>
          <Card style={styles.card}>
            <View style={styles.topRow}>
              <Text style={styles.name}>{item.customerName}</Text>
              <Badge label={item.status} tone={STATUS_TONE[item.status]} />
            </View>
            <Text style={styles.meta}>
              Due {new Date(item.dueDate).toLocaleDateString()} ·{' '}
              {item.items.map((x) => `${x.qty}× ${x.name}`).join(', ')}
            </Text>
            <View style={styles.bottomRow}>
              <Text style={styles.total}>${item.total.toFixed(2)}</Text>
              <View style={styles.actions}>
                {item.status !== 'paid' && (
                  <Pressable
                    style={styles.chip}
                    onPress={() => updateInvoiceStatus(item.id, 'paid')}
                  >
                    <Text style={styles.chipText}>Mark paid</Text>
                  </Pressable>
                )}
                <Pressable
                  onPress={() =>
                    Alert.alert('Delete invoice', 'Remove this invoice?', [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => removeInvoice(item.id),
                      },
                    ])
                  }
                >
                  <Ionicons name="trash-outline" size={18} color={Colors.textMuted} />
                </Pressable>
              </View>
            </View>
          </Card>
          </Pressable>
        )}
      />

      <Modal visible={open} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <SectionHeader title="New invoice" />
              <Text style={styles.label}>Customer</Text>
              <View style={styles.chips}>
                {customers.map((c) => (
                  <Pressable
                    key={c.id}
                    onPress={() => setCustomerId(c.id)}
                    style={[
                      styles.selectChip,
                      customerId === c.id && styles.selectChipOn,
                    ]}
                  >
                    <Text
                      style={[
                        styles.selectChipText,
                        customerId === c.id && styles.selectChipTextOn,
                      ]}
                    >
                      {c.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {customers.length === 0 && (
                <Text style={styles.hint}>Add a customer first.</Text>
              )}

              <Text style={[styles.label, { marginTop: 16 }]}>Item</Text>
              <View style={styles.chips}>
                {inventory.map((i) => (
                  <Pressable
                    key={i.id}
                    onPress={() => setItemId(i.id)}
                    style={[
                      styles.selectChip,
                      itemId === i.id && styles.selectChipOn,
                    ]}
                  >
                    <Text
                      style={[
                        styles.selectChipText,
                        itemId === i.id && styles.selectChipTextOn,
                      ]}
                    >
                      {i.name} (${i.unitPrice.toFixed(2)})
                    </Text>
                  </Pressable>
                ))}
              </View>
              {inventory.length === 0 && (
                <Text style={styles.hint}>Add inventory first.</Text>
              )}

              <FormField
                label="Quantity"
                placeholder="1"
                value={qty}
                onChangeText={setQty}
                keyboardType="number-pad"
              />
              <PrimaryButton title="Create invoice" onPress={onSave} />
              <Pressable onPress={() => setOpen(false)} style={styles.cancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { padding: 20, paddingTop: 8, paddingBottom: 40 },
  card: { marginBottom: 12 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: { fontSize: 16, fontWeight: '700', color: Colors.text },
  meta: { fontSize: 13, color: Colors.textSecondary, marginBottom: 12 },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: { fontSize: 20, fontWeight: '800', color: Colors.text },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chip: {
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chipText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  selectChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.offWhite,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectChipOn: {
    backgroundColor: Colors.primaryBg,
    borderColor: Colors.primary,
  },
  selectChipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  selectChipTextOn: { color: Colors.primary },
  hint: { fontSize: 13, color: Colors.textMuted, marginBottom: 8 },
  cancel: { alignItems: 'center', marginTop: 16 },
  cancelText: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
});
