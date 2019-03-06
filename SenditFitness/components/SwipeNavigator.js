import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import MovementTracker from './MovementTracker';
import BodyProfile from './BodyProfile';
import Register from './Register';
import setGoals from './setGoals';
import Goals from './goals';
import Food_sugg from './Food_sugg';
import FoodList from './FoodList';
import Swiper from 'react-native-swiper';

var first = true;

class SwipeNavigator extends React.Component {

	constructor (props) {
	    super(props);

	    this.state = {
	      	calories: 0
	    }
	    
	}

	keyForDate(date) {
	    return ((date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear());
	}

	async loadCals() {
	    var cal = await AsyncStorage.getItem(this.keyForDate(new Date()) + "cal");
	    if(cal == null) {
	    	this.setState({calories: 0});
	    }

	    else {
	    	await this.setState({calories: cal});
	    }
	    alert("You gained " + this.state.calories + " Calories today!");
	}

	render() {
		
		if(first) {
			this.loadCals();
			first = false;
		}
		
		const styles = StyleSheet.create({
	      	container: {
		        flex: 1,
		        backgroundColor: '#fff',
		        alignItems: 'center',
		        justifyContent: 'center',
	      	}
	    });

		return (
			<Swiper
			loop={false}
			showsPagination={true}
			index={0}>
				<View>
					<Goals />
				</View>

				<View>
					<FoodList />
				</View>

				<View>
					<Food_sugg />
				</View>

				<View>
					<BodyProfile />
				</View>

				<View style={styles.container}>
					<MovementTracker />
				</View>

			</Swiper>
		)
	}
}

export default SwipeNavigator;