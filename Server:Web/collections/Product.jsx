import { Mongo } from 'meteor/mongo';
import { Category } from './Category';

export const Product = new Mongo.Collection('product', {
    transform: function(doc) {
        doc.category = Category.findOne({
            _id: doc.category
        });
        doc.normalPrice = ((doc.category.price * doc.grams) + doc.priceRound).toFixed(2);
        doc.paysPrice = ((doc.category.price * doc.grams) + (((doc.category.price * doc.grams) * doc.pricePercent)/100) + doc.pricePercentRound).toFixed(2);
        return doc;
    }
});

export const ProductIndex = new EasySearch.Index({
    collection: Product,
    fields: ['denomination','provider'],
    engine: new EasySearch.Minimongo({
        transform: (doc) => {
            doc.category = Category.findOne({
                _id: doc.category
            });
            doc.normalPrice = ((doc.category.price * doc.grams) + doc.priceRound).toFixed(2);
            doc.paysPrice = ((doc.category.price * doc.grams) + (((doc.category.price * doc.grams) * doc.pricePercent)/100) + doc.pricePercentRound).toFixed(2);
            return doc;
        }
    })
});
