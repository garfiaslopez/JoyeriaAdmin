/**
 * MENU COMPONENT
 */
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Category } from '../../../../../collections/Category';
import { CategoryIndex } from '../../../../../collections/Category';

import CategoryListStyles from './CategoryListStyles';

//Components
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

//ICons
import ContentAdd from 'material-ui/svg-icons/content/add';
import Delete from 'material-ui/svg-icons/action/delete';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';

//Buttons
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';

const propTypes = {
    categories: PropTypes.array
};

class CategoryList extends Component {

    constructor(props) {
        super(props);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);

        this.clickCell = this.clickCell.bind(this);
        this.add = this.add.bind(this);
        this.close = this.close.bind(this);

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleChangePrice = this.handleChangePrice.bind(this);
        this.handleSearchText = this.handleSearchText.bind(this);

        this.state = {
            openModal: false,
            selectedIndex: undefined,
            selectedCategory: {},
            categories: this.props.categories
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            categories: nextProps.categories
        });
    }
    clickCell(index){
        this.setState({
            openModal: true,
            selectedIndex: index,
            selectedCategory: this.state.categories[index]
        });
    }
    add() {
        this.setState({
            openModal: true
        });
    }
    close() {
        this.setState({
            openModal: false,
            selectedIndex: undefined,
            selectedCategory: {}
        });
    }
    save() {
        if (this.state.selectedCategory.name &&
            this.state.selectedCategory.description &&
            this.state.selectedCategory.price) {
                if(this.state.selectedIndex === undefined){
                    if(parseFloat(this.state.selectedCategory.price)){
                        Category.insert(this.state.selectedCategory);
                    }else{
                        console.log("NO NUMBER VALID");
                    }
                }else{
                    Category.update(this.state.categories[this.state.selectedIndex]._id,this.state.selectedCategory);
                }
                this.close();
        }
    }
    delete() {
        Category.remove(this.state.categories[this.state.selectedIndex]._id);
        this.close();
    }
    handleChangeName(event) {
        let newCategory = this.state.selectedCategory;
        newCategory.name = event.target.value;
        this.setState({
            selectedCategory: newCategory
        });
    }
    handleChangeDescription(event) {
        let newCategory = this.state.selectedCategory;
        newCategory.description = event.target.value;
        this.setState({
            selectedCategory: newCategory
        });
    }
    handleChangePrice(event) {
        let newCategory = this.state.selectedCategory;
        let value = event.target.value;
        newCategory.price = value;
        this.setState({
            selectedCategory: newCategory
        });
    }
    handleSearchText(event) {
        let searchText = event.target.value;
        this.setState({
            searchText: searchText,
            categories: CategoryIndex.search(searchText).fetch()
        });
    }
    renderModal() {
        let label = "Categoria";
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
                  style={CategoryListStyles.CancelButton}
                  onTouchTap={this.delete}
                />
            );
            label = "Editar Categoria";
        } else {
            label = "Agregar Categoria";
        }
        const modalBody = (
            <div>
                <div style={CategoryListStyles.CenterContainer}>
                    <TextField
                      value={this.state.selectedCategory.name}
                      onChange={this.handleChangeName}
                      ref="name"
                      hintText="Nombre o denominación"
                      hintStyle={CategoryListStyles.HintStyle}
                      floatingLabelText="Nombre o denominación"
                      floatingLabelStyle={CategoryListStyles.FloatingLabelStyle}
                      underlineFocusStyle={CategoryListStyles.UnderlineStyle}
                      style={CategoryListStyles.ChildContainer}
                    />
                    <TextField
                      value={this.state.selectedCategory.description}
                      onChange={this.handleChangeDescription}
                      ref="description"
                      hintText="Descripción"
                      hintStyle={CategoryListStyles.HintStyle}
                      floatingLabelText="Descripción"
                      floatingLabelStyle={CategoryListStyles.FloatingLabelStyle}
                      underlineFocusStyle={CategoryListStyles.UnderlineStyle}
                      style={CategoryListStyles.ChildContainer}
                    />
                    <TextField
                      value={this.state.selectedCategory.price}
                      onChange={this.handleChangePrice}
                      ref="price"
                      hintText="Precio ($)"
                      floatingLabelText="Precio($)"
                      hintStyle={CategoryListStyles.HintStyle}
                      floatingLabelStyle={CategoryListStyles.FloatingLabelStyle}
                      underlineFocusStyle={CategoryListStyles.UnderlineStyle}
                      style={CategoryListStyles.ChildContainer}
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
        let Objects = [];
        if (this.state.categories) {
            Objects = this.state.categories.map((object, index) => {
                return (
                    <TableRow key={object._id}>
                      <TableRowColumn>{object.name}</TableRowColumn>
                      <TableRowColumn>{object.description}</TableRowColumn>
                      <TableRowColumn>${object.price}</TableRowColumn>
                    </TableRow>
                );
            });
        }
        return (
            <div>
                <div style={CategoryListStyles.ContainerStyle}>
                    <div style={CategoryListStyles.CardContainer}>
                        <div style={CategoryListStyles.SearchBar}>
                            <TextField
                              value={this.state.searchText}
                              onChange={this.handleSearchText}
                              ref="search"
                              hintText="Busqueda"
                              hintStyle={CategoryListStyles.HintStyle}
                              floatingLabelText="Busqueda"
                              floatingLabelStyle={CategoryListStyles.FloatingLabelStyle}
                              underlineFocusStyle={CategoryListStyles.UnderlineStyle}
                              style={{width: '100%'}}
                            />
                        </div>
                        <Card style={CategoryListStyles.Card}>
                            <CardHeader
                              title="Categorias"
                            />
                            <Divider />
                            <div style={CategoryListStyles.ContainerActionButton}>
                                <FloatingActionButton
                                  style={CategoryListStyles.FloatingButton}
                                  mini={true}
                                  onClick={this.add}
                                >
                                    <ContentAdd />
                                </FloatingActionButton>
                            </div>
                            <div style={CategoryListStyles.TableContainer}>
                                <Table
                                    onCellClick={this.clickCell}
                                >
                                    <TableHeader
                                        displaySelectAll={false}
                                        adjustForCheckbox={false}
                                    >
                                    <TableRow>
                                        <TableHeaderColumn>Nombre</TableHeaderColumn>
                                        <TableHeaderColumn>Descripción</TableHeaderColumn>
                                        <TableHeaderColumn>Precio</TableHeaderColumn>
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
                {this.renderModal()}
            </div>
        );
    }
}

CategoryList.propTypes = propTypes;

export default createContainer(() => {
    return {
        categories: Category.find().fetch()
    };
}, CategoryList);
