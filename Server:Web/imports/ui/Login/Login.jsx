/**
 * LOGIN COMPONENT
 */
import React, { Component, PropTypes } from 'react';
import cookie from 'react-cookie';
import moment from 'moment';
import { UserAdmin } from '../../../collections/UserAdmin';

import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import LoginStyles from './LoginStyles';

const contextTypes = {
    router: PropTypes.object.isRequired
};

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
                open: false
        };
        this.doLogin = this.doLogin.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    componentDidMount() {

    }
    handleOpen(msg) {
      this.setState({open: true,MsgToShow:msg});
    };
    handleClose() {
      this.setState({open: false});
    };
    doLogin() {
        if(this.refs.username.input.value !== '' && this.refs.password.input.value !== '') {
            const SearchUser = { username: this.refs.username.input.value, password: this.refs.password.input.value};
            const admin = UserAdmin.findOne(SearchUser);
            if(admin) {
                const expirationDate = moment().add(7, 'days').toDate();
                cookie.save('InventoryApp', admin._id, { path: '/' , expires: expirationDate});
                this.context.router.push('/Menu');
            }else{
                this.handleOpen('Usuario o Contraseña incorrectos');
            }
        }else{
            this.handleOpen('Favor de rellenar todos los datos');
        }
    }
    render() {
        const actions = [
          <FlatButton
            label="Entendido"
            primary={true}
            onClick={this.handleClose}
          />,
        ];
        return (
            <div style={LoginStyles.ContainerStyle}>
                <div style={LoginStyles.CenterContainer}>
                    <Avatar
                      src="images/Diamond.png"
                      size={200}
                      style={LoginStyles.ChildContainer}
                    />
                    <TextField
                      ref="username"
                      hintText="Username"
                      hintStyle={LoginStyles.HintStyle}
                      floatingLabelText="Username"
                      floatingLabelStyle={LoginStyles.FloatingLabelStyle}
                      underlineFocusStyle={LoginStyles.UnderlineStyle}
                      style={LoginStyles.ChildContainer}
                    />
                    <TextField
                      ref="password"
                      hintText="********"
                      floatingLabelText="Password"
                      hintStyle={LoginStyles.HintStyle}
                      floatingLabelStyle={LoginStyles.FloatingLabelStyle}
                      underlineFocusStyle={LoginStyles.UnderlineStyle}
                      style={LoginStyles.ChildContainer}
                    />
                    <br/>
                    <br/>
                    <RaisedButton
                      label="Iniciar Sesión"
                      secondary={true}
                      style={LoginStyles.ChildContainer}
                      onClick={this.doLogin}
                    />

                </div>
            <Dialog
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
            >
                {this.state.MsgToShow}
            </Dialog>
            </div>
        );
    }
}

Login.contextTypes = contextTypes;


export default Login;
