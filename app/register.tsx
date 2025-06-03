import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

const RegisterPage = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');

  const router = useRouter();

  const handleRegister = async () => {
    // Form validation
    if (!email || !password || !phone || !fullName) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    // Data to send in the request
    const data = {
      email,
      password,
      phone,
      fullName,
    };

    try {
      // Sending the POST request to the backend
      const response = await fetch('https://klemz-backend.onrender.com/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Success: Show a success message
        Alert.alert('Success', result.message || 'Registration successful!');
        // Redirect to login page after successful registration
        router.push('/login');
      } else {
        // Error: Show the error message returned from the backend
        Alert.alert('Error', result.message || 'Something went wrong!');
      }
    } catch (error) {
      // Network or other error
      Alert.alert('Error', 'Failed to connect to the server.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image source={require('../assets/images/klemz1.jpg')} style={styles.image} />

      {/* Register Instructions */}
      <Text style={styles.title}>Create an Account</Text>
      <Text style={styles.subtitle}>Fill in the details to get started.</Text>

      {/* Full Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#aaa"
        value={fullName}
        onChangeText={setFullName}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />

      {/* Phone Input */}
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#aaa"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Register Button */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginLink}> Log in here</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Text */}
      <Text style={styles.footerText}>By registering, you agree to our Terms & Conditions.</Text>
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
  registerButton: {
    width: '100%',
    padding: 14,
    backgroundColor: '#2E8B57',
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  loginText: {
    fontSize: 14,
    color: '#555',
  },
  loginLink: {
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

export default RegisterPage;
