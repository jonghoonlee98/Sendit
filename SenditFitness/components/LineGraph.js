import React from 'react';
import {View} from 'react-native';
import {LineChart, Grid, YAxis} from 'react-native-svg-charts';

/*
 * This component uses the react-native-svg-charts module for React Native,
 * provided with the MIT license and located as open-source code at 
 * https://github.com/JesperLekland/react-native-svg-charts.
 */

/*
 * When using the LineGraph component, the prop that must be passed is an
 * array of numbers called "data", representing all of the data points to be
 * charted on the line graph.
 */
class LineGraph extends React.Component {

  render() {
    const data = this.props.data;

    return (
      <View style={{height: 300, flexDirection: 'row'}}>
        <YAxis
          data={data}
          contentInset={{top: 40, bottom: 40}}
          svg={{fontSize: 12, fill: 'black'}}
        />
        <LineChart
          data={data}
          contentInset={{top: 40, bottom: 40}}
          svg={{stroke: 'rgb(66, 137, 244)'}}
          style={{flex: 1, marginLeft: 16}}
        >
          <Grid/>
        </LineChart>
      </View>
    );
  }
}

export default LineGraph;