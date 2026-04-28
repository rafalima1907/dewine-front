import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "../screens/Home.js";
import Vinhos from "../screens/Vinhos.js";
import Exclusivos from "../screens/Exclusivos.js";
import WineBox from "../screens/WineBox.js";
import Assinatura from "../screens/Assinatura.js";
import Carrinho from "../screens/Carrinho.js";
import Cadastro from "../screens/Cadastro.js";
import Login from "../screens/Login.js";
import CadProdutos from "../screens/CadProdutos.js";
import { SQLiteProvider } from "expo-sqlite";
import { initDatabase } from "../services/initDatabase.js";
import DescricaoVinho from "../screens/DescricaoVinho.js";
import BottomTabs from "./tab.routes.js";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth";
import { AuthProvider } from "../context/auth.js";
import Header from "../components/Header.js";
import { resetDatabase } from "../services/initDatabase.js";
import SplashScreen from "../screens/SplashScreen";
const Stack = createNativeStackNavigator();

export function StackRoutes() {
  const { logado, loading } = useContext(AuthContext);

  if (loading) return <SplashScreen />;
// useEffect(() => {
//     resetDatabase();
//   }, []);
  return (
    <Stack.Navigator
      key={logado ? "user" : "guest"}
      screenOptions={{ header: Header }}
    >
      {!logado ? (
        <>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Tabs" component={BottomTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Exclusivos" component={Exclusivos} />
          <Stack.Screen name="WineBox" component={WineBox} />
          <Stack.Screen name="Assinatura" component={Assinatura} />
          <Stack.Screen name="Carrinho" component={Carrinho} />
          <Stack.Screen name="DescricaoVinho" component={DescricaoVinho} />
          <Stack.Screen name="CadProdutos" component={CadProdutos} />
        </>
      )}
    </Stack.Navigator>
  );
}