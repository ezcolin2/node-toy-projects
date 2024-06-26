const { AxiosError } = require('axios')
const User = require('../schemas/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
const joinUser = async (req, res)=>{
    console.log(req.body)
    const {name, password} = req.body
    const newUser = new User({
        name,
        password: await bcrypt.hash(password, 10)
    })
    try{
        await newUser.save()
    } catch(error){
        console.error(error)
        if(error.name == "MongoServerError" && error.code ==11000){
            return res.status(409).json({
                code: 409,
                message: '유저 이름 중복'
            })
        }
    }
    res.json({
        code: 200,
        message: '회원가입 성공'
    })
}

const loginUser = async(req, res, next)=>{
    passport.authenticate('local', (error, user, info)=>{  
        if (error){
            console.error(error)
            return next(error)
        }
        if (!user){
            return res.status(info.code).json(info)
        }
        return req.login(user, (error)=>{
            if(error){
                return next(error)
            }
            console.log(info)
            return res.status(info.code).json(info)
        })

    })(req, res, next)
}

const logoutUser = async (req, res)=>{
    req.session.destroy()
    res.json({
        code: 200,
        message: '로그아웃에 성공했습니다.'
    })
}

module.exports = {
    joinUser,
    loginUser,
    logoutUser
}