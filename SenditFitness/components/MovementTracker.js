import React from 'react';
import { AsyncStorage, StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';
import LineGraph from './LineGraph';
import Expo from 'expo';
import { Pedometer } from 'expo';

/*
 * This component uses the react-native-svg-charts module for React Native,
 * provided with the MIT license and located as open-source code at 
 * https://github.com/JesperLekland/react-native-svg-charts.
 */

/* 
 * MovementTracker component
 * This component takes no props as arguments and renders a page
 * with MovementTracking information. It takes a little bit to load.
 */
class MovementTracker extends React.PureComponent {
  
  constructor (props) {
    super(props);

    this.state = {
      steps:    0,
      goal:     10000,
      inputNum: 0,
      week:     [0, 0, 0, 0, 0, 0, 0],
      updater:  0
    }

    /* Asynchronously get steps for today so far. */
    fetchdata = async () => {
      var todaysKey = this.keyForDate(new Date());
      var stepCount = 0;
      var goalCount = 10000;

      try {
        var stepData = await AsyncStorage.getItem(todaysKey);
        if (stepData !== null) {
          this.setState({steps: this.state.steps + stepData})
        } 
      } catch (error) {
        this.setState({steps: 0})
      }

      try {
        var goals = await AsyncStorage.getItem("Goals");
        var goalData = JSON.parse(goals);
        if (goalData !== null && goalData.stepgoals !== 0) {
          this.setState({goal: goalData.stepgoals});
        } else {
          this.setState({goal: 10000});
        }
      } catch (error) {
        this.setState({goal: 10000});
      }
    }

    fetchdata();

    /* Asynchronously get step data for the past week to display. */
    weekdata = async () => {
      var today = new Date();
      var weekSteps = [];

      /* Grab data for each day one at a time. */
      for (i = 1; i < 8; i++) {
        var theDay = new Date();
        theDay.setDate(today.getDate() - i);

        try {
          var theDayData = await AsyncStorage.getItem(this.keyForDate(theDay));
          if (theDayData !== null) {
            weekSteps.push(parseInt(theDayData));
            if (i == 7) {
              this.setState({week: weekSteps.reverse()});
            }
          }
        } catch (error) {
          weekSteps.push(0);
          if (i == 7) {
            this.setState({week: weekSteps.reverse()});
          }
        }
      }
    }

    weekdata();
  }


  componentDidMount() {
    this.subscription = Pedometer.watchStepCount(data => {
      this.setState({inputNum: data.steps - this.state.updater});
      this.setState({updater: data.steps});
      this.submit();
    });

    Pedometer.isAvailableAsync().then(response => {
      if (!response) {
        Alert.alert(
          'Step counting not available on this device.',
          'Sorry :('
        );
      }
    });
  }

  componentWillUnmount() {
    this.subscription && this.subscription.remove();
    this.subscription = null;
  }

  progress() {
    if (this.state.steps < this.state.goal) {
      Alert.alert(
        'Halfway there!',
        'You\'re ' + 
          (this.state.goal - this.state.steps) + 
          ' steps away from your goal!',
        [{text: 'I can do it!'}]
      )
    } else {
      Alert.alert(
        'Congrats!',
        'You\'ve hit your step goal!',
        [{text: 'Yay!'}]
      )
    }
  }

  keyForDate(date) {
    return ("steps-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear());
  }

  async submit() {
    var lessThanHalf = this.state.steps < (this.state.goal / 2)
    var lessThanGoal = this.state.steps < this.state.goal

    var todaysKey = this.keyForDate(new Date());
    var stepsSoFar = parseInt(this.state.inputNum) || 0;
    if (this.state.inputNum === 0)  {
      stepsSoFar = 0;
    }

    try {
      var todayData = await AsyncStorage.getItem(todaysKey);
      if (todayData !== null) {
        var newSteps = stepsSoFar + parseInt(todayData);

        this.setState({steps:    newSteps,
                       inputNum: 0});
        AsyncStorage.setItem(todaysKey, newSteps.toString());

        if ((lessThanHalf && this.state.steps >= (this.state.goal / 2)) || 
            (lessThanGoal && this.state.steps >= this.state.goal)) {
          this.progress();
        }
      } else {
        this.setState({steps:    stepsSoFar,
                       inputNum: 0});

        AsyncStorage.setItem(todaysKey, stepsSoFar.toString());

        if ((lessThanHalf && this.state.steps >= (this.state.goal / 2)) || 
            (lessThanGoal && this.state.steps >= this.state.goal)) {
          this.progress();
        } 
      }
    } catch (error) {
      this.setState({steps:    stepsSoFar,
                     inputNum: 0});

      AsyncStorage.setItem(todaysKey, stepsSoFar.toString());

      if ((lessThanHalf && this.state.steps >= (this.state.goal / 2)) || 
          (lessThanGoal && this.state.steps >= this.state.goal)) {
        this.progress();
      }
    }
  }

  render() {
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      header: {
        fontSize: 24,
      },
      circle: {
        height:        225,
        width:         225,
        paddingTop:    10,
        paddingBottom: 10,
      },
      input: {
        height:       35,
        width:        120,
        borderColor: 'darkgreen',
        borderWidth: 1,
      }
    });

    var ratio = this.state.steps / this.state.goal;
    var color = 'rgb(66, 137, 244)';

    if (ratio >= 1.0) {
      color = 'darkgreen'
    }

    return (
      <View style={styles.container}>
        <Text h1 style={styles.header}>
          {"\n"}
          Movement Tracking
        </Text>

        <ProgressCircle
          progress={ratio}
          progressColor={color}
          style={styles.circle}
        />

        <Text>
          {"\n"}
          You have taken {this.state.steps} steps out of your {this.state.goal} step goal!
        </Text>

        <Text h5 style={styles.header}>
          Steps for the past week
        </Text>

        <LineGraph
          data={this.state.week}
        />
      </View>
    );
  }
}

export default MovementTracker;
