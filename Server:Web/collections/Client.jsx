import { Mongo } from 'meteor/mongo';

export const Client = new Mongo.Collection('client');

export const ClientIndex = new EasySearch.Index({
    collection: Client,
    fields: ['name','description'],
    engine: new EasySearch.Minimongo()
});
