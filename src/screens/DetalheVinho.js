import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';

import QntItem from '../components/QntItem';
import WineCard from '../components/WineCard';

const { width } = Dimensions.get('window');

export default function DetalheVinho() {
  const navigation = useNavigation();
  const route = useRoute();
  const database = useSQLiteContext();
  
  const [quantidade, setQuantidade] = useState(1);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [similares, setSimilares] = useState([]);

  const { 
    wineTitle = "Vinho", 
    winePrice = "0,00",
    wineSafra = "N/D",
    wineYear = "N/D",
    wineDesc = "Descrição não disponível.",
    wineCat = "Não classificado"
  } = route.params || {};

  const getSimilares = async () => {
    try {
      const result = await database.getAllAsync("SELECT * FROM produtos LIMIT 4");
      setSimilares(result);
    } catch (error) {
      console.log("Erro ao buscar similares:", error);
    }
  };

  useEffect(() => {
    getSimilares();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Image source={require('../../assets/icons/seta_voltar.png')} style={styles.backImg} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroSection}>
          <View style={styles.redBackground} />

          <View style={styles.contentRow}>
            <View style={styles.textColumn}>
              
              <Text style={styles.title}>{wineTitle}</Text>
              
              <Text style={styles.description}>
                {wineDesc}
              </Text>

              <View style={styles.priceRow}>
                <Text style={styles.price}>R$ {winePrice}</Text>
                
                <QntItem 
                  quantity={quantidade} 
                  onIncrease={() => setQuantidade(q => q + 1)}
                  onDecrease={() => setQuantidade(q => q > 1 ? q - 1 : 1)}
                />
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.mainBtn}>
                  <Text style={styles.btnText}>Finalizar compra</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.basketBtn}>
                  <Image source={require('../../assets/icons/carrinho.png')} style={styles.iconBasket} />
                </TouchableOpacity>
              </View>

            </View>

            <View style={styles.imageColumn}>
               <Image source={require('../../assets/fotoExemplo.png')} style={styles.wineImage} />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.verMaisContainer}
          onPress={() => setMostrarDetalhes(!mostrarDetalhes)}
        >
          <Text style={styles.verMaisText}>
            {mostrarDetalhes ? "Ver Menos" : "Ver Mais"}
          </Text>
          <Ionicons 
            name={mostrarDetalhes ? "chevron-up" : "chevron-down"} 
            size={16} 
            color="#1A1A1A" 
          />
        </TouchableOpacity>

        {mostrarDetalhes && (
          <View style={styles.detailsGrid}>
            <View style={styles.detailColumnInfo}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>País:</Text>
                <Text style={styles.detailValue}>Brasil</Text> 
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Safra:</Text>
                <Text style={styles.detailValue}>{wineSafra}</Text>
              </View>
            </View>

            <View style={styles.detailColumnInfo}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Tipo do vinho:</Text>
                <Text style={styles.detailValue}>{wineCat}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.similaresSection}>
          <Text style={styles.similaresTitle}>Produtos similares</Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.similaresList}
          >
            {similares.map((product) => (
              <WineCard
                key={product.id_produto}
                title={product.nome}
                price={product.preco.toFixed(2)}
                safra={product.ano_safra} 
                description={product.descricao}
                category={product.categoria}
              />
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#E8E0CC'
  },
  scrollContent: { 
    paddingBottom: 40 
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 5,
    zIndex: 50
  },
  backBtn: { 
    padding: 5,
    marginLeft: -5
  },
  backImg: { 
    width: 22, 
    height: 22, 
    resizeMode: 'contain', 
    tintColor: '#000' 
  },
  heroSection: { 
    width: '100%', 
    position: 'relative' 
  },
  redBackground: { 
    position: 'absolute', 
    right: 0, 
    top: -50, 
    height: 500, 
    width: width * 0.35, 
    backgroundColor: '#5C0A11', 
    borderTopLeftRadius: 200,
    borderBottomLeftRadius: 200,
    zIndex: 1 
  },
  contentRow: { 
    flexDirection: 'row', 
    width: '100%', 
    paddingHorizontal: 20,
    zIndex: 10 
  },
  textColumn: { 
    width: '60%', 
    paddingRight: 10
  },
  title: { 
    fontSize: 22, 
    color: '#1A1A1A', 
    marginBottom: 15, 
    fontFamily: 'serif' 
  },
  description: { 
    fontSize: 11, 
    lineHeight: 16, 
    color: '#333', 
    textAlign: 'justify',
    fontFamily: 'serif' 
  },
  priceRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 30 
  },
  price: { 
    fontSize: 18, 
    color: '#1A1A1A', 
    marginRight: 15,
    fontFamily: 'serif' 
  },
  actionRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginTop: 20 
  },
  mainBtn: { 
    backgroundColor: '#F7EFE1', 
    paddingVertical: 12, 
    paddingHorizontal: 15, 
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 }
  },
  btnText: { 
    fontSize: 14, 
    color: '#1A1A1A',
    fontFamily: 'serif',
    fontWeight: '500'
  },
  basketBtn: { 
    marginLeft: 15 
  },
  iconBasket: { 
    width: 24, 
    height: 24, 
    resizeMode: 'contain' 
  },
  imageColumn: { 
    width: '40%', 
    alignItems: 'center',
    paddingTop: 10
  },
  wineImage: { 
    width: 280, 
    height: 400, 
    resizeMode: 'contain', 
    marginLeft: 50 
  },
  verMaisContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35, 
    marginBottom: 10,
  },
  verMaisText: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#1A1A1A',
    marginRight: 5, 
  },
  detailsGrid: {
    flexDirection: 'row',
    marginTop: 20, 
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  detailColumnInfo: {
    width: '48%'
  },
  detailItem: {
    marginBottom: 20
  },
  detailLabel: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'serif',
    marginBottom: 2
  },
  detailValue: {
    fontSize: 12,
    color: '#1A1A1A',
    fontFamily: 'serif',
    fontWeight: 'bold'
  },

  similaresSection: {
    marginTop: 40,
  },
  similaresTitle: {
    fontSize: 22,
    fontFamily: 'serif',
    color: '#1A1A1A',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  similaresList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  }
});