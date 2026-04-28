import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/context/auth";
import { StackRoutes } from "./src/routes/stack.routes";
import { SQLiteProvider } from "expo-sqlite";
import { initDatabase } from "./src/services/initDatabase";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SQLiteProvider databaseName="dewine.db" onInit={initDatabase}>
        <NavigationContainer>
          <AuthProvider>
            <StackRoutes />
          </AuthProvider>
        </NavigationContainer>
      </SQLiteProvider>
    </SafeAreaView>
  );
}