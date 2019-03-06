import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import MovementTracker from './components/MovementTracker';
import BodyProfile from './components/BodyProfile';
import Register from './components/Register';
import setGoals from './components/setGoals';
import Goals from './components/goals';
import Food_sugg from './components/Food_sugg';
import FoodList from './components/FoodList';
import Swiper from 'react-native-swiper';
import SwipeNavigator from './components/SwipeNavigator';

import {createStackNavigator, createAppContainer} from 'react-navigation';

var RootStack = createStackNavigator({
  Register: {screen: Register},
  setGoals: {screen: setGoals},
  SwipeNavigator:    {screen: SwipeNavigator},
},
{
  headerMode: 'none',
});

var App = createAppContainer(RootStack);

export default App;