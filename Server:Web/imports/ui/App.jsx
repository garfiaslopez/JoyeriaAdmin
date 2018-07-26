/**
 * Root App Module
 */
import React, { Component } from 'react';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import CoreModule from '../core/CoreModule';
import Routes from './Common/Routes';

const keyReducers = [
    'authLogin',
    'AddAdminUser'
];

class App extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <CoreModule
                keyReducers={keyReducers}
                routes={Routes}>
            </CoreModule>
        );
    }
}

export default App;
