import React, {useState} from 'react';
import {
  Button,
  Alert,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import styles from './../styles';

const HomeScreen = ({navigation}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="skyblue" />
      <View style={styles.container}>
        <SafeAreaView>
          <Text style={styles.title}>E-mail cadastrado!</Text>
        </SafeAreaView>
      </View>
    </>
  );
};

HomeScreen.navigationOptions = {
  title: 'Home',
};

export default HomeScreen;
