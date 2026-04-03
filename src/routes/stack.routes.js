import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer} from '@react-navigation/native';
import Home from '../screens/Home.js';
import Vinhos from '../screens/Vinhos.js'; 
import Exclusivos from '../screens/Exclusivos.js';
import WineBox from '../screens/WineBox.js';
import Assinatura from '../screens/Assinatura.js'; 
import Carrinho from '../screens/Carrinho.js'; 
import Cadastro from '../screens/Cadastro.js';
import Login from '../screens/Login.js';
import { SQLiteProvider } from 'expo-sqlite';
import { initDatabase } from '../services/initDatabase.js';
import DescricaoVinho from '../screens/DescricaoVinho.js';

import Header from '../components/Header.js';
// import { resetDatabase } from '../services/initDatabase.js';

export function StackRoutes(){
    const {Screen, Navigator} = createNativeStackNavigator();
    return( 
    <SQLiteProvider databaseName="dewine.db" onInit={initDatabase}>
        <NavigationContainer >
           <Navigator 
                    // initialRouteName="Home" 
                    screenOptions={{ header: Header }}
                >
                    {/* <Screen 
                        name="Cadastro" 
                        component={Cadastro} 
                        options={{ headerShown: false }} 
                    />
                     <Screen 
                        name="Login" 
                        component={Login} 
                        options={{ headerShown: false }} 
                    /> */}

                    <Screen name="Home" component={Home} />
                    <Screen name="Vinhos" component={Vinhos} />
                    <Screen name="Exclusivos" component={Exclusivos} />
                    <Screen name="WineBox" component={WineBox} />
                    <Screen name="Assinatura" component={Assinatura} />
                    <Screen name="Carrinho" component={Carrinho} />
                    <Screen name="DescricaoVinho" component={DescricaoVinho} />
                </Navigator>
        </NavigationContainer>
        </SQLiteProvider>
    );
}