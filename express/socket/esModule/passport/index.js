import passport from 'passport';
import local from './localStrategy.js';
import User from '../schemas/user.js';

const initializePassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    try {
      const findUser = await User.findOne({ _id });
      done(null, findUser);
    } catch (err) {
      done(err);
    }
  });

  local();
};

export default initializePassport;
