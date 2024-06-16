import dotenv from "dotenv";
import path from "path";
import expose from './expose.cjs';
const {__dirname} = expose;
export default () => {
  console.log(`NODE_ENV = ${process.env.NODE_ENV}`);
  switch (process.env.NODE_ENV) {
    case "dev":

      dotenv.config({ path: path.join(__dirname, "./dev.env") });
      break;
    case "test":
      dotenv.config({ path: path.join(__dirname, "./test.env") });
      break;
    default: // 기본적으로 개발 모드
      dotenv.config({ path: path.join(__dirname, "./dev.env") });
      break;
  }
  console.log(`NODE_ENV : ${process.env.NODE_ENV}`);
};
