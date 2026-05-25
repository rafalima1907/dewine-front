import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/context/auth";
import { StackRoutes } from "./src/routes/stack.routes";
import { SQLiteProvider } from "expo-sqlite";
import { initDatabase, resetDatabase } from "./src/services/initDatabase";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

export default function App() {
  // useEffect(() => {resetDatabase()})
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <SQLiteProvider databaseName="dewine.db" onInit={initDatabase}>
          <NavigationContainer>
            <AuthProvider>
              <StackRoutes />
            </AuthProvider>
          </NavigationContainer>
        </SQLiteProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
