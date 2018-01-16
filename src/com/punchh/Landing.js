import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Datastore from 'react-native-local-mongodb' ;
var cityList = new Datastore({ filename: 'asyncStorageKey', autoload: true });
import { StaticData } from './StaticData';
import { distane_url, weather_url } from './Urls';
import { getFetch } from './APIController';
import { getLocation } from './location/Location';
import { toggleFav, populateFavouarte } from './redux/actions';
//import MapView from 'react-native-maps';
import SearchBar from 'react-native-searchbar'

var {height, width} = Dimensions.get('window');
//console.log(width);


class Landing extends Component {

    constructor(props){
        super(props);
        //console.log(StaticData);
        this.state = {
            results : [],
            currentLocation : {
                latitude  : 28.4194339,
                longitude : 77.037976
            },
            distance : '',
            weather : '',
            arrayToBeSearched : []
        }

    }

    loadData(){
        //let nthis = this;
        let temp = [];
        StaticData.map((data, index) => {
            console.log(data);
            temp.push(data.place);
            console.log(temp);
        })
        console.log(temp);
        this.setState({arrayToBeSearched : temp});
    }

    componentWillMount(){
        let nthis = this;
        this.loadData();
        getLocation().then((response) =>{
            console.log(response);
            nthis.setState({currentLocation : response})

        }).catch((error) => {
            console.log(error);
            console.log("kbdfk");
        })
        nthis.calculateTempWeather()
    }

    componentWillReceiveProps(){
        console.log('componentWillReceiveProps');
        //nthis.setRoutes();
    }

    calculateTempWeather(){
        let nthis = this;
        const { currentLocation } = this.state;
        let _distance = [];
        let weather = [];
        StaticData.map((data, index) => {
            let place = data.place + ",india"
            let url = distane_url(currentLocation.latitude,currentLocation.longitude, place);
            console.log(url);
            getFetch(url).then((response) =>{
                console.log(response);
                let dis = response.rows[0].elements[0].distance.text ;
                console.log(dis);
                _distance[data.place] = dis;
                //_distance.push(dis);
                console.log(_distance);
                if(StaticData.length == index + 1){
                    console.log(_distance);
                    nthis.setState({distance : _distance})
                }
            }).catch((error)=>{
                console.log(error);
            })
            let url2 = weather_url( place);
            console.log(url2);
            getFetch(url2).then((response) =>{
                console.log(response);

                let temp = response.main.temp - 273.15 ;
                temp = temp.toFixed(2);
                let temp_type = response.weather[0].main  ;
                console.log(temp);
                //weather.push({temp : temp, temp_type : temp_type});
                weather[data.place] = {temp : temp, temp_type : temp_type};
                if(StaticData.length == index + 1){
                    console.log(weather);
                    nthis.setState({weather : weather})
                }
            }).catch((error)=>{
                console.log(error);
            })
        })

    }

    toggleFav(place){
        let nthis = this;
        const { favList } = this.props;
        console.log(favList);
        cityList.update({place : place}, {$set:{isFav : !favList[place]}}, function(error, updated){
            console.log("ldkfnbkjbkjdfkjbfkdbfkjbdkfjbkdjf");
            console.log(updated);
            nthis.props.populateFavouarte([]);
            let list = favList;
            console.log(list);
            list[place] = !list[place];
            console.log(list);
            nthis.props.populateFavouarte(list);
            Actions.refresh();
        })

    }

    showAllPlaces(){
        let nthis = this;
        const { currentLocation, distance, weather, results } = this.state;
        const { favList } = this.props;
        let temp = StaticData;
        if(results.length > 0){
            temp = [];
            StaticData.map((data, index) => {
                results.map((place, index2) => {
                    console.log(data);
                    console.log(place);
                    if(data.place == place)
                        temp.push(data);
                })
            })
        }
        console.log(temp);
        return(
            temp.map((data, index) => {
                console.log(data);
                console.log(distance);
                console.log(weather);
                //console.log(weather[index].temp);
                if(typeof weather == 'string'){
                    return null;
                }
                let iconName = (favList[data.place] == true)?"ios-heart" : "ios-heart-outline";
                console.log(iconName);
                let url = (data.place == 'Jaipur')?require('./images/jaipur.png'):require('./images/delhi.png')
                return(
                    <View key = {index} style = {estyles.box} >
                        <ImageBackground source={url} style = {estyles.image}>
                            <View style = {{flex:1,  justifyContent : 'space-between', paddingHorizontal : 10, paddingVertical : 6}} >
                                <TouchableOpacity style = {{alignSelf : 'flex-end',}} onPress = {() => {nthis.toggleFav(data.place)}}>
                                    <Icon size={25} color="red" name= {iconName} />
                                </TouchableOpacity>
                                <View style = {{flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}} >
                                    <Text style ={{color : '#FFFFFF', fontSize:20, fontWeight : 'bold'}} >{data.place}</Text>
                                    <View style = {{alignItems :'center'}} >
                                        {/*<Text style ={{color : '#FFFFFF'}} >"{weather[index].temp} ℃ {weather[index].temp_type}"</Text>*/}
                                        <Text style ={{color : '#FFFFFF'}} >{weather[data.place].temp} ℃ {weather[data.place].temp_type}</Text>
                                        <TouchableOpacity style = {{flexDirection : 'row', alignItems:'center'}} onPress = {() => {Actions.detail({data : data, currentLocation : currentLocation})}} >
                                            <Text style ={{color : '#FFFFFF', marginRight : 5}} >{distance[data.place]}</Text>
                                            <Icon size={25} color="white" name="ios-arrow-forward-outline" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                        <Text style = {{padding:5, textAlign : 'left'}} /* numberOfLines = {10} ellipsizeMode= {'tail'} */ >{data.detail}</Text>
                    </View>
                )
            })
        );
    }

    _handleResults = (text) => {
        let nthis = this;
        console.log(text);
        nthis.setState({ results :text});
    }

    render() {
        const { currentLocation, distance, weather, arrayToBeSearched } = this.state;
        console.log(arrayToBeSearched);
        console.log(distance);
        console.log(typeof distance);
        if(typeof distance == 'string'){
            return null;
        }
        return (
            <View style ={{flex : 1, marginBottom  :10, backgroundColor : '#FFFFFF'}}>
                <View>
                    <SearchBar
                      ref={(ref) => this.searchBar = ref}
                      data={arrayToBeSearched}
                      handleResults={this._handleResults}
                      showOnLoad = {true}
                      getValue = {(value) => {console.log(value);}}
                    />
                </View>
            <ScrollView style = {{width : width-20, alignSelf :'center'}} contentContainerStyle = {{marginTop : 70,alignSelf : 'center'}} >
                    {
                        this.showAllPlaces()
                    }
                </ScrollView>
            </View>
        );
    }

}

const estyles = EStyleSheet.create({
    container : {
        backgroundColor : '#FFFFFF',
        alignItems : 'center'
    },
    map: {
        width: '100%',
        height: '100%',
    },
    box : {
        width : width-15,
        borderWidth  :1,
        marginTop : 2,
        borderRadius : 5,
        borderColor : '#D6D6D6',
        backgroundColor : '#FFFFFF'
    },
    image : {
        width : width-15,
        height : 120,
        borderRadius:5
    },

});

const mapStateToProps = (state) => {
  const { favList } = state.object;
  //console.log(center);
  return { favList };
};

export default connect(mapStateToProps, {toggleFav, populateFavouarte })(Landing);
