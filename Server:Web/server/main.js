import { Meteor } from 'meteor/meteor';
import { UserAdmin } from '../collections/UserAdmin';

Meteor.startup(() => {
    // UserAdmin Sample if no found Any
    if(UserAdmin.find().count() === 0){
        var newUserAdmin = {
            name: 'TestAdmin',
            username: 'admin',
            password: 'awesomepassword'
        };
        UserAdmin.insert(newUserAdmin);
    }

    Cloudinary.config({
        cloud_name: 'berry',
        api_key: '879734371464722',
        api_secret: 'X8rMLT_e5H3q5tjvRD4wwqAQvw0'
    });

});
