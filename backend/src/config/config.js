import dotenv from "dotenv";
dotenv.config();

if (!process.env.mongouri) {
  throw new Error("Mongo URI is not defined in .env environment variables");
}
if (!process.env.port) {
  throw new Error("PORT is not defined in .env environment variables");
}

const config = {
  mongouri: process.env.mongouri,
  port: process.env.port,
};

export default config;
