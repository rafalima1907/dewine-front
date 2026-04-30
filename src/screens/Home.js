import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import WineCard from "../components/WineCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const database = useSQLiteContext();

  const getProducts = async () => {
    const result = await database.getAllAsync("SELECT * FROM produtos");
    setProducts(result);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const firstRow = products.slice(0, 4);

  const secondRow = products.slice(4, 8);
  // console.log(secondRow);
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Image
            source={require("../../assets/imagemPrincipalHome.png")}
            style={styles.wineImage}
          />
          <Text style={styles.title}>Novos Lançamentos</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardList}
            style={{ marginBottom: 20 }}
          >
            {firstRow.map((product) => {
              return (
                <WineCard
                  key={product.id_produto}
                  title={product.nome}
                  year={product.id_produto + 1980}
                  price={product.preco}
                />
              );
            })}
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardList}
          >
            {secondRow.map((product) => (
              <WineCard
                key={product.id_produto}
                title={product.nome}
                year={product.id_produto + 1920}
                price={product.preco}
              />
            ))}
          </ScrollView>
          <Image
            source={require("../../assets/segundaImagemHome.png")}
            style={styles.wineImage2}
          />
        </View>

        {/* <BottomNav></BottomNav> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#E8E0CC",
  },
  title: {
    fontSize: 28,
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 15,
    fontWeight: "300",
  },
  cardList: {
    paddingHorizontal: 20,
  },
  wineImage2: {
    marginBottom: 80,
  }
});
