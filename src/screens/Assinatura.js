import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import BottomNav from '../components/BottomNav';

import ImgSelo from '../../assets/selo-assinatura.png';
import ImgKitIniciante from '../../assets/kit-iniciante.png';
import ImgKitEssentials from '../../assets/kit-essentials-collector.png';

const KitCard = ({ title, price, description, items, image }) => (
  <View style={styles.cardContainer}>
    <Image source={ImgSelo} style={styles.seloImage} />
    
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardPrice}>{price}</Text>
    
    <View style={styles.cardContent}>
      <View style={styles.imageWrapper}>
        <Image source={image} style={styles.kitImage} />
      </View>
      
      <View style={styles.textWrapper}>
        <Text style={styles.cardDescription}>{description}</Text>
        <View style={styles.itemsList}>
          {items.map((item, index) => (
            <Text key={index} style={styles.itemText}>
              <Text style={{ fontWeight: 'bold' }}>{item.qtd}</Text> {item.name}
            </Text>
          ))}
        </View>
      </View>
    </View>

    <TouchableOpacity style={styles.assinarButton}>
      <Text style={styles.assinarButtonText}>Assinar</Text>
    </TouchableOpacity>
  </View>
);

export default function Assinatura() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.bannerPlaceholder}>
          <Text style={styles.bannerText}>Banner</Text>
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Assinaturas</Text>
        </View>

        <View style={styles.introSection}>
          <Text style={styles.introText}>
            Sabemos que escolher o vinho certo nem sempre é fácil. Por isso, nossa curadoria faz o trabalho de buscar pelo mundo garrafas que expressem a alma de cada terroir e as traz direto para a sua taça.
          </Text>
          <Text style={styles.introText}>
            Seja para quem está dando os primeiros passos no mundo da uva ou para quem já coleciona safras e histórias, criamos experiências que se moldam à sua rotina. Escolha a assinatura que se encaixe melhor com o seu perfil.
          </Text>
        </View>

        <View style={styles.cardsSection}>
          <KitCard 
            title="Kit Iniciante"
            price="R$ XXX,XX /mês"
            description="Para quem está iniciando na degustação de vinhos e não sabe por onde começar."
            items={[
              { qtd: '2', name: 'Taças de vidro' },
              { qtd: '1', name: 'Saca rolha' },
              { qtd: '1', name: 'Rótulo curadoria da casa' }
            ]}
            image={ImgKitIniciante}
          />

          <KitCard 
            title="Kit Essentials"
            price="R$ XXX,XX /mês"
            description="A medida certa para quem aprecia um bom vinho com regularidade. Três rótulos selecionados para acompanhar seus jantares e momentos de lazer com amigos e família."
            items={[
              { qtd: '3', name: 'Rótulos curadoria da casa' }
            ]}
            image={ImgKitEssentials}
          />

          <KitCard 
            title="Kit Collector"
            price="R$ XXX,XX /mês"
            description="Mergulhe mais fundo na curadoria DeWine. Nove rótulos por mês para quem deseja explorar diferentes terroirs, safras e produtores, elevando a experiência da degustação a um novo nível."
            items={[
              { qtd: '9', name: 'Rótulos curadoria da casa' }
            ]}
            image={ImgKitEssentials}
          />
        </View>

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
    color: '#FAF7F0',
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
  introSection: {
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  introText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'justify', 
    marginBottom: 15,
    lineHeight: 18,
  },
  cardsSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: '#FAF7F0',
    borderRadius: 30,
    width: '100%',
    paddingTop: 35,
    paddingBottom: 25,
    paddingHorizontal: 15,
    marginBottom: 50, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    alignItems: 'center', 
  },
  seloImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
    zIndex: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: '#333',
    marginBottom: 5,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 15,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kitImage: {
    width: 130,
    height: 150, 
    resizeMode: 'contain',
  },
  textWrapper: {
    flex: 1.3,
    paddingLeft: 12,
  },
  cardDescription: {
    fontSize: 11,
    color: '#444',
    textAlign: 'justify', 
    marginBottom: 15,
    lineHeight: 16,
  },
  itemsList: {
    flexDirection: 'column',
  },
  itemText: {
    fontSize: 11,
    color: '#333',
    marginBottom: 5,
  },
  assinarButton: {
    backgroundColor: '#4A0E17',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginTop: 10,
  },
  assinarButtonText: {
    color: '#FAF7F0',
    fontSize: 12,
    fontWeight: '500',
  }
});