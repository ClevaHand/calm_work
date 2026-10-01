import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  Card,
  PrimaryButton,
  FormField,
  EmptyState,
  SectionHeader,
  Badge,
} from '@/components/CalmUI';
import { useAppData, type InventoryItem } from '@/context/AppDataContext';
import { Colors } from '@/constants/colors';

export default function InventoryScreen() {
  const { inventory, addInventoryItem, removeInventoryItem } = useAppData();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  const reset = () => {
    setName('');
    setSku('');
    setQty('');
    setPrice('');
    setCategory('');
  };

  const onSave = () => {
    const quantity = parseInt(qty, 10);
    const unitPrice = parseFloat(price);
    if (!name.trim() || !sku.trim() || isNaN(quantity) || isNaN(unitPrice)) {
      Alert.alert('Required', 'Name, SKU, quantity and price are required.');
      return;
    }
    addInventoryItem({
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      quantity,
      unitPrice,
      category: category.trim() || undefined,
      lowStockThreshold: 5,
    });
    reset();
    setOpen(false);
  };

  const onDelete = (item: InventoryItem) => {
    Alert.alert('Remove item', `Remove ${item.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeInventoryItem(item.id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventory</Text>
        <Pressable style={styles.addBtn} onPress={() => setOpen(true)}>
          <Ionicons name="add" size={24} color={Colors.white} />
        </Pressable>
      </View>

      <FlatList
        data={inventory}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            title="No items yet"
            message="Add products and track stock levels in one place."
            actionLabel="Add item"
            onAction={() => setOpen(true)}
          />
        }
        renderItem={({ item }) => {
          const low = item.quantity <= (item.lowStockThreshold ?? 5);
          return (
            <Card style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.iconWrap}>
                  <Ionicons name="cube-outline" size={22} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.meta}>
                    {item.sku}
                    {item.category ? ` · ${item.category}` : ''}
                  </Text>
                  <Text style={styles.price}>${item.unitPrice.toFixed(2)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 8 }}>
                  <Badge
                    label={`${item.quantity} in stock`}
                    tone={low ? 'warning' : 'success'}
                  />
                  <Pressable onPress={() => onDelete(item)} hitSlop={10}>
                    <Ionicons name="trash-outline" size={18} color={Colors.textMuted} />
                  </Pressable>
                </View>
              </View>
            </Card>
          );
        }}
      />

      <Modal visible={open} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <SectionHeader title="New inventory item" />
            <FormField label="Name" placeholder="Product name" value={name} onChangeText={setName} />
            <FormField label="SKU" placeholder="SKU-001" value={sku} onChangeText={setSku} autoCapitalize="characters" />
            <FormField label="Quantity" placeholder="0" value={qty} onChangeText={setQty} keyboardType="number-pad" />
            <FormField label="Unit price" placeholder="0.00" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
            <FormField label="Category" placeholder="Optional" value={category} onChangeText={setCategory} />
            <PrimaryButton title="Save item" onPress={onSave} />
            <Pressable
              onPress={() => {
                reset();
                setOpen(false);
              }}
              style={styles.cancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
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
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 16, fontWeight: '700', color: Colors.text },
  meta: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  price: { fontSize: 14, fontWeight: '700', color: Colors.primary, marginTop: 4 },
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
  },
  cancel: { alignItems: 'center', marginTop: 16 },
  cancelText: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
});
