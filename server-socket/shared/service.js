import * as config from "../config/envConfig.js";
import http from "http";
import https from "https";

const port = config.apiBaseUrl.startsWith("https") ? https : http;

function options(path, method) {
    const { hostname, port, pathname } = new URL(`${config.apiBaseUrl}/${path}`);
    return {
        host: hostname, // Extract the hostname
        port: port || config.port, // Extract the port or default to 80
        path: pathname, // Extract the path
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        timeout: 5000, // Set a timeout for requests
    };
}

async function callRESTAPI(path, method, retries = 3) {
    while (retries > 0) {
        try {
            let req = port.request(options(path, method), (res) => {
                let output = "";
                res.setEncoding("utf8");
                res.on("data", (chunk) => (output += chunk));
                res.on("end", () => {
                    resolve({
                        statusCode: res.statusCode,
                        data: JSON.parse(output),
                    });
                });
            });

            req.on("error", (err) => {
                if (--retries === 0) {
                    reject(new Error(`Request failed after retries: ${err.message}`));
                }
            });

            req.setTimeout(10000, () => {
                req.abort();
                if (--retries === 0) {
                    reject(new Error("Request timeout after retries"));
                }
            });

            req.end();
        } catch (error) {
            if (--retries === 0) throw error;
        }
    }
}

export { options, callRESTAPI };
