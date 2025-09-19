
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Resolver caminho absoluto para config.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rawConfig = fs.readFileSync(path.join(__dirname, "../config/config.json"));
const configFile = JSON.parse(rawConfig);

const env = process.env.NODE_ENV || "development";
const config = configFile[env];

export const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize({
      dialect: config.dialect,
      storage: config.storage,
      logging: config.logging || false,
    });

export default sequelize;