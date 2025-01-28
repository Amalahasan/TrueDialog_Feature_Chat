import React, { useCallback, useEffect, useState } from 'react';
import { AppState, Modal, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { PaperProvider, DefaultTheme, Button, Snackbar } from 'react-native-paper';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import NetInfo from '@react-native-community/netinfo';
import { store, persistor } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import 'react-native-url-polyfill/auto';
import SignalRConnection from './src/signalr'
import { CHAT_URL, fetchChatDetails, fetchChatInfo, getChatToken } from './src/services';

const App = () => {
  const [visible, setVisible] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const refreshChats = async () => {
    try {
      const response = await fetchChatInfo(
        store.getState()?.userInfo?.userInfo?.accountId,
        store.getState()?.userAuth?.userAuth,
      );
      if (response?.data) {
        store.dispatch({
          type: 'CHAT_LIST',
          payload: response?.data,
        });
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const getChats = async (id: any) => {
    try {
      const response = await fetchChatDetails(
        store.getState()?.userInfo?.userInfo?.accountId,
        id,
        store.getState()?.userAuth?.userAuth,
      );
      if (response?.data) {
        store.dispatch({
          type: 'CHAT_DETAILS',
          payload: { data: response?.data, id: id },
        });
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }

  const chatAuthorization = async (id: any) => {
    //marking as viewed when user in the same converation
    let currentConversationId = store.getState()?.userInfo?.conversationId;
    if (currentConversationId === id) {
      const response = await getChatToken(
        store.getState()?.userInfo?.userInfo?.accountId,
        store.getState()?.userAuth?.userAuth,
      );
      let payload = {
        command: 'authorization',
        messageId: generateGUID(),
        payload: {
          username: store.getState()?.userInfo?.userInfo?.email,
          password: response?.data?.token,
          nickname: store.getState()?.userInfo?.userInfo?.firstName,
        },
      };
      SignalRConnection.sendMessage('ToServer', payload);

      let command = {
        command: 'viewed',
        messageId: generateGUID(),
        payload: {
          conversationId: id,
          viewed: true,
        },
      };
      SignalRConnection.sendMessage('ToServer', command);
    }
  };

  const handleMessage = useCallback((message: any) => {
    console.log("received message", message);
    switch (message?.command) {
      case "notifyDeliveryStatus":
        setSnackMessage("Message delivered successfully!");
        setSnackVisible(true);
        refreshChats();
        getChats(message?.payload?.conversationId);
        break;
      case "notifyConversationCreated":
        setSnackMessage("New chat created successfully!")
        setSnackVisible(true);
        refreshChats();
        break;
      case "incoming":
        setSnackMessage("New message from " + message?.payload.sender + "\n\n " + message?.payload.message)
        setSnackVisible(true);
        const date = new Date();

        chatAuthorization(message?.payload?.conversationId);

        const newMessage = {
          id: message?.messageId,
          message: message?.payload?.message,
          logDate: date.toISOString().slice(0, 19),
          isSent: true,
          incoming: true,
          channelCode: message?.payload?.accountId,
        };
        store.dispatch({
          type: 'CHAT_DETAILS',
          payload: {
            data: [newMessage, ...store.getState()?.chatDetails?.[message?.payload?.conversationId]],
            id: message?.payload?.conversationId
          },
        });
        refreshChats();
        break;
      case "ok":
        refreshChats();
        break;
      default:
        break;
    }
  }, [store]);

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      refreshChats();
      const connection = SignalRConnection.getConnection();
      if (connection && connection.state === "Disconnected") {
        SignalRConnection.init(CHAT_URL);
      }
    }
  };


  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    });
    SignalRConnection.init(CHAT_URL);
    SignalRConnection.onMessage('onmessage', handleMessage);
    return () => {
      unsubscribe()
      SignalRConnection.stopConnection();
      subscription.remove();
    };
  }, []);

  const closeSnack = () => {
    setSnackVisible(false);
  };

  const backgroundStyle = {
    flex: 1,
    backgroundColor: '#fff',
  };
  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#5664d2',
      accent: 'white',
      text: '#FFFFFF',
    },
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <PaperProvider theme={customTheme}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppNavigator />
            <Modal
              visible={visible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setVisible(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalText}>No Internet Connection</Text>
                  <Text style={styles.modalDescription}>
                    Please check your internet connection.
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => setVisible(false)}
                    style={{ borderRadius: 0, marginVertical: 16 }}>
                    Close
                  </Button>
                </View>
              </View>
            </Modal>
            <Snackbar
              style={{ marginHorizontal: 25, backgroundColor: "#5664d2", marginBottom: 80 }}
              visible={snackVisible}
              onDismiss={closeSnack}
              action={{
                label: 'Close',
                onPress: () => {
                  closeSnack();
                },
              }}
            >
              <Text style={{ color: '#fff', fontSize: 14 }}>
                {snackMessage}
              </Text>
            </Snackbar>
          </PersistGate>
        </Provider>
      </PaperProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    backgroundColor: 'tomato',
  },
  dialogText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 10,
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default App;
