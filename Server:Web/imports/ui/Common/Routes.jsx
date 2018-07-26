/**
 * Basic routes App
 */
import React, { Component } from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import cookie from 'react-cookie';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import ClientListContainer from '../ClientListContainer/ClientListContainer';
import InventoryContainer from '../InventoryContainer/InventoryContainer';
import Settings from '../Settings/Settings';
import AddAdminUser from '../Settings/AddAdminUser/AddAdminUser';
import Login from '../Login/Login';
import Menu from './Menu/Menu';
import NotFound from './NotFound';

function wrapper(Component) {
    return React.createClass({
        render: function() {
            const Cookie = cookie.load('InventoryApp');
            if(Cookie){
                return (
                    <Component {...this.props} adminId={Cookie}/>
                );
            }else{
                return (
                    <Login {...this.props}/>
                );
            }
        }
    });
}

const Routes = (
    <Route path="/" >
        <IndexRoute component={wrapper(Login)} />
        <Route path="/Login" component={wrapper(Login)}/>
        <Route path="/Menu" component={wrapper(Menu)}/>
        <Route path="/Inventario" component={wrapper(InventoryContainer)}/>
        <Route path="/ListaClientes" component={wrapper(ClientListContainer)}/>
        <Route path="/Configuraciones" component={wrapper(Settings)}/>
        <Route path="/Configuraciones/AddAdminUser" component={wrapper(AddAdminUser)}/>
        <Route path="/*" component={NotFound}/>
    </Route>
);

export default Routes;
