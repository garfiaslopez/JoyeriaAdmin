import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Cloudinary from 'cloudinary';

injectTapEventPlugin();

import App from '../imports/ui/App.jsx';

class MainApp extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <MuiThemeProvider>
                <App />
            </MuiThemeProvider>
        );
    }
}

Meteor.startup(()=>{

    Cloudinary.config({cloud_name: 'berry'});

    render(<MainApp />, document.getElementById('render-target'));
});
