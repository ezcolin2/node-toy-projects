import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../schemas/user.js';

export default function configureLocalStrategy() {
    passport.use('local', new LocalStrategy({
        usernameField: 'name',
        passwordField: 'password'
    }, async (name, password, done) => {
        try {
            const findUser = await User.findOne({ name });
            if (findUser) {
                const res = await bcrypt.compare(password, findUser.password);
                if (res) {
                    done(null, findUser, { code: 200, message: "로그인 성공" });
                } else {
                    done(null, false, { code: 400, message: "비밀번호가 일치하지 않습니다." });
                }
            } else {
                done(null, false, { code: 404, message: "해당 유저가 존재하지 않습니다." });
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
}
