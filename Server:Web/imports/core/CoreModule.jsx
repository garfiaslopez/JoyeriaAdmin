/**
 * Root redux app
 */
import React, { Component, PropTypes } from 'react';
// import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { createStoreWith } from './redux/store';

const propTypes = {
    configUrl: PropTypes.string,
    dataUrl: PropTypes.string,
    keyReducers: PropTypes.array,
    customReducers: PropTypes.array,
    routes: PropTypes.object,
    children: PropTypes.element
};

// children: PropTypes.array

const defaultProps = {
    keyReducers: []
};

const defaultchildContextTypes = {
    configUrl: PropTypes.string,
    dataUrl: PropTypes.string
};

const defaultDataUrl = 'http://kboard-feed-api-1933259418.us-west-2.elb.amazonaws.com/v1/searches';
const defaultConfigUrl = 'http://kpulse-api-215136801.us-west-2.elb.amazonaws.com/v1';

class CoreModule extends Component {
    constructor(props) {
        super(props);

        let history;
        if (this.props.routes) {
            history = browserHistory;
        } else {
            history = null;
        }
        this.MainStore = createStoreWith(
            this.props.keyReducers, this.props.customReducers, history
        );
    }
    getChildContext() {
        return {
            configUrl: this.props.configUrl ? this.props.configUrl : defaultConfigUrl,
            dataUrl: this.props.dataUrl ? this.props.dataUrl : defaultDataUrl
        };
    }
    renderComponent() {
        if (this.props.routes) {
            const history = syncHistoryWithStore(browserHistory, this.MainStore);
            return (
                <Provider store={this.MainStore}>
                    <Router history={history} routes={this.props.routes} />
                </Provider>
            );
        }
        return (
            <Provider store={this.MainStore}>
                <div>
                    {this.props.children}
                </div>
            </Provider>
        );
    }
    render() {
        return (
            <div>
                {this.renderComponent()}
            </div>
        );
    }
}

CoreModule.propTypes = propTypes;
CoreModule.defaultProps = defaultProps;
CoreModule.childContextTypes = defaultchildContextTypes;


export default CoreModule;
