import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { List, Avatar, Text, useTheme, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { fetchChatInfo } from '../services';
import { store } from '../redux/store';

const ChatList = ({ navigation, query }) => {
  const theme = useTheme();
  const [chats, setChats] = useState([]);
  const [chatsTemp, setChatsTemp] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const userAuth = useSelector(state => state?.userAuth);
  const userInfo = useSelector(state => state?.userInfo);
  const chatList = useSelector(state => state?.chatList);

  useEffect(() => {
    setChats(chatList?.chatList);
    setChatsTemp(chatList?.chatList);
  }, [chatList]);

  const getChats = async () => {
    try {
      setLoading(true);
      const response = await fetchChatInfo(
        userInfo?.userInfo?.accountId,
        userAuth?.userAuth,
      );
      setLoading(false);
      if (response?.data) {
        store.dispatch({
          type: 'CHAT_LIST',
          payload: response?.data,
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  useEffect(() => {
    const filtered = chatsTemp.filter(contact => {
      return (
        (contact?.target)
          .toString()
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        contact?.lastMessage.toLowerCase().includes(query.toLowerCase())
      );
    });
    setChats(filtered);
  }, [query]);

  const renderChatItem = ({ item }) => {
    const timestamp = item?.lastMessageDate;
    const now = new Date(timestamp + 'Z');
    const formattedDate = `${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}`;
    const amPm = now.getHours() >= 12 ? 'PM' : 'AM';
    const formattedTime = `${now.getHours() % 12}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')} ${amPm}`;
    return (
      <>
        <List.Item
          onPress={() => {
            navigation.push('ChatDetails', { data: item });
          }}
          title={item.target}
          descriptionNumberOfLines={1}
          description={item.lastMessage}
          left={() => (
            <>
              <Avatar.Text size={36} label={'#'} />
              {item.unread > 0 && (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: 'green',
                  }}
                />
              )}
            </>
          )}
          right={() => (
            <Text style={[styles.time, { color: theme.colors.placeholder }]}>
              {`${formattedDate} ${formattedTime}`}
            </Text>
          )}
          style={styles.listItem}
        />
        <Divider />
      </>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator animating={true} size="large" color={'#5664d2'} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#fff' }]}>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        ListFooterComponent={<View style={{ height: 160 }}></View>}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={getChats} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  listItem: {
    backgroundColor: 'white',
    marginBottom: 4,
    borderRadius: 8,
    elevation: 2,
  },
  time: {
    fontSize: 12,
    alignSelf: 'flex-start',
    paddingTop: 8,
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

export default ChatList;
