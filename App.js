
import React, { Component } from 'react';

import Navigator from './src/com/punchh/Navigator';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './src/com/punchh/redux/reducers';

export default class App extends Component<{}> {
    render() {
        return (
            <Provider store={createStore(reducers)}>
                <Navigator />
            </Provider>
        );
   }
}
