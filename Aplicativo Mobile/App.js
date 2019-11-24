/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
// Importing Screens
import LoginScreen from './screens/login';
import HomeScreen from './screens/home';
import emailLoginScreen from './screens/emailLogin';
import LogScreen from './screens/log';

// react-navigations dependencies
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

//Creating Navigation Paths
const AuthStack = createStackNavigator(
  {SignIn: LoginScreen, EmailAuth: emailLoginScreen},
  // Hide white header on this screen
  {headerMode: 'none'},
);
// Creating Navigation Paths
const HomeStack = createStackNavigator(
  {Home: HomeScreen},
  // Hide white header on this screen
  {headerMode: 'none'},
);

const EmailStack = createStackNavigator(
  {EmailAuth: emailLoginScreen},
  // Hide white header on this screen
  {headerMode: 'none'},
);

const LogStack = createStackNavigator(
  {Log: LogScreen},
  // Hide white header on this screen
  {headerMode: 'none'},
);

// Navigator
const Routes = createAppContainer(
  createSwitchNavigator(
    {
      Home: HomeStack,
      Auth: AuthStack,
      Log: LogStack,
    },
    {
      initialRouteName: 'Auth',
    },
  ),
);

export default Routes;
