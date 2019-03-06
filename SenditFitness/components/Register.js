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
import {createStackNavigator, createAppContainer} from 'react-navigation';
import setGoals from './setGoals';
import SwipeNavigator from './SwipeNavigator';


var Form = t.form.Form;

var Gender = t.enums({
  M: 'Male',
  F: 'Female'
});

// here we are: define your domain model
var Person = t.struct({
  name: t.String,              // a required string
  height: t.Number,
  weight: t.Number,
  birthDate: t.Date,
  gender: Gender
});

t.form.Form.stylesheet.controlLabel.normal.color = 'black';
t.form.Form.stylesheet.textbox.normal.color = 'black';


var options = {
  fields: {
    name: {
      placeholder: 'First name',
    },
    birthDate: {
      mode: 'date', // display the Date field as a DatePickerAndroid
      config: {
        format: date => moment(date).format('MMMM Do YYYY'),
        dateFormat: date => moment(date).format('MMMM Do YYYY'),
      },
      color: 'white',
    },
    height: {
      placeholder: 'Inches',

    },
    weight: {
      placeholder: 'Pounds'
    },
    gender: {
      nullOption: {value: '', text: 'Choose your gender'}
    }
  }
};


class Register extends Component {

  constructor (props) {
    super(props)
    this.onPress = this.onPress.bind(this)


    fetchdata = async () => {
      try {
        var r = await AsyncStorage.getItem('is_registered');
        console.log(r);
        if (r != null) {
          this.props.navigation.navigate('SwipeNavigator')
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
    console.log('ok1')
    if (value) { // if validation fails, value will be null
      this.storeData(value);
      console.log('ok')
      Alert.alert(
        'WELCOME',
        'Hey, ' + value.name + '! Thanks for choosing our app',
        [
          {text: 'OK', onPress: () => this.props.navigation.navigate('setGoals')},
        ],
        { cancelable: false }
      ) 

    }
  }

  async storeData(value)  {
    try {
      var data ={ 
        name: value.name,
        height: value.height,
        weight: value.weight,
        birthDate: value.birthDate,
        gender: value.gender
      }
      await AsyncStorage.setItem('Person', JSON.stringify(data));
      console.log(JSON.stringify(data));
      await AsyncStorage.setItem('is_registered', JSON.stringify({is_registered: true}));
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>sendit fitness</Text>
        <Text style={styles.subtitle}>Tell us a little about yourself.</Text>
        {}
        <Form
          ref="form"
          type={Person}
          options={options}
        />
        <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableHighlight>
      </View>
    );
  }
};
export default Register;

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 50,
    flex: 1,
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
    fontSize: 16,
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
