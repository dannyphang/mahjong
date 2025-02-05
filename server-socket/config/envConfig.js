import env from "./environment.json" with { type: "json" };
import envProd from "./environment.prod.json" with { type: "json" };

let isDev = true;

const port = isDev ? env.port : envProd.port;

const apiBaseUrl = isDev ? env.api : envProd.api;

export { apiBaseUrl, port };
