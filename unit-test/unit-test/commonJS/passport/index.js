const passport = require('passport')
const local = require('./localStrategy')
const User = require('../schemas/user')

module.exports = ()=>{
    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })
    passport.deserializeUser(async (_id ,done)=>{
        const findUser = await User.findOne({_id})
        done(null, findUser)
    })
    local()
}