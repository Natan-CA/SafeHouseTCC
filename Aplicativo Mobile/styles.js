import {Colors} from 'react-native/Libraries/NewAppScreen';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'skyblue',
  },

  paperLogin: {
    alignItems: 'stretch',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    width: 300,
    height: 360,
    padding: 15,
    borderRadius: 10,
  },

  paperEmailLogin: {
    alignItems: 'stretch',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    width: 300,
    height: 300,
    padding: 15,
    borderRadius: 10,
  },

  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    height: 40,
    fontSize: 16,
  },

  title: {
    paddingBottom: 15,
    textAlign: 'center',
    fontSize: 22,
  },

  warning: {},

  button: {
    borderRadius: 10,
    fontWeight: 'bold',
    
  },

  link: {
    color: '#218AFF',
    textAlign: 'center',
    paddingTop: 5
  },
});

export default styles;
