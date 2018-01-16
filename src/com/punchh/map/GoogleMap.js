import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {customMapStyle }from './CustomMapStyle';
import { getLocation } from '../location/Location';


class Map extends Component {

    constructor(props) {
        super(props);
        this.state = {
            region:{
                latitude: 28.4595,
                longitude: 77.0266,
                latitudeDelta: 0.03355,
                longitudeDelta: 0.02547,
            }
        }
    }

    componentWillMount(){
        let nthis = this;
        getLocation().then( (location) =>{
            const centerlatlong = {
              latitude : location.latitude,
              longitude : location.longitude,
              latitudeDelta: 0.03355,
              longitudeDelta: 0.02547,
           }
           nthis.setState({ region : centerlatlong});
        }).catch( (error) => { console.log(error) })
    }

    onRegionChange(region) {
        console.log(region);
        nthis.setState({ region });
    }


  render() {

    return (
      <View style={styles.container}>
          <MapView
            //provider={MapView.PROVIDER_GOOGLE}
            region={this.state.region}
            onRegionChange={this.onRegionChange}
            style={estyles.map}
            customMapStyle={customMapStyle}
            showsUserLocation = {true}
            followsUserLocation = {true}
            showsMyLocationButton = {false}
            cacheEnabled = {true}
            loadingEnabled = {true}
          >

          </MapView>
      </View>
    );
  }

}

const estyles = EStyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
    },



});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default Map;
