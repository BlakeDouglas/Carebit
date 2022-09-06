import {
  StyleSheet,
  SafeAreaView,
  Text,
  Linking,
  View,
  Pressable,
} from "react-native";

import React, { useEffect, useState, useCallback } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { Provider, useSelector } from "react-redux";
import { getDatabase, get, set } from "firebase/database";
export default function ChatScreen({ navigation }) {
  const userData = useSelector((state) => state.Reducers.userData);
  console.log(userData.firstName);
  const database = getDatabase();
  const [messages, setMessages] = useState([]);
  const [myData, setMyData] = useState(null);

  const onButton = async () => {
    try {
      const database = getDatabase();

      const user = await findUser("Bob");
      if (user) {
        setMyData(user);
      } else {
        const newUserObj = {
          username: "Bob",
        };
        set(ref(database, "users/${username}"), newUserObj);
        setMyData(newUserObj);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //const thread = await get(ref(database, 'users/Bob' ));
  // return thread.val()

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Chat Started",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
}
