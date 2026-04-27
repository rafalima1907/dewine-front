import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { api } from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [logado, setLogado] = useState(false);
  const [autenticado, setAutenticado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canBack, setCanBack] = useState(false);

  // const navigation = useNavigation();

  function errorToast(text1, text2) {
    Toast.show({ type: "error", text1, text2, topOffset: 50 });
  }

  function successToast(text1, text2) {
    Toast.show({ type: "success", text1, text2, topOffset: 50 });
  }

  async function login(credentials) {
    try {
      const response = await fetch(`${api}users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Erro no login");
      }

      const token = data.token;
      const decoded = jwtDecode(token);

      await AsyncStorage.setItem("token", token);

      setUser(decoded);
      setLogado(true);

      successToast("Login", data.message);
      // navigation.navigate("Tabs");
    } catch (error) {
      console.log(error);
      throw new Error("Email ou senha inválidos");
    }
  }

  async function logout() {
    await AsyncStorage.removeItem("token");

    setUser(null);
    setLogado(false);
    setAutenticado(false);

    // navigation.navigate("Login");
  }

  async function estaLogado() {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setLogado(false);
        return false;
      }

      const decoded = jwtDecode(token);

      if (Date.now() >= decoded.exp * 1000) {
        await AsyncStorage.removeItem("token");
        setLogado(false);
        return false;
      }

      setUser(decoded);
      setLogado(true);
      return true;
    } catch (error) {
      console.log(error);
      errorToast("Erro", "Falha ao validar sessão");
      return false;
    }
  }

  async function handleStates() {
    await estaLogado();
    setLoading(false);
  }

  useEffect(() => {
    handleStates();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        logado,
        loading,
        canBack,
        setCanBack,
        successToast,
        errorToast,
      }}
    >
      {children}
      <Toast />
    </AuthContext.Provider>
  );
}