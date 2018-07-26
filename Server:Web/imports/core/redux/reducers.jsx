/**
 * Feed redux reducers
 */
import { merge } from 'lodash';

import {
    REQUEST_DATA, CLEAN_DATA, RECEIVE_DATA, ERROR_DATA
} from './actions';


/**
 * Configuration
 */

const initialStateData = {
    dataSet: {},
    status: { code: -1, info: 'init' }
};

function dataReducer(state = initialStateData, action = {}) {
    switch (action.type) {
    case REQUEST_DATA:
        return {
            config: {},
            status: action.status
        };
    case RECEIVE_DATA:
        return {
            dataSet: action.data,
            status: action.status
        };
    case ERROR_DATA:
        return {
            config: {},
            status: action.error
        };
    default:
        return state;
    }
}

export const MultiReducerConfig = [
    {
        func: dataReducer,
        name: 'data'
    }
];
