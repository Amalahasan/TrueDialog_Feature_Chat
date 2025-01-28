import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';

const SplashScreen = ({ navigation }: any) => {
  const userAuth = useSelector(state => state?.userAuth);

  useEffect(() => {
    setTimeout(() => {
      let route = userAuth?.userAuth?.auth?.username ? 'Home' : 'Login';
      navigation.replace(route);
    }, 2000);
  }, [navigation, userAuth]);

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../assets/logo-dark.png')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  image: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
});

export default SplashScreen;
