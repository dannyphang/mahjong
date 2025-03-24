import * as config from "../configuration/envConfig.js";
import axios from "axios";

const httpLog = axios.create({
    baseURL: config.logBaseUrl,
});

function createLog(error, req, res, statusCode) {
    const errorDetails = {
        message: error.message,
        stack: error.stack,
        statusCode: statusCode || res.statusCode,
        request: {
            url: req.originalUrl,
            method: req.method,
            path: req.path,
            headers: req.headers,
            body: req.body,
        },
    };
    return httpLog.post("console", { errorDetails });
}

export { createLog };
