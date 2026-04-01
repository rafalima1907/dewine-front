import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import WineCard from '../components/WineCard';
import BottomNav from '../components/BottomNav';

import FotoBestSellers from '../../assets/BestSellersExemplo.png';

export default function Exclusivos() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.bannerPlaceholder}>
          <Text style={styles.bannerText}>Banner</Text>
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Exclusivos</Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.carouselContainer}
        >
          <WineCard title="Cabernet Sauvignon Watchful Eye" year="2021" price="110,29" />
          <WineCard title="Cabernet Sauvignon Watchful Eye" year="2021" price="110,29" />
          <WineCard title="Cabernet Sauvignon Watchful Eye" year="2021" price="110,29" />
          <WineCard title="Cabernet Sauvignon Watchful Eye" year="2021" price="110,29" />
        </ScrollView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.carouselContainer}
        >
          <WineCard title="Cabernet Sauvignon Watchful Eye" year="2021" price="110,29" />
          <WineCard title="Cabernet Sauvignon Watchful Eye" year="2021" price="110,29" />
          <WineCard title="Cabernet Sauvignon Watchful Eye" year="2021" price="110,29" />
          <WineCard title="Cabernet Sauvignon Watchful Eye" year="2021" price="110,29" />
        </ScrollView>

        <View style={styles.bestSellersCard}>
          <Text style={styles.bestSellersTitle}>Conheça Nossos Best Sellers</Text>
          
          <Image source={FotoBestSellers} style={styles.bestSellersImage} />

          <TouchableOpacity style={styles.saibaMaisButton}>
            <Text style={styles.saibaMaisText}>Saiba Mais</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} /> 
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E6', 
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bannerPlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#4A0E17',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    color: '#555',
    fontStyle: 'italic',
  },
  headerRow: {
    alignItems: 'center', 
    paddingVertical: 15,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#333',
  },
  carouselContainer: {
    paddingLeft: 20, 
    paddingRight: 5, 
    paddingBottom: 25, 
  },
  
  // ESTILOS DO CARD DE BEST SELLERS
  bestSellersCard: {
    backgroundColor: '#FAF7F0',
    borderRadius: 25,
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bestSellersTitle: {
    fontSize: 22,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  bestSellersImage: {
    width: '100%',
    height: 180, 
    resizeMode: 'contain',
    marginBottom: 20,
  },
  saibaMaisButton: {
    backgroundColor: '#4A0E17',
    paddingVertical: 10,
    paddingHorizontal: 35, 
    borderRadius: 20,
  },
  saibaMaisText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  }
});