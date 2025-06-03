import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // You can install: npm install react-native-vector-icons

const BarbershopInfo = () => {
  const barbershop = {
    name: "Klems Barbershop",
    address: "123 Main Street, Madina, Behind UPSA",
    locationUrl: "https://maps.app.goo.gl/irRGrpeirETAfqDg9",
    phone: "+233545678903",
    phone2: "+233545445551",
    email: "support@klemsbarbershop.com",
    openingHours: "Mon-Sat: 9 AM - 5 PM\nSun: Closed",
    coordinates: { latitude: 5.683, longitude: -0.165 },
    image: "https://lh3.googleusercontent.com/p/AF1QipNbELd_UxLCmUctTuke4YiQpafb-UlgyEuQj1rf=s680-w680-h510"
  };

  const faqs = [
    { question: "How do I book an appointment?", answer: "You can book an appointment through our app or by calling us." },
    { question: "Do you accept MoMo?", answer: "Yes, we accept all kinds of MoMo payment." },
    { question: "Do you accept walk-ins?", answer: "Yes, but appointments are recommended to avoid long wait times." },
    { question: "What are the payment methods?", answer: "We accept cash, credit cards, and mobile payments." }
  ];

  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Image source={{ uri: barbershop.image }} style={styles.image} /> */}

      {/* <Text style={styles.title}>{barbershop.name}</Text> */}
      <Text style={styles.paragraph}>
        Welcome to Klems Barbershop! We offer quality grooming services in a comfortable environment. Feel free to contact us or visit our location.
      </Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Icon name="location-outline" size={20} color="#007AFF" />
          <Text style={styles.infoText}>{barbershop.address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="time-outline" size={20} color="#007AFF" />
          <Text style={styles.infoText}>{barbershop.openingHours}</Text>
        </View>

        <TouchableOpacity style={styles.mapButton} onPress={() => Linking.openURL(barbershop.locationUrl)}>
          <Text style={styles.mapButtonText}>📍 View on Google Maps</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contactCard}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(`tel:${barbershop.phone}`)}>
          <Icon name="call-outline" size={20} color="#007AFF" />
          <Text style={styles.contactText}>{barbershop.phone}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(`tel:${barbershop.phone2}`)}>
          <Icon name="call-outline" size={20} color="#007AFF" />
          <Text style={styles.contactText}>{barbershop.phone2}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(`mailto:${barbershop.email}`)}>
          <Icon name="mail-outline" size={20} color="#007AFF" />
          <Text style={styles.contactText}>{barbershop.email}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.callButton} onPress={() => router.push("/calendy")}>
          <Text style={styles.callButtonText}>📞 Book a 1-on-1 Support Call</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.faqSection}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.map((faq, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqItem}
            onPress={() => setExpanded(expanded === index ? null : index)}
          >
            <View style={styles.faqHeader}>
              <Icon name={expanded === index ? 'chevron-up-outline' : 'chevron-down-outline'} size={18} color="#333" />
              <Text style={styles.faqQuestion}>{faq.question}</Text>
            </View>
            {expanded === index && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  image: { width: '100%', height: 200, borderRadius: 12, marginBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  paragraph: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#555' },
  infoCard: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { marginLeft: 8, fontSize: 16, color: '#333' },
  mapButton: { backgroundColor: '#2E8B57', padding: 10, borderRadius: 8, marginTop: 10 },
  mapButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },

  contactCard: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  contactText: { marginLeft: 8, fontSize: 16, color: '#333' },
  callButton: { backgroundColor: '#2E8B57', padding: 12, borderRadius: 8, marginTop: 10 },
  callButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },

  faqSection: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10 },
  faqItem: { marginBottom: 10 },
  faqHeader: { flexDirection: 'row', alignItems: 'center' },
  faqQuestion: { marginLeft: 8, fontSize: 16, fontWeight: 'bold', flex: 1 },
  faqAnswer: { fontSize: 14, color: '#555', marginTop: 5, paddingLeft: 28 }
});

export default BarbershopInfo;
