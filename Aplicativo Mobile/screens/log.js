import React, {Component} from 'react';
import {View, Text, StatusBar, SafeAreaView} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

import styles from './../styles';

class LogScreen extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      dataSource: [],
    };
  }

  componentDidMount() {
    fetch('http://192.168.0.120:3000/sensorLog')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          dataSource: [responseJson],
        });
      });
  }

  // csutomnizar a saida aqui
  _renderItem = ({item}) => (
    <>
      <Text style={{fontWeight: 'bold'}}>Sensor: {item.sensor}</Text>
      <Text>Início: {item.ini}</Text>
      <Text style={{paddingBottom: 10}}>Fim: {item.fim}</Text>
    </>
  );

  render() {
    if (this.state.isLoading) {
      return (
        <>
          <StatusBar barStyle="dark-content" backgroundColor="skyblue" />
          <View style={styles.container}>
            <SafeAreaView>
              <Text>Fazendo busca...</Text>
            </SafeAreaView>
          </View>
        </>
      );
    } else {
      console.log(this.state.dataSource[0]);
      return (
        <>
          <StatusBar barStyle="dark-content" backgroundColor="skyblue" />
          <View style={styles.container}>
            <SafeAreaView>
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: 18,
                  paddingBottom: 10,
                  paddingTop: 10,
                }}>
                Histórico:
              </Text>
              <FlatList
                data={this.state.dataSource[0]}
                renderItem={this._renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </SafeAreaView>
          </View>
        </>
      );
    }
  }
}

LogScreen.navigationOptions = {
  title: 'Log',
};

export default LogScreen;
