/**
 * MENU COMPONENT
 */
import React, { Component, PropTypes } from 'react';
import ClientCardStyles from './ClientCardStyles';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Chip from 'material-ui/Chip';

import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

const propTypes = {
    client: PropTypes.object.isRequired,
    index: PropTypes.number,
    handleParentClick: PropTypes.func
};

class clientCard extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(){
        this.props.handleParentClick(this.props.index);
    }
    render() {
        return (
            <div style={ClientCardStyles.ContainerCol}>
                <div onClick={this.handleClick} style={ClientCardStyles.ContainerRow}>
                    <div style={ClientCardStyles.ContainerPhoto}>
                        <img
                          style={ClientCardStyles.ImagePreview}
                          src="images/Profile.png"
                        />
                    </div>
                    <div style={ClientCardStyles.ContainerDescription}>
                        <h4 style={ClientCardStyles.Text}>{this.props.client.name}</h4>
                        <h4 style={ClientCardStyles.Text}>{this.props.client.name}</h4>
                        <div style={ClientCardStyles.SubContainerRow}>
                            <h4 style={ClientCardStyles.Text}>{this.props.client.provider}</h4>
                            <h4 style={ClientCardStyles.Text}>{this.props.client.grams} Gramos</h4>
                        </div>
                        <div style={ClientCardStyles.SubContainerRow}>
                            <h4 style={ClientCardStyles.Text}>{this.props.client.provider}</h4>
                            <h4 style={ClientCardStyles.Text}>{this.props.client.grams} Gramos</h4>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

clientCard.propTypes = propTypes;


export default clientCard;
