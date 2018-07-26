/**
 * MENU COMPONENT
 */
import React, { Component, PropTypes } from 'react';
import SettingsStyles from './SettingsStyles';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

const contextTypes = {
    router: PropTypes.object.isRequired
};

class Settings extends Component {
    constructor(props) {
        super(props);
    }
    redirectTo(path){
        this.context.router.push(path);
    }
    render() {
        return (
            <div style={MenuStyles.ContainerStyle}>
                <div style={MenuStyles.CardContainer}>
                    <Card>
                        <CardHeader
                          title="Ajustes"
                        />
                        <Divider />
                        <List>
                            <ListItem onClick={this.redirectTo.bind(this,'/Configuraciones/AddAdminUser')} primaryText="Administradores" leftIcon={<PersonAdd />} />
                            <ListItem onClick={this.redirectTo.bind(this,'/Menu')} primaryText="Atras" leftIcon={<ArrowBack />} />
                        </List>
                    </Card>
                </div>
            </div>
        );
    }
}

Settings.contextTypes = contextTypes;


export default Settings;
