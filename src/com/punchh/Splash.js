import React, {Component} from  'react';

import {
  StyleSheet,
  View,
  Text,
  Platform
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Datastore from 'react-native-local-mongodb' ;
var cityList = new Datastore({ filename: 'asyncStorageKey', autoload: true });
//user_trip = new Datastore({ filename: 'asyncStorageKey_6', autoload: true });
import { toggleFav, populateFavouarte } from './redux/actions';
import { StaticData } from './StaticData';


var nthis = '';

class Splash extends Component {
    constructor(props){
        super(props);
        nthis = this;
        this.state = {

        }
        //list = ["name" : "rahul", "sir": "dubey"];
        //console.log(list);
    }

    componentWillMount(){
        let nthis = this;
        StaticData.map((data, index) => {
            nthis.checkFav(data.place);
        })
    }

    checkFav(place){
        console.log(place);
        cityList.find({place : place}, {multi : true}, function(error, docs){
            //alert("dfkb")
            //console.log(error);
            console.log(docs);
            if(docs.length == 0){
                cityList.insert({place : place, isFav : false}, function(error, newDoc){
                    console.log(newDoc);
                })
            }
        })
    }

    componentDidMount(){
        console.log("dfkjk");
        this.fetchFavList();
        setTimeout(() => {
            Actions.landing();
        }, 3000)

    }

    fetchFavList(){
        let nthis = this;
        cityList.find({}, function(error, docs){
            console.log(docs);
            let list = [];
            docs.map((data, index) => {
                list[data.place] = data.isFav;
            })
            console.log(list);
            nthis.props.populateFavouarte(list);
        })
    }


    render(){
        return(
            <View style = {estyles.container} >
                <Text style = {{color : '#000000', fontWeight : 'bold', fontSize : 22}} >Punchh</Text>
            </View>
        );
    }
}

const estyles = EStyleSheet.create({
    container:{
        height:"100%",
        width:"100%",
        alignItems:"center",
        justifyContent:"center"
    },
    image:{
        height:"40%",
        width:"60%",
        resizeMode:"stretch"
    },
    ActivityIndicator:{
        width:'100%',
        height:"100%",
        justifyContent:'center',
        backgroundColor:'rgba(0,0,0,0)',
        alignItems:"center"
    }
})

const mapStateToProps = (state) => {
  const { favList } = state.object;
  //console.log(center);
  return { favList };
};

export default connect(mapStateToProps, {toggleFav, populateFavouarte })(Splash);
