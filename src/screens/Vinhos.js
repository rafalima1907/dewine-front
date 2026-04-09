import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import WineCard from '../components/WineCard';
import BottomNav from '../components/BottomNav';

export default function Vinhos() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.bannerPlaceholder}>
          <Text style={styles.bannerText}>Banner</Text>
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Vinhos</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Filtros</Text>
            <Image source={require('../../assets/icons/filtro.png')} style={styles.filterIcon} />
          </TouchableOpacity>
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

        <View style={{ height: 100 }} /> 
      </ScrollView>

      {/* <BottomNav /> */}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#333',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E3D5',
  },
  filterText: {
    marginRight: 8,
    fontSize: 12,
    color: '#333',
  },
  filterIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  carouselContainer: {
    paddingLeft: 20, 
    paddingRight: 5, 
    paddingBottom: 25, 
  }
});