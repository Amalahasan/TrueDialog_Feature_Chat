import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import {
  FAB,
  Modal,
  Searchbar,
  Text,
  TextInput,
  Button as PaperButton,
} from 'react-native-paper';
import ChatList from './ChatList';
import Icon from 'react-native-vector-icons/FontAwesome';
import CountryPicker from 'rn-country-picker';
import { CHAT_URL, getChatToken } from '../services';
import { useSelector } from 'react-redux';
import SignalRConnection from '../signalr';

const ChatPage = ({ navigation }) => {
  const userInfo = useSelector(state => state?.userInfo);
  const userAuth = useSelector(state => state?.userAuth);
  const chatList = useSelector(state => state?.chatList);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [countryCode, setCountryCode] = React.useState('1');

  const validatePhoneNumber = (phoneNumber: any) => {
    const phoneRegex = /^(?:\+1\s?)?(\(\d{3}\)|\d{3})[\s\-]?\d{3}[\s\-]?\d{4}$/;
    return phoneRegex.test(phoneNumber);
  };

  const createConversation = async () => {
    if (!validatePhoneNumber(inputValue)) {
      setErrorMessage('Phone Number is not valid.');
      setError(true);
      return;
    }
    const exists =
      chatList?.chatList.filter(item => item.target === inputValue).length > 0;
    if (exists) {
      setErrorMessage('Phone Number already exist.');
      setError(true);
      return;
    }

    const connection = await SignalRConnection.getConnection();
    if (connection && connection.state === 'Disconnected') {
      SignalRConnection.init(CHAT_URL);
    }

    setLoading(true);
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

    const response = await getChatToken(
      userInfo?.userInfo?.accountId,
      userAuth?.userAuth,
    );

    let authPayload = {
      command: 'authorization',
      messageId: generateGUID(),
      payload: {
        username: userInfo?.userInfo?.email,
        password: response?.data?.token,
        nickname: userInfo?.userInfo?.firstName,
      },
    };
    SignalRConnection.sendMessage('ToServer', authPayload);

    let summonPayload = {
      command: 'summon',
      messageId: generateGUID(),
      payload: {
        target: inputValue,
        channelType: 0,
      },
    };
    SignalRConnection.sendMessage('ToServer', summonPayload);
    setLoading(false);
    setVisible(false);
    setInputValue('');
  };

  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

  const handleCancel = () => {
    setInputValue('');
    hideModal();
    setError(false);
  };

  const selectedValue = value => {
    console.log(value);
    setCountryCode(value?.callingCode);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 24,
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <Text style={styles.header}>Chats</Text>
        <Image
          height={24}
          source={require('../assets/logo-dark.png')}
          style={{
            resizeMode: 'contain',
            height: 24,
            position: 'absolute',
            left: '38%',
            transform: [{ translateX: -50 }],
            top: 2,
          }}
        />
      </View>

      <View style={{ padding: 24, paddingTop: 0 }}>
        <Searchbar
          style={styles.searchBar}
          inputStyle={styles.searchBarInput}
          placeholder="Search"
          clearIcon={() =>
            searchQuery && <Icon color={'#999'} name="close" size={24} />
          }
          icon={() => <Icon color={'#999'} name="search" size={24} />}
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
        <ChatList navigation={navigation} query={searchQuery} />
      </View>
      <FAB
        style={[styles.fab, { backgroundColor: '#fff' }]}
        icon={() => <Icon color={'#5664d2'} name="comments" size={24} />}
        onPress={() => showModal()}
      />

      <Modal
        visible={visible}
        contentContainerStyle={{
          backgroundColor: 'white',
          padding: 20,
          marginHorizontal: 20,
          borderRadius: 16,
        }}>
        <Text style={{ marginBottom: 20, fontSize: 16, fontWeight: 'bold' }}>
          New Chat
        </Text>
        {/* <CountryPicker
          animationType={"slide"}
          language="en"
          searchBarPlaceholderTextColor={"#ff0"}
          countryCode={countryCode}
          selectedValue={selectedValue}
        /> */}
        <TextInput
          mode="outlined"
          label="Enter phone number..."
          value={inputValue}
          onChangeText={text => {
            setInputValue(text);
            setError(false);
          }}
          style={{ marginBottom: 10 }}
        />
        {error && (
          <Text style={{ marginBottom: 20, fontSize: 14, color: 'red' }}>
            {errorMessage}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: error ? 0 : 10,
          }}>
          <PaperButton
            mode="contained"
            style={{ flex: 1, marginRight: 10 }}
            onPress={createConversation}>
            Start
          </PaperButton>
          <PaperButton mode="outlined" style={{ flex: 1 }} onPress={handleCancel}>
            Cancel
          </PaperButton>
        </View>
      </Modal>

      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator animating={true} size="large" color={'#5664d2'} />
          <Text style={styles.text}>Loading...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    flex: 1,
    textAlign: 'left',
  },
  text: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  searchBar: {
    height: 40,
    borderColor: '#eff2f7',
    borderWidth: 1,
    backgroundColor: '#eff2f7',
    marginTop: 8,
  },
  searchBarInput: {
    minHeight: 0,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    margin: 16,
  },
  loaderContainer: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
});

export default ChatPage;
