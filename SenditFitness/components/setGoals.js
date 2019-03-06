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
import Goals from './goals';
import SwipeNavigator from './SwipeNavigator';

var Form = t.form.Form;

var weightGoal = t.enums({
  Lose: 'Lose weight',
  Gain: 'Gain weight',
  Maintain: 'Stay the same'
}, 'Goals');

// here we are: define your domain model
var Goal = t.struct({
  goal: weightGoal,
  calories: t.Number,
  steps: t.Number,
});

t.form.Form.stylesheet.controlLabel.normal.color = 'black';
t.form.Form.stylesheet.textbox.normal.color = 'black';


var options = {
  fields: {
    calories: {
      placeholder: 'Max calories per day',
    },
    steps: {
      placeholder: 'Max steps per day'
    },
    goal: {
      nullOption: {value: '', text: 'I want to'}
    }
  }
};


class setGoals extends Component {

  constructor (props) {
    super(props)
    this.state = {
      swi: false,
      first: true
    }
    this.onPress = this.onPress.bind(this)

    fetchdata = async () => {
      try {
        var f = await AsyncStorage.getItem('First');
        var f1 = JSON.parse(f);
        if (f1 != null) {
          this.setState({first: false});
        } else {
            try {
              var data ={ 
               first: false
              }
              await AsyncStorage.setItem('First', JSON.stringify(data));
            } catch (error) {
              console.log(error)
            }          
        }
      } catch (error) {
        console.log("Error retrieving data" + error);
      }
    }

    fetchdata();    
  }

  onPress() {
    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      this.storeData(value);
      this.setState({swi: true});
      Alert.alert(
        'Goals',
        'Goals successfully saved!',
        [
          {text: 'OK', onPress: () => this.render()},
        ],
        { cancelable: false }
      ) 
      
    }
  }

  async storeData(value)  {
    try {
      var data ={ 
       goal: value.goal.toString(),
       calories: value.calories,
       stepgoals: value.steps,
       index: 0
      }
      await AsyncStorage.setItem('Goals', JSON.stringify(data));
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    if (!this.state.swi) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Set your goals.</Text>
        {}
        <Form
          ref="form"
          type={Goal}
          options={options}
        />
        <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableHighlight>
      </View>
    );
    }
    else if (this.state.first){
      return (<SwipeNavigator navigation={this.props.navigation}/>);
    } else {
      return (<Goals navigation={this.props.navigation}/>);
    }
  }
};
export default setGoals

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 50,
    
    backgroundColor: 'white',
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

