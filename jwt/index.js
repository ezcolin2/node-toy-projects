const express = require("express");
const User = require("./schemas/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const connect = require("./schemas");
const bcrypt = require("bcrypt");
const localStrategy = require("./passport/LocalStrategy");
const jwtStrategy = require("./passport/JwtStrategy");
const app = express();
dotenv.config();
connect();
localStrategy();
jwtStrategy();
app.use(express.json());
app.use(passport.initialize());
app.listen(3001, () => {
  console.log("3001번 포트 연결");
});

app.post("/users", async (req, res) => {
  const { name, password, age } = req.body;
  const newUser = new User({
    name,
    password: await bcrypt.hash(password, 10),
    age,
  });
  const saveUser = await newUser.save();
  res.json(saveUser);
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      console.error(error);
      return next(error);
    }
    if (!user) {
      return res.json(info);
    }
    return req.login(user, { session: false }, (error) => {
      if (error) {
        return next(error);
      }
      console.log(user)
      const newJwt = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET
      );
      return res.json({ newJwt });
    });
  })(req, res, next);
});
const jwtAuthorize = (req, res, next)=>{
  passport.authenticate("jwt", { session: false }, (error, user, info) => {
      console.log(error)
      console.log(info)
    if (error){
        return next(error)
    }
    if (!user){
      return res.json({message : info.message})
    }
    req.user = user
    next()
  })(req, res, next);
}
app.get("/my-info",jwtAuthorize, (req, res)=>{
  res.json(req.user)
});
