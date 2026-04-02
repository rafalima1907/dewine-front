import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  TextInput, 
  TouchableOpacity, 
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ImageFundo from '../../assets/ImageFundo.png'; 
import SetaVoltar from '../../assets/icons/seta_voltar.png';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <ImageBackground 
      source={ImageFundo} 
      style={styles.background} 
      imageStyle={{ opacity: 0.9 }}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()}
          >
            <Image source={SetaVoltar} style={styles.backIcon} />
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.title}>LOGIN</Text>

            <View style={styles.inputGroup}>
              <TextInput 
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(245, 240, 230, 0.6)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput 
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="rgba(245, 240, 230, 0.6)"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
              <Text style={styles.loginLink}>
                Não possui conta? Faça <Text style={styles.underline}>cadastro</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnEntrar}>
              <Text style={styles.btnText}>Entrar</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 0,
    padding: 10,
  },
  backIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: '#F5F0E6', 
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(74, 14, 23, 0.85)', 
    borderRadius: 30,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  title: {
    fontSize: 34,
    fontFamily: 'serif',
    color: '#F5F0E6',
    letterSpacing: 3,
    marginBottom: 35,
    fontWeight: '300',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#F5F0E6',
    borderRadius: 30,
    marginBottom: 20,
    paddingHorizontal: 20,
    color: '#F5F0E6',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  loginLink: {
    color: '#F5F0E6',
    fontSize: 13,
    marginBottom: 30,
  },
  underline: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  btnEntrar: {
    backgroundColor: '#F5F0E6', 
    width: '100%',
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  btnText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A0E17',
    fontFamily: 'serif',
  },
});