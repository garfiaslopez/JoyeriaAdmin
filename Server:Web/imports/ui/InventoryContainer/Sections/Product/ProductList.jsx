import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Product } from '../../../../../collections/Product';
import { ProductIndex } from '../../../../../collections/Product';
import { Category } from '../../../../../collections/Category';
import Dropzone from 'react-dropzone';

import ProductCard from './ProductCard/ProductCard'
import ProductListStyles from './ProductListStyles';

//Components
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Chip from 'material-ui/Chip';
import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';

//ICons
import ContentAdd from 'material-ui/svg-icons/content/add';
import Delete from 'material-ui/svg-icons/action/delete';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import AddAPhoto from 'material-ui/svg-icons/image/add-a-photo';

//Buttons
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';

const propTypes = {
    products: PropTypes.array,
    categories: PropTypes.array
};

class ProductList extends Component {

    constructor(props) {
        super(props);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);

        this.clickCell = this.clickCell.bind(this);
        this.add = this.add.bind(this);
        this.close = this.close.bind(this);

        this.handleChangeDenomination = this.handleChangeDenomination.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleAddNewTag = this.handleAddNewTag.bind(this);
        this.handleChangeProvider = this.handleChangeProvider.bind(this);
        this.handleChangeGrams = this.handleChangeGrams.bind(this);
        this.handleChangePriceRound = this.handleChangePriceRound.bind(this);
        this.handleChangePricePercent = this.handleChangePricePercent.bind(this);
        this.handleChangeImage = this.handleChangeImage.bind(this);
        this.handleChangePricePercentRound = this.handleChangePricePercentRound.bind(this);

        this.calculatePrices = this.calculatePrices.bind(this);
        this.onClickUpload = this.onClickUpload.bind(this);
        this.handleDeleteTag = this.handleDeleteTag.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.handleGridClick = this.handleGridClick.bind(this);

        this.handleSearchText = this.handleSearchText.bind(this);

        this.state = {
            openModal: false,
            selectedIndex: undefined,
            selectedProduct: {
                category: '',
                tags: [],
                normalPrice: 0,
                paysPrice: 0,
            },
            selectedCategory: {},
            gridCols: 2,
            products: this.props.products
        }
    }
    componentWillReceiveProps(nextProps){
        let columns = 2;
        if(nextProps.sizeScreen < 640) {
            columns = 1;
        }
        this.setState({
            products: nextProps.products,
            gridCols: columns
        });
    }
    clickCell(index) {
        this.setState({
            openModal: true,
            selectedIndex: index,
            selectedProduct: this.props.categories[index],
            imagePrev: {}
        });
    }
    handleGridClick(index){
        let p = Object.assign({}, this.state.products[index]);
        p.category = this.state.products[index].category._id;

        this.setState({
            openModal: true,
            selectedIndex: index,
            selectedProduct: p,
            selectedCategory: this.state.products[index].category,
            imagePrev: { preview: p.image }
        });
    }
    handleSearchText(event) {
        let searchText = event.target.value;
        this.setState({
            searchText: searchText,
            products: ProductIndex.search(searchText).fetch()
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
            selectedProduct: {
                category: '',
                tags: [],
                normalPrice: 0,
                paysPrice: 0,
            },
            selectedCategory: {},
            imagePrev: {}
        });
    }
    save() {
        let product = this.state.selectedProduct;
        if(product.category && product.denomination) {
            // save all the model except calculations;
            delete product.normalPrice;
            delete product.paysPrice;

            product.grams = parseFloat(product.grams);
            product.pricePercent = parseFloat(product.pricePercent);
            product.pricePercentRound = parseFloat(product.pricePercentRound);
            product.priceRound = parseFloat(product.priceRound);

            if (this.state.selectedIndex === undefined) {
                Product.insert(product);
            }else{
                Product.update(this.state.products[this.state.selectedIndex]._id,product);
            }

            this.close();
        }
    }
    delete() {
        Product.remove(this.state.products[this.state.selectedIndex]._id);
        this.close();
    }

    handleChangeDenomination(event) {
        let newProduct = this.state.selectedProduct;
        newProduct.denomination = event.target.value;
        this.setState({
            selectedProduct: newProduct
        });
    }
    handleChangeCategory(event, index, value) {
        let newProduct = this.state.selectedProduct;
        newProduct.category = value;
        this.setState({
            selectedProduct: this.calculatePrices(newProduct, this.props.categories[index]),
            selectedCategory: this.props.categories[index]
        });
    }
    handleAddNewTag(event) {
        if(event.keyCode === 13) {
            //Pressing Enter:
            let newProduct = this.state.selectedProduct;
            newProduct.tags.push(this.refs.newTag.input.value);
            this.refs.newTag.input.value = "";
            this.setState({
                selectedProduct: newProduct
            });
        }
    }
    handleDeleteTag(index) {
        let newProduct = this.state.selectedProduct;
        newProduct.tags.splice(index, 1);
        this.setState({
            selectedProduct: newProduct
        });
    }
    handleChangeProvider(event) {
        let newProduct = this.state.selectedProduct;
        newProduct.provider = event.target.value;
        this.setState({
            selectedProduct: newProduct
        });
    }
    calculatePrices(product, category) {
        var product = this.state.selectedProduct;

        let Grams = parseFloat(product.grams) || 0.0;
        let basePrice = parseFloat(category.price * Grams) || 0.00;

        let PriceRound = parseFloat(product.priceRound) || 0.0;
        let normalPrice = basePrice + PriceRound;

        let PricePercent = parseFloat(product.pricePercent) || 0.0;
        let percetToAdd = parseFloat((PricePercent * basePrice) / 100);

        let PercentRound = parseFloat(product.pricePercentRound) || 0.0;
        let paysPrice = parseFloat(basePrice + percetToAdd + PercentRound);

        product.normalPrice = normalPrice.toFixed(2);
        product.paysPrice = paysPrice.toFixed(2);

        return product;
    }
    handleChangeGrams(event) {
        let newProduct = this.state.selectedProduct;
        newProduct.grams = event.target.value;
        this.setState({
            selectedProduct: this.calculatePrices(newProduct, this.state.selectedCategory)
        });
    }
    handleChangePriceRound(event) {
        let newProduct = this.state.selectedProduct;
        newProduct.priceRound = event.target.value;
        this.setState({
            selectedProduct: this.calculatePrices(newProduct, this.state.selectedCategory)
        });
    }
    handleChangePricePercent(event) {
        let newProduct = this.state.selectedProduct;
        newProduct.pricePercent = event.target.value;
        this.setState({
            selectedProduct: this.calculatePrices(newProduct, this.state.selectedCategory)
        });
    }
    handleChangePricePercentRound(event) {
        let newProduct = this.state.selectedProduct;
        newProduct.pricePercentRound = event.target.value;
        this.setState({
            selectedProduct: this.calculatePrices(newProduct, this.state.selectedCategory)
        });
    }
    handleChangeImage(url, file){
        let newProduct = this.state.selectedProduct;
        newProduct.image = url;
        this.setState({
            selectedProduct: newProduct,
            imagePrev: file
        });
    }
    onDrop(files){
        if(files.length > 0){
            Cloudinary.upload(files, {}, function(err, res) {
                this.handleChangeImage(res.url, files[0]);
            }.bind(this));
        }
    }
    onClickUpload() {
        this.refs.dropzone.open();
    }
    renderModal() {
        let label = "Producto";
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
            label = "Editar Producto";
        } else {
            label = "Agregar Producto";
        }
        const DropdownItems = this.props.categories.map((C, index)=>{
            return(
                <MenuItem key={index} value={C._id} primaryText={`${C.name} - $${C.price} Gramo`} />
            );
        });
        let TagsItems = [];
        if(this.state.selectedProduct.tags) {
            TagsItems = this.state.selectedProduct.tags.map((T, index)=>{
                return (
                    <Chip
                      key={index}
                      onRequestDelete={() => {this.handleDeleteTag(index)}}
                      style={ProductListStyles.Chip}
                    >
                        { T }
                    </Chip>
                );
            });
        }

        const modalBody = (
            <div>
                <div style={ProductListStyles.CenterContainer}>
                    <DropDownMenu
                      value={this.state.selectedProduct.category || ''}
                      onChange={this.handleChangeCategory}
                      style={ProductListStyles.ChildContainer}
                      autoWidth={false}
                    >
                      {DropdownItems}
                    </DropDownMenu>
                    <TextField
                      value={this.state.selectedProduct.denomination}
                      onChange={this.handleChangeDenomination}
                      ref="name"
                      hintText="Nombre o denominación"
                      hintStyle={ProductListStyles.HintStyle}
                      floatingLabelText="Nombre o denominación"
                      floatingLabelStyle={ProductListStyles.FloatingLabelStyle}
                      underlineFocusStyle={ProductListStyles.UnderlineStyle}
                      style={ProductListStyles.ChildContainer}
                    />
                    <div style={ProductListStyles.ChildContainerRow}>
                        <TextField
                          value={this.state.selectedProduct.provider}
                          onChange={this.handleChangeProvider}
                          ref="provider"
                          hintText="Proveedor"
                          hintStyle={ProductListStyles.HintStyle}
                          floatingLabelText="Proveedor"
                          floatingLabelStyle={ProductListStyles.FloatingLabelStyle}
                          underlineFocusStyle={ProductListStyles.UnderlineStyle}
                          style={ProductListStyles.ChildContainer}
                        />
                        <TextField
                          value={this.state.selectedProduct.grams}
                          onChange={this.handleChangeGrams}
                          ref="grams"
                          hintText="Gramos (g)"
                          hintStyle={ProductListStyles.HintStyle}
                          floatingLabelText="Gramos (g)"
                          floatingLabelStyle={ProductListStyles.FloatingLabelStyle}
                          underlineFocusStyle={ProductListStyles.UnderlineStyle}
                          style={ProductListStyles.ChildContainer}
                        />
                    </div>
                    <div style={ProductListStyles.ChildContainerRow}>
                        <TextField
                          value={this.state.selectedProduct.priceRound}
                          onChange={this.handleChangePriceRound}
                          ref="priceRound"
                          hintText="Precio para redondeo ($)"
                          hintStyle={ProductListStyles.HintStyle}
                          floatingLabelText="Redondeo ($)"
                          floatingLabelStyle={ProductListStyles.FloatingLabelStyle}
                          underlineFocusStyle={ProductListStyles.UnderlineStyle}
                          style={ProductListStyles.ChildContainer}
                        />
                        <h3 style={ProductListStyles.Number} >
                            Contado: ${this.state.selectedProduct.normalPrice}
                        </h3>

                    </div>
                    <div style={ProductListStyles.ChildContainerRow}>
                        <TextField
                          value={this.state.selectedProduct.pricePercent}
                          onChange={this.handleChangePricePercent}
                          ref="pricePercent"
                          hintText="Porcentaje redondeo (%)"
                          hintStyle={ProductListStyles.HintStyle}
                          floatingLabelText="Porcentaje (%)"
                          floatingLabelStyle={ProductListStyles.FloatingLabelStyle}
                          underlineFocusStyle={ProductListStyles.UnderlineStyle}
                          style={ProductListStyles.ChildContainerAtForty}
                        />
                        <TextField
                          value={this.state.selectedProduct.pricePercentRound}
                          onChange={this.handleChangePricePercentRound}
                          ref="pricePercentRound"
                          hintText="Redondeo para porcentaje($)"
                          hintStyle={ProductListStyles.HintStyle}
                          floatingLabelText="Redondeo ($)"
                          floatingLabelStyle={ProductListStyles.FloatingLabelStyle}
                          underlineFocusStyle={ProductListStyles.UnderlineStyle}
                          style={ProductListStyles.ChildContainerAtForty}
                        />
                        <h3 style={ProductListStyles.Number}>
                            Credito: ${this.state.selectedProduct.paysPrice}
                        </h3>
                    </div>


                    <TextField
                      onKeyDown={this.handleAddNewTag}
                      ref="newTag"
                      hintText="Agregar Tag"
                      hintStyle={ProductListStyles.HintStyle}
                      floatingLabelText="Nuevo tag"
                      floatingLabelStyle={ProductListStyles.FloatingLabelStyle}
                      underlineFocusStyle={ProductListStyles.UnderlineStyle}
                      style={ProductListStyles.ChildContainer}
                    />
                    <div style={ProductListStyles.ChipWrapper}>
                        {TagsItems}
                    </div>
                    <div style={ProductListStyles.ChildContainerRow}>
                        <Dropzone
                          onDrop={this.onDrop}
                          multiple={false}
                          accept="image/*"
                          ref="dropzone"
                          style={ProductListStyles.DropzoneBox}
                        >
                        </Dropzone>
                        <RaisedButton
                          label="Subir foto "
                          secondary={true}
                          style={ProductListStyles.ButtonPhoto}
                          onClick={this.onClickUpload}
                          icon={<AddAPhoto />}
                        />
                    </div>
                    {this.state.imagePrev ?
                        <div style={ProductListStyles.ContainerPhoto}>
                            <img
                              style={ProductListStyles.ImagePreview}
                              src={this.state.imagePrev.preview}
                            />
                        </div>
                    :null}
                </div>
            </div>
        );

        return(
            <Dialog
              title={label}
              actions={actions}
              modal={true}
              open={this.state.openModal}
              autoScrollBodyContent={true}
            >
                {modalBody}
            </Dialog>
        );
    }

    render() {
        let ProductsOnProps = [];
        let testGridElements = [];
        if (this.state.products) {
            ProductsOnProps = this.state.products.map((P, index)=>(
                <ProductCard key={index} product={P} />
            ));
            testGridElements = this.state.products.map((P, index)=>(
                <GridTile
                  key={index}
                  value={index}
                  style={ProductListStyles.Tile}
                >
                    <ProductCard key={index} product={P} index={index} handleGridClick={this.handleGridClick} />
                </GridTile>
            ));
        }
        return (
            <div>
                <div style={ProductListStyles.ContainerStyle}>
                    <div style={ProductListStyles.CardContainer}>
                        <div style={ProductListStyles.SearchBar}>
                            <TextField
                              value={this.state.searchText}
                              onChange={this.handleSearchText}
                              ref="search"
                              hintText="Busqueda"
                              hintStyle={ProductListStyles.HintStyle}
                              floatingLabelText="Busqueda"
                              floatingLabelStyle={ProductListStyles.FloatingLabelStyle}
                              underlineFocusStyle={ProductListStyles.UnderlineStyle}
                              style={{width: '100%'}}
                            />
                        </div>
                        <Card style={ProductListStyles.Card}>
                            <CardHeader
                              title="Productos"
                            />
                            <Divider />
                            <div style={ProductListStyles.ContainerActionButton}>
                                <FloatingActionButton
                                  style={ProductListStyles.FloatingButton}
                                  mini={true}
                                  onClick={this.add}
                                >
                                    <ContentAdd />
                                </FloatingActionButton>
                            </div>

                            <div style={ProductListStyles.root}>
                                <GridList
                                  style={ProductListStyles.gridList}
                                  cols={this.state.gridCols}
                                  cellHeight={200}
                                >
                                  {testGridElements}
                                </GridList>
                            </div>

                        </Card>
                    </div>
                </div>
                {this.renderModal()}
            </div>
        );
    }
}


ProductList.propTypes = propTypes;

export default createContainer(() => {
    return {
        products: Product.find().fetch(),
        categories: Category.find().fetch()
    };
}, ProductList);
