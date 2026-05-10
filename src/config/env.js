const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const requiredVars = ["AWS_REGION", "DYNAMODB_TABLE_NAME"];

for (const key of requiredVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

module.exports = {
  port: Number(process.env.PORT || 4000),
  awsRegion: process.env.AWS_REGION,
  tableName: process.env.DYNAMODB_TABLE_NAME,
  corsOrigin: process.env.CORS_ORIGIN || "*"
};
