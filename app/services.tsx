import React from "react";
import { View, Text, FlatList, Image, StyleSheet, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons"; // Make sure expo install @expo/vector-icons

const services = [
  { id: "1", name: "Haircut", price: "$20", description: "A professional haircut tailored to your style.", image: require("../assets/images/1.jpeg") },
  { id: "2", name: "Beard Trim", price: "$10", description: "A precise trim to keep your beard looking sharp.", image: require("../assets/images/2.jpeg") },
  { id: "3", name: "Hair Styling", price: "$25", description: "Expert styling for any occasion, from casual to formal.", image: require("../assets/images/3.jpeg") },
  { id: "4", name: "Shave", price: "$15", description: "A clean and smooth shave for a fresh look.", image: require("../assets/images/4.jpeg") },
  { id: "5", name: "Kids Haircut", price: "$15", description: "A fun and comfortable haircut experience for kids.", image: require("../assets/images/5.jpeg") },
];

const ServicesPricing = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <FontAwesome5 name="cut" size={40} color="#2E8B57" style={{ marginBottom: 10 }} />
        <Text style={styles.title}>Our Premium Services</Text>
        <Text style={styles.subtitle}>Experience the best grooming services tailored just for you.</Text>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>Why Choose Klems?</Text>
        <Text style={styles.aboutText}>
          At Klems Barbershop, we prioritize quality, professionalism, and customer satisfaction. Our experienced barbers ensure every haircut and grooming service is done with precision and care.
        </Text>
      </View>

      <Text style={styles.serviceHeader}>Available Services</Text>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.details}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{item.name}</Text>
                {/* <Text style={styles.price}>{item.price}</Text> */}
              </View>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  aboutSection: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: 20,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111827",
  },
  aboutText: {
    fontSize: 15,
    color: "#4b5563",
    lineHeight: 22,
  },
  serviceHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111827",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10b981",
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
});

export default ServicesPricing;
