import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Title,
  Text,
  Card,
  ActivityIndicator,
} from 'react-native-paper';
import { store } from '../redux/store';
import { fetchUserInfo } from '../services';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email) {
      return 'Username cannot be empty';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setUsernameError(emailError);
    setPasswordError(passwordError);
    if (emailError || passwordError) {
      return;
    } else {
      try {
        setLoading(true);
        const response = await fetchUserInfo(email, password);
        setLoading(false);
        if (response?.data) {
          store.dispatch({
            type: 'USER_INFO',
            payload: response?.data,
          });
          store.dispatch({
            type: 'USER_AUTH',
            payload: {
              auth: {
                username: email,
                password: password,
              },
            },
          });
          navigation.replace('Home');
        } else {
          setPasswordError('Invalid username or password');
        }
      } catch (error) {
        setPasswordError('Invalid username or password');
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = () => {
    Linking.openURL('https://ui.truedialog.com/Recover');
  };

  const handleCreateAccount = () => {
    Linking.openURL('https://www.truedialog.com/pricing/#page#17');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Card style={styles.card} elevation={0}>
        <Card.Content>
          <Image
            style={styles.logo}
            source={require('../assets/logo-dark.png')}
          />
          <Title style={styles.title}>Welcome Back!</Title>
          <Title style={styles.subTitle}>
            Sign in to continue to TrueDialog.
          </Title>
          <TextInput
            label="Username"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
            mode="outlined"
          />
          {usernameError && <Text style={{ color: 'red' }}>{usernameError}</Text>}
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={[styles.input, { marginTop: 8 }]}
            mode="outlined"
          />
          {passwordError && <Text style={{ color: 'red' }}>{passwordError}</Text>}
          <Button
            mode="contained"
            onPress={handleLogin}
            disabled={isLoading}
            icon={
              isLoading
                ? () => <ActivityIndicator size="small" color="#fff" />
                : ''
            }
            style={[styles.button, { borderRadius: 0 }]}>
            Login
          </Button>

          <View style={styles.footer}>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={[styles.footerText]}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreateAccount}>
              <Text style={[styles.footerText]}>
                Don't have an account? Create one
              </Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  logo: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  card: {
    margin: 16,
    borderRadius: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
  },
  subTitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 16,
    paddingVertical: 4,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
    color: '#505d69',
  },
  linkText: {
    textDecorationLine: 'underline',
  },
});

export default LoginPage;
