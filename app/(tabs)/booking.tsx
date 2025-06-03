import React, { useEffect, useState } from 'react';
import { View, Image, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Appointment {
  _id: string;
  barberID: { fullName: string };
  haircutID: { name: string; price: number };
  time: string;
  createdAt: string;
  date:string
}

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState<'history' | 'bookings'>('bookings');
  const [history, setHistory] = useState<Appointment[]>([]);
  const [bookings, setBookings] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const user = await AsyncStorage.getItem('user');
      if (!token) {
        router.push('/login');
        return;
      }
      if (user) {
        const userId = JSON.parse(user)._id;
        try {
          const response = await fetch(`https://klemz-backend.onrender.com/appointment/appointments/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('Failed to fetch appointments');
          const data: Appointment[] = await response.json();
          const today = new Date().toISOString().split('T')[0];
          
          // Sort by latest date first
          const sortedHistory = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          setHistory(sortedHistory);
          setBookings(data.filter((appt) => appt.createdAt.split('T')[0] === today));
        } catch (error) {
          // console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAppointments();
  }, [history,bookings]);

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`https://klemz-backend.onrender.com/appointment/appointments/${selectedId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete appointment');
      setBookings((prev) => prev.filter((item) => item._id !== selectedId));
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const paystackSecretKey = 'sk_test_8cfe75cee12fe13c7d7f8caf3228666f95355564';

  const createPayment = async () => {
    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          amount: 50 * 100,
          currency: 'GHS',
          callback_url: 'https://yourwebsite.com/payment-success'
        })
      });

      const data = await response.json();
      if (data.status) {
        router.push(data.data.authorization_url);
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const renderItem = ({ item }: { item: Appointment }) => (
    
    <View style={styles.card}>
      
      <View style={styles.cardHeader}>
        {activeTab === 'bookings' && (
          <TouchableOpacity style={styles.position}  onPress={() => { setSelectedId(item._id); setModalVisible(true); }}>
            <Ionicons   name="trash" size={24} color="#ff4d4f" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.detailText}>Appointment code : {item._id}</Text>

      <Text style={styles.detailText}>Date: {item.date.split('T')[0]}</Text>
      <Text style={styles.detailText}>Time: {item.time}</Text>

      {activeTab === 'bookings' && (
        <>
        <Text style={styles.detailText}>Barber : {item.barberID.fullName}</Text>
        <Text style={styles.detailText}>Haircut : {item.haircutID.name}</Text>
          <Text style={styles.price}>GHC {item.haircutID.price.toFixed(2)}</Text>

          <View style={styles.paymentSection}>
            <TouchableOpacity style={styles.payButton} onPress={createPayment}>
              <Ionicons name="card" size={20} color="white" />
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>

            <View style={styles.paymentLogos}>
              <Image source={require('../../assets/images/mtn.png')} style={styles.logo} />
              <Image source={require('../../assets/images/telecel.png')} style={styles.logo} />
              <Image source={require('../../assets/images/tigo2.png')} style={styles.logo} />
            </View>
          </View>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'bookings' && styles.activeTab]} onPress={() => setActiveTab('bookings')}>
          <Text style={[styles.tabText, activeTab === 'bookings' && styles.activeTabText]}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'history' && styles.activeTab]} onPress={() => setActiveTab('history')}>
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
      ) : activeTab === 'bookings' && bookings.length === 0 ? (
        <View style={styles.noData}>
          <Text style={styles.noDataText}>No bookings for today</Text>
        </View>
      ) : (
        <FlatList
          data={activeTab === 'history' ? history : bookings}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 12 }}
        />
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Delete this appointment?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalButton, { backgroundColor: '#777' }]}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={[styles.modalButton, { backgroundColor: '#ff4d4f' }]}>
                <Text  style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#fff', elevation: 2 },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#2E8B57' },
  tabText: { fontSize: 16, color: '#2E8B57' },
  activeTabText: { color: '#2E8B57', fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',position:"relative" },
  barberName: { fontSize: 17, fontWeight: '600', color: '#333' },
  haircutName: { fontSize: 15, color: '#666', marginVertical: 4 },
  detailText: { fontSize: 14, color: '#888' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#2e8b57', marginTop: 8 },
  paymentSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  payButton: { flexDirection: 'row', backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center' },
  payButtonText: { color: 'white', fontSize: 15, marginLeft: 8, fontWeight: '600' },
  paymentLogos: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 30, height: 30, marginLeft: 8, borderRadius: 4, resizeMode: 'contain' },
  noData: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noDataText: { fontSize: 16, color: '#999' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '80%', alignItems: 'center' },
  modalText: { fontSize: 18, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalButton: { flex: 1, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  modalButtonText: { color: 'white', fontWeight: '600', fontSize: 16 },
  position: {
  position: "absolute",
  top: 3,       // add some padding so it's not flush on the edge
  right: -10,
  width: 40,    // explicit width & height for hit area
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,   // make sure it's on top
  backgroundColor: 'transparent' // or a visible color temporarily to debug
},

});

export default HistoryPage;
