import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert,
  AppRegistry,
  Picker,
  Switch,
  AsyncStorage
} from 'react-native';
var moment = require('moment');
import t from 'tcomb-form-native';
import SetGoals from './setGoals';
import Register from './Register';


var calories = AsyncStorage.getItem('calories');

class Goals extends Component {

  constructor (props) {
    super(props)
    this.state = {
      goal: '',
      calories: '',
      steps: '',
      swi: false
    }
    this.onPress = this.onPress.bind(this)

    fetchdata = async () => {
      try {
        var goals = await AsyncStorage.getItem('Goals');
        var Goals = JSON.parse(goals);
        this.setState({calories: Goals.calories});
        this.setState({steps: Goals.stepgoals});
        this.setState({goal: Goals.goal});
      } catch (error) {
        console.log("Error retrieving data" + error);
      }
    }

    fetchdata();
  }

  onPress() {
    //return <SetGoals navigation={this.props.navigation} />;
    this.setState({swi: true});
    console.log('r321')
    this.render();
  }


  render() {
    if (!this.state.swi) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Your goals</Text>
        <Text style={styles.goalsubhead}>Goal</Text>
        <Text style={styles.goal}>{this.state.goal} weight</Text>
        <Text style={styles.goalsubhead}>Max calories per day</Text>
        <Text style={styles.goal}>{this.state.calories}</Text>
        <Text style={styles.goalsubhead}>Max steps per day</Text>
        <Text style={styles.goal}>{this.state.steps}</Text>
        <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Edit goals</Text>
        </TouchableHighlight>
        
      </View>
    ); 
    } else {
      return (<SetGoals navigation={this.props.navigation}/>);
    }
  }


};
export default Goals

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 50,
    
    backgroundColor: 'white',
  },
  goal: {
    fontSize: 20,
    marginBottom: 30,
  },
  goalsubhead: {
    fontSize:16,
    color: '#808080'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  title: {
    fontSize: 28,
    alignSelf: 'center',
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: 'black',
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

