/**
 *  Feed redux store
 */
// import React from 'react';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import multireducer from 'multireducer';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { MultiReducerConfig } from './reducers';

export function createStoreWith(keys, reducers, history) {
    const MainReducer = {};
    MultiReducerConfig.map((ObjReduc) => {
        const multiObj = {};
        keys.map((key) => {
            multiObj[key] = ObjReduc.func;
        });
        MainReducer[ObjReduc.name] = multireducer(multiObj);
    });
    if (reducers) {
        // Load custom reducers.
        reducers.map((ObjReduc) => {
            const multiObj = {};
            keys.map((key) => {
                multiObj[key] = ObjReduc.func;
            });
            MainReducer[ObjReduc.name] = multireducer(multiObj);
        });
    }

    MainReducer.routing = routerReducer;
    const Reducers = combineReducers(MainReducer);
    if (history) {
        return createStore(
            Reducers,
            compose(
                applyMiddleware(
                    thunkMiddleware,
                    routerMiddleware(history)
                )
            )
        );
    }
    return createStore(
        Reducers,
        compose(
            applyMiddleware(
                thunkMiddleware
            )
        )
    );
}

export function createStoreWithKeys(keys) {
    const MainReducer = {};
    MultiReducerConfig.map((ObjReduc) => {
        const multiObj = {};
        keys.map((key) => {
            multiObj[key] = ObjReduc.func;
        });
        MainReducer[ObjReduc.name] = multireducer(multiObj);
    });
    const Reducers = combineReducers(MainReducer);
    const store = createStore(
        Reducers,
        compose(
            applyMiddleware(
                thunkMiddleware
            )
        )
    );
    return store;
}
export default function storeWithKeysFunc(keys, reducers) {
    const MainReducer = {};
    MultiReducerConfig.map((ObjReduc) => {
        const multiObj = {};
        keys.map((key) => {
            multiObj[key] = ObjReduc.func;
        });
        MainReducer[ObjReduc.name] = multireducer(multiObj);
    });
    reducers.map((ObjReduc) => {
        const multiObj = {};
        keys.map((key) => {
            multiObj[key] = ObjReduc.func;
        });
        MainReducer[ObjReduc.name] = multireducer(multiObj);
    });
    const Reducers = combineReducers(MainReducer);
    const store = createStore(
        Reducers,
        compose(
            applyMiddleware(
                thunkMiddleware
            )
        )
    );
    return store;
}
