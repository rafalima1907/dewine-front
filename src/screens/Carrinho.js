import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import QntItem from '../components/QntItem';

import FotoVinho from '../../assets/fotoExemplo.png';
import SetaVoltar from '../../assets/icons/seta_voltar.png';
import IconExcluir from '../../assets/icons/x.png';

export default function Carrinho() {
  const navigation = useNavigation();
  
  const [items, setItems] = useState([
    { id: 1, name: 'Cabernet Sauvignon Watchful Eye', year: '2024', price: 110.29, quantity: 1 },
    { id: 2, name: 'Cabernet Sauvignon Watchful Eye', year: '2024', price: 110.29, quantity: 1 },
    { id: 3, name: 'Cabernet Sauvignon Watchful Eye', year: '2024', price: 110.29, quantity: 1 },
    { id: 4, name: 'Cabernet Sauvignon Watchful Eye', year: '2024', price: 110.29, quantity: 1 },
    { id: 5, name: 'Cabernet Sauvignon Watchful Eye', year: '2024', price: 110.29, quantity: 1 },
  ]);

  const [selectedIds, setSelectedIds] = useState([1, 2, 3, 4, 5]);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const updateQuantity = (id, type) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = type === 'add' ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    }));
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.headerTitleRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image source={SetaVoltar} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Meu Carrinho</Text>
      </View>

      <View style={styles.listWrapper}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          {items.map(item => (
            <View key={item.id} style={styles.cartCard}>
              <TouchableOpacity onPress={() => toggleSelect(item.id)} style={styles.checkboxTouch}>
                <View style={[styles.checkboxBox, selectedIds.includes(item.id) && styles.checkboxSelected]}>
                  {selectedIds.includes(item.id) && <View style={styles.checkInner} />}
                </View>
              </TouchableOpacity>

              <Image source={FotoVinho} style={styles.wineImage} />

              <View style={styles.infoContainer}>
                <View style={styles.topInfoRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productYear}>{item.year}</Text>
                  </View>
                  <TouchableOpacity style={styles.deleteBtn}>
                    <Image source={IconExcluir} style={styles.xIcon} />
                  </TouchableOpacity>
                </View>

                <View style={styles.bottomInfoRow}>
                  <QntItem 
                    quantity={item.quantity} 
                    onIncrease={() => updateQuantity(item.id, 'add')}
                    onDecrease={() => updateQuantity(item.id, 'remove')}
                  />
                  <Text style={styles.productPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.totalLabel}>Total: R$ 330,87</Text>
        <TouchableOpacity style={styles.finishBtn}>
          <Text style={styles.finishText}>Finalizar compra</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E6' },
  headerTitleRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 15, 
    paddingBottom: 20,
    position: 'relative'
  },
  backBtn: { position: 'absolute', left: 20, top: 15, zIndex: 1 },
  backIcon: { width: 22, height: 22, resizeMode: 'contain' },
  pageTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    fontStyle: 'italic', 
    color: '#333',
    textAlign: 'center'
  },
  listWrapper: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  cartCard: { 
    backgroundColor: '#FAF7F0', 
    borderRadius: 30, 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    marginBottom: 20, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    shadowOffset: { width: 0, height: 2 } 
  },
  checkboxTouch: { padding: 5 },
  checkboxBox: { 
    width: 22, 
    height: 22, 
    borderWidth: 1.5, 
    borderColor: '#333', 
    borderRadius: 5, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  checkInner: { width: 12, height: 12, backgroundColor: '#333', borderRadius: 2 },
  wineImage: { width: 55, height: 90, resizeMode: 'contain', marginLeft: 5 },
  infoContainer: { flex: 1, marginLeft: 12, justifyContent: 'space-between', height: 90 },
  topInfoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  productName: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  productYear: { fontSize: 10, color: '#888' },
  deleteBtn: { padding: 5 },
  xIcon: { width: 22, height: 22, resizeMode: 'contain' }, 
  bottomInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  footerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: '#F5F0E6', 
    borderTopWidth: 0.5,
    borderTopColor: '#D1C8B4'
  },
  totalLabel: { fontSize: 22, fontWeight: '500', color: '#1A1A1A' },
  finishBtn: { 
    backgroundColor: '#FAF7F0', 
    paddingVertical: 10, 
    paddingHorizontal: 25, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#E0D6C1',
    elevation: 2
  },
  finishText: { fontSize: 12, fontWeight: 'bold', color: '#333' },
});