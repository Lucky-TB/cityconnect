import React, { useState, useEffect, useRef } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar as RNStatusBar
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { StatusBar } from 'expo-status-bar';
import { GEMINI_API_KEY } from "@env"; // Import the API key from .env

const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const flatListRef = useRef(null);
  const API_KEY = GEMINI_API_KEY;

  useEffect(() => {
    const startChat = async () => {
      try {
        const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = "Hello! Feel free to ask me about city-related topics like local events, traffic, and public services.";
        const result = await model.generateContent(prompt);

        if (result && result.response) {
          const text = result.response.text ? result.response.text() : "No response available.";
          showMessage({
            message: "Welcome to City Chatbot 🤖",
            description: text,
            type: "info",
            icon: "info",
            duration: 2000,
          });
          setMessages([{ text, user: false }]);
        } else {
          console.error("Response is undefined or does not have the expected structure", result);
          showMessage({
            message: "Error",
            description: "Failed to start chat. Please try again.",
            type: "danger",
          });
        }
      } catch (error) {
        console.error("Error in startChat:", error);
        showMessage({
          message: "Error",
          description: "An error occurred while starting the chat.",
          type: "danger",
        });
      }
    };
    startChat();
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    try {
      setLoading(true);
      const userMessage = { text: userInput, user: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      const isCityRelated = /city|traffic|public services|local news|events|infrastructure|transport/.test(userInput.toLowerCase());
      if (!isCityRelated) {
        setMessages((prevMessages) => [...prevMessages, { text: "Please ask me something related to city issues!", user: false }]);
        setLoading(false);
        setUserInput("");
        return;
      }

      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Provide information on city-related topics only. ${userMessage.text}`;

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

  const ClearMessage = () => {
    setMessages([]);
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
    <View style={{ flex: 1, backgroundColor: "#161622", padding: 16 }}>
      <RNStatusBar barStyle="light-content" backgroundColor="#161622" />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 10, marginTop: 45 }}
      />
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#232533", padding: 8, borderRadius: 25 }}>
        <TextInput
          placeholder="Ask about city topics"
          onChangeText={setUserInput}
          value={userInput}
          onSubmitEditing={sendMessage}
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
        <TouchableOpacity onPress={ClearMessage} style={{ backgroundColor: "#FF0000", padding: 8, borderRadius: 25 }}>
          <Entypo name="controller-stop" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        {loading && <ActivityIndicator size="large" color="#90EE90" style={{ marginLeft: 8 }} />}
      </View>
    </View>
  );
};

export default GeminiChat;

