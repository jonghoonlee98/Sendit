import React, { Component } from 'react';
import { 
    View, 
    StyleSheet, 
    Button, 
    AsyncStorage,
    Text
} from "react-native";
import LineGraph from './LineGraph';

import t from 'tcomb-form-native';

const Form = t.form.Form;


const User = t.struct({
    Weight: t.Number
});

const formStyles = {
    ...Form.stylesheet,
    formGroup: {
        normal: {
            marginBottom: 10
        }
    },
    controlLabel: {
        normal: {
            fontSize: 18,
            marginBottom: 7,
            fontWeight: '600'
        },
        // the style applied when a validation error occours
        error: {
            color: 'red',
            fontSize: 18,
            marginBottom: 7,
            fontWeight: '600'
        }
    }
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginTop: 50,
        padding: 20,
        backgroundColor: '#ffffff'
    },
    header: {
        fontSize: 24,
        marginTop: 50,
    },
    button: {
        marginBottom: 50
    }
});

const options = {
    fields: {
        Weight: {
            error: 'Please enter a number',
            placeholder: 'Weight (Pounds)'
        }
    },
    stylesheet: formStyles,
}; 



class BodyProfile extends Component {

    constructor (props) {
        super(props);
        this.state = {
            height: 0,
            weight:  [0],
            bmi:  [0]
        }

        fetchdata = async () => {

            try {
                var retrieved = await AsyncStorage.getItem('BODYPROFILE');
                if (retrieved != null) {
                    var bodyInfo = JSON.parse(retrieved);
                    this.setState({height: bodyInfo.height});
                    this.setState({bmi: bodyInfo.bmi});
                    this.setState({weight: bodyInfo.weight});
                } else {
                    var person = await AsyncStorage.getItem('Person');
                    var bodyInfo = JSON.parse(person);
                    
                    var h = bodyInfo.height;

                    var w = [];
                    w.push(bodyInfo.weight);

                    var bmi = [];
                    var individualBMI =  Number((w / (h * h) * 703).toFixed(2));
                    bmi.push(individualBMI);
                    
                    this.setState({height: h});
                    this.setState({weight: w});
                    this.setState({bmi: bmi});
                }
            } catch (error) {
                console.log("Error retrieving data" + error);
            }
        }

        fetchdata();
    }

    handleSubmit = () => {
        const value = this._form.getValue();
        console.log(this.state);
        if(value != null) {
            let w = value.Weight;
            let h = this.state.height;
            let bmi =  Number((w / (h * h) * 703).toFixed(2));

            if(bmi < 18.5)
                alert("Your BMI is " + bmi + ", and you are underweight at the moment.");
            else if(bmi < 24.9)
                alert("Your BMI is " + bmi + ", and you are normal weight at the moment.");
            else if(bmi < 29.9)
                alert("Your BMI is " + bmi + ", and you are overweight at the moment.");
            else 
                alert("Your BMI is " + bmi + ", and you are obese at the moment.");

            this.updateBMI(bmi, w);
        }
    }

    async updateBMI(bmi, w) {
        var bodyInfo = this.state;
        const value = this._form.getValue();
        var date = this.valueForDate(new Date());
        try {
      		var today = await AsyncStorage.getItem("DATE");
      		if(today == date) {
      			console.log("same");
      			bodyInfo.weight.splice(bodyInfo.weight.length - 1, 1, w);
      			bodyInfo.bmi.splice(bodyInfo.bmi.length - 1, 1, bmi);
      		}
      		else {
        		bodyInfo.weight.push(w);
        		bodyInfo.bmi.push(bmi);
        		this.saveDate(date);
        	}
        } catch (error) {
        	console.log("Error getting date" + error);
        }

        this.setState({bmi: bodyInfo.bmi});
        this.setState({weight: bodyInfo.weight});
        this.saveBMI(JSON.stringify(bodyInfo));
    }

    // get date to update weight and bmi only once in a day
    valueForDate(date) {
    	return ((date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear());
  	}

  	// save date to update weight and bmi only once in a day
  	async saveDate(today) {
  		try {
            await AsyncStorage.setItem('DATE', today);
        } catch (error) {
            console.log("Error saving data" + error);
        }
  	}

  	// save bmi and weight information to asynch storage
    async saveBMI(value) {
        try {
            await AsyncStorage.setItem('BODYPROFILE', value);
        } catch (error) {
            console.log("Error saving data" + error);
        }
    }
  
    render() {
        return (
            <View style={styles.container}>
                <Form 
                    ref={c => this._form = c}
                    type={User} 
                    options={options}
                />
                <Button 
                    style={styles.button}
                    title="Get BMI"
                    onPress={this.handleSubmit}
                />
                <Text h5 style={styles.header}>
                    Weight History
                </Text>
                <LineGraph
                    data={this.state.weight}
                />
               
            </View>
        );
    }
}

export default BodyProfile;
