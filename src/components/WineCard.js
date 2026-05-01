import React from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import FotoVinho from "../../assets/fotoExemplo.png";
import AddToCartButton from "./AddToCartButton";

export default function WineCard({ idCliente = 1, produto }) {
  const db = useSQLiteContext();

  const handleSaveLocal = async (itemValidado) => {
    let compra = await db.getFirstAsync(
      `SELECT * FROM compras WHERE id_cliente = ? AND status = 'pendente'
     ORDER BY data_compra DESC LIMIT 1`,
      [idCliente],
    );

    if (!compra) {
      const endereco = await db.getFirstAsync(
        `SELECT id_endereco FROM endereco WHERE id_cliente = ? LIMIT 1`,
        [idCliente],
      );
      const result = await db.runAsync(
        `INSERT INTO compras (id_cliente, id_endereco, valor_total, status)
       VALUES (?, ?, 0, 'pendente')`,
        [idCliente, endereco?.id_endereco ?? null],
      );
      compra = { id_compra: result.lastInsertRowId };
    }

    const itemExistente = await db.getFirstAsync(
      `SELECT * FROM itens_compra WHERE id_compra = ? AND id_produto = ?`,
      [compra.id_compra, itemValidado.id_produto],
    );

    if (itemExistente) {
      await db.runAsync(
        `UPDATE itens_compra SET quantidade = quantidade + ? WHERE id_item = ?`,
        [itemValidado.quantidade, itemExistente.id_item],
      );
    } else {
      await db.runAsync(
        `INSERT INTO itens_compra (id_compra, id_produto, quantidade, preco_unitario)
       VALUES (?, ?, ?, ?)`,
        [
          compra.id_compra,
          itemValidado.id_produto,
          itemValidado.quantidade,
          itemValidado.preco_unitario,
        ],
      );
    }

    const total = await db.getFirstAsync(
      `SELECT SUM(quantidade * preco_unitario) AS total
     FROM itens_compra WHERE id_compra = ?`,
      [compra.id_compra],
    );
    await db.runAsync(
      `UPDATE compras SET valor_total = ? WHERE id_compra = ?`,
      [total?.total ?? 0, compra.id_compra],
    );
  };

  return (
    <View style={styles.card}>
      <Image source={FotoVinho} style={styles.wineImage} />

      <Text style={styles.title} numberOfLines={2}>
        {produto?.nome ?? ""}
      </Text>
      <Text style={styles.year}>{produto?.ano_safra ?? ""}</Text>
      <Text style={styles.price}>
        R$ {Number(produto?.preco ?? 0).toFixed(2)}
      </Text>

      <AddToCartButton
        idCliente={1}
        produto={produto}
        quantidade={1}
        onSaveLocal={handleSaveLocal}
        onSuccess={() => Alert.alert("✓", "Adicionado ao carrinho!")}
        onError={(msg) => Alert.alert("Erro", msg)}
        style={styles.cartButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#faf7f0",
    borderRadius: 20,
    padding: 15,
    alignItems: "flex-start",
    width: 160,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wineImage: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
    alignSelf: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "left",
    marginBottom: 2,
    width: "100%",
  },
  year: {
    fontSize: 10,
    color: "#666",
    marginBottom: 8,
    textAlign: "left",
    width: "100%",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
    width: "100%",
  },
  cartButton: {
    width: "100%",
    minWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 15,
  },
});
