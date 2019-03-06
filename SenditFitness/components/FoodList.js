import React, { Component } from 'react';
import { 
    Alert, Button,  FlatList, StyleSheet, Text, View, 
    AppRegistry, TextInput, AsyncStorage, ScrollView } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';
// import FoodList from './components/FoodList.js';

const initialState = {
    name: '',
    cal: 0
}


class FoodList extends Component {


    constructor (props) {
        super(props);
        this.state = {
            name: '',
            cal: 0,
            consumedCals: 0,
            ratio: 0,
            max: 2000,
            todaysKey: this.keyForDate(new Date()),
            calorieKey: this.keyForDate(new Date()) + "cal",
            mealList: []
        }
    }

    keyForDate(date) {
        return ((date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear());
    }

    async loadMeals() {
        console.log("Loading meals");
        var foods = JSON.parse(await AsyncStorage.getItem(this.state.todaysKey));
        this.setState({
            mealList: foods
        })
    }

    async loadCals() {
        console.log("Loading cals");
        var calories = await AsyncStorage.getItem(this.state.calorieKey);
        var ratioConsumed = Number(calories) / Number(this.state.max);
        this.setState({
            consumedCals: calories,
            ratio: ratioConsumed
        })
        console.log("updated decreased ratio " + this.state.ratio);
    }

    async loadGoal() {
        var goals = await AsyncStorage.getItem('Goals');
        var parsed = JSON.parse(goals);
        this.setState({
            max: parsed.calories
        });
        console.log("set goal to " + this.state.max);
        console.log(goals);
    }

    loadDatabase() {
        this.loadMeals();
        this.loadCals();
        this.loadGoal();
    }

    clearDatabase() {
        this.clearMeals();
        this.clearCals();
    }

    async clearMeals() {
        /* Clears async, just for testing */
        console.log("Clearing meals");
        var clearedList = await AsyncStorage.removeItem(this.state.todaysKey);
        this.setState({
            mealList: clearedList
        })
    }

    async clearCals() {
        /* Clears async, just for testing */
        console.log("Clearing calories");
        var testdeletecal = await AsyncStorage.removeItem(this.state.calorieKey);
        this.setState({ 
            consumedCals: 0,
            ratio: 0
        })
    }

    async saveMeal() {
        if (this.state.name != "" && this.state.cal != "" && !isNaN(this.state.cal) && this.state.cal >= 0) {
            try {
                var newMeal = { Consumed: this.state.name, Calories: this.state.cal }
                var newCals = Number(this.state.consumedCals) + Number(this.state.cal);
                var parsedMeals = new Array();

                /* Retrieving already eaten meals from storage */
                var savedMeals = await AsyncStorage.getItem(this.state.todaysKey);

                /* Turn meal list into object */
                if (savedMeals == null) {
                    console.log("First meal of the day");
                    savedMeals = new Array();
                } else  {
                    parsedMeals = JSON.parse(savedMeals);
                }

                /* Appending new meal to meal list */
                parsedMeals.push(newMeal);

                /* Turn meal list back into string */
                savedMeals = JSON.stringify(parsedMeals);

                /* Storing new meal + new calories in async */
                var ratioConsumed = Number(newCals) / Number(this.state.max);
                var setM = await AsyncStorage.setItem(this.state.todaysKey, savedMeals);
                var setC = await AsyncStorage.setItem(this.state.calorieKey, newCals.toString());

                /* Updating local state */
                this.setState({
                    name: '',
                    consumedCals: newCals,
                    mealList: parsedMeals,
                    cal: '',
                    ratio: ratioConsumed
                    
                });

                console.log("updated increased ratio " + this.state.ratio);

                if (this.state.consumedCals > (Number(this.state.max)/3) * 2) {
                    console.log(Number(this.state.max) - Number(this.state.consumedCals));
                    alert("You have " + (Number(this.state.max) - Number(this.state.consumedCals)) + " calories remaining from your daily recommended amount.");
                }

            } catch (error) {
                console.log("Error saving data" + error);
            }


        } else {
            alert("Invalid input. Calories must be a positive number!");
            this.setState(initialState);
        }
    }

    async deleteMeal(meal) {
        var list = JSON.parse(await AsyncStorage.getItem(this.state.todaysKey));
        var currCal = await AsyncStorage.getItem(this.state.calorieKey)
        // var index = list.filter(curr => curr.Consumed == meal.Consumed);
        var index = list.map(function(e) { return e.Consumed; }).indexOf(meal.Consumed);

        if (index != -1) {

            /* Removing meal from list */
            console.log("removed " + (list.splice(index, 1).Consumed));
            // list.splice(index, 1);

            /* Updating calories */
            currCal = Number(this.state.consumedCals) - Number(meal.Calories);
            var setC = await AsyncStorage.setItem(this.state.calorieKey, currCal.toString());
            console.log("subtracting cals " + setC);

            /* Pushing updated list to database */
            list = JSON.stringify(list)
            var setM = await AsyncStorage.setItem(this.state.todaysKey, list);
            this.loadDatabase();
            console.log("deleted " + list + this.state.consumedCals);
        } else {
            console.log("Meal not found.")
        }

        
    }

    componentDidMount() {
        // this.clearDatabase();
        this.loadDatabase();
    }

    render() {

        const styles = StyleSheet.create({
            container: {
                 flex: 1,
                 backgroundColor: '#fff',
                 alignItems: 'center',
                 justifyContent: 'center',
                 flexDirection: 'row'
            },
            title: {
                textAlign: 'center',
                fontSize: 22,
                marginTop: 30,
                marginBottom: 10,
            },
            button: {
                height: 36,
                backgroundColor: '#48BBEC',
                borderColor: '#48BBEC',
                borderWidth: 1,
                borderRadius: 8,
                marginBottom: 10,
                alignSelf: 'stretch',
                // justifyContent: 'center'
            },
            buttonText: {
                fontSize: 18,
                color: 'white',
                alignSelf: 'center'
            },
            circle: {
                height:        225,
                width:         225,
                paddingTop:    10,
                paddingBottom: 10,
                // justifyContent: 'center'
            } 
        });

        var color = 'rgb(66, 137, 244)';

        if (Number(this.state.ratio) >= 1.0) {
          color = 'darkgreen'
        }

        return (

            <View>
            <ScrollView>

                <Text id="title" style={styles.title}> Track Diet </Text>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    placeholder={'What did you eat?'}
                    onChangeText={(name) => this.setState({name})}
                    value={this.state.name}
                    clearButtonMode = 'always'
                />

                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    placeholder={'How many calories?'}
                    onChangeText={(cal) => this.setState({cal})}
                    value={this.state.cal}
                    clearButtonMode = 'always'
                />

                <Button
                    onPress={() => this.saveMeal()}
                    title="Add calories"
                    color="#841584"
                    accessibilityLabel="Tap button to add calories to intake"
                    placeholder = 'Enter text....'
                />

                <View style={styles.container}>
                <ProgressCircle
                  progress={Number(this.state.ratio)}
                  progressColor={color}
                  style={styles.circle}
                />
                </View>
                <Text>{"\n"}</Text>
                <View style={styles.container}>

                    <FlatList
                            data={this.state.mealList}
                            renderItem={({item}) => <View style={{flexDirection: 'row', width: '60%', height: 30}}>
                                                        <Button style={{width:'20%'}}
                                                            onPress={() => this.deleteMeal(item)}
                                                            title='x'
                                                            color='#f1f1f1'
                                                            justifyContent='center'
                                                            alignItems='center'
                                                        />
                                                        <Text style={{width:'80%'}}> {item.Consumed} </Text>
                                                    </View>}
                    />

                    <FlatList
                            
                            data={this.state.mealList}
                            renderItem={({item}) => <View style={{width: '40%', height: 30}}>
                                                        <Text> {item.Calories} </Text>
                                                    </View>}
                    />
                </View>

                <View style={styles.container}>
                <Text> Total consumed: {this.state.consumedCals} </Text>
                <Text> Remaining: {Number(this.state.max) - Number(this.state.consumedCals)} </Text>
                </View>

                <View>
                    <Button
                        onPress={() => this.clearDatabase()}
                        title="Reset all meals"
                        color="#841584"
                        accessibilityLabel="Tap button to add calories to intake"
                        placeholder = 'Enter text....'
                    />
                </View>

            </ScrollView>                    
            </View>
        );
    }
}


    
export default FoodList;