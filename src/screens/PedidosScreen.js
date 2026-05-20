import React, { useCallback, useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/auth";

const WINE = "#7B2D1E";

export default function PedidosScreen({ navigation }) {
  const db = useSQLiteContext();
  const { user } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPedidos = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const idCliente = user?.id_cliente ?? 1;
      const compras = await db.getAllAsync(
        `SELECT *
         FROM compras
         WHERE id_cliente = ? AND status != 'pendente'
         ORDER BY data_compra DESC`,
        [idCliente],
      );

      const comprasComItens = await Promise.all(
        compras.map(async (compra) => {
          const itens = await db.getAllAsync(
            `SELECT ic.id_item, ic.id_produto, ic.quantidade, ic.preco_unitario,
                    p.nome, p.categoria
             FROM itens_compra ic
             JOIN produtos p ON p.id_produto = ic.id_produto
             WHERE ic.id_compra = ?`,
            [compra.id_compra],
          );

          return { ...compra, itens };
        }),
      );

      setPedidos(comprasComItens);
    } catch (error) {
      console.log("Erro ao listar pedidos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPedidos();
    }, [user?.id_cliente]),
  );

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("pt-BR");
  };

  const openPaymentLink = async (url) => {
    if (!url) return;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) await Linking.openURL(url);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={WINE} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Meus Pedidos</Text>
      </View>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => String(item.id_compra)}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadPedidos(true)}
            colors={[WINE]}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Nenhum pedido encontrado</Text>
            <Text style={styles.emptyText}>
              Os pedidos finalizados aparecem aqui.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.orderTitle}>Pedido #{item.id_compra}</Text>
                <Text style={styles.date}>{formatDate(item.data_compra)}</Text>
              </View>
              <Text style={styles.status}>{item.status}</Text>
            </View>

            <Text style={styles.total}>
              Total: R$ {Number(item.valor_total ?? 0).toFixed(2)}
            </Text>

            {item.pagseguro_reference_id ? (
              <View style={styles.paymentBox}>
                <Text style={styles.paymentLabel}>PagSeguro</Text>
                <Text style={styles.paymentText}>
                  Referencia: {item.pagseguro_reference_id}
                </Text>
                <Text style={styles.paymentText}>
                  Status: {item.pagseguro_status ?? "CRIADO"}
                </Text>
                {item.pagseguro_link ? (
                  <TouchableOpacity
                    onPress={() => openPaymentLink(item.pagseguro_link)}
                  >
                    <Text style={styles.linkText}>Abrir checkout sandbox</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}

            <View style={styles.items}>
              {item.itens.map((produto) => (
                <Text key={produto.id_item} style={styles.itemText}>
                  {produto.quantidade}x {produto.nome} - R${" "}
                  {(produto.quantidade * produto.preco_unitario).toFixed(2)}
                </Text>
              ))}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF7F5" },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF7F5",
  },
  header: {
    backgroundColor: "#fff",
    borderBottomColor: "#EEE8E4",
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backText: {
    color: WINE,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  title: { color: "#1A0A06", fontSize: 24, fontWeight: "800" },
  list: { padding: 16, paddingBottom: 100 },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyTitle: { color: "#1A0A06", fontSize: 18, fontWeight: "800" },
  emptyText: { color: "#777", fontSize: 14, marginTop: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderTitle: { color: "#1A0A06", fontSize: 17, fontWeight: "800" },
  date: { color: "#777", fontSize: 12, marginTop: 2 },
  status: {
    backgroundColor: "#F5EDE9",
    borderRadius: 8,
    color: WINE,
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 5,
    textTransform: "uppercase",
  },
  total: {
    color: "#1A0A06",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 14,
  },
  paymentBox: {
    backgroundColor: "#FAF7F5",
    borderRadius: 10,
    marginTop: 12,
    padding: 12,
  },
  paymentLabel: { color: WINE, fontSize: 13, fontWeight: "800" },
  paymentText: { color: "#555", fontSize: 12, marginTop: 4 },
  linkText: { color: WINE, fontSize: 13, fontWeight: "800", marginTop: 8 },
  items: { borderTopColor: "#EEE8E4", borderTopWidth: 1, marginTop: 12, paddingTop: 10 },
  itemText: { color: "#444", fontSize: 13, marginBottom: 4 },
});
