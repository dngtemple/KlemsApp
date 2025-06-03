import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

const SupportCallBooking = () => {
  const calendlyLink = "https://calendly.com/donnahaytempleton1230";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Book a 1-on-1 Support Call</Text>
      <Text style={styles.description}>
        Need personalized assistance? Schedule a free 15-minute call with our support team to get help tailored to your needs.
      </Text>



      <View style={styles.webviewContainer}>
        <WebView 
          source={{ uri: calendlyLink }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          style={styles.webview}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  description: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 5, marginBottom: 20 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  webviewContainer: { height: 500, width: "100%", borderRadius: 10, overflow: 'hidden' },
  webview: { flex: 1 }
});

export default SupportCallBooking;
