import React, {useState} from 'react';
import {
  Button,
  Alert,
  TextInput,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import styles from './../styles';

// Wrap the content wich when touched will dismiss the keyboard
const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

// Componente Tela de Login
const emailLoginScreen = ({navigation}) => {
  // Hooks to Manage component state
  const [email, setEmail] = useState('');

  const simpleValidation = mail => {
    if (mail === '') {
      Alert.alert('Preencha todos os campos!');
    } else {
      getEmail(mail);
    }
  };

  // Função para verificar se o email já está no banco
  async function getEmail(mail, name) {
    try {
      let response = await fetch(`http://192.168.0.120:3000/users/${mail}`);
      let responseJson = await response.json();
      console.log(responseJson);
      if (responseJson[0] !== undefined) {
        navigation.navigate('Log');
        return;
      } else {
        Alert.alert('E-mail não cadastrado!');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="skyblue" />
      <DismissKeyboard>
        <View style={styles.container}>
          <SafeAreaView>
            <View style={styles.paperEmailLogin}>
              <Text style={styles.title}>Login</Text>
              <Text style={{fontSize: 18}}>Email</Text>
              <TextInput
                style={{borderWidth: 1, borderColor: 'gray', height: 40}}
                onChangeText={text => setEmail(text)}
              />
              <Button
                title="Entrar"
                style={styles.button}
                onPress={() => simpleValidation(email)}
              />
            </View>
          </SafeAreaView>
        </View>
      </DismissKeyboard>
    </>
  );
};

emailLoginScreen.navigationOptions = {
  title: 'AuthEmail',
};

export default emailLoginScreen;
