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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Card,
  PrimaryButton,
  FormField,
  EmptyState,
  SectionHeader,
} from '@/components/CalmUI';
import { useAppData, type Customer } from '@/context/AppDataContext';
import { Colors } from '@/constants/colors';

export default function CustomersScreen() {
  const { customers, addCustomer, removeCustomer } = useAppData();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');

  const reset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
  };

  const onSave = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Required', 'Name and email are required.');
      return;
    }
    addCustomer({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      company: company.trim() || undefined,
    });
    reset();
    setOpen(false);
  };

  const onDelete = (c: Customer) => {
    Alert.alert('Remove customer', `Remove ${c.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeCustomer(c.id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Customers</Text>
        <Pressable style={styles.addBtn} onPress={() => setOpen(true)}>
          <Ionicons name="add" size={24} color={Colors.white} />
        </Pressable>
      </View>

      <FlatList
        data={customers}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            title="No customers yet"
            message="Add your first customer to start tracking relationships."
            actionLabel="Add customer"
            onAction={() => setOpen(true)}
          />
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/customer/${item.id}`)}>
            <Card style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  {item.company ? (
                    <Text style={styles.company}>{item.company}</Text>
                  ) : null}
                  <Text style={styles.meta}>{item.email}</Text>
                  {item.phone ? <Text style={styles.meta}>{item.phone}</Text> : null}
                </View>
                <Pressable onPress={() => onDelete(item)} hitSlop={10}>
                  <Ionicons name="trash-outline" size={20} color={Colors.textMuted} />
                </Pressable>
              </View>
            </Card>
          </Pressable>
        )}
      />

      <Modal visible={open} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <SectionHeader title="New customer" />
            <FormField label="Name" placeholder="Full name" value={name} onChangeText={setName} />
            <FormField
              label="Email"
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <FormField
              label="Phone"
              placeholder="Optional"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <FormField
              label="Company"
              placeholder="Optional"
              value={company}
              onChangeText={setCompany}
            />
            <PrimaryButton title="Save customer" onPress={onSave} />
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  name: { fontSize: 16, fontWeight: '700', color: Colors.text },
  company: { fontSize: 13, color: Colors.primary, fontWeight: '600', marginTop: 2 },
  meta: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
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
