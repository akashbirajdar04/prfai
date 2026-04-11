const { performance } = require("perf_hooks");
const { enqueue } = require("./batcher");
const http = require("http");
const https = require("https");

function instrumentHttp() {
    console.log("[AI-PERF-SDK] Starting HTTP instrumentation...");

    // 1. Instrument global fetch
    if (global.fetch) {
        console.log("[AI-PERF-SDK] Fetch detected. Patching global.fetch...");
        const originalFetch = global.fetch;
        global.fetch = async (...args) => {
            const url = args[0];
            const urlStr = typeof url === 'string' ? url : (url.url || url.toString());

            if (urlStr && urlStr.includes('/api/telemetry')) {
                return originalFetch(...args);
            }

            console.log(`[AI-PERF-SDK] Fetch intercepted: ${urlStr}`);
            const start = performance.now();
            let status = 0;
            let error = null;

            try {
                const res = await originalFetch(...args);
                status = res.status;
                return res;
            } catch (err) {
                error = err.message;
                throw err;
            } finally {
                const duration = performance.now() - start;
                enqueue({
                    type: "http-fetch",
                    url: urlStr,
                    method: args[1]?.method || 'GET',
                    duration: Math.round(duration),
                    status: status,
                    error: error,
                    timestamp: new Date().toISOString()
                });
            }
        };
    }

    // 2. Instrument Node.js http/https modules
    [http, https].forEach((module) => {
        const moduleName = module === https ? 'https' : 'http';
        console.log(`[AI-PERF-SDK] Patching Node.js ${moduleName} module...`);
        const originalRequest = module.request;

        module.request = function (options, callback) {
            const start = performance.now();
            const protocol = moduleName === 'https' ? 'https:' : 'http:';
            const host = options.host || options.hostname || 'localhost';
            const path = options.path || '/';
            const urlStr = `${protocol}//${host}${path}`;

            if (urlStr.includes('/api/telemetry')) {
                return originalRequest.apply(this, arguments);
            }

            // console.log(`[AI-PERF-SDK] HTTP Request intercepted: ${urlStr}`);

            const req = originalRequest.call(this, options, (res) => {
                res.on('end', () => {
                    enqueue({
                        type: "http-node",
                        url: urlStr,
                        method: options.method || 'GET',
                        duration: Math.round(performance.now() - start),
                        status: res.statusCode,
                        timestamp: new Date().toISOString()
                    });
                });
                if (callback) callback(res);
            });

            req.on('error', (err) => {
                enqueue({
                    type: "http-node-error",
                    url: urlStr,
                    method: options.method || 'GET',
                    duration: Math.round(performance.now() - start),
                    status: 0,
                    error: err.message,
                    timestamp: new Date().toISOString()
                });
            });

            return req;
        };

        const originalGet = module.get;
        module.get = function (options, callback) {
            const req = module.request(options, callback);
            req.end();
            return req;
        };

        // --- Inbound Request (Server) Patching (PROTOTYPE METHOD) ---
        const originalEmit = module.Server.prototype.emit;
        module.Server.prototype.emit = function (event, req, res) {
            if (event === 'request' && req && res) {
                console.log(`[AI-PERF-SDK] Inbound Intercepted: ${req.method} ${req.url}`);
                const start = performance.now();
                const url = req.url;
                const method = req.method;

                // Ignore telemetry calls
                if (url && !url.includes('/api/telemetry')) {
                    res.on('finish', () => {
                        const duration = performance.now() - start;
                        enqueue({
                            type: "http-inbound",
                            url: url,
                            method: method,
                            duration: Math.round(duration),
                            status: res.statusCode,
                            timestamp: new Date().toISOString()
                        });
                    });
                }
            }
            return originalEmit.apply(this, arguments);
        };
    });
}


module.exports = { instrumentHttp };

