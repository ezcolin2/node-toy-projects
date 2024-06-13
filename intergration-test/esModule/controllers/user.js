import express from 'express';
import User from '../schemas/user.js';
import bcrypt from 'bcrypt';
import passport from 'passport';

const router = express.Router();

const joinUser = async (req, res) => {
    console.log(req.body);
    const { name, password } = req.body;
    const newUser = new User({
        name,
        password: await bcrypt.hash(password, 10)
    });

    try {
        await newUser.save();
        res.json({
            code: 200,
            message: '회원가입 성공'
        });
    } catch (error) {
        if (error.name === "MongoServerError" && error.code === 11000) {
            return res.status(409).json({
                code: 409,
                message: '유저 이름 중복'
            });
        }
        console.error(error);
        res.status(500).json({
            code: 500,
            message: '서버 에러'
        });
    }
};

const loginUser = async (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) {
            console.error(error);
            return next(error);
        }
        if (!user) {
            return res.status(info.code).json(info);
        }
        req.login(user, (error) => {
            if (error) {
                return next(error);
            }
            return res.status(info.code).json(info);
        });
    })(req, res, next);
};

const logoutUser = (req, res) => {
    req.logout();
    req.session.destroy();
    res.json({
        code: 200,
        message: '로그아웃에 성공했습니다.'
    });
};

export {
    joinUser,
    loginUser,
    logoutUser
};

export default router;
