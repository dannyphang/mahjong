import env from "./environment.json" with { type: "json" };
import envProd from "./environment.prod.json" with { type: "json" };
import dotenv from "dotenv";

dotenv.config();

let isProd = process.env.NODE_ENV === "production";

let isServerConnect = false;
let isLogServerConnect = false;

const port = isProd || isServerConnect ? envProd.port : env.port;

const apiBaseUrl = isProd || isServerConnect ? envProd.api : env.api;

const logBaseUrl = isProd || isLogServerConnect ? envProd.log : env.log;

export { apiBaseUrl, port, logBaseUrl };
