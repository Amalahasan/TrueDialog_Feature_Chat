import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  Text,
  Card,
  Avatar,
  IconButton,
  List,
  Searchbar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const CallItem = ({ call }) => (
  <Card style={styles.card} elevation={0}>
    <Card.Content style={styles.cardContent}>
      <Avatar.Image size={50} source={{ uri: call.avatar }} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{call.name}</Text>
        <Text style={styles.timestamp}>{call.timestamp}</Text>
      </View>
      <IconButton
        icon={() => <Icon color={'#999'} name='phone' size={24} />}
        size={30}
        onPress={() => console.log(`${call.name} call clicked`)}
        style={styles.callButton}
      />
    </Card.Content>
  </Card>
);

const CallsPage = () => {
  const callsData = [
    {
      id: '1',
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      timestamp: 'Today, 2:30 PM',
      isIncoming: true,
    },
    {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      timestamp: 'Yesterday, 4:15 PM',
      isIncoming: false,
    },
    {
      id: '3',
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      timestamp: 'Sep 10, 1:00 PM',
      isIncoming: true,
    },
    // Add more call data as needed
  ];

  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 24,
          justifyContent: 'space-between',
        }}>
        <Text style={styles.header}>Calls</Text>
      </View>

      <View style={{ padding: 24, paddingTop: 0 }}>
        <Searchbar
          style={styles.searchBar}
          inputStyle={styles.searchBarInput}
          placeholder="Search"
          icon={() => <Icon color={'#999'} name='search' size={24} />}
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
        <FlatList
          data={callsData}
          renderItem={({ item }) => <CallItem call={item} />}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
  callButton: {
    marginLeft: 10,
  },
  text: {
    fontSize: 24,
    marginTop: 20,
    fontWeight: 'bold',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: 'white',
    marginTop: 8,
  },
  searchBarInput: {
    minHeight: 0,
  },
});

export default CallsPage;
