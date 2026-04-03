import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, 
  TouchableOpacity, Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Importando seus componentes (sem o BottomNav)
import WineCard from '../components/WineCard';
import QntItem from '../components/QntItem';

const { width } = Dimensions.get('window');

export default function DescricaoVinho() {
  const navigation = useNavigation();
  const [similares, setSimilares] = useState([]);
  const [verMaisAberto, setVerMaisAberto] = useState(false);
  const [quantidade, setQuantidade] = useState(1);
  const database = useSQLiteContext();

  // Busca produtos reais da sua tabela 'produtos'
  const getSimilares = async () => {
    try {
      const result = await database.getAllAsync("SELECT * FROM produtos LIMIT 4");
      setSimilares(result);
    } catch (error) {
      console.error("Erro ao buscar similares:", error);
    }
  };

  useEffect(() => {
    getSimilares();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Botão Voltar */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image source={require('../../assets/icons/seta_voltar.png')} style={styles.backImg} />
        </TouchableOpacity>

        {/* SEÇÃO HERO */}
        <View style={styles.heroSection}>
          {!verMaisAberto && <View style={styles.redBackground} />}
          
          <View style={styles.contentRow}>
            <View style={styles.textColumn}>
              <Text style={[styles.title, styles.fontJacques]}>Cabernet Sauvignon Watchful Eye</Text>
              
              <Text style={styles.description}>
                O Sauvignon Blanc da Outersounds e como uma noite quente de julho em uma taça. 
                O vinho se revela com o aroma de uma brisa de verão. Na taça, o limão vibrante 
                ganha vida em uma explosão de sol de verão.
              </Text>

              <View style={styles.priceRow}>
                <Text style={[styles.price, styles.fontJacques]}>R$ 110,29</Text>
                
                {/* Seu componente QntItem */}
                <QntItem 
                  quantity={quantidade} 
                  onIncrease={() => setQuantidade(q => q + 1)}
                  onDecrease={() => setQuantidade(q => q > 1 ? q - 1 : 1)}
                />
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.mainBtn} activeOpacity={0.8}>
                  <Text style={[styles.btnText, styles.fontJacques]}>Finalizar compra</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.basketBtn}>
                  <Image source={require('../../assets/icons/carrinho.png')} style={styles.iconBasket} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.verMais} onPress={() => setVerMaisAberto(!verMaisAberto)}>
                <Text style={[styles.verMaisText, styles.fontJacques]}>
                  {verMaisAberto ? "Ver Menos" : "Ver Mais"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.imageColumn}>
               <Image source={require('../../assets/Vinho2.png')} style={styles.wineImage} />
            </View>
          </View>
        </View>

        {/* DETALHES TÉCNICOS - Agora completo conforme o print */}
        {verMaisAberto && (
          <View style={styles.detailsSection}>
            {/* Primeira Linha */}
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, styles.fontJacques]}>País:</Text>
                <Text style={[styles.detailValue, styles.fontJacques]}>Austrália</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, styles.fontJacques]}>Tipo do vinho:</Text>
                <Text style={[styles.detailValue, styles.fontJacques]}>Vermelho, seco e de corpo médio</Text>
              </View>
            </View>

            {/* Segunda Linha */}
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, styles.fontJacques]}>Safra:</Text>
                <Text style={[styles.detailValue, styles.fontJacques]}>2021-2022</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, styles.fontJacques]}>Harmonize bem com:</Text>
                <Text style={[styles.detailValue, styles.fontJacques]}>Carnes grelhadas, massas e queijos</Text>
              </View>
            </View>
          </View>
        )}

        {/* PRODUTOS SIMILARES - Usando seu WineCard */}
        <Text style={[styles.sectionTitle, styles.fontJacques]}>Produtos similares</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardList}>
          {similares.map((product) => (
            <WineCard
              key={product.id_produto}
              title={product.nome}
              year={product.id_produto + 1920}
              price={product.preco.toFixed(2)}
            />
          ))}
        </ScrollView>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E0CC' },
  scrollContent: { paddingBottom: 20 },
  fontJacques: { fontFamily: 'JacquesFrancois-Regular' },

  backBtn: { paddingLeft: 20, marginTop: 20, zIndex: 50 },
  backImg: { width: 25, height: 25, resizeMode: 'contain' },

  heroSection: { width: '100%', position: 'relative', paddingBottom: 20 },
  redBackground: { 
    position: 'absolute', right: 0, top: 0, height: 380, width: width * 0.27, 
    backgroundColor: '#4E0000', borderBottomLeftRadius: 200, borderTopLeftRadius: 580, zIndex: 1 
  },
  
  contentRow: { flexDirection: 'row', width: '100%', zIndex: 10 },
  textColumn: { width: '60%', paddingLeft: 25, paddingTop: 10 },

  title: { fontSize: 22, color: '#1A1A1A', marginBottom: 10, fontWeight: 'bold' },
  description: { fontSize: 10, lineHeight: 15, color: '#444', textAlign: 'justify' },
  price: { fontSize: 24, color: '#1A1A1A', marginRight: 15 },
  
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  actionRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  mainBtn: { backgroundColor: '#FAF7F0', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, elevation: 3 },
  btnText: { fontSize: 16, color: '#1A1A1A' },
  basketBtn: { marginLeft: 15 },
  iconBasket: { width: 30, height: 30, resizeMode: 'contain' },
  verMais: { marginTop: 20 },
  verMaisText: { fontSize: 13, textDecorationLine: 'underline' },

  imageColumn: { width: '40%', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 70 },
  wineImage: { width: width * 0.38, height: 350, resizeMode: 'contain', marginTop: -20 },

  detailsSection: { paddingHorizontal: 25, marginTop: 20 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailItem: { width: '48%' },
  detailLabel: { fontSize: 12, fontWeight: 'bold' },
  detailValue: { fontSize: 11, color: '#444' },

  sectionTitle: { fontSize: 28, marginLeft: 20, marginTop: 30, marginBottom: 15 },
  cardList: { paddingHorizontal: 20 }
});