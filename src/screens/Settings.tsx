import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { store } from '../redux/store';

const ProfilePage = ({ navigation }) => {
  const userInfo = useSelector(state => state?.userInfo);

  const handleSignOut = () => {
    store.dispatch({
      type: 'USER_INFO',
      payload: {},
    });
    store.dispatch({
      type: 'USER_AUTH',
      payload: {},
    });
    navigation.replace('Login');
  };

  const getLabel = () => {
    return (
      userInfo?.userInfo?.firstName?.charAt(0) +
      userInfo?.userInfo?.lastName?.charAt(0)
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#fff' }]}>
      {/* User's Name */}
      <Card style={styles.card} elevation={0}>
        <Card.Content style={styles.cardContent}>
          <Avatar.Text size={88} label={getLabel()} />
        </Card.Content>
        <Card.Content>
          <Title style={styles.title}>
            {userInfo?.userInfo?.firstName}
            {userInfo?.userInfo?.lastName}
          </Title>
        </Card.Content>
      </Card>

      {/* User's Email */}
      <Card style={styles.card} elevation={0}>
        <Card.Content>
          <Text style={styles.label}>Email:</Text>
          <Paragraph style={styles.detailText}>
            {userInfo?.userInfo?.email}
          </Paragraph>
        </Card.Content>
      </Card>

      {/* User's Phone */}
      <Card style={styles.card} elevation={0}>
        <Card.Content>
          <Text style={styles.label}>Phone:</Text>
          <Paragraph style={styles.detailText}>
            {userInfo?.userInfo?.phoneNumber}
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={{ marginHorizontal: 16 }}>
        {/* Sign Out Button */}
        <Button mode="contained" onPress={handleSignOut} style={styles.button}>
          Sign Out
        </Button>
      </View>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0 (4)</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 8,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    // marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  detailText: {
    color: '#6e6e6e',
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
  versionContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  versionText: {
    color: '#888',
    fontSize: 14,
  },
});

export default ProfilePage;
