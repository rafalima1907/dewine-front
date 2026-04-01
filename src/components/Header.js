import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Ionicons name="menu" size={28} color="#000" />
      </TouchableOpacity>
      <Image style={styles.logoImage} source={require("../../assets/logo_principal.png")} />
      <TouchableOpacity>
        <Ionicons name="search" size={26} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    backgroundColor: '#faf7f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  logoImage: {
    width: 180,
    height: 60,
    resizeMode: 'contain'
  },
});
