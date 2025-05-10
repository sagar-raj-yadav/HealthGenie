import React, { useEffect, useState } from "react";
import { Text, Image, StyleSheet, TextInput, TouchableOpacity, View, FlatList, SafeAreaView, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";

const { width } = Dimensions.get('window');

const GEMINI_API_KEY = "AIzaSyBuEc68Llso8LYY07LyY-fS_E7hX9qBKcA";

type Message = {
  text: string;
  sender: "user" | "gemini";
};

const ChatScreen = () => {
  const [msg, setMsg] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const route = useRoute<any>();
  const selectedDate = route?.params?.selectedDate || new Date().toISOString().split("T")[0];
  const isNewChat = route?.params?.isNewChat || false;


  
  useEffect(() => {
    const loadPreviousMessages = async () => {
      if (isNewChat) {
        // Clear previous messages for new chat
        setMessages([]);
        return;
      }

      const stored = await AsyncStorage.getItem("aichat");
      if (stored) {
        const data = JSON.parse(stored);
        if (data[selectedDate]) {
          setMessages(data[selectedDate].slice().reverse());
        }
      }
    };
    loadPreviousMessages();
  }, [selectedDate, isNewChat]);


  const handleButtonClick = async () => {
    if (!msg.trim()) return;

    const userMessage: Message = { text: msg, sender: "user" };
    setMessages((prev) => [userMessage, ...prev]);
    setMsg("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: msg }] }],
          }),
        }
      );

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      const geminiMessage: Message = { text: reply, sender: "gemini" };

      setMessages((prev) => [geminiMessage, userMessage, ...prev]);

      const stored = await AsyncStorage.getItem("aichat");
      const chatData = stored ? JSON.parse(stored) : {};
      chatData[selectedDate] = [...(chatData[selectedDate] || []), userMessage, geminiMessage];
      await AsyncStorage.setItem("aichat", JSON.stringify(chatData));
    } catch (err) {
      const errorMessage: Message = { text: "Error occurred", sender: "gemini" };
      setMessages((prev) => [errorMessage, ...prev]);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.geminiMessage]}>
      <Text style={[styles.messageText, item.sender === 'user' ? styles.userMessageText : styles.geminiMessageText]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesContainer}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Query...."
          placeholderTextColor="grey"
          value={msg}
          onChangeText={setMsg}
        />
        <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
          <Image source={require("../utils/send.png")} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#494F55',
  },
  messagesContainer: {
    padding: 10,
  },
  message: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: 'rgba(12, 171, 246, 0.4)',
    alignSelf: 'flex-end',
  },
  geminiMessage: {
    backgroundColor: 'rgba(117, 242, 76, 0.6)',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: 'white',
  },
  userMessageText: {
    fontWeight: "bold",
  },
  geminiMessageText: {
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 25,
    marginVertical: 6,
    width: width * 0.95,
    alignSelf: "center",
    paddingHorizontal: 5,
  },
  input: {
    flex: 1,
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  button: {
    padding: 10,
  },
});

export default ChatScreen;
