const passport = require("passport");
const dotenv = require("dotenv");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../schemas/user");
dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

module.exports = () => {
  passport.use(
    'jwt',
    new JwtStrategy(options, async(payload, done) => {
      try{
        const findUser = await User.findById(payload.id)
        if (findUser){
          return done(null, findUser)
        } else{
          return done(null, false, {message: "해당 유저가 존재하지 않습니다."})
        }
      }
      catch (error){
        done(error, false, {message: "에러가 발생했습니다."})
      }
    })
  );
};
