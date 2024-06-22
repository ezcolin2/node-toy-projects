import Sequelize from 'sequelize';
import * as configEX from "../config/config.json" assert { type: 'json' };

// 환경변수에 따라 config를 설정
const env = process.env.NODE_ENV || 'development';
const config = configEX.default[env];
const db = {};

// db 객체에 sequelize 객체를 저장
const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;

export default db;