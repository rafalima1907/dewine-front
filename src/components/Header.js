import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/auth";

export default function Header() {
  const navigation = useNavigation();
  const { logout, isAdmin } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  // console.log("isAdmin no Header:", isAdmin);
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setMenuOpen(true)}>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>

        <Image
          style={styles.logoImage}
          source={require("../../assets/logo_principal.png")}
        />

        <TouchableOpacity>
          <Ionicons name="search" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {menuOpen && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setMenuOpen(false)}
          />

          <View style={styles.drawer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMenuOpen(false)}
            >
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("Tabs")}
            >
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("Exclusivos")}
            >
              <Text style={styles.menuText}>Exclusivos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("WineBox")}
            >
              <Text style={styles.menuText}>WineBox</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("Assinatura")}
            >
              <Text style={styles.menuText}>Assinatura</Text>
            </TouchableOpacity>
            {isAdmin && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("AdminProdutos")}
              >
                <Text style={styles.menuText}>Editar produtos</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.menuItem} onPress={() => logout()}>
              <Text style={styles.menuText}>Sair</Text>
            </TouchableOpacity>
            <View style={styles.contactArea}>
              <Text style={styles.contactTitle}>Contate-nos:</Text>
              <Text style={styles.contactText}>+55 (11) 3160-4161</Text>
              <Text style={styles.contactText}>DeWine_Oficial@gmail.com</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 100,
  },

  container: {
    height: 90,
    backgroundColor: "#faf7f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  logoImage: {
    width: 180,
    height: 60,
    resizeMode: "contain",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 250,
    height: "auto",
    backgroundColor: "#d8d1bf",
    borderTopRightRadius: 35,
    borderBottomRightRadius: 35,
    paddingTop: 20,
    paddingHorizontal: 18,
    elevation: 8,
  },

  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
    padding: 5,
  },

  closeText: {
    fontSize: 24,
    color: "#5a554a",
    fontWeight: "300",
  },

  menuItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ece6d8",
  },

  menuText: {
    fontSize: 18,
    color: "#2e2b26",
    fontFamily: "serif",
  },

  contactArea: {
    marginTop: 35,
  },

  contactTitle: {
    fontSize: 16,
    marginBottom: 15,
    fontFamily: "serif",
    color: "#2e2b26",
  },

  contactText: {
    fontSize: 13,
    marginBottom: 8,
    color: "#2e2b26",
  },
});
