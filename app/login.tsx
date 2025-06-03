import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const LoginPage = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Error', 'All fields are required.');
    return;
  }

  const data = { email, password };

  try {
    const response = await fetch('https://klemz-backend.onrender.com/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      // Save token and user data to AsyncStorage
      await AsyncStorage.setItem('authToken', result.token);
      await AsyncStorage.setItem('user', JSON.stringify(result.user));

      // Success message
      Alert.alert('Success', result.message || 'Login successful!');
      
      // Redirect to the booking page
      router.push('/(tabs)');
    } else {
      // Error: Show error message
      Alert.alert('Error', result.message || 'Login failed! Please check your credentials.');
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to connect to the server.');
  }
};


  return (
    <View style={styles.container}>
      {/* Image */}
      <Image source={require('../assets/images/klemz1.jpg')} style={styles.image} />

      {/* Login Instructions */}
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Please log in to continue.</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      {/* Register Link */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.registerLink}> Register here</Text>
        </TouchableOpacity>


      </View>
      <Text onPress={()=>router.push("/forgot")} style={styles.registerLink}> Forgot password?</Text>


      {/* Footer Text */}
      <Text style={styles.footerText}>By logging in, you agree to our Terms & Conditions.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ddd',
    fontSize: 16,
    backgroundColor: '#fff',
  },
  loginButton: {
    width: '100%',
    padding: 14,
    backgroundColor: '#2E8B57',
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  registerText: {
    fontSize: 14,
    color: '#555',
  },
  registerLink: {
    fontSize: 14,
    color: '#2E8B57',
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 12,
    color: '#777',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default LoginPage;
