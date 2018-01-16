
import React, { Component } from 'react';
import {
    Platform,
    View
} from 'react-native'
import { Scene, Router} from 'react-native-router-flux';
import EStyleSheet from 'react-native-extended-stylesheet';

import Splash from './Splash';
import Landing from './Landing';
import Detail from './Detail';

EStyleSheet.build({
  $textColor: 'green' // variable
});

export default class Navigator extends Component {
    render() {
        return (
            <View style = {{flex:1, marginTop : (Platform.OS == 'ios')?20:0}}>
                <Router>
                    <Scene key="main">
                        <Scene key="splash" component={Splash}  hideNavBar={true} initial />
                        <Scene key="landing" component={Landing}  hideNavBar={true} />
                        <Scene key="detail" component={Detail}  hideNavBar={true}  />
                    </Scene>
               </Router>
           </View>
        );
    }
}
