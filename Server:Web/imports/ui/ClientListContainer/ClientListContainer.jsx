/**
 * CLIENT LIST COMPONENT
 */
import React, { Component, PropTypes } from 'react';
import ClientListStyles from './ClientListStyles';
import ClientsMenuMapper from './Sections/ClientsMenuMapper';
import cookie from 'react-cookie';
import { createContainer } from 'meteor/react-meteor-data';
import { UserAdmin } from '../../../collections/UserAdmin';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

const contextTypes = {
    router: PropTypes.object.isRequired
};

class ClientListContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {open: true};
        this.handleToggle = this.handleToggle.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.backToMenu = this.backToMenu.bind(this);
        this.closeSession = this.closeSession.bind(this);

        console.log(props);
        this.state = {
            sizeScreen: 0,
            selectedMenuIndex: 0,
            renderComponent: ClientsMenuMapper[0].component,
            title: ClientsMenuMapper[0].title
        }
    }
    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
    handleToggle(){
        this.setState({open: !this.state.open});
    }
    handleResize() {
        var SizeScreen = window.innerWidth;
        console.log(SizeScreen);
        if (SizeScreen < 640) {
            this.setState({
                sizeScreen: SizeScreen,
                open: false,
                isDocked: false,
                paddingLeft: 0
            });
        }else {
            this.setState({
                sizeScreen: SizeScreen,
                open: true,
                isDocked: true,
                paddingLeft: 256
            });
        }
    }
    backToMenu() {
        this.context.router.push('/Menu');
    }
    closeSession() {
        cookie.remove('InventoryApp', { path: '/' });
        this.context.router.push('/Login');
    }
    changeMenu(el, index){
        this.setState({
            selectedMenuIndex: index,
            renderComponent: el.component,
            title: el.title
        });
    }
    renderMenuComponent() {
        return (
            <this.state.renderComponent />
        );
    }
    render() {
        const MenuItems = ClientsMenuMapper.map((el,index) => {
            let styleSelected = {};
            if (index == this.state.selectedMenuIndex) {
                styleSelected = InventoryStyles.MenuSelected;
            }
            return (
                <MenuItem
                  key={index}
                  onClick={this.changeMenu.bind(this, el, index)}
                  style={styleSelected}
                >
                    {el.title}
                </MenuItem>
            );
        });
        let name = "";
        if(this.props.useradmin) {
            name = this.props.useradmin.name;
        }
        return (
            <div>
                <div style={InventoryStyles.ContainerStyle}>
                    <AppBar
                      style = {InventoryStyles.AppBarStyle}
                      titleStyle = {InventoryStyles.TitleMainTab}
                      title={this.state.title}
                      onLeftIconButtonTouchTap={this.handleToggle}
                      iconElementRight={
                        <IconMenu
                          iconButtonElement={
                            <IconButton>
                                <MoreVertIcon />
                            </IconButton>
                          }
                          targetOrigin={{horizontal: 'right', vertical: 'top'}}
                          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        >
                            <MenuItem onClick={this.backToMenu} primaryText="Regresar Al Menu" />
                            <MenuItem onClick={this.closeSession} primaryText="Cerrar Sesión" />
                        </IconMenu>
                      }
                    />
                    <div style={{paddingLeft: this.state.paddingLeft}}>
                        <div style={InventoryStyles.SubContainer}>
                            <this.state.renderComponent sizeScreen={this.state.sizeScreen}/>
                        </div>
                    </div>
                </div>
                <Drawer
                  open={this.state.open}
                  docked={this.state.isDocked}
                  onRequestChange={this.handleToggle}
                >
                    <div style={InventoryStyles.Profile}>
                        <Avatar
                          src="images/Profile.png"
                          size={80}
                          style={InventoryStyles.Avatar}
                        />
                        <div style={InventoryStyles.ChildContainer}>
                            <p style={InventoryStyles.Name} > {name} </p>
                        </div>
                    </div>
                    {MenuItems}
                </Drawer>
            </div>
        );
    }
}

ClientListContainer.contextTypes = contextTypes;

export default createContainer((props) => {
    console.log("ON CREATE CONTAINER");
    console.log(props);
    return {
        useradmin: UserAdmin.findOne({ _id: props.adminId }),
    };
}, ClientListContainer);
