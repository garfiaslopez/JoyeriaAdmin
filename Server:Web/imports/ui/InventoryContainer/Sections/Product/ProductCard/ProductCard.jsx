/**
 * MENU COMPONENT
 */
import React, { Component, PropTypes } from 'react';
import ProductCardStyles from './ProductCardStyles';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Chip from 'material-ui/Chip';

import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

const propTypes = {
    product: PropTypes.object.isRequired,
    index: PropTypes.number,
    handleGridClick: PropTypes.func
};

class ProductCard extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(){
        this.props.handleGridClick(this.props.index);
    }
    render() {
        const tags = this.props.product.tags.map((T, index)=>{
            return (
                <Chip
                  key={index}
                  style={ProductCardStyles.Chip}
                >
                    { T }
                </Chip>
            );
        });
        return (
            <div style={ProductCardStyles.ContainerCol}>
                <div onClick={this.handleClick} style={ProductCardStyles.ContainerRow}>
                    <div style={ProductCardStyles.ContainerPhoto}>
                        <img
                          style={ProductCardStyles.ImagePreview}
                          src={this.props.product.image}
                        />
                    </div>
                    <div style={ProductCardStyles.ContainerDescription}>
                        <h4 style={ProductCardStyles.Text}>{this.props.product.denomination}</h4>
                        <div style={ProductCardStyles.SubContainerRow}>
                            <h4 style={ProductCardStyles.Text}>{this.props.product.category.name}</h4>
                            <h4 style={ProductCardStyles.Text}>${this.props.product.category.price}</h4>
                        </div>
                        <div style={ProductCardStyles.SubContainerRow}>
                            <h4 style={ProductCardStyles.Text}>Contado: ${this.props.product.normalPrice}</h4>
                            <h4 style={ProductCardStyles.Text}>Credito: ${this.props.product.paysPrice}</h4>
                        </div>
                        <div style={ProductCardStyles.SubContainerRow}>
                            <h4 style={ProductCardStyles.Text}>{this.props.product.provider}</h4>
                            <h4 style={ProductCardStyles.Text}>{this.props.product.grams} Gramos</h4>
                        </div>
                    </div>
                </div>
                <div style={ProductCardStyles.ChipWrapper}>
                    {tags}
                </div>
            </div>
        );
    }
}

ProductCard.propTypes = propTypes;


export default ProductCard;
