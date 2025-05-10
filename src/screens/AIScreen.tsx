import React, { useEffect, useState } from "react";
import { View, Image,Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { NavigationProp, useRoute } from "@react-navigation/native";
import LottieView from 'lottie-react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get('window');

interface IndexProps {
  navigation: NavigationProp<any>;
}

interface ChatMessage {
  text: string;
}

interface ChatMessagesByDate {
  [date: string]: ChatMessage[];
}

const IntroductionScreen: React.FC<IndexProps> = ({ navigation }) => {
  const [messages, setMessages] = useState<ChatMessagesByDate>({});
  const route = useRoute<any>();
  const { selectedDate, isNewChat } = route.params || {};

  useEffect(() => {
    const today = selectedDate || new Date().toISOString().split("T")[0];
    const loadPreviousMessages = async () => {
      if (isNewChat) {
        setMessages({});
        return;
      }

      const stored = await AsyncStorage.getItem("aichat");
      if (stored) {
        const data = JSON.parse(stored);
        setMessages(data);
      }
    };

    loadPreviousMessages();
  }, [selectedDate, isNewChat]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Introducing AIRA</Text>

       <Image
        source={require('../utils/robot1.png')}
        style={styles.lottie}
        resizeMode="cover"
      />


      <Text style={styles.description}>
        Aira is your personal self-care assistant, offering smart suggestions and insights
        based on your habits, moods, and daily logs.
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("aichat", { isNewChat: true })}
        activeOpacity={0.7}
        style={styles.buttonContainer}
      >
        <Text style={styles.startButtonText}>START CONVERSATION</Text>
      </TouchableOpacity>

      <View style={styles.conversationsContainer}>
        <View style={{ gap: width * 0.2, flexDirection: "row", alignSelf: "center", justifyContent: "space-between" }}>
          <Text style={styles.conversationsTitle}>Previous conversations</Text>
          <TouchableOpacity onPress={async () => {
            await AsyncStorage.removeItem("aichat");
            setMessages({});
          }}>
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "white" }}>Clear History</Text>
          </TouchableOpacity>
        </View>

        {Object.keys(messages).length === 0 ? (
          <Text style={styles.conversationsText}>
            Hmmm.... seems like you don’t have any conversations with Aira.
          </Text>
        ) : (
          <ScrollView>
            {Object.keys(messages)
              .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
              .map((date) => (
                <TouchableOpacity
                  key={date}
                  style={styles.dateItem}
                  onPress={() => navigation.navigate('aichat', { selectedDate: date })}
                >
                  <Text style={styles.datePreview}>
                    {messages[date]?.[0]?.text?.slice(0, 50) || 'No preview'}
                  </Text>
                  <Text style={styles.dateText}>{date}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },

  lottie: {
    width: '40%',
    height: '20%',
  },
  description: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
  },
  buttonContainer: {
    backgroundColor: 'green',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  conversationsContainer: {
    backgroundColor: 'rgba(50, 58, 61, 1)',
    width: width,
    height: height * 0.5,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginVertical: 30,
  },
  conversationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  conversationsText: {
    fontSize: 16,
    color: '#aaa',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  dateItem: {
    backgroundColor: '#2e2e2e',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    justifyContent:"space-between",
    flexDirection:"row"
  },
  dateText: {
    fontSize: 14,
    color: '#fff',
  },
  datePreview: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 4,
    fontWeight:"bold"
  },
});

export default IntroductionScreen;
