// BarberBookingPage.tsx

import { useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Modal, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface Barber {
  _id: string;
  id: string;
  fullName: string;
  phone: string;
  email: string;
  seat: number;
  price: number;
  availableTimes: string[];
  profileImage: any;
  unavailableTimes?: string[];
}

const BarberBookingPage = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [todayDate, setTodayDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [hasBooking, setHasBooking] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalBarber, setModalBarber] = useState<Barber | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const barberImages: { [key: string]: any } = {
    "barber1": require('../../assets/images/20.jpeg'),
    "barber2": require('../../assets/images/24.jpeg'),
    "barber3": require('../../assets/images/26.jpeg'),
    "barber4": require('../../assets/images/image1.png'),
  };

  const router = useRouter();

  useEffect(() => {
    setTodayDate(new Date().toLocaleDateString());
  }, []);

  const fetchUser = async () => {
    try {
      const userStore = await AsyncStorage.getItem("user");
      if (userStore) {
        const parsedUser = JSON.parse(userStore);
        setUserId(parsedUser._id);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchBarbers = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (!storedToken) {
        router.push('/login');
        return;
      }

      const response = await fetch('https://klemz-backend.onrender.com/barber/barbers', {
        headers: { 'Authorization': `Bearer ${storedToken}` },
      });

      if (!response.ok) {
        console.error('Error fetching barbers:', await response.text());
        router.push('/login');
        return;
      }

      const data = await response.json();
      setBarbers(
        data.map((barber: any, index: number) => ({
          ...barber,
          profileImage: barberImages[`barber${index + 1}`] || require('../../assets/images/default.png'),
        }))
      );
    } catch (error) {
      console.error('Error fetching barbers:', error);
      router.push('/login');
    }
  };

  const fetchTodayAppointments = async () => {
    try {
      const response = await fetch('https://klemz-backend.onrender.com/appointment/todayonly');
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      return [];
    }
  };

  const checkUserBooking = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`https://klemz-backend.onrender.com/appointment/appointments/${userId}`);
      if (!response.ok) return;

      const data = await response.json();
      const today = new Date().toLocaleDateString();
      const hasTodayBooking = data.some((appointment: any) =>
        new Date(appointment.createdAt).toLocaleDateString() === today
      );
      setHasBooking(hasTodayBooking);
    } catch (error) {}
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchBarbers();
        await fetchUser();
        await checkUserBooking();
        if (!hasBooking) {
          const todayAppointments = await fetchTodayAppointments();
          setBarbers(prevBarbers =>
            prevBarbers.map(barber => {
              const barberId = barber._id || barber.id;
              const unavailableTimes = todayAppointments
                .filter((appt: any) => appt.barberID?._id === barberId)
                .map((appt: any) => appt.time);
              return { ...barber, id: barberId, unavailableTimes };
            })
          );
        }
      };

      fetchData();
      const interval = setInterval(() => {
        setCurrentTime(new Date().toUTCString().split(" ")[4]);
      }, 1000);

      return () => clearInterval(interval);
    }, [userId, hasBooking])
  );

  const handleConfirmDate = (date: Date) => {
    if (!selectedBarber) return;

    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = date.toLocaleDateString();

    if (selectedBarber.unavailableTimes?.includes(time)) {
      Alert.alert("Time Unavailable", "This time is already booked. Please choose another time.");
      return;
    }

    setSelectedTime(time);
    setSelectedDate(date);
    AsyncStorage.setItem("barber", JSON.stringify(selectedBarber));
    AsyncStorage.setItem("time", JSON.stringify(time));
    AsyncStorage.setItem("date", JSON.stringify(formattedDate));
    hideDatePicker();
    router.push("/confirm");
  };

  const showDatePicker = (barber: Barber) => {
    setSelectedBarber(barber);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const openBarberModal = (barber: Barber) => {
    setModalBarber(barber);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalBarber(null);
  };

  return (
    <Animatable.View animation="fadeInUp" style={styles.container}>
      <Animatable.View animation="pulse" style={styles.timeContainer}>
        <Text style={styles.timeTextHeader}>
          <Ionicons name="time-outline" size={18} color="white" />  {currentTime}
        </Text>
        <Text style={styles.timeTextHeader}>
          <MaterialIcons name="date-range" size={18} color="white" /> {todayDate}
        </Text>
      </Animatable.View>

      <FlatList
        data={barbers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Animatable.View animation="zoomIn" delay={10} style={styles.barberItem}>
            <TouchableOpacity onPress={() => openBarberModal(item)}>
              <Image source={item.profileImage} style={styles.profileImage} />
            </TouchableOpacity>

            <View style={styles.barberDetails}>
              <Text style={styles.name}>{item.fullName}</Text>
              <Text style={styles.detail}><Ionicons name="call-outline" size={14} color="#2E8B57" /> {item.phone}</Text>
              <Text style={styles.detail}><MaterialIcons name="email" size={14} color="#2E8B57" /> {item.email}</Text>
              <Text style={styles.detail}><Ionicons name="person-outline" size={14} color="#2E8B57" /> Seat: {item.seat}</Text>
            </View>

            {hasBooking ? (
              <View style={styles.disabledButton}>
                <Text style={styles.disabledText}>
                  <Ionicons name="close-circle-outline" size={16} color="#666" /> You already have a booking , please cancel it to book again.
                </Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.timeButton} onPress={() => showDatePicker(item)}>
                <Text style={styles.timeText}>
                  <MaterialIcons name="event" size={16} color="white" /> Select Date & Time
                </Text>
              </TouchableOpacity>
            )}
          </Animatable.View>
        )}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            <Image source={modalBarber?.profileImage} style={styles.modalImage} />
            <Text style={styles.modalName}>{modalBarber?.fullName}</Text>
            <Text style={styles.modalDetail}>Experience: 5+ years</Text>
            <Text style={styles.modalDetail}>Rating: ⭐ 4.7 / 5.0</Text>
            <Pressable style={styles.closeButton} onPress={closeModal}>
              <AntDesign name="closecircle" size={24} color="white" />
              <Text style={{ color: "white", marginLeft: 8 }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f8f8' },
  timeContainer: { alignItems: 'center', padding: 10, backgroundColor: '#2E8B57', marginBottom: 10, borderRadius: 8 },
  timeTextHeader: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  barberItem: { padding: 16, marginBottom: 12, backgroundColor: '#fff', borderRadius: 12, elevation: 3 },
  profileImage: { width: '100%', height: 180, borderRadius: 12, marginBottom: 10 },
  barberDetails: { marginBottom: 8 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#2E8B57', marginBottom: 4 },
  detail: { fontSize: 14, color: '#444' },
  timeButton: { backgroundColor: '#2E8B57', padding: 10, borderRadius: 5, marginTop: 10, alignItems: 'center' },
  timeText: { color: 'white', fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#ccc', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  disabledText: { color: '#666', fontWeight: 'bold', fontSize: 12 },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '80%', alignItems: 'center' },
  modalImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  modalName: { fontSize: 20, fontWeight: 'bold', color: '#2E8B57', marginBottom: 10 },
  modalDetail: { fontSize: 14, color: '#444', marginBottom: 5 },
  closeButton: { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: '#2E8B57', padding: 10, borderRadius: 8 }
});

export default BarberBookingPage;
