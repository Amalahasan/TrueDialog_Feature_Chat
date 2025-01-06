// TwoFactorPage.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Card, useTheme } from 'react-native-paper';

const TwoFactorPage = ({ navigation }) => {
  const [code, setCode] = useState('');
  const theme = useTheme();

  const handleVerify = () => {
    navigation.push('Home');
  };

  return (
    <View style={[styles.container, { backgroundColor: '#fff' }]}>
      <Card style={styles.card} elevation={0}>
        <Card.Content>
          <Title style={styles.title}>Two-Factor Authentication</Title>
          <TextInput
            label="Enter the code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.input}
            mode="outlined"
          />
          <Button
            mode="contained"
            onPress={handleVerify}
            style={[styles.button, { borderRadius: 0 }]}>
            Verify Code
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    margin: 16,
    borderRadius: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
    paddingVertical: 4,
  },
});

export default TwoFactorPage;
