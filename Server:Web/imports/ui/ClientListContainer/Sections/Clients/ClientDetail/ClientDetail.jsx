/**
 * MENU COMPONENT
 */
import React, { Component, PropTypes } from 'react';
import ClienDetailStyles from './ClientDetailStyles';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {List, ListItem} from 'material-ui/List';
import {Tabs, Tab} from 'material-ui/Tabs';
import Divider from 'material-ui/Divider';
import Chip from 'material-ui/Chip';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import Subheader from 'material-ui/Subheader';

import ContentAdd from 'material-ui/svg-icons/content/add';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Delete from 'material-ui/svg-icons/action/delete';

//Buttons
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import { Client } from '../../../../../../collections/Client';
import { Product } from '../../../../../../collections/Product';
import { ProductIndex } from '../../../../../../collections/Product';


moment.locale();

const propTypes = {
    client: PropTypes.object.isRequired,
    client_id: PropTypes.string,
    index: PropTypes.number
};

class ClientDetail extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.handleChangeTab = this.handleChangeTab.bind(this);
        this.handleChangePay = this.handleChangePay.bind(this);
        this.onClickAdd = this.onClickAdd.bind(this);
        this.close = this.close.bind(this);
        this.onClickCell = this.onClickCell.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);

        this.savePay = this.savePay.bind(this);
        this.deletePay = this.deletePay.bind(this);
        this.deletePayFromTable = this.deletePayFromTable.bind(this);

        this.saveProducts = this.saveProducts.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.deleteSelectedProduct = this.deleteSelectedProduct.bind(this);

        this.handleAddProduct = this.handleAddProduct.bind(this);
        this.handleSearchText = this.handleSearchText.bind(this);

        this.state = {
            selectedTab: 0,
            Pay: {
                index: undefined,
                object: {
                    date: Date(),
                    total: ''
                }
            },
            openModalPays: false,
            openModalProducts: false,
            openDeleteConfirmation: false,
            addModal: {
                searchText: '',
                products: this.props.products,
                selectedProducts: []
            }
        }
    }
    componentWillReceiveProps(nextProps){
        let modal = this.state.addModal;
        modal.products = nextProps.products;
        this.setState({
            addModal: modal
        });
    }
    onClickAdd() {
        if (this.state.selectedTab == 0) {
            this.setState({
                openModalProducts: true
            });
        }else{
            this.setState({
                openModalPays: true
            });
        }
    }
    onClickCell(index) {
        console.log("ON CLICK FUCKING CELL ");
        if (this.state.selectedTab == 0) {
            this.setState({
                openModalProducts: true
            });
        }else{
            this.setState({
                openModalPays: true,
                Pay: {
                    index: index,
                    object: this.props.client.pays[index]
                }
            });
        }
    }
    close() {
        let modal = this.state.addModal;
        modal.selectedProducts = [];
        modal.searchText = '';
        this.setState({
            openModalPays: false,
            openModalProducts: false,
            Pay: {
                index: undefined,
                object: {}
            },
            addModal: modal
        });
    }
    handleChangeTab(value) {
        this.setState({
            selectedTab: value
        });
    }
    handleChangePay(event) {
        let newPay = this.state.Pay;
        newPay.object[event.target.id] = event.target.value;
        this.setState({
            Pay: newPay
        });
    }
    handleChangeDate(none, date) {
        let newPay = this.state.Pay;
        newPay.object.date = date;
        this.setState({
            Pay: newPay
        });
    }
    handleAddProduct(row) {
        let modal = this.state.addModal;
        let product = this.state.addModal.products[row];
        modal.selectedProducts.push(product);
        this.setState({
            addModal: modal
        });
    }
    handleSearchText(event) {
        let searchText = event.target.value;
        let modal = this.state.addModal;
        modal.searchText = searchText;
        modal.products = ProductIndex.search(searchText).fetch();
        this.setState({
            addModal: modal
        });
    }
    saveProducts() {
        const newProducts = this.state.addModal.selectedProducts;
        const newClient = this.props.client;
        if(newClient.products === undefined){
            newClient.products = [];
        }
        newProducts.map((p)=>{
            newClient.products.push(p);
        });
        Client.update(this.props.client._id,newClient);
        this.close();
    }
    deleteProduct(index) {
        let newClient = this.props.client;
        newClient.products.splice(index, 1);
        Client.update(this.props.client._id,newClient);
    }
    deleteSelectedProduct(index) {
        let modal = this.state.addModal;
        modal.selectedProducts.splice(index,1);
        this.setState({
            addModal: modal
        });
    }
    savePay() {
        if (this.state.Pay.index !== undefined) {
            // UPDATE
            const Pay = this.state.Pay.object;
            const indexPay = this.state.Pay.index;
            if (Pay.date !== '' && Pay.total !== '') {
                const newClient = this.props.client;
                newClient.pays[indexPay] = Pay;
                Client.update(this.props.client._id,newClient);
                this.close();
            }
        } else {
            // SAVE
            const Pay = this.state.Pay.object;
            if (Pay.date !== '' && Pay.total !== '') {
                const newClient = this.props.client;
                if(newClient.pays === undefined){
                    newClient.pays = [];
                }
                newClient.pays.push(Pay);
                Client.update(this.props.client._id,newClient);
                this.close();
            }
        }
    }
    deletePay() {
        const Pay = this.state.Pay.object;
        const indexPay = this.state.Pay.index;
        const newClient = this.props.client;
        newClient.pays.splice(indexPay,1);
        Client.update(this.props.client._id,newClient);
        this.close();
    }
    deletePayFromTable(index) {
        let newClient = this.props.client;
        newClient.pays.splice(index, 1);
        Client.update(this.props.client._id,newClient);
        this.setState({
            Pay: {
                index: undefined,
                object: {
                    date: Date(),
                    total: ''
                }
            }
        })
    }
    renderModalForPays() {
        let label = "Pagos";

        const actions = [
            <FlatButton
              label="Cancelar"
              primary={false}
              onTouchTap={this.close}
            />,
            <FlatButton
              label="Guardar"
              primary={true}
              onTouchTap={this.savePay}
            />,
        ];
        if (this.state.Pay.index !== undefined) {
            actions.unshift(
                <FlatButton
                  label="Eliminar"
                  primary={false}
                  disabled={false}
                  style={ClienDetailStyles.CancelButton}
                  onTouchTap={this.deletePay}
                />
            );
            label = "Editar pago";
        } else {
            label = "Agregar nuevo pago";
        }

        const modalBody = (
            <div>
                <div style={ClienDetailStyles.CenterContainer}>
                    <DatePicker
                      hintText="Fecha"
                      ref="datepicker"
                      style={ClienDetailStyles.ChildContainer}
                      value={this.state.Pay.object.date || Date()}
                      onChange={this.handleChangeDate}
                    />
                    <TextField
                      id="total"
                      value={this.state.Pay.object.total}
                      onChange={this.handleChangePay}
                      ref="total"
                      hintText="Total ($)"
                      hintStyle={ClienDetailStyles.HintStyle}
                      floatingLabelText="Total"
                      floatingLabelStyle={ClienDetailStyles.FloatingLabelStyle}
                      underlineFocusStyle={ClienDetailStyles.UnderlineStyle}
                      style={ClienDetailStyles.ChildContainer}
                    />
                </div>
            </div>
        );
        return(
            <Dialog
              title={label}
              actions={actions}
              modal={true}
              open={this.state.openModalPays}
              autoScrollBodyContent={true}
            >
                {modalBody}
            </Dialog>
        );
    }
    renderModalForProducts() {
        let label = "Agregar nuevos productos";
        let ProductRows = [];
        let ProductRowsSelected = [];

        const actions = [
            <FlatButton
              label="Cancelar"
              primary={false}
              onTouchTap={this.close}
            />,
            <FlatButton
              label="Guardar"
              primary={true}
              onTouchTap={this.saveProducts}
            />,
        ];
        if (this.state.addModal.products !== undefined) {
            ProductRows = this.state.addModal.products.map((object,index) => {
                return (
                    <TableRow key={index}>
                      <TableRowColumn>{object.denomination}</TableRowColumn>
                      <TableRowColumn>${object.normalPrice}</TableRowColumn>
                    </TableRow>
                );
            });
        }
        if (this.state.addModal.selectedProducts !== undefined) {
            ProductRowsSelected = this.state.addModal.selectedProducts.map((object,index) => {
                return (
                    <TableRow key={index}>
                      <TableRowColumn>{object.denomination}</TableRowColumn>
                      <TableRowColumn>${object.normalPrice}</TableRowColumn>
                      <TableRowColumn>
                        <IconButton onClick={()=>{this.deleteSelectedProduct(index)}}>
                            <Delete />
                        </IconButton>
                      </TableRowColumn>
                    </TableRow>
                );
            });
        }

        const modalBody = (
            <div style={ClienDetailStyles.ContainerRowModal}>
                <div style={ClienDetailStyles.ContainerCol}>
                    <Subheader style={ClienDetailStyles.Subheader}>Productos </Subheader>
                    <div style={ClienDetailStyles.SearchBarContainer}>
                        <TextField
                          value={this.state.addModal.searchText}
                          onChange={this.handleSearchText}
                          ref="search"
                          hintText="Busqueda"
                          hintStyle={ClienDetailStyles.HintStyle}
                          floatingLabelText="Busqueda"
                          floatingLabelStyle={ClienDetailStyles.FloatingLabelStyle}
                          underlineFocusStyle={ClienDetailStyles.UnderlineStyle}
                          style={ClienDetailStyles.SearchBar}
                        />
                    </div>
                    <Table
                        ref="tableProducts"
                        selectable={false}
                        style={{height: '100%'}}
                        wrapperStyle={{height: '100%'}}
                        onCellClick={(row)=>{this.handleAddProduct(row)}}
                    >
                        <TableHeader
                            displaySelectAll={false}
                            adjustForCheckbox={false}
                        >
                        <TableRow>
                            <TableHeaderColumn>Producto</TableHeaderColumn>
                            <TableHeaderColumn>Total</TableHeaderColumn>
                          </TableRow>
                        </TableHeader>
                        <TableBody
                            key="0"
                            showRowHover={true}
                            stripedRows={true}
                            displayRowCheckbox={false}
                            style={{height: '100%'}}

                        >
                        {ProductRows}
                        </TableBody>
                      </Table>
                </div>
                <div style={ClienDetailStyles.ContainerCol}>
                    <Subheader style={ClienDetailStyles.SecondSubheader}>Agregados</Subheader>
                    <Table
                        ref="tableProducts"
                        onRowSelection={this.handleAddProduct}
                        selectable={false}
                        style={{height: '100%'}}
                        wrapperStyle={{height: '100%'}}
                    >
                        <TableHeader
                            displaySelectAll={false}
                            adjustForCheckbox={false}
                        >
                        <TableRow>
                            <TableHeaderColumn>Producto</TableHeaderColumn>
                            <TableHeaderColumn>Total</TableHeaderColumn>
                            <TableHeaderColumn>Acciones</TableHeaderColumn>
                          </TableRow>
                        </TableHeader>
                        <TableBody
                            key="1"
                            showRowHover={true}
                            stripedRows={false}
                            displayRowCheckbox={false}
                            style={{height: '100%'}}
                        >
                        {ProductRowsSelected}
                        </TableBody>
                      </Table>
                </div>
            </div>
        );
        return(
            <Dialog
              title={label}
              actions={actions}
              modal={true}
              open={this.state.openModalProducts}
            >
                {modalBody}
            </Dialog>
        );
    }

    render() {
        let Pays = [];
        let Products = [];

        let totalPays = 0;
        let totalProducts = 0;
        let difference = 0;

        if (this.props.client.pays !== undefined) {
            Pays = this.props.client.pays.map((object, index) => {
                totalPays = totalPays + parseFloat(object.total);
                const stringDate = moment(object.date).format('LL');
                return (
                    <TableRow key={index}>
                      <TableRowColumn>{stringDate}</TableRowColumn>
                      <TableRowColumn>{object.total}</TableRowColumn>
                      <TableRowColumn>
                        <IconButton onTouchTap={()=>{this.deletePayFromTable(index)}}>
                            <Delete />
                        </IconButton>
                      </TableRowColumn>
                    </TableRow>
                );
            });
        }
        if (this.props.client.products !== undefined) {
            Products = this.props.client.products.map((object,index) => {
                totalProducts = totalProducts + parseFloat(object.normalPrice);
                const stringDate = moment(object.date).format('LL');
                return (
                    <TableRow key={index}>
                      <TableRowColumn>{stringDate}</TableRowColumn>
                      <TableRowColumn>{object.denomination}</TableRowColumn>
                      <TableRowColumn>{object.normalPrice}</TableRowColumn>
                      <TableRowColumn>
                        <IconButton onClick={()=>{this.deleteProduct(index)}}>
                            <Delete />
                        </IconButton>
                      </TableRowColumn>
                    </TableRow>
                );
            });
        }

        return (
            <div style={ClientDetailStyles.ContainerCol}>
                <div onClick={this.handleClick} style={ClientDetailStyles.ContainerRow}>
                    <div style={ClientDetailStyles.ContainerPhoto}>
                        <img
                          style={ClientDetailStyles.ImagePreview}
                          src="images/Profile.png"
                        />
                    </div>
                    <div style={ClientDetailStyles.ContainerDescription}>
                        <div style={ClientDetailStyles.SubContainerRow}>
                            <h4 style={ClientDetailStyles.Text}>{this.props.client.name}</h4>
                            <h4 style={ClientDetailStyles.Text}>{this.props.client.email} Gramos</h4>
                        </div>
                        <h4 style={ClientDetailStyles.Text}>{this.props.client.address}</h4>
                        <div style={ClientDetailStyles.SubContainerRow}>
                            <h4 style={ClientDetailStyles.Text}>{this.props.client.provider}</h4>
                            <h4 style={ClientDetailStyles.Text}>{this.props.client.grams}</h4>
                        </div>
                        <div style={ClientDetailStyles.SubContainerRow}>
                            <h4 style={ClientDetailStyles.Text}>{this.props.client.provider}</h4>
                            <h4 style={ClientDetailStyles.Text}>{this.props.client.grams} Gramos</h4>
                        </div>
                    </div>

                </div>
                <Tabs
                    style={ClienDetailStyles.CardContainer}
                    onChange={this.handleChangeTab}
                >
                    <Tab
                      label="Productos"
                      value="0"
                    >
                        <div>
                            <Card style={ClienDetailStyles.Card}>
                                <div style={ClienDetailStyles.ContainerActionButton}>
                                    <FloatingActionButton
                                      style={ClienDetailStyles.FloatingButton}
                                      mini={true}
                                      onClick={this.onClickAdd}
                                    >
                                        <ContentAdd />
                                    </FloatingActionButton>
                                </div>
                                <div style={ClienDetailStyles.TableContainer}>
                                    <Table>
                                        <TableHeader
                                            displaySelectAll={false}
                                            adjustForCheckbox={false}
                                        >
                                        <TableRow>
                                            <TableHeaderColumn>Fecha</TableHeaderColumn>
                                            <TableHeaderColumn>Producto</TableHeaderColumn>
                                            <TableHeaderColumn>Total</TableHeaderColumn>
                                            <TableHeaderColumn>Acciones</TableHeaderColumn>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody
                                            key="0"
                                            displayRowCheckbox={false}
                                            showRowHover={true}
                                            stripedRows={true}
                                        >
                                        {Products}
                                        </TableBody>
                                      </Table>
                                </div>
                            </Card>
                        </div>
                    </Tab>
                    <Tab
                      label="Pagos"
                      value="1"
                    >
                        <div>
                            <Card style={ClienDetailStyles.Card}>
                                <div style={ClienDetailStyles.ContainerActionButton}>
                                    <FloatingActionButton
                                      style={ClienDetailStyles.FloatingButton}
                                      mini={true}
                                      onClick={this.onClickAdd}
                                    >
                                        <ContentAdd />
                                    </FloatingActionButton>
                                </div>
                                <div style={ClienDetailStyles.TableContainer}>
                                    <Table
                                        onCellClick={this.onClickCell}
                                    >
                                        <TableHeader
                                            displaySelectAll={false}
                                            adjustForCheckbox={false}
                                        >
                                        <TableRow>
                                            <TableHeaderColumn>Fecha</TableHeaderColumn>
                                            <TableHeaderColumn>Total</TableHeaderColumn>
                                            <TableHeaderColumn>Acciones</TableHeaderColumn>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody
                                            key="1"
                                            displayRowCheckbox={false}
                                            showRowHover={true}
                                            stripedRows={true}
                                        >
                                        {Pays}
                                        </TableBody>
                                      </Table>
                                </div>
                            </Card>
                        </div>
                    </Tab>
                </Tabs>
                <div style={ClientDetailStyles.SubContainerRow}>
                    <h4 style={ClientDetailStyles.Text}>Debe: ${totalProducts}</h4>
                    <h4 style={ClientDetailStyles.Text}>Pagado: ${totalPays}</h4>
                </div>
                <div style={ClientDetailStyles.SubContainerRow}>
                    <h4 style={ClientDetailStyles.Text}>Restante: ${(totalProducts - totalPays).toFixed(2)}</h4>
                </div>
                {this.renderModalForPays()}
                {this.renderModalForProducts()}
            </div>
        );
    }
}

ClientDetail.propTypes = propTypes;

export default createContainer((props) => {
    return {
        client: Client.findOne({ _id: props.client_id }),
        products: Product.find().fetch()
    };
}, ClientDetail);
