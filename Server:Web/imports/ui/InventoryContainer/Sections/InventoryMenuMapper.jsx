/**
 * Basic routes App
 */
import ProductList from './Product/ProductList';
import CategoryList from './Category/CategoryList';

const InventoryMenuMapper = [
    {
        title: 'Categoria (Linea)',
        component: CategoryList,
        isSelected: false
    },
    {
        title: 'Productos',
        component: ProductList,
        isSelected: false
    }
];

export default InventoryMenuMapper;
