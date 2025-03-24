import env from "./environment.json" with { type: "json" };

let isServerConnect = false;

const logBaseUrl = env.log;

export { logBaseUrl };
