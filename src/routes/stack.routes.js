import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Home.js';
import Vinhos from '../screens/Vinhos.js'; 
import Exclusivos from '../screens/Exclusivos.js';
import { SQLiteProvider } from 'expo-sqlite';
import { initDatabase } from '../services/initDatabase.js';
import Header from '../components/Header.js';

const { Screen, Navigator } = createNativeStackNavigator();

export function StackRoutes() {
    return (
        <SQLiteProvider databaseName="dewine.db" onInit={initDatabase}>
            <NavigationContainer>
                <Navigator screenOptions={{ header: Header }}>
                    <Screen name="Home" component={Home} />
                    <Screen name="Vinhos" component={Vinhos} />
                    <Screen name="Exclusivos" component={Exclusivos} />
                </Navigator>
            </NavigationContainer>
        </SQLiteProvider>
    );
}