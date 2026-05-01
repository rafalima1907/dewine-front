import React from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Home from "../screens/Home.js";
import Vinhos from "../screens/Vinhos.js";
import CartScreen from "../screens/CartScreen.js";
import Header from "../components/Header.js";

export default function BottomTabs() {
  const { Screen, Navigator } = createBottomTabNavigator();

  return (
    <Navigator
      screenOptions={{
        header: () => <Header />,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color="#FFFFFF"
            />
          ),
        }}
      />
      <Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons
                name={focused ? "cart" : "cart-outline"}
                size={24}
                color="#FFFFFF"
              />
            </View>
          ),
        }}
      />

      <Screen
        name="Vinhos"
        component={Vinhos}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "wine" : "wine-outline"}
              size={24}
              color="#FFFFFF"
            />
          ),
        }}
      />
    </Navigator>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    marginHorizontal: 30,
    borderRadius: 30,
    backgroundColor: "#4A0E17",
    borderTopWidth: 0,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
  tabBarItem: {
    flex: 0,
    width: '33%',
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    position: "relative",
  },
  icon: {
    width: 24,
    height: 24,

    tintColor: "#FFFFFF",
  },
  //   badge é o icone que fica no carrinho, mostrando a quantidade de itens implementar depois
  badge: {
    position: "absolute",
    right: -10,
    top: -8,
    backgroundColor: "#E6DDC6",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#4A0E17",
    fontSize: 10,
    fontWeight: "bold",
  },
});
