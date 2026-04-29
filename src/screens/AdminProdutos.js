import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { Ionicons } from "@expo/vector-icons";

export default function AdminProdutos() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const database = useSQLiteContext();

  const getProducts = async () => {
    try {
      const result = await database.getAllAsync("SELECT * FROM produtos");
      setProducts(result);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleView = (produto) => {
    navigation.navigate("DescricaoVinho", { produto: produto });
  };

  const handleEdit = (item) => {
    navigation.navigate("CadProdutos", { produto: item, isEdit: true });
  };

  const handleDelete = (id, nome) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o vinho ${nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await database.runAsync("DELETE FROM produtos WHERE id_produto = ?", [id]);
              getProducts();
            } catch (error) {
              console.error("Erro ao excluir produto:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerTitleRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Image
            source={require("../../assets/icons/seta_voltar.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Gerenciar Vinhos</Text>
      </View>

      <View style={styles.listWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {products.map((item) => (
            <View key={item.id_produto} style={styles.card}>
              <Image
                source={require("../../assets/fotoExemplo.png")}
                style={styles.wineImage}
              />

              <View style={styles.infoContainer}>
                <View>
                  <Text style={styles.productName}>{item.nome}</Text>
                  <Text style={styles.productYear}>{item.ano_safra}</Text>
                </View>
                <Text style={styles.productPrice}>
                  R$ {Number(item.preco).toFixed(2).replace(".", ",")}
                </Text>
              </View>

              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  onPress={() => handleView(item)}
                  style={styles.iconBtn}
                >
                  <Ionicons name="eye-outline" size={24} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleEdit(item)}
                  style={styles.iconBtn}
                >
                  <Ionicons name="pencil-outline" size={20} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item.id_produto, item.nome)}
                  style={styles.iconBtn}
                >
                  <Image
                    source={require("../../assets/icons/x.png")}
                    style={styles.xIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F0E6",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    position: "relative",
  },
  backBtn: {
    position: "absolute",
    left: 20,
    top: 15,
    zIndex: 1,
  },
  backIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#333",
    textAlign: "center",
  },
  listWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#FAF7F0",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  wineImage: {
    width: 55,
    height: 90,
    resizeMode: "contain",
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    height: 90,
  },
  productName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
  },
  productYear: {
    fontSize: 10,
    color: "#888",
    marginTop: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: "auto",
  },
  actionsContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    height: 90,
    paddingLeft: 10,
  },
  iconBtn: {
    padding: 5,
  },
  xIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
});
