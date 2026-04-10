import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import FotoVinho from '../../assets/fotoExemplo.png';
import { useNavigation } from '@react-navigation/native';

export default function WineCard({ title, year, price, description, safra, category }) {
  const navigation = useNavigation();

  return (
      <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('DetalheVinho', {
        wineTitle: title,
        wineYear: year,
        winePrice: price,
        wineDesc: description,
        wineCat: category,
        wineSafra: safra
      })}>
      <Image source={FotoVinho} style={styles.wineImage} />

      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      <Text style={styles.year}>{year}</Text>
      <Text style={styles.price}>R$ {price}</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Adicionar ao Carrinho</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#faf7f0',
    borderRadius: 20,
    padding: 15,
    alignItems: 'flex-start',
    width: 160,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wineImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'left',
    marginBottom: 2,
    width: '100%',
  },
  year: {
    fontSize: 10,
    color: '#666',
    marginBottom: 8,
    textAlign: 'left',
    width: '100%',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#4A0E17',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 15,
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 9,
    textAlign: 'center',
    fontWeight: '500',
  }
});