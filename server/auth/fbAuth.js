import { Strategy as FacebookStrategy } from 'passport-facebook';
import passport from 'passport';

const FB = {
  APP_ID: '1813878368846537',
  APP_SECRET: '593aa0c997cd308c58587825095f4264',
  CALLBACK: 'http://localhost:8732/auth/facebook/callback'
};

console.log(FB);
export const facebookAuthConfig = function(User) {
  passport.use(new FacebookStrategy({
    clientID: FB.APP_ID,
    clientSecret: FB.APP_SECRET,
    callbackURL: FB.CALLBACK,
    enableProof: true,
    profileFields: ['id', 'emails', 'name']
  }, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      return User.findOrCreate({
        name: profile.name.givenName,
        facebookId: profile.id,
        facebookAccessToken: accessToken
      })
      .then((user) => {
        console.log('got it!');
        return done(null, user);
      })
      .catch((err) => done(err, null));
    });
  }
  ));
};

