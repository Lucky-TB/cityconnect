import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, FlatList, ActivityIndicator, StatusBar as RNStatusBar } from "react-native";
import * as GoogleGenerativeAI from "@google/generative-ai";
import { Entypo } from "@expo/vector-icons";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { GEMINI_API_KEY } from "@env"; // Import the API key from .env

const CityBuddy = ({ route }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const API_KEY = GEMINI_API_KEY;

  useEffect(() => {
    setModalVisible(true); // Force modal to open on mount as a test
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async (input) => {
    try {
      setLoading(true);
      const userMessage = { text: input, user: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Is ${input} compostable, recyclable, or to be thrown in the trash? Provide the best disposal method for this item.`;

      const fetchContent = async (retries = 3) => {
        try {
          const result = await model.generateContent(prompt);

          if (result && result.response) {
            const text = result.response.text ? result.response.text() : "No response available.";
            setMessages((prevMessages) => [...prevMessages, { text, user: false }]);
          } else {
            console.error("Response is undefined or does not have the expected structure", result);
            showMessage({
              message: "Error",
              description: "Failed to generate a response. Please try again.",
              type: "danger",
            });
          }
        } catch (error) {
          if (error.message.includes("503") && retries > 0) {
            console.log(`Retrying... Attempts left: ${retries}`);
            setTimeout(() => fetchContent(retries - 1), 2000); // Retry after 2 seconds
          } else {
            console.error("Error in fetchContent:", error);
            showMessage({
              message: "Error",
              description: "The service is currently overloaded. Please try again later.",
              type: "danger",
            });
          }
        }
      };

      await fetchContent();

    } catch (error) {
      console.error("Error in sendMessage:", error);
      showMessage({
        message: "Error",
        description: "An error occurred while sending the message.",
        type: "danger",
      });
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={{
        padding: 12,
        marginVertical: 4,
        borderRadius: 8,
        maxWidth: "80%",
        alignSelf: item.user ? "flex-end" : "flex-start",
        backgroundColor: item.user ? "#90EE90" : "#232533",
      }}
    >
      <Text style={{ fontSize: 16, color: item.user ? "#161622" : "#FFFFFF" }}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <RNStatusBar barStyle="light-content" backgroundColor="#161622" />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 10, marginTop: 45 }}
      />
      <View style={styles.chatContainer}>
        <TextInput
          placeholder="Type a message"
          onChangeText={setUserInput}
          value={userInput}
          onSubmitEditing={() => sendMessage(userInput)}
          placeholderTextColor="#CDCDE0"
          style={{
            flex: 1,
            marginHorizontal: 8,
            padding: 12,
            backgroundColor: "#232533",
            color: "#FFFFFF",
            borderRadius: 25,
          }}
        />
        <TouchableOpacity
          style={{ backgroundColor: "#FF0000", padding: 8, borderRadius: 25 }}
          onPress={() => setMessages([])}
        >
          <Entypo name="controller-stop" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        {loading && <ActivityIndicator size="large" color="#90EE90" style={{ marginLeft: 8 }} />}
      </View>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>What item are you disposing?</Text>
            <TextInput
              placeholder="Type the item here"
              placeholderTextColor="#CDCDE0"
              style={styles.modalTextInput}
              value={userInput}
              onChangeText={setUserInput}
              onSubmitEditing={() => {
                sendMessage(userInput);
                setModalVisible(false);
              }}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
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
    backgroundColor: "#161622",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  chatContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#232533",
    padding: 8,
    borderRadius: 25,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: "#232533",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    color: "#90EE90",
    fontSize: 18,
    marginBottom: 20,
  },
  modalTextInput: {
    width: '100%',
    backgroundColor: '#232533',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  modalClose: {
    color: "#90EE90",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CityBuddy;