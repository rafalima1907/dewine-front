import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/context/auth";
import { StackRoutes } from "./src/routes/stack.routes";
import { SQLiteProvider } from "expo-sqlite";
import { initDatabase } from "./src/services/initDatabase";
import { resetDatabase } from "./src/services/initDatabase";
import { useEffect } from "react";
export default function App() {
//   useEffect(() => {
//   async function reset() {
//     await resetDatabase();
//   }

//   reset();
// }, []);
  return (
    <SQLiteProvider databaseName="dewine.db" onInit={initDatabase}>
      <NavigationContainer>
        <AuthProvider>
          <StackRoutes />
        </AuthProvider>
      </NavigationContainer>
    </SQLiteProvider>
  );
}