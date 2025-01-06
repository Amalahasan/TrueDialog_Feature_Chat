import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Searchbar } from 'react-native-paper';
import ContactList from './ContactList';
import Icon from 'react-native-vector-icons/FontAwesome';

const ContactsPage = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 24,
          justifyContent: 'flex-start',
        }}>
        <Text style={styles.header}>Contacts</Text>
        <Image
          height={24}
          source={require('../assets/logo-dark.png')}
          style={{ resizeMode: 'contain', height: 24, position: 'absolute', left: '38%', transform: [{ translateX: -50 }], top: 4 }}
        />
      </View>
      <View style={{ padding: 24, paddingTop: 0 }}>
        <Searchbar
          style={{
            height: 40,
            borderColor: '#eff2f7',
            borderWidth: 1,
            backgroundColor: '#eff2f7',
            marginTop: 8,
          }}
          inputStyle={{
            minHeight: 0,
          }}
          clearIcon={() =>
            searchQuery && <Icon color={'#999'} name="close" size={24} />
          }
          icon={() => <Icon color={'#999'} name="search" size={24} />}
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />

        <ContactList navigation={navigation} query={searchQuery} />
      </View>
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
  },
  text: {
    fontSize: 24,
    marginTop: 20,
    fontWeight: 'bold',
  },
});

export default ContactsPage;
