import express from 'express';
import User from '../schemas/user.js';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { isAuthenticated, isNotAuthenticated } from '../middlewares/apiAuthMiddleware.js';

const router = express.Router();

router.post('/join', isNotAuthenticated, async (req, res) => {
  console.log(req.body);
  const { name, password } = req.body;
  const newUser = new User({
    name,
    password: await bcrypt.hash(password, 10)
  });
  try {
    await newUser.save();
  } catch (error) {
    if (error.name == "MongoServerError" && error.code == 11000) {
      return res.status(409).json({
        code: 409,
        message: '유저 이름 중복'
      });
    }
  }
  res.json({
    code: 200,
    message: '회원가입 성공'
  });
});

router.post('/login', isNotAuthenticated, async (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) {
      console.error(error);
      return next(error);
    }
    if (!user) {
      return res.status(info.code).json(info);
    }
    return req.login(user, (error) => {
      if (error) {
        return next(error);
      }
      return res.status(info.code).json(info);
    });
  })(req, res, next);
});

router.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy();
  res.json({
    code: 200,
    message: '로그아웃에 성공했습니다.'
  });
});

export default router;
