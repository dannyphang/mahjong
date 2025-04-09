import * as config from "../configuration/envConfig.js";
import axios from "axios";

const httpLog = axios.create({
    baseURL: config.logBaseUrl,
});

function createLog(error, req, res, statusCode, module) {
    const errorDetails = {
        project: "Mahjong",
        module: module,
        server: "Server API",
        serverType: "API",
        message: error.message,
        stack: error.stack,
        statusCode: statusCode || res.statusCode,
        request: {
            url: req.originalUrl,
            method: req.method,
            path: req.path,
            host: req.headers.host,
        },
    };
    return httpLog.post("exception", { errorDetails });
}

export { createLog };
