
import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Linking
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Datastore from 'react-native-local-mongodb' ;
var cityList = new Datastore({ filename: 'asyncStorageKey', autoload: true });
import { toggleFav, populateFavouarte } from './redux/actions';
import getDirections from 'react-native-google-maps-directions'
var {height, width} = Dimensions.get('window');
import { distane_url_2, weather_url } from './Urls';
import { getFetch } from './APIController';
import { getLocation } from './location/Location';

import Geocoder from 'react-native-geocoding';
Geocoder.setApiKey('AIzaSyBLIlY6hZQkXZc6o-D8IkJ6eHl9mZX4-tc');
//console.log(width);
class Detail extends Component {
    constructor(props){
        super(props);
        this.offset = 0;
        //console.log(width);
        const { data } = this.props;
        console.log(this.props.data);
        this.state = {
            selectedIndex : 0,
            dataSource: data.sight,
            currentDistance : '',
            distance : [],
            lines : 10,
        };
    }

    componentWillMount(){
        this.setCurrentDistance(this.state.selectedIndex);
        this.calculateTempWeather();
    }

    calculateTempWeather(){
        let nthis = this;
        const { currentLocation, data } = this.props;
        let _distance = [];
        console.log(data);
        data.sight.map((sight, index) => {
            let source = data.place + ",india"
            let destination = sight.place + ",india"
            let url = distane_url_2(source, destination);
            console.log(url);
            getFetch(url).then((response) =>{
                console.log(response);
                let dis = response.rows[0].elements[0].distance.text ;
                console.log(dis);
                _distance.push(dis);
                console.log(_distance);
                if(data.sight.length == index + 1){
                    console.log(_distance);
                    nthis.setState({distance : _distance})
                }
            }).catch((error)=>{
                console.log(error);
            })
        })
    }

    setCurrentDistance(index){
        /*
        let nthis = this;
        const { data, currentLocation } = this.props;
        let place = data.sight[index].place + ",india";
        console.log(place);
        let url = distane_url(currentLocation.latitude,currentLocation.longitude, place);
        console.log(url);
        getFetch(url).then((response) =>{
            console.log(response);
            let dis = response.rows[0].elements[0].distance.text ;
            console.log(dis);
            ntihs.setState({currentDistance : dis});
        }).catch((error)=>{
            console.log(error);
        })
        */
    }

    _onScroll(event){
        const { selectedIndex } = this.state;
        //console.log(event);
        //console.log(event.nativeEvent);
        //console.log(event.nativeEvent.contentOffset);
        const currentOffset = event.nativeEvent.contentOffset.x;
        console.log(currentOffset);
        console.log(this.offset);
        if((currentOffset - this.offset) >= width ){
            console.log('right');
            this.setState({selectedIndex : selectedIndex + 1})
            this.offset = currentOffset;
            this.setCurrentDistance(selectedIndex + 1);
        }else if(currentOffset - this.offset <= -width ){
            console.log('left');
            this.setState({selectedIndex : selectedIndex - 1})
            this.offset = currentOffset;
            this.setCurrentDistance(selectedIndex - 1);
        }
    };

    handleGetDirections (){
        const data = {
            /*
           source: {
            latitude: 28.4595,
            longitude: 77.0266
            },*/
          destination: {
            latitude: 28.7041,
            longitude: 77.1025
          }
        }

        getDirections(data)
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
        const { dataSource } = this.state;
        return(
            dataSource.map((data, index) => {
                //alert(data.url)
                return(
                    <Image
                      style={{width: width, height: 200}}
                      source={{uri: data.url}}
                      key = {index}
                    />
                );
            })
        )
    }

    showBubble(){
        const { dataSource, selectedIndex } = this.state;
        return(
            dataSource.map((data, index) => {
                //alert(data.url)
                return(
                    <View style ={{backgroundColor :(selectedIndex == index)?'#000000':'#d6d6d6', width:10, height:10, borderRadius:10, marginTop :10,  margin : 3}} key = {index} />
                );
            })
        )
    }

    openUber(){
        let url = "https://m.uber.com/ul/?client_id=DlBMivySQjorXkTIBkoAMjy7tOyQQXTs"
        Linking.canOpenURL(url).then(supported => {
          if (!supported) {
            console.log('Can\'t handle url: ' + url);
          } else {
            return Linking.openURL(url);
          }
        }).catch(err => console.error('An error occurred', err));

    }

    showData(){
        const { data, currentLocation, } = this.props;
        const { selectedIndex, distance, lines } = this.state;
        let currentData = data.sight;
        currentData = currentData[selectedIndex];
        console.log(currentData);
        //console.log(currentDistance);
        console.log(distance);
        let currentDistance = distance[selectedIndex];
        console.log(currentDistance);
        let count = (lines == 10)?1000:10;
        return(
            <View style = {{ margin : 10, backgroundColor : '#FFFFFF', borderWidth : 2, borderColor  :'#d6d6d6', padding : 8 }} >
                <View style = {{flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}} >
                    <Text style = {{fontSize : 18, fontWeight : 'bold'}} > {currentData.place} </Text>
                    <Text style= {{fontWeight : '500'}} > {currentDistance} </Text>
                </View>
                <Text style = {{marginTop : 5}} numberOfLines = {lines} ellipsizeMode= {'tail'} >{currentData.detail}</Text>
                <TouchableOpacity position = {'absolute'}  style = {{padding:5, backgroundColor:'blue', borderWidth:1, borderColor:'#000000', alignSelf : 'flex-end'}} onPress = {()=>{ this.setState({lines : count}) }}>
                    <Text style = {{fontWeight :'bold', color:'#FFFFFF'}} >{(lines == 10)?'Show More' : 'Show Less'}</Text>
                </TouchableOpacity>
                <View style = {{flexDirection  :'row', justifyContent : 'space-around', alignItems : 'center', marginVertical : 12}} >
                    <TouchableOpacity style = {{borderWidth :1, borderColor : '#000000', borderRadius : 3, padding : 10, flexDirection  :'row', alignItems : 'center'}} onPress = {() => {this.handleGetDirections()}} >
                        <Text style = {{marginRight : 5, fontWeight :'500'}} >Direction</Text>
                        <Icon size={35} color="#235162" name="ios-navigate-outline" />
                    </TouchableOpacity>
                    <TouchableOpacity style = {{borderWidth :1, borderColor : '#000000', borderRadius : 3, padding : 10, flexDirection  :'row', alignItems : 'center'}} onPress = {() => {this.openUber()}} >
                        <Text style = {{marginRight : 5, fontWeight :'500' }}  >Book Uber</Text>
                        <Icon size={35} color="#235162" name="ios-car-outline" />
                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    render() {
        const {data, favList} = this.props;

        let iconName = (favList[data.place] == true)?"ios-heart" : "ios-heart-outline";
        console.log(iconName);
        return (
            <View style ={{backgroundColor:'#FFFFFF'}}>
                <View style = {{flexDirection : 'row', justifyContent :'space-between', alignItems :'center', paddingHorizontal:15, paddingVertical:3, borderWidth:0.5, borderColor:"#d6d6d6"}} >
                    <TouchableOpacity onPress = {() => {Actions.pop()}} >
                        <Icon size={35} color="#235162" name="ios-arrow-back-outline" />
                    </TouchableOpacity>
                    <Text style = {{fontSize : 16, fontWeight:'500'}} >{data.place}</Text>
                    <TouchableOpacity onPress = {() => {this.toggleFav(data.place)}} >
                        <Icon size={35} color="red" name={iconName} />
                    </TouchableOpacity>

                </View>
                <ScrollView style = {{backgroundColor :'#FFFFFF', height : 200}}
                    contentContainerStyle = {{backgroundColor : 'yellow'}}
                    pagingEnabled = {true}
                    horizontal = {true}
                    showsHorizontalScrollIndicator = {false}
                    onScroll={(event) => {this._onScroll(event)} }
                    >
                    {this.showAllPlaces()}
                </ScrollView>
                <View style = {{flexDirection : 'row', justifyContent : 'center', alignItems:"center",}} >
                    {this.showBubble()}
                </View>
                <ScrollView style = {{backgroundColor : '#FFFFFF',  height : height-300}}>
                    {this.showData()}
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
    searchInput:{
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1
  }

});

const mapStateToProps = (state) => {
  const { favList } = state.object;
  //console.log(center);
  return { favList };
};

export default connect(mapStateToProps, {toggleFav, populateFavouarte })(Detail);
