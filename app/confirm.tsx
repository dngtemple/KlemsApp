import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Image, Animated, TouchableOpacity, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native"; 
import { useRouter } from "expo-router";

interface Haircut {
  _id: string;
  name: string;
  price: number;
}

interface Barber {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
}

const ReceiptPage = () => {
  const [haircuts, setHaircuts] = useState<Haircut[]>([]);
  const [selectedHaircutId, setSelectedHaircutId] = useState<any | null>(null);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [barberId, setBarberId] = useState<string | null>(null);
  const [time, setTime] = useState<any | null>(null);
  const [date, setDate] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedHaircut, setSelectedHaircut] = useState<Haircut | null>(null);

  const router = useRouter();

  // Animations
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Fetch stored data and haircuts when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchStoredData = async () => {
        try {
          const storedBarber = await AsyncStorage.getItem("barber");
          const storedTime = await AsyncStorage.getItem("time");
          const userStore = await AsyncStorage.getItem("user");
          const storedDate = await AsyncStorage.getItem("date");

          if (storedBarber) {
            const parsedBarber: Barber = JSON.parse(storedBarber);
            setBarber(parsedBarber);
            setBarberId(parsedBarber._id);
          }

          if (userStore) {
            const parsedUser = JSON.parse(userStore);
            setUserId(parsedUser._id);
          }

          if (storedTime) {
            setTime(JSON.parse(storedTime));
          }
          if(storedDate) {
            setDate(JSON.parse(storedDate));
          }
        } catch (error) {
          console.error("Error fetching local storage data:", error);
        }
      };

      fetchStoredData();

      // Fetch haircuts from API
      fetch("https://klemz-backend.onrender.com/haircut/haircuts")
        .then((response) => response.json())
        .then((data: Haircut[]) => setHaircuts(data))
        .catch((error) => console.error("Error fetching haircuts:", error));

      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, []) 
  );

  const handleConfirm = async () => {
    if (!selectedHaircutId) {
      alert("Please select a valid haircut.");
      return;
    }

    const appointmentData = {
      barberID: barberId,
      userID: userId,
      haircutID: selectedHaircutId,
      time,
      date,
    };

    try {
      const response = await fetch("https://klemz-backend.onrender.com/appointment/appointments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      const responseData = await response.json();
      console.log("Response Data:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Booking failed. Please try again.");
      }

      alert("Your booking is confirmed. We look forward to seeing you!");
      router.push("/booking");
    } catch (error: any) {
      console.error("Error creating booking:", error);
      alert(`${error.message} || "Error booking appointment. Please try again later."}`);
    }
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Booking Confirmation</Text> */}

      <Animated.View style={[styles.infoBox, { opacity: fadeAnim }]}>
        <Image
          source={require("../assets/images/klemz1.jpg")}
          style={styles.barberImage}
        />
        <View style={styles.barberInfo}>
          <Text style={styles.text}>
            <Text style={styles.bold}>Barber:</Text> {barber?.fullName || "Loading..."}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Phone:</Text> {barber?.phone || "Loading..."}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Email:</Text> {barber?.email || "Loading..."}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Time:</Text> {time || "Loading..."}
          </Text>
        </View>
      </Animated.View>

      <Text style={styles.label}>Select Haircut:</Text>
      
      {/* Custom Modal for selecting haircut */}
      <TouchableOpacity style={styles.pickerContainer} onPress={openModal}>
        <Text style={styles.pickerText}>
          {selectedHaircut ? `${selectedHaircut.name} - GHC${selectedHaircut.price}` : "-- Select a haircut --"}
        </Text>
      </TouchableOpacity>

      {/* Modal for Haircut Selection */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Haircut</Text>
            {haircuts.map((haircut) => (
              <TouchableOpacity
                key={haircut._id}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedHaircut(haircut);
                  setSelectedHaircutId(haircut._id);
                  closeModal();
                }}
              >
                <Text style={styles.modalOptionText}>
                  {haircut.name} - GHC{haircut.price}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.warning}>⚠️ Note: All bookings are for today.</Text>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirm Booking</Text>
      </TouchableOpacity>

      <Icon name="check-circle" size={30} color="green" style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  infoBox: {
    marginBottom: 20,
    alignItems: "center",
  },
  barberImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  barberInfo: {
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  bold: {
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    justifyContent: "center",
  },
  pickerText: {
    fontSize: 16,
    color: "#555",
  },
  warning: {
    fontSize: 14,
    color: "#ff0000",
    fontWeight: "bold",
    marginVertical: 15,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    textAlign: "center",
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  modalOption: {
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 6,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});


export default ReceiptPage
