/**
 * MENU COMPONENT
 */
import React, { Component, PropTypes } from 'react';
import MenuStyles from './MenuStyles';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

import Assignment from 'material-ui/svg-icons/action/assignment';
import AccountBalanceWallet from 'material-ui/svg-icons/action/account-balance-wallet';
import SettingsApplications from 'material-ui/svg-icons/action/settings-applications';

const contextTypes = {
    router: PropTypes.object.isRequired
};

class Menu extends Component {
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
                          title="Menu Principal"
                        />
                        <Divider />
                        <List>
                          <ListItem onClick={this.redirectTo.bind(this,'/inventario')} primaryText="Inventario" leftIcon={<Assignment />} />
                          <ListItem onClick={this.redirectTo.bind(this, '/ListaClientes')} primaryText="Agenda De Contactos" leftIcon={<AccountBalanceWallet />} />
                          <ListItem onClick={this.redirectTo.bind(this, '/Configuraciones')} primaryText="Configuraciones" leftIcon={<SettingsApplications />} />
                        </List>
                    </Card>
                </div>
            </div>
        );
    }
}

Menu.contextTypes = contextTypes;


export default Menu;
