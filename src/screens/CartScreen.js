import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { submitCheckout } from "../services/cartService";

const ID_CLIENTE_PLACEHOLDER = 1; // substitua pelo id do seu contexto de auth

export default function CartScreen({ navigation, route }) {
  const id_cliente = route?.params?.id_cliente ?? ID_CLIENTE_PLACEHOLDER;
  const db = useSQLiteContext();
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [id_cliente]),
  );

  const loadCart = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const compra = await db.getFirstAsync(
        `SELECT * FROM compras WHERE id_cliente = ? AND status = 'pendente' ORDER BY data_compra DESC LIMIT 1`,
        [id_cliente],
      );
      if (!compra) {
        setItens([]);
        return;
      }
      const rows = await db.getAllAsync(
        `SELECT ic.id_item, ic.id_produto, ic.quantidade, ic.preco_unitario,
                p.nome, p.categoria, p.estoque,
                (SELECT url FROM produto_imagens WHERE id_produto = p.id_produto AND is_principal = 1 LIMIT 1) AS imagem_principal
         FROM itens_compra ic JOIN produtos p ON p.id_produto = ic.id_produto
         WHERE ic.id_compra = ?`,
        [compra.id_compra],
      );
      setItens(rows.map((r) => ({ ...r, id_compra: compra.id_compra })));
    } catch (err) {
      Alert.alert("Erro", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const recalcTotal = async (id_compra) => {
    const r = await db.getFirstAsync(
      `SELECT SUM(quantidade * preco_unitario) AS total FROM itens_compra WHERE id_compra = ?`,
      [id_compra],
    );
    await db.runAsync(
      `UPDATE compras SET valor_total = ? WHERE id_compra = ?`,
      [r?.total ?? 0, id_compra],
    );
  };

  const handleUpdateQty = async (item, delta) => {
    const novaQtd = item.quantidade + delta;
    if (novaQtd <= 0) {
      handleRemove(item);
      return;
    }
    if (novaQtd > item.estoque) {
      Alert.alert("Estoque insuficiente", `Disponível: ${item.estoque}`);
      return;
    }
    try {
      await db.runAsync(
        `UPDATE itens_compra SET quantidade = ? WHERE id_item = ?`,
        [novaQtd, item.id_item],
      );
      await recalcTotal(item.id_compra);
      setItens((prev) =>
        prev.map((i) =>
          i.id_item === item.id_item ? { ...i, quantidade: novaQtd } : i,
        ),
      );
    } catch (err) {
      Alert.alert("Erro", err.message);
    }
  };

  const handleRemove = (item) => {
    Alert.alert("Remover item", "Deseja remover este produto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await db.runAsync(`DELETE FROM itens_compra WHERE id_item = ?`, [
              item.id_item,
            ]);
            await recalcTotal(item.id_compra);
            setItens((prev) => prev.filter((i) => i.id_item !== item.id_item));
          } catch (err) {
            Alert.alert("Erro", err.message);
          }
        },
      },
    ]);
  };

  const handleClear = () => {
    if (!itens.length) return;
    Alert.alert("Limpar carrinho", "Remover todos os itens?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Limpar",
        style: "destructive",
        onPress: async () => {
          try {
            const id_compra = itens[0].id_compra;
            await db.runAsync(`DELETE FROM itens_compra WHERE id_compra = ?`, [
              id_compra,
            ]);
            await db.runAsync(
              `UPDATE compras SET valor_total = 0 WHERE id_compra = ?`,
              [id_compra],
            );
            setItens([]);
          } catch (err) {
            Alert.alert("Erro", err.message);
          }
        },
      },
    ]);
  };

  const handleCheckout = async () => {
    if (!itens.length) return;
    const endereco = await db.getFirstAsync(
      `SELECT id_endereco FROM endereco WHERE id_cliente = ? LIMIT 1`,
      [id_cliente],
    );
    if (!endereco) {
      Alert.alert(
        "Endereço necessário",
        "Cadastre um endereço de entrega antes de finalizar.",
      );
      return;
    }
    setCheckingOut(true);
    try {
      const { pedido } = await submitCheckout(
        id_cliente,
        endereco.id_endereco,
        itens.map((i) => ({
          id_produto: i.id_produto,
          nome: i.nome,
          preco_unitario: i.preco_unitario,
          quantidade: i.quantidade,
          estoque: i.estoque,
        })),
      );
      const id_compra = itens[0].id_compra;
      await db.runAsync(
        `UPDATE compras SET status = 'pago', valor_total = ? WHERE id_compra = ?`,
        [pedido.valor_total, id_compra],
      );
      setItens([]);
      Alert.alert(
        "Pedido confirmado! 🍷",
        `Total: R$ ${pedido.valor_total.toFixed(2)}`,
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } catch (err) {
      Alert.alert("Erro no pedido", err.message);
    } finally {
      setCheckingOut(false);
    }
  };

  const valorTotal = itens.reduce(
    (acc, i) => acc + i.quantidade * i.preco_unitario,
    0,
  );
  const WINE = "#7B2D1E";
  const WINE_LIGHT = "#F5EDE9";

  if (loading)
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color={WINE} />
      </View>
    );

  if (!itens.length)
    return (
      <SafeAreaView style={s.container}>
        <StatusBar barStyle="dark-content" />
        <View style={s.header}>
          <Text style={s.headerTitle}>Carrinho</Text>
        </View>
        <View style={s.centered}>
          <Text style={{ fontSize: 56, marginBottom: 12 }}>🛒</Text>
          <Text style={{ fontSize: 16, color: "#999", marginBottom: 24 }}>
            Seu carrinho está vazio
          </Text>
          <TouchableOpacity
            style={s.btnShop}
            onPress={() => navigation.goBack()}
          >
            <Text style={s.btnShopText}>Ver Produtos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <Text style={s.headerTitle}>Carrinho</Text>
        <TouchableOpacity onPress={handleClear}>
          <Text style={{ fontSize: 14, color: WINE, fontWeight: "600" }}>
            Limpar
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={itens}
        keyExtractor={(item) => String(item.id_item)}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 8,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadCart(true)}
            colors={[WINE]}
          />
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            {item.imagem_principal ? (
              <Image
                source={{ uri: item.imagem_principal }}
                style={s.img}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  s.img,
                  {
                    backgroundColor: WINE_LIGHT,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text style={{ fontSize: 28 }}>🍷</Text>
              </View>
            )}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={{ fontSize: 14, fontWeight: "700", color: "#1A0A06" }}
                numberOfLines={2}
              >
                {item.nome}
              </Text>
              <Text style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                {item.categoria}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: WINE,
                  fontWeight: "600",
                  marginTop: 4,
                }}
              >
                R$ {item.preco_unitario.toFixed(2)}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <TouchableOpacity
                  style={s.qtyBtn}
                  onPress={() => handleUpdateQty(item, -1)}
                >
                  <Text style={s.qtyBtnTxt}>−</Text>
                </TouchableOpacity>
                <Text style={s.qtyVal}>{item.quantidade}</Text>
                <TouchableOpacity
                  style={s.qtyBtn}
                  onPress={() => handleUpdateQty(item, +1)}
                >
                  <Text style={s.qtyBtnTxt}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginLeft: 16 }}
                  onPress={() => handleRemove(item)}
                >
                  <Text style={{ fontSize: 18 }}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "800",
                color: "#1A0A06",
                marginLeft: 8,
                minWidth: 70,
                textAlign: "right",
              }}
            >
              R$ {(item.quantidade * item.preco_unitario).toFixed(2)}
            </Text>
          </View>
        )}
      />
      <View style={s.footer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 17, color: "#555", fontWeight: "600" }}>
            Total
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "900", color: "#1A0A06" }}>
            R$ {valorTotal.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={[s.checkoutBtn, checkingOut && { opacity: 0.7 }]}
          onPress={handleCheckout}
          disabled={checkingOut}
        >
          {checkingOut ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "800",
                letterSpacing: 0.5,
              }}
            >
              Finalizar Pedido
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF7F5" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE8E4",
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#1A0A06" },
  btnShop: {
    backgroundColor: "#7B2D1E",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnShopText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 12,
    padding: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  img: { width: 68, height: 68, borderRadius: 10 },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#F5EDE9",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnTxt: {
    fontSize: 18,
    color: "#7B2D1E",
    fontWeight: "700",
    lineHeight: 22,
  },
  qtyVal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A0A06",
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: "center",
  },
  footer: {
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 90,
    borderTopWidth: 1,
    borderTopColor: "#EEE8E4",
  },
  checkoutBtn: {
    backgroundColor: "#7B2D1E",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#7B2D1E",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
