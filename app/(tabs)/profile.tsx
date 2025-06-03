import React, { ReactNode, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import { router } from 'expo-router';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [userId, setUserId] = useState('');

  const getUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const authToken = await AsyncStorage.getItem('authToken');

      if (!authToken) {
        router.push('/login');
        return;
      }

      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserId(user._id);

        const response = await axios.get(
          `https://klemz-backend.onrender.com/user/users/${user._id}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const userData = response.data;
        setName(userData.fullName);
        setEmail(userData.email);
        setPhone(userData.phone);
        setAddress(userData.address || '');
      } else {
        router.push('/login');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          await AsyncStorage.removeItem('authToken');
          router.push('/login');
        }
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      getUser();
    }, [])
  );

  const handleSave = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID is missing. Please try again.');
      return;
    }

    try {
      const payload = { fullName: name, email, phone, ...(address ? { address } : {}) };
      await axios.put(`https://klemz-backend.onrender.com/user/users/${userId}`, payload);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleLogout = async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('user');
          await AsyncStorage.removeItem('authToken');
          router.push('/login');
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* <Text style={styles.headerTitle}>My Profile</Text>3 */}

      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: 'https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg',
          }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIcon}>
          <Feather name="edit" size={11} color="#333" />
        </TouchableOpacity>
        <Text style={styles.description}>
          Keep your account information up to date for better service.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <FormInput
          icon={<MaterialIcons name="person" size={20} color="#4CAF50" />}
          value={name}
          onChangeText={setName}
          placeholder="Full Name"
        />
        <FormInput
          icon={<MaterialIcons name="email" size={20} color="#4CAF50" />}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          editable={false}
          
        />
        <FormInput
          icon={<FontAwesome name="phone" size={20} color="#4CAF50" />}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone Number"
          keyboardType="phone-pad"
        />
        <FormInput
          icon={<MaterialIcons name="location-on" size={20} color="#4CAF50" />}
          value={address}
          onChangeText={setAddress}
          placeholder="Address"
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

type FormInputProps = React.ComponentProps<typeof TextInput> & {
  icon: ReactNode;
};

const FormInput: React.FC<FormInputProps> = ({ icon, ...props }) => (
  <View style={styles.inputGroup}>
    {icon}
    <TextInput style={styles.input} {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f9fafa' },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'center',
    marginBottom: 15,
  },
  imageContainer: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 110, height: 110, borderRadius: 55 },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: '40%',
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 20,
    elevation: 4,
  },
  description: { fontSize: 14, color: '#777', marginTop: 10, textAlign: 'center' },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fefefe',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
  },
  input: { flex: 1, fontSize: 16, marginLeft: 10, color: '#333' },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
