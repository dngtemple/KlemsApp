import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Image, View, Text, FlatList, TouchableOpacity } from "react-native";

type ImageSource = { uri: string } | number;

export default function TabTwoScreen() {
  const images: ImageSource[] = [
    require("../../assets/images/image1.png"),
    require("../../assets/images/image2.png"),
    require("../../assets/images/image3.png"),
    require("../../assets/images/image4.png"),
    require("../../assets/images/image5.png"),
    require("../../assets/images/image6.png"),
    require("../../assets/images/image7.png"),
    require("../../assets/images/image8.png"),
    require("../../assets/images/image9.png"),
    require("../../assets/images/1.jpeg"),
    require("../../assets/images/2.jpeg"),
    require("../../assets/images/3.jpeg"),
    require("../../assets/images/4.jpeg"),
    require("../../assets/images/5.jpeg"),
    require("../../assets/images/6.jpeg"),
    require("../../assets/images/7.jpeg"),
    require("../../assets/images/8.jpeg"),
    require("../../assets/images/9.jpeg"),
    require("../../assets/images/10.jpeg"),
    require("../../assets/images/11.jpeg"),
    require("../../assets/images/12.jpeg"),
    require("../../assets/images/13.jpeg"),
    require("../../assets/images/14.jpeg"),
    require("../../assets/images/15.jpeg"),
    require("../../assets/images/16.jpeg"),
    require("../../assets/images/17.jpeg"),
    require("../../assets/images/18.jpeg"),
    require("../../assets/images/19.jpeg"),
    require("../../assets/images/20.jpeg"),
    require("../../assets/images/21.jpeg"),
    require("../../assets/images/22.jpeg"),
    require("../../assets/images/23.jpeg"),
    require("../../assets/images/24.jpeg"),
    require("../../assets/images/25.jpeg"),
    require("../../assets/images/26.jpeg"),
    require("../../assets/images/27.jpeg"),
    require("../../assets/images/28.jpeg"),
    require("../../assets/images/29.jpeg"),
    require("../../assets/images/30.jpeg"),
    require("../../assets/images/31.jpeg"),
  ];

  const renderImage = ({ item }: { item: ImageSource }) => (
    <View style={styles.imageContainer}>
      <Image source={item} style={styles.image} />
    </View>
  );

  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Gallery</Text> */}
      <Text style={styles.description}>Explore our collection of images showcasing our work and creativity.</Text>
      
      <TouchableOpacity style={styles.contactButton} onPress={() => router.push("/contact")}> 
        <Text style={styles.contactButtonText}>Contact Us</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactButton} onPress={() => router.push("/services")}> 
        <Text style={styles.contactButtonText}>Services</Text>
      </TouchableOpacity>
      
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
      />

      <Text style={styles.importantMessage}>Stay connected with us for more updates and inspiration!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  gridContainer: {
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  contactButton: {
    width: "100%",
    padding: 14,
    backgroundColor: "#2E8B57",
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  importantMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#d9534f",
    marginTop: 20,
    fontWeight: "bold",
  },
});
