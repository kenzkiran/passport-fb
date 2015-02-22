// connect to the database
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/passport-fb');

var uSchema = new Schema({
    oauthID: {type: Number, unique: true},
    name: String,
    created: Date,
    credentials: {
        accessToken: {type: String, default: 'default-access-token'},
        refreshToken: {type: String, default: 'default-refresh-token'}
    }
});

var User = mongoose.model('User', uSchema);

User.login = function(profile, credentials, done) {
    console.log('User.login');
    User.findOne({ oauthID: profile.id }, function(err, user) {
        if(err) { console.log(err); }
        if (!err && user != null) {
            console.log('Found User: ' + user.toString());
            done(null, user);
        } else {
            console.log('Creating new user: ' + profile.displayName);
            // default values not getting updated for credentials field
            var user = new User({
                oauthID: profile.id,
                name: profile.displayName,
                created: Date.now()
            });
            user.save(function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("saving user ..." + JSON.stringify(user));
                    done(null, user);
                };
            });
        };
    });
}

module.exports = User;
