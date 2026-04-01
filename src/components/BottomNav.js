import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function BottomNav() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.iconWrapper}>
          <Image source={require('../../assets/icons/carrinho.png')} style={styles.icon} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity>
          <Image source={require('../../assets/icons/home.png')} style={styles.icon} />
        </TouchableOpacity>
        
        <TouchableOpacity>
          <Image source={require('../../assets/icons/user.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 20, 
    width: '100%',
    alignItems: 'center', 
    justifyContent: 'center',
    zIndex: 99, 
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60, 
    width: '85%', 
    backgroundColor: '#4A0E17',
    borderRadius: 30, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  iconWrapper: {
    position: 'relative',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
  badge: {
    position: 'absolute',
    right: -10,
    top: -8,
    backgroundColor: '#E6DDC6',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#4A0E17',
    fontSize: 10,
    fontWeight: 'bold',
  }
});