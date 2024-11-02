import React, { useState, useEffect, useRef } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar as RNStatusBar,
} from "react-native";
import * as Speech from "expo-speech";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { StatusBar } from "expo-status-bar";
import { GEMINI_API_KEY } from "@env"; // Import your API key

const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showStopIcon, setShowStopIcon] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    const startChat = async () => {
      try {
        const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = "hello!";
        const result = await model.generateContent(prompt);

        if (result?.response) {
          const text = result.response.text || "No response available.";
          showMessage({
            message: "Welcome to Gemini Chat 🤖",
            description: text,
            type: "info",
            icon: "info",
            duration: 2000,
          });
          setMessages([{ text, user: false }]);
        } else {
          console.error("Unexpected result structure", result);
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
    if (!userInput.trim()) return; // Prevent sending empty messages

    try {
      setLoading(true);
      const userMessage = { text: userInput, user: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const fetchContent = async (retries = 3) => {
        try {
          const result = await model.generateContent(userInput);

          console.log("API Response:", result); // Log the entire response

          if (result?.response) {
            const text = result.response.text || "No response available.";
            setMessages((prevMessages) => [...prevMessages, { text, user: false }]);
            if (text && !isSpeaking) {
              Speech.speak(text);
              setIsSpeaking(true);
              setShowStopIcon(true);
            }
          } else {
            console.error("Unexpected result structure", result);
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

      await fetchContent(); // Call fetchContent to get the response

    } catch (error) {
      console.error("Error in sendMessage:", error);
      showMessage({
        message: "Error",
        description: "An error occurred while sending the message.",
        type: "danger",
      });
    } finally {
      setLoading(false);
      setUserInput(""); // Clear the input after sending
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      Speech.speak(messages[messages.length - 1]?.text || "");
      setIsSpeaking(true);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setIsSpeaking(false);
  };

  const renderMessage = ({ item }) => (
    <View
      style={{
        padding: 12,
        marginVertical: 4,
        borderRadius: 8,
        backgroundColor: item.user ? "blue" : "lightgray",
        maxWidth: "80%",
        alignSelf: item.user ? "flex-end" : "flex-start",
      }}
    >
      <Text style={{ color: item.user ? "white" : "black", fontSize: 16 }}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#E9F0E8", padding: 16 }}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#E9F0E8" />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        style={{ flex: 1, marginBottom: 8, paddingTop: 16, paddingBottom: 8 }}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#a8c3a3", padding: 12, borderRadius: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 }}>
        <TouchableOpacity
          style={{ backgroundColor: "#86a880", padding: 12, borderRadius: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 }}
          onPress={toggleSpeech}
        >
          {isSpeaking ? (
            <FontAwesome name="microphone-slash" size={24} color="white" />
          ) : (
            <FontAwesome name="microphone" size={24} color="white" />
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="Type a message"
          onChangeText={setUserInput}
          value={userInput}
          onSubmitEditing={sendMessage}
          style={{ flex: 1, marginHorizontal: 12, padding: 12, backgroundColor: "#d3e1d1", borderRadius: 30, color: "gray" }}
          placeholderTextColor="#aaa"
        />
        {showStopIcon && (
          <TouchableOpacity
            style={{ backgroundColor: "red", padding: 12, borderRadius: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 }}
            onPress={clearMessages}
          >
            <Entypo name="controller-stop" size={24} color="white" />
          </TouchableOpacity>
        )}
        {loading && <ActivityIndicator size="large" color="#4B5563" style={{ marginLeft: 8 }} />}
      </View>
    </View>
  );
};

export default GeminiChat;
