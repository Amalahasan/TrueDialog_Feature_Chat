import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Linking,
} from 'react-native';
import { Divider, List, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { fetchContacts } from '../services';
import { store } from '../redux/store';

const ContactsList = ({ navigation, query }) => {
  const screenHeight = Dimensions.get('window').height;
  const [contacts, setContacts] = useState([]);
  const [contactsTemp, setContactsTemp] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const userAuth = useSelector(state => state?.userAuth);
  const userInfo = useSelector(state => state?.userInfo);
  const contactsData = useSelector(state => state?.contacts);

  useEffect(() => {
    setContacts(contactsData?.contacts);
    setContactsTemp(contactsData?.contacts);
  }, [contactsData]);

  const getContacts = async () => {
    try {
      setLoading(true);
      const response = await fetchContacts(
        userInfo?.userInfo?.accountId,
        userAuth?.userAuth,
      );
      setLoading(false);
      if (response?.data?.data) {
        store.dispatch({
          type: 'CONTACTS',
          payload: response?.data?.data,
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  useEffect(() => {
    const filtered = contactsTemp.filter(contact => {
      return (
        (contact?.id).toString().includes(query) ||
        contact?.phoneNumber.includes(query)
      );
    });
    setContacts(filtered);
  }, [query]);

  const renderContactItem = ({ item }) => {
    const timestamp = item?.modified;
    const now = new Date(timestamp);
    const formattedDate = `${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    return (
      <>
        <List.Item
          onPress={() => {
            Linking.openURL(`tel:${item.phoneNumber}`);
          }}
          key={item.id}
          title={item.phoneNumber}
          right={() => <Text style={{ paddingTop: 8 }}>{`${formattedDate} ${formattedTime}`}</Text>}
          left={() => <Icon color={'#5664d2'} name="phone" size={32} />}
          style={styles.listItem}
        />
        <Divider />
      </>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.loaderContainer, { height: screenHeight - 200 }]}>
        <ActivityIndicator animating={true} size="large" color={'#5664d2'} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#fff' }]}>
      <FlatList
        data={contacts}
        renderItem={renderContactItem}
        keyExtractor={item => item.id}
        ListFooterComponent={<View style={{ height: 160 }}></View>}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={getContacts} />
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
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    marginTop: 20,
  },
});

export default ContactsList;
