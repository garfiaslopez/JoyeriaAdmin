/**
 * ADDADMINUSER COMPONENT
 */
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { UserAdmin } from '../../../../collections/UserAdmin';

import AddAdminUserStyles from './AddAdminUserStyles';
import LoginStyles from '../../Login/LoginStyles';

//Components
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

//ICons
import ContentAdd from 'material-ui/svg-icons/content/add';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Delete from 'material-ui/svg-icons/action/delete';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';


//Buttons
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';

const contextTypes = {
    router: PropTypes.object.isRequired
};
const propTypes = {
    admins: PropTypes.array,
    isLoading: PropTypes.bool
};

class AddAdminUser extends Component {
    constructor(props) {
        super(props);

        this.saveUserAdmin = this.saveUserAdmin.bind(this);
        this.deleteUserAdmin = this.deleteUserAdmin.bind(this);

        this.handleClickCell = this.handleClickCell.bind(this);
        this.handleAddAdminUser = this.handleAddAdminUser.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);

        this.state = {
            openModal: false,
            selectedIndex: undefined,
            adminSelected: {}
        }
    }
    componentDidMount() {
        console.log(this.props);
    }
    redirectTo(path){
        this.context.router.push(path);
    }
    handleClickCell(index){
        this.setState({
            openModal: true,
            selectedIndex: index,
            adminSelected: this.props.admins[index]
        });
    }
    handleAddAdminUser() {
        this.setState({
            openModal: true
        });
    }
    handleClose() {
        this.setState({
            openModal: false,
            selectedIndex: undefined,
            adminSelected: {}
        });
    }
    handleChangeName(event) {
        let newUserAdmin = this.state.adminSelected;
        newUserAdmin.name = event.target.value;
        this.setState({
            adminSelected: newUserAdmin
        });
    }
    handleChangeUsername(event) {
        let newUserAdmin = this.state.adminSelected;
        newUserAdmin.username = event.target.value;
        this.setState({
            adminSelected: newUserAdmin
        });
    }
    handleChangePassword(event) {
        let newUserAdmin = this.state.adminSelected;
        newUserAdmin.password = event.target.value;
        this.setState({
            adminSelected: newUserAdmin
        });
    }
    saveUserAdmin() {
        if( this.state.adminSelected.username &&
            this.state.adminSelected.password &&
            this.state.adminSelected.name){
                if (this.state.selectedIndex === undefined) {
                    UserAdmin.insert(this.state.adminSelected);
                }else{
                    UserAdmin.update(this.props.admins[this.state.selectedIndex]._id,this.state.adminSelected);
                }
                this.handleClose();
        }
    };
    deleteUserAdmin() {
        if (this.props.admins.length > 1) {
            UserAdmin.remove(this.props.admins[this.state.selectedIndex]._id);
        }
        this.handleClose();
    }
    renderModal() {
        let label = "Administrador";
        const actions = [
            <FlatButton
              label="Cancelar"
              primary={false}
              onTouchTap={this.handleClose}
            />,
            <FlatButton
              label="Guardar"
              primary={true}
              onTouchTap={this.saveUserAdmin}
            />,
        ];

        var ActualUserAdmin = {};
        if (this.state.selectedIndex !== undefined) {
            if (this.props.admins.length > 1) {
                actions.unshift(
                    <FlatButton
                      label="Eliminar"
                      primary={false}
                      disabled={false}
                      style={AddAdminUserStyles.CancelButton}
                      onTouchTap={this.deleteUserAdmin}
                    />
                );
            }
            label = "Editar Administrador";
        } else {
            label = "Agregar Administrador";
        }
        const modalBody = (
            <div>
                <div style={AddAdminUserStyles.CenterContainer}>
                    <TextField
                      value={this.state.adminSelected.name}
                      onChange={this.handleChangeName}
                      ref="name"
                      hintText="Nombre Completo"
                      hintStyle={AddAdminUserStyles.HintStyle}
                      floatingLabelText="Nombre Completo"
                      floatingLabelStyle={AddAdminUserStyles.FloatingLabelStyle}
                      underlineFocusStyle={AddAdminUserStyles.UnderlineStyle}
                      style={AddAdminUserStyles.ChildContainer}
                    />
                    <TextField
                      value={this.state.adminSelected.username}
                      onChange={this.handleChangeUsername}
                      ref="username"
                      hintText="username"
                      hintStyle={AddAdminUserStyles.HintStyle}
                      floatingLabelText="UserName"
                      floatingLabelStyle={AddAdminUserStyles.FloatingLabelStyle}
                      underlineFocusStyle={AddAdminUserStyles.UnderlineStyle}
                      style={AddAdminUserStyles.ChildContainer}
                    />
                    <TextField
                      value={this.state.adminSelected.password}
                      onChange={this.handleChangePassword}
                      ref="password"
                      hintText="********"
                      floatingLabelText="Password"
                      hintStyle={AddAdminUserStyles.HintStyle}
                      floatingLabelStyle={AddAdminUserStyles.FloatingLabelStyle}
                      underlineFocusStyle={AddAdminUserStyles.UnderlineStyle}
                      style={AddAdminUserStyles.ChildContainer}
                    />
                </div>
            </div>
        );
        return(
            <Dialog
              title={label}
              actions={actions}
              modal={true}
              open={this.state.openModal}
            >
                {modalBody}
            </Dialog>
        );
    }
    render() {
        const Admins = this.props.admins.map((adminU, index) => {
            return (
                <TableRow key={adminU._id}>
                  <TableRowColumn>{adminU.name}</TableRowColumn>
                  <TableRowColumn>{adminU.username}</TableRowColumn>
                  <TableRowColumn>{adminU.password}</TableRowColumn>
                </TableRow>
            );
        });
        return (
            <div>
                <div style={AddAdminUserStyles.ContainerStyle}>
                    <div style={AddAdminUserStyles.CardContainer}>
                        <Card style={AddAdminUserStyles.Card}>
                            <CardHeader
                              title="Administradores"
                            />
                            <Divider />
                            <div style={AddAdminUserStyles.ContainerActionButton}>
                                <FloatingActionButton
                                  style={AddAdminUserStyles.FloatingButton}
                                  mini={true}
                                  onClick={this.handleAddAdminUser}
                                >
                                    <ContentAdd />
                                </FloatingActionButton>
                            </div>
                            <div style={AddAdminUserStyles.TableContainer}>
                                <Table
                                    onCellClick={this.handleClickCell}
                                >
                                    <TableHeader
                                        displaySelectAll={false}
                                        adjustForCheckbox={false}
                                    >
                                    <TableRow>
                                        <TableHeaderColumn>Nombre</TableHeaderColumn>
                                        <TableHeaderColumn>Usuario</TableHeaderColumn>
                                        <TableHeaderColumn>Password</TableHeaderColumn>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody
                                        displayRowCheckbox={false}
                                        showRowHover={true}
                                        stripedRows={true}
                                    >
                                    {Admins}
                                    </TableBody>
                                  </Table>
                            </div>
                            <List>
                                <ListItem onClick={this.redirectTo.bind(this,'/Configuraciones')} primaryText="Atras" leftIcon={<ArrowBack />} />
                            </List>
                        </Card>
                    </div>
                </div>
                {this.renderModal()}
            </div>
        );
    }
}

AddAdminUser.contextTypes = contextTypes;
AddAdminUser.propTypes = propTypes;

export default createContainer(() => {
    return {
        admins: UserAdmin.find().fetch()
    };
}, AddAdminUser);
