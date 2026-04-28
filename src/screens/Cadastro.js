import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { AuthContext } from "../context/auth";
import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { api } from "../services/api";
import ImageFundo from "../../assets/ImageFundo.png";
import SetaVoltar from "../../assets/icons/seta_voltar.png";

export default function Cadastro() {
  const { successToast, errorToast } = useContext(AuthContext);
  const database = useSQLiteContext();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [cep, setCep] = useState("");
  const [nome, setNome] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  function validarEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function validarCPF(cpf) {
    return cpf.replace(/\D/g, "").length === 11;
  }

  function validarCEP(cep) {
    return cep.replace(/\D/g, "").length === 8;
  }

  async function handleCadastro() {
    try {
      if (!email || !senha || !confirmarSenha || !cpf || !cep || !nome) {
        throw new Error("Preencha todos os campos");
      }

      if (!validarEmail(email)) {
        throw new Error("Email inválido");
      }

      if (!validarCPF(cpf)) {
        throw new Error("CPF inválido");
      }

      if (!validarCEP(cep)) {
        throw new Error("CEP inválido");
      }

      if (senha !== confirmarSenha) {
        throw new Error("As senhas não coincidem");
      }

      // 🔹 1. Chamada API
      const response = await fetch(`${api}users/cadastro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
          confirmarSenha,
          cpf,
          cep,
          nome,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Erro ao cadastrar");
      }

      const result = await database.runAsync(
        `INSERT INTO cliente (nome, senha, cpf) VALUES (?, ?, ?)`,
        [data.cliente.nome, data.cliente.senhaHash, data.cliente.cpf],
      );

      const idCliente = result.lastInsertRowId;

      await database.runAsync(
        `INSERT INTO email (id_cliente, email, tipo) VALUES (?, ?, ?)`,
        [idCliente, email, "principal"],
      );

      successToast("Sucesso", "Cadastro realizado!");

      navigation.navigate("Login");
    } catch (error) {
      console.log("Erro cadastro:", error);
      errorToast("Erro", error.message);
    }
  }
  return (
    <ImageBackground
      source={ImageFundo}
      style={styles.background}
      imageStyle={{ opacity: 0.9 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Image source={SetaVoltar} style={styles.backIcon} />
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.title}>CADASTRO</Text>

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="CEP"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={cep}
                onChangeText={setCep}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="CPF"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={cpf}
                onChangeText={setCpf}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Confirmar senha"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>
                Já possui conta? Faça{" "}
                <Text style={styles.underline}>login</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnCadastrar}
              onPress={handleCadastro}
            >
              <Text style={styles.btnText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  backBtn: {
    position: "absolute",
    top: 20,
    left: 0,
    padding: 10,
  },
  backIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
    tintColor: "#F5F0E6",
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(74, 14, 23, 0.85)",
    borderRadius: 30,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  title: {
    fontSize: 34,
    fontFamily: "serif",
    color: "#F5F0E6",
    letterSpacing: 3,
    marginBottom: 35,
    fontWeight: "300",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: "#F5F0E6",
    borderRadius: 30,
    marginBottom: 20,
    paddingHorizontal: 20,
    color: "#F5F0E6",
    fontSize: 16,
    backgroundColor: "transparent",
  },
  loginLink: {
    color: "#F5F0E6",
    fontSize: 13,
    marginBottom: 30,
  },
  underline: {
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  btnCadastrar: {
    backgroundColor: "#F5F0E6",
    width: "100%",
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  btnText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A0E17",
    fontFamily: "serif",
  },
});
