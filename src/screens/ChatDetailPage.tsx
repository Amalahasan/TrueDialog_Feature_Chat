import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Text, Avatar, Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { fetchChatDetails, getChatToken } from '../services';
import { store } from '../redux/store';
import SignalRConnection from '../signalr'

const ChatDetailPage = ({ route, navigation }) => {
  const { data } = route?.params;
  const [message, setMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const userAuth = useSelector(state => state?.userAuth);
  const userInfo = useSelector(state => state?.userInfo);
  const chatDetails = useSelector(state => state?.chatDetails);

  useEffect(() => {
    setMessages(chatDetails?.[data?.id]);
  }, [chatDetails, data]);

  const getChats = async () => {
    try {
      setLoading(true);
      const response = await fetchChatDetails(
        userInfo?.userInfo?.accountId,
        data?.id,
        userAuth?.userAuth,
      );
      setLoading(false);
      if (response?.data) {
        store.dispatch({
          type: 'CHAT_DETAILS',
          payload: { data: response?.data, id: data?.id },
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    function generateGUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    const response = await getChatToken(userInfo?.userInfo?.accountId, userAuth?.userAuth);

    let payload = {
      command: "authorization",
      messageId: generateGUID(),
      payload: {
        username: userInfo?.userInfo?.email,
        password: response?.data?.token,
        nickname: userInfo?.userInfo?.firstName
      }
    }
    SignalRConnection.sendMessage('ToServer', payload);

    let command = {
      command: "message",
      messageId: generateGUID(),
      payload: {
        conversationId: data?.id,
        target: data?.target,
        message: message,
        mediaIds: [],
        channelType: 0
      }
    }
    SignalRConnection.sendMessage('ToServer', command);
  }

  useEffect(() => {
    getChats();
  }, []);

  const handleSend = async () => {
    if (message.trim()) {
      const newMessage = {
        id: `${messages.length + 1}`,
        message: message,
        user: 'John',
        logDate: Date.now(),
        isSent: true,
        channelCode: '26246',
      };
      setMessages([newMessage, ...messages]);
      setMessage('');
      sendMessage();
    }
  };

  const renderMessage = ({ item }) => {
    const timestamp = item?.logDate;
    const now = new Date(timestamp);
    const formattedDate = `${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    if (item?.message) {
      return (
        <View
          style={[
            styles.messageContainer,
            item.incoming ? styles.receivedMessage : styles.sentMessage,
          ]}>
          <Avatar.Text
            style={{ backgroundColor: '#eff2f7' }}
            label={'#'}
            size={48}
          />
          <View style={styles.messageContent}>
            <Text style={styles.messageText}>{item.message}</Text>
            <Text
              style={
                styles.timestamp
              }>{`${formattedDate} ${formattedTime}`}</Text>
          </View>
        </View>
      );
    }
  };

  const getMessageLength = (message: any) => {
    if (message.length > 160) {
      return 160 - (message.length % 160)
    }
    return 160 - message.length;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Appbar.Header style={{ backgroundColor: '#fff' }} elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={data?.target} />
      </Appbar.Header>
      <View style={styles.chatContainer}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator
              animating={true}
              size="large"
              color={'#5664d2'}
            />
            <Text style={styles.text}>Loading...</Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            inverted
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={getChats} />
            }
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={{ position: 'absolute', top: 4, left: 16, color: '#505d69' }}>
          Messages: {parseInt(((message.length / 161) + 1))} Remaining: {getMessageLength(message) == 0 ? 160 : getMessageLength(message)}
        </Text>
        <TextInput
          multiline
          numberOfLines={5}
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
        />
        <Icon
          name="send"
          size={24}
          color={!message.trim() ? '#ccc' : '#5664d2'}
          onPress={handleSend}
          disabled={!message.trim()}
          style={styles.sendButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatContainer: {
    flex: 1,
    padding: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  messageContent: {
    maxWidth: '80%',
    marginLeft: 10,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
  },
  messageText: {
    marginVertical: 5,
    fontSize: 16,
    backgroundColor: '#5664d2',
    padding: 12,
    color: '#fff',
    borderRadius: 6,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 24
  },
  input: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    marginTop: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    marginTop: 20,
  },
});

export default ChatDetailPage;
