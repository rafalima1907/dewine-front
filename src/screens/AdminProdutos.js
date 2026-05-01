import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../services/api";

export default function AdminProdutos() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const database = useSQLiteContext();

  const getProducts = async () => {
    try {
      const query = `
        SELECT p.*, i.url as url_imagem 
        FROM produtos p 
        LEFT JOIN produto_imagens i ON p.id_produto = i.id_produto
      `;
      const result = await database.getAllAsync(query);
      setProducts(result || []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getProducts();
    }, [])
  );

  const handleView = (produto) => {
    setProdutoSelecionado(produto);
    setModalVisible(true);
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
              const response = await fetch(`${api}produtos/excluir/${id}`, {
                method: "DELETE",
              });

              if (response.ok) {
                await database.runAsync("DELETE FROM produtos WHERE id_produto = ?", [id]);
                getProducts();
              }
            } catch (error) {
              console.error(error);
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
        <TouchableOpacity
          onPress={() => navigation.navigate("CadProdutos", { isEdit: false })}
          style={styles.addBtn}
        >
          <Text style={styles.addBtnText}>+ Novo Produto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {products?.map((item) => (
            <View key={item.id_produto} style={styles.card}>
              <Image
                source={item.url_imagem ? { uri: item.url_imagem } : require("../../assets/fotoExemplo.png")}
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {produtoSelecionado && (
              <>
                <Image
                  source={produtoSelecionado.url_imagem ? { uri: produtoSelecionado.url_imagem } : require("../../assets/fotoExemplo.png")}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{produtoSelecionado.nome}</Text>

                <ScrollView style={styles.modalScroll}>
                  <Text style={styles.modalText}>
                    <Text style={styles.modalLabel}>Categoria: </Text>
                    {produtoSelecionado.id_categoria}
                  </Text>
                  <Text style={styles.modalText}>
                    <Text style={styles.modalLabel}>Preço: </Text>
                    R$ {Number(produtoSelecionado.preco).toFixed(2).replace(".", ",")}
                  </Text>
                  <Text style={styles.modalText}>
                    <Text style={styles.modalLabel}>Estoque: </Text>
                    {produtoSelecionado.quantidade_estoque}
                  </Text>
                  <Text style={styles.modalText}>
                    <Text style={styles.modalLabel}>Safra: </Text>
                    {produtoSelecionado.ano_safra}
                  </Text>
                  <Text style={styles.modalText}>
                    <Text style={styles.modalLabel}>Descrição: </Text>
                    {produtoSelecionado.descricao}
                  </Text>
                </ScrollView>

                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    textAlign: "center",
  },
  addBtn: {
    position: "absolute",
    right: 20,
    top: 18,
    zIndex: 1,
  },
  addBtnText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#FAF7F0",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  modalImage: {
    width: 100,
    height: 150,
    resizeMode: "contain",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  modalScroll: {
    width: "100%",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
    lineHeight: 20,
  },
  modalLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  modalCloseBtn: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  modalCloseText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});