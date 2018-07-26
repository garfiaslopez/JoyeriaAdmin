/**
 * MENU COMPONENT
 */
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Client } from '../../../../../collections/Client';
import { ClientIndex } from '../../../../../collections/Client';

import ClientsListStyles from './ClientsListStyles';
import ClientCard from './ClientCard/ClientCard';
import ClientDetail from './ClientDetail/ClientDetail';
//Components
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

//ICons
import ContentAdd from 'material-ui/svg-icons/content/add';
import Delete from 'material-ui/svg-icons/action/delete';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

//Buttons
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';

const propTypes = {
    clients: PropTypes.array,
};

class ClientsList extends Component {

    constructor(props) {
        super(props);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);

        this.clickCell = this.clickCell.bind(this);
        this.add = this.add.bind(this);
        this.close = this.close.bind(this);

        this.PayPeriods = [
            {
                _id: 0,
                name: "Semanal"
            },
            {
                _id: 1,
                name: "Quincenal"
            },
            {
                _id: 2,
                name: "Mensual"
            }
        ];

        // CHANGES STATE FUNCTIONS
        this.handleChangeOfPropInModel = this.handleChangeOfPropInModel.bind(this);
        this.handleChangeTimePeriod = this.handleChangeTimePeriod.bind(this);
        this.onBack = this.onBack.bind(this);

        this.handleSearchText = this.handleSearchText.bind(this);

        this.state = {
            openDetail: false,
            openModal: false,
            selectedIndex: undefined,
            selected: {},
            payPeriod: {},
            clients: this.props.clients
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            clients: nextProps.clients
        });
    }
    clickCell(index) {
        this.setState({
            openDetail: true,
            selectedIndex: index,
            selected: this.state.clients[index]
        });
    }
    add() {
        this.setState({
            openModal: true
        });
    }
    onBack() {
        this.setState({
            openDetail: false,
            selectedIndex: undefined,
            selected: {}
        });
    }
    close() {
        this.setState({
            openModal: false,
            selectedIndex: undefined,
            selected: {}
        });
    }
    save() {
        let cliente = this.state.selected;
        if(cliente.name !== "" && cliente.phone !== ""){
            Client.insert(cliente);
            this.close();
        }
    }
    delete() {

    }
    handleChangeOfPropInModel(event) {
        let NewObj = this.state.selected;
        NewObj[event.target.id] = event.target.value;
        this.setState({
            selected: NewObj
        });
    }
    handleChangeTimePeriod(event, index) {
        let NewObj = this.state.selected;
        NewObj.payPeriod = this.PayPeriods[index].name;
        console.log(NewObj);
        this.setState({
            selected: NewObj,
            payPeriod: this.PayPeriods[index]
        });
    }
    handleSearchText(event) {
        let searchText = event.target.value;
        this.setState({
            searchText: searchText,
            clients: ClientIndex.search(searchText).fetch()
        });
    }
    renderModal() {
        let label = "Cliente";
        const actions = [
            <FlatButton
              label="Cancelar"
              primary={false}
              onTouchTap={this.close}
            />,
            <FlatButton
              label="Guardar"
              primary={true}
              onTouchTap={this.save}
            />,
        ];
        if (this.state.selectedIndex !== undefined) {
            actions.unshift(
                <FlatButton
                  label="Eliminar"
                  primary={false}
                  disabled={false}
                  style={ClientsListStyles.CancelButton}
                  onTouchTap={this.delete}
                />
            );
            label = "Editar cliente";
        } else {
            label = "Agregar Cliente";
        }
        const DropdownItems = this.PayPeriods.map((C, index)=>{
            return(
                <MenuItem key={index} value={C._id} primaryText={`${C.name}`} />
            );
        });

        const modalBody = (
            <div>
                <div style={ClientsListStyles.CenterContainer}>
                    <TextField
                      id="name"
                      value={this.state.selected.name}
                      onChange={this.handleChangeOfPropInModel}
                      ref="name"
                      hintText="Nombre Completo"
                      hintStyle={ClientsListStyles.HintStyle}
                      floatingLabelText="Nombre"
                      floatingLabelStyle={ClientsListStyles.FloatingLabelStyle}
                      underlineFocusStyle={ClientsListStyles.UnderlineStyle}
                      style={ClientsListStyles.ChildContainer}
                    />
                    <TextField
                      id="address"
                      value={this.state.selected.address}
                      onChange={this.handleChangeOfPropInModel}
                      ref="address"
                      hintText="Dirección"
                      hintStyle={ClientsListStyles.HintStyle}
                      floatingLabelText="Dirección"
                      floatingLabelStyle={ClientsListStyles.FloatingLabelStyle}
                      underlineFocusStyle={ClientsListStyles.UnderlineStyle}
                      style={ClientsListStyles.ChildContainer}
                    />
                    <TextField
                      id="phone"
                      value={this.state.selected.phone}
                      onChange={this.handleChangeOfPropInModel}
                      ref="phone"
                      hintText="Telefono (10 Digitos)"
                      floatingLabelText="Telefono"
                      hintStyle={ClientsListStyles.HintStyle}
                      floatingLabelStyle={ClientsListStyles.FloatingLabelStyle}
                      underlineFocusStyle={ClientsListStyles.UnderlineStyle}
                      style={ClientsListStyles.ChildContainer}
                    />
                    <TextField
                      id="email"
                      value={this.state.selected.email}
                      onChange={this.handleChangeOfPropInModel}
                      ref="email"
                      hintText="Correo Electrónico"
                      floatingLabelText="Correo Electrónico"
                      hintStyle={ClientsListStyles.HintStyle}
                      floatingLabelStyle={ClientsListStyles.FloatingLabelStyle}
                      underlineFocusStyle={ClientsListStyles.UnderlineStyle}
                      style={ClientsListStyles.ChildContainer}
                    />
                    <div style={ProductListStyles.ChildContainer}>
                        <p>Plan de pago</p>
                    </div>
                    <DropDownMenu
                      value={this.state.payPeriod._id || ''}
                      onChange={this.handleChangeTimePeriod}
                      style={ProductListStyles.ChildContainer}
                      autoWidth={false}
                    >
                      {DropdownItems}
                    </DropDownMenu>
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
    };
    renderBody() {
        if(this.state.openDetail) {
            return (
                <div style={ClientsListStyles.ContainerStyle}>
                    <div style={ClientsListStyles.CardContainer}>
                        <Card style={ClientsListStyles.Card}>
                            <div style={ClientsListStyles.CardHeader}>
                                <IconButton tooltip="Atras" onClick={this.onBack}>
                                  <ArrowBack />
                                </IconButton>
                                <CardHeader
                                  title={this.state.selected.name}
                                />
                            </div>
                            <Divider/>
                            <div style={ClientsListStyles.TableContainer}>
                                <ClientDetail
                                    key={this.state.selected._id}
                                    client_id={this.state.selected._id}
                                    index={this.state.selectedIndex}
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            );
        }
        let Objects = [];
        if (this.state.clients) {
            Objects = this.state.clients.map((object, index) => {
                return (
                    <TableRow key={object._id}>
                      <TableRowColumn>{object.name}</TableRowColumn>
                      <TableRowColumn>{object.phone}</TableRowColumn>
                      <TableRowColumn>{object.email}</TableRowColumn>
                      <TableRowColumn>{object.restForPay}</TableRowColumn>
                    </TableRow>
                );
            });
        }
        return (
            <div style={ClientsListStyles.ContainerStyle}>
                <div style={ClientsListStyles.CardContainer}>
                    <div style={ClientsListStyles.SearchBar}>
                        <TextField
                          value={this.state.searchText}
                          onChange={this.handleSearchText}
                          ref="search"
                          hintText="Busqueda"
                          hintStyle={ClientsListStyles.HintStyle}
                          floatingLabelText="Busqueda"
                          floatingLabelStyle={ClientsListStyles.FloatingLabelStyle}
                          underlineFocusStyle={ClientsListStyles.UnderlineStyle}
                          style={{width: '100%'}}
                        />
                    </div>
                    <Card style={ClientsListStyles.Card}>
                        <CardHeader
                          title="Lista de clientes"
                        />
                        <Divider />
                        <div style={ClientsListStyles.ContainerActionButton}>
                            <FloatingActionButton
                              style={ClientsListStyles.FloatingButton}
                              mini={true}
                              onClick={this.add}
                            >
                                <ContentAdd />
                            </FloatingActionButton>
                        </div>
                        <div style={ClientsListStyles.TableContainer}>
                            <Table
                                onCellClick={this.clickCell}
                            >
                                <TableHeader
                                    displaySelectAll={false}
                                    adjustForCheckbox={false}
                                >
                                <TableRow>
                                    <TableHeaderColumn>Nombre</TableHeaderColumn>
                                    <TableHeaderColumn>Telefono</TableHeaderColumn>
                                    <TableHeaderColumn>Email</TableHeaderColumn>
                                    <TableHeaderColumn>Deuda</TableHeaderColumn>
                                  </TableRow>
                                </TableHeader>
                                <TableBody
                                    displayRowCheckbox={false}
                                    showRowHover={true}
                                    stripedRows={true}
                                >
                                    {Objects}
                                </TableBody>
                              </Table>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }
    render() {
        return (
            <div>
                {this.renderBody()}
                {this.renderModal()}
            </div>
        );
    }
}

ClientsList.propTypes = propTypes;

export default createContainer(() => {
    return {
        clients: Client.find().fetch()
    };
}, ClientsList);
