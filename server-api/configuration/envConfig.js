import env from "./environment.json" with { type: "json" };
import envProd from "./environment.prod.json" with { type: "json" };

let isServerConnect = true;

const logBaseUrl = isServerConnect ? envProd.log : env.log;

export { logBaseUrl };
