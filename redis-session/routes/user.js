const express = require('express')
const User = require('../schemas/user')
const router = express.Router()
const bcrypt = require('bcrypt')
router.get('/my-info', (req, res)=>{
    console.log(req.cookies)
    console.log(req.user)
    console.log(req.isAuthenticated())
    res.send("good")
})
router.get('/:id', async (req, res)=>{
    req.session.userId=req.params.id
    console.log(req.session.userId)
    console.log(req.session)
    
    const id = req.params.id
    const findUser = await User.find({
        _id: id
    })
    res.json(findUser)
})
router.post('/', async (req, res)=>{
    const {name, password, age} = req.body
    const newUser = new User({
        name,
        password: await bcrypt.hash(password, 10),
        age
    })
    await newUser.save()
    res.json(newUser)
})
const passport = require('passport')
router.post('/login', async(req, res, next)=>{
    passport.authenticate('local', (error, user, info)=>{  
        if (error){
            console.error(error)
            return next(error)
        }
        if (!user){
            return res.json(info)
        }
        return req.login(user, (error)=>{
            if(error){
                return next(error)
            }
            return res.json(user)
        })

    })(req, res, next)
})

module.exports = router