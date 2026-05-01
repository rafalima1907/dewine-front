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
import AdminProdutos from "../screens/AdminProdutos.js";
import DescricaoVinho from "../screens/DescricaoVinho.js";
import BottomTabs from "./tab.routes.js";
import Header from "../components/Header.js";
import SplashScreen from "../screens/SplashScreen";

const Stack = createNativeStackNavigator();

export function StackRoutes() {
  // ⚠️ BYPASS DE LOGIN PARA TESTES ⚠️
  // Comentamos o AuthContext para ele não te barrar e não dar tela de loading infinita

  return (
    <Stack.Navigator
      initialRouteName="AdminProdutos" // Isso força o app a abrir direto no Admin!
      screenOptions={{ header: Header }}
    >
      <Stack.Screen
        name="AdminProdutos"
        component={AdminProdutos}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CadProdutos" 
        component={CadProdutos} 
        options={{ headerShown: false }} 
      />
      
      {/* Restante das telas liberadas */}
      <Stack.Screen
        name="Tabs"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="DescricaoVinho" component={DescricaoVinho} />
      <Stack.Screen name="Exclusivos" component={Exclusivos} />
      <Stack.Screen name="WineBox" component={WineBox} />
      <Stack.Screen name="Assinatura" component={Assinatura} />
      <Stack.Screen name="Carrinho" component={Carrinho} />

      {/* Deixei o Login aqui no final só para não quebrar nenhuma importação */}
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Cadastro"
        component={Cadastro}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}