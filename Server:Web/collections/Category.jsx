import { Mongo } from 'meteor/mongo';

export const Category = new Mongo.Collection('category');

export const CategoryIndex = new EasySearch.Index({
    collection: Category,
    fields: ['name','description'],
    engine: new EasySearch.Minimongo()
});
