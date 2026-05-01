import React, { useState, useEffect } from "react";
import {
    View, Text, StyleSheet, ImageBackground, TextInput,
    TouchableOpacity, Image, KeyboardAvoidingView,
    Platform, ScrollView, Alert
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { api } from "../services/api";

import ImageFundo from "../../assets/ImageFundo.png";
import SetaVoltar from "../../assets/icons/seta_voltar.png";

export default function CadProdutos() {
    const database = useSQLiteContext();
    const navigation = useNavigation();
    const route = useRoute();
    const { produto, isEdit } = route.params || {};

    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [categoria, setCategoria] = useState("");
    const [anoSafra, setAnoSafra] = useState("");
    const [descricao, setDescricao] = useState("");
    const [estoque, setEstoque] = useState("");
    const [imagem, setImagem] = useState(null);

    useEffect(() => {
        if (isEdit && produto) {
            setNome(produto.nome || "");
            setPreco(produto.preco ? produto.preco.toString() : "");
            setCategoria(produto.categoria || "");
            setAnoSafra(produto.ano_safra ? produto.ano_safra.toString() : "");
            setDescricao(produto.descricao || "");
            setEstoque(produto.estoque ? produto.estoque.toString() : "");
            setImagem(produto.url_imagem || null);
        }
    }, [isEdit, produto]);

    const selecionarImagem = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImagem(result.assets[0].uri);
        }
    };

    async function handleCadastroProduto() {
        try {
            if (!nome || !preco || !estoque || !imagem) {
                throw new Error("Nome, Preço, Estoque e Imagem são obrigatórios!");
            }

            const precoFormatado = parseFloat(preco.replace(',', '.'));
            const estoqueFormatado = parseInt(estoque);
            const safraFormatada = anoSafra ? parseInt(anoSafra) : null;

            const url = isEdit ? `${api}produtos/editar/${produto.id_produto}` : `${api}produtos/cadastro`;
            const method = isEdit ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome,
                    preco: precoFormatado,
                    categoria,
                    descricao,
                    ano_safra: safraFormatada,
                    estoque: estoqueFormatado,
                    url_imagem: imagem
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data?.message || "Erro no servidor");

            if (isEdit) {
                await database.runAsync(
                    `UPDATE produtos SET nome = ?, preco = ?, categoria = ?, descricao = ?, ano_safra = ?, estoque = ? WHERE id_produto = ?`,
                    [nome, precoFormatado, categoria, descricao, safraFormatada, estoqueFormatado, produto.id_produto]
                );

                await database.runAsync(
                    `DELETE FROM produto_imagens WHERE id_produto = ?`,
                    [produto.id_produto]
                );
                await database.runAsync(
                    `INSERT INTO produto_imagens (id_produto, url, is_principal) VALUES (?, ?, ?)`,
                    [produto.id_produto, imagem, 1]
                );
            } else {
                const result = await database.runAsync(
                    `INSERT INTO produtos (nome, preco, categoria, descricao, ano_safra, estoque) VALUES (?, ?, ?, ?, ?, ?)`,
                    [nome, precoFormatado, categoria, descricao, safraFormatada, estoqueFormatado]
                );

                const idInserido = result.lastInsertRowId;

                await database.runAsync(
                    `INSERT INTO produto_imagens (id_produto, url, is_principal) VALUES (?, ?, ?)`,
                    [idInserido, imagem, 1]
                );
            }

            setNome("");
            setPreco("");
            setCategoria("");
            setAnoSafra("");
            setDescricao("");
            setEstoque("");
            setImagem(null);

            navigation.goBack();

        } catch (error) {
            console.log("Erro ao cadastrar produto:", error);
            Alert.alert("Erro", error.message);
        }
    }

    return (
        <ImageBackground source={ImageFundo} style={styles.background}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Image source={SetaVoltar} style={styles.backIcon} />
                    </TouchableOpacity>

                    <View style={styles.card}>
                        <Text style={styles.title}>{isEdit ? 'Editar Produto' : 'Cadastrar Produto'}</Text>

                        <TouchableOpacity style={styles.imagePlaceholder} onPress={selecionarImagem}>
                            {imagem ? (
                                <Image source={{ uri: imagem }} style={styles.imagePreview} />
                            ) : (
                                <Text style={styles.imagePlaceholderText}>+ Selecionar Foto</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.inputGroup}>
                            {/* Nome - Ocupa a linha toda */}
                            <TextInput style={styles.input} placeholder="Nome do Vinho *" placeholderTextColor="rgba(255,255,255,0.6)" value={nome} onChangeText={setNome} />

                            <View style={styles.row}>
                                <TextInput style={[styles.input, styles.halfInput]} placeholder="Preço *" placeholderTextColor="rgba(255,255,255,0.6)" value={preco} onChangeText={setPreco} keyboardType="numeric" />
                                <TextInput style={[styles.input, styles.halfInput]} placeholder="Estoque *" placeholderTextColor="rgba(255,255,255,0.6)" value={estoque} onChangeText={setEstoque} keyboardType="numeric" />
                            </View>

                            <View style={styles.row}>
                                <TextInput style={[styles.input, styles.halfInput]} placeholder="Categoria" placeholderTextColor="rgba(255,255,255,0.6)" value={categoria} onChangeText={setCategoria} />
                                <TextInput style={[styles.input, styles.halfInput]} placeholder="Ano Safra" placeholderTextColor="rgba(255,255,255,0.6)" value={anoSafra} onChangeText={setAnoSafra} keyboardType="numeric" />
                            </View>

                            <TextInput style={[styles.input, styles.textArea]} placeholder="Descrição" placeholderTextColor="rgba(255,255,255,0.6)" value={descricao} onChangeText={setDescricao} multiline={true} textAlignVertical="top" />
                        </View>

                        <TouchableOpacity style={styles.btnCadastrar} onPress={handleCadastroProduto}>
                            <Text style={styles.btnText}>Salvar Produto</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, width: "100%", height: "100%" },
    container: { flexGrow: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, paddingVertical: 40 },
    backBtn: { position: "absolute", top: 20, left: 0, padding: 10 },
    backIcon: { width: 25, height: 25, tintColor: "#F5F0E6" },
    card: { width: "100%", backgroundColor: "rgba(74, 14, 23, 0.85)", borderRadius: 30, padding: 25, alignItems: "center" },
    title: { fontSize: 28, fontFamily: "serif", color: "#F5F0E6", marginBottom: 20, letterSpacing: 2 },
    imagePlaceholder: { width: '100%', height: 150, borderRadius: 15, borderStyle: 'dashed', borderWidth: 1, borderColor: '#F5F0E6', justifyContent: 'center', alignItems: 'center', marginBottom: 20, overflow: 'hidden' },
    imagePlaceholderText: { color: '#F5F0E6', fontSize: 16 },
    imagePreview: { width: '100%', height: '100%' },
    inputGroup: { width: "100%" },
    input: { width: "100%", minHeight: 50, borderWidth: 1, borderColor: "#F5F0E6", borderRadius: 25, marginBottom: 15, paddingHorizontal: 20, color: "#F5F0E6" },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    halfInput: { width: '48%' },
    textArea: { minHeight: 80, paddingTop: 15, borderRadius: 20 },
    btnCadastrar: { backgroundColor: "#F5F0E6", width: "100%", height: 55, borderRadius: 25, alignItems: "center", justifyContent: "center", marginTop: 10 },
    btnText: { fontSize: 18, fontWeight: "bold", color: "#4A0E17", fontFamily: "serif" },
});