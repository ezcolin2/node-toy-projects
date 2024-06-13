const dotenv = require("dotenv");

switch (process.env.NODE_ENV) {
  case "dev":
    dotenv.config({ path: "./env.dev" });
    break;
  case "test":
    dotenv.config({ path: "./env.test" });
}
