import React, {useState, useEffect} from 'react';
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
const LoginScreen = ({navigation}) => {
  // Hooks to Manage component state
  const [email, setEmail] = useState('');
  const [emailVerify, setEmailVerify] = useState('');
  const [nome, setNome] = useState('');

  const simpleValidation = (mail, mailVerify, name) => {
    if (mail === '' || mailVerify === '' || name === '') {
      Alert.alert('Preencha todos os campos!');
    } else if (mail !== mailVerify) {
      Alert.alert('Emails não são iguais');
    } else {
      getEmail(mail, name);
    }
  };

  // Função para verificar se o email já está no banco
  async function getEmail(mail, name) {
    try {
      let response = await fetch(`http://192.168.0.120:3000/users/${mail}`);
      let responseJson = await response.json();
      console.log(responseJson);
      if (responseJson[0] !== undefined) {
        Alert.alert('E-mail já cadastrado! Informe outro E-mail');
        return;
      } else {
        insertData(mail, name);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Função para inserir dados no banco
  async function insertData(mail, name) {
    try {
      let response = await fetch(
        `http://192.168.0.120:3000/newUser/${name}/${mail}`,
        {method: 'POST'},
      );
      let responseJson = response;
      if (responseJson.status === 200) {
        // returns true to 'father' call
        console.log('inserção sucesso');
        navigation.navigate('Home');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="skyblue" />
      <DismissKeyboard>
        <View style={styles.container}>
          <SafeAreaView>
            <View style={styles.paperLogin}>
              <Text style={styles.title}>Cadastro</Text>
              <Text style={{fontSize: 18}}>Nome</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={text => setNome(text)}
              />

              <Text style={{fontSize: 18}}>Email</Text>
              <TextInput
                style={{borderWidth: 1, borderColor: 'gray', height: 40}}
                onChangeText={text => setEmail(text)}
              />

              <Text style={{fontSize: 18}}>Confirmar email</Text>
              <TextInput
                style={{borderWidth: 1, borderColor: 'gray', height: 40}}
                onChangeText={text => setEmailVerify(text)}
              />
              <Button
                title="Entrar"
                style={styles.button}
                onPress={() => simpleValidation(email, emailVerify, nome)}
              />
              <Text
                style={styles.link}
                onPress={() => navigation.navigate('EmailAuth')}>
                Já possui cadastro?
              </Text>
            </View>
          </SafeAreaView>
        </View>
      </DismissKeyboard>
    </>
  );
};

LoginScreen.navigationOptions = {
  title: 'Auth',
};

export default LoginScreen;
