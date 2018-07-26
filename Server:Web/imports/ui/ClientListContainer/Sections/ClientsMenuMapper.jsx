/**
 * Basic routes App
 */
import React, { Component } from 'react';

import ClientsList from './Clients/ClientsList';

const InventoryMenuMapper = [
    {
        title: 'Clientes',
        component: ClientsList,
        isSelected: false
    }
];

export default InventoryMenuMapper;
