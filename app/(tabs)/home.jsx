import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";

const announcementsData = [
  { id: '1', text: 'New transit routes available starting next week!' },
  { id: '2', text: 'City cleanup event on Saturday - Join us!' },
  { id: '3', text: 'Eco-friendly tip: Use public transport to reduce emissions.' },
];

const Home = () => {
  const navigation = useNavigation();
  const [isResourcesModalVisible, setResourcesModalVisible] = useState(false);
  const [isEcoTipsModalVisible, setEcoTipsModalVisible] = useState(false);

  const renderAnnouncement = ({ item }) => (
    <View style={styles.announcementItem}>
      <Text style={styles.announcementText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.missionStatement}>
        CityConnect helps you navigate the city with ease by providing transit updates, city resources, and eco-friendly tips.
      </Text>

      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate("citybuddy", { showModal: true })}
        >
          <Text style={styles.navButtonText}>What Goes Where?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => setResourcesModalVisible(true)}
        >
          <Text style={styles.navButtonText}>City Resources</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => setEcoTipsModalVisible(true)}
        >
          <Text style={styles.navButtonText}>Eco-Friendly Tips</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.announcementsTitle}>Announcements:</Text>
      <FlatList
        data={announcementsData}
        renderItem={renderAnnouncement}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.announcementsList}
      />

      {/* Resources Modal */}
      <Modal
        visible={isResourcesModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setResourcesModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>B</Text>
            <TouchableOpacity onPress={() => setResourcesModalVisible(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Eco-Friendly Tips Modal */}
      <Modal
        visible={isEcoTipsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEcoTipsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>C</Text>
            <TouchableOpacity onPress={() => setEcoTipsModalVisible(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#161622',
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionStatement: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#90EE90',
    marginTop: 50,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '100%',
  },
  navButton: {
    padding: 10,
    backgroundColor: '#232533',
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
  },
  navButtonText: {
    color: '#90EE90',
    fontSize: 16,
    fontWeight: 'bold',
  },
  announcementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#CDCDE0',
    textAlign: 'center',
  },
  announcementsList: {
    paddingBottom: 20,
  },
  announcementItem: {
    padding: 16,
    backgroundColor: '#232533',
    borderRadius: 8,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  announcementText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#232533',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    color: '#90EE90',
    fontSize: 18,
    marginBottom: 20,
  },
  modalClose: {
    color: '#90EE90',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
