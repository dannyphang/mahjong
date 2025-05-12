import env from "./environment.json" with { type: "json" };
import envProd from "./environment.prod.json" with { type: "json" };
import * as config from "./config.js"

let environment = config.default.environment;
let isServerConnect = true;
let isAuthServerConnect = false;

const logBaseUrl = environment === 'production' || isServerConnect ? envProd.log : env.log;
const authBaseUrl = environment === 'production' || isAuthServerConnect ? envProd.auth : env.auth;

export { logBaseUrl, authBaseUrl };
