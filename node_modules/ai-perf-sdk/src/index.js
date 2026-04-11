const { initBatcher, flush } = require("./batcher");
const { instrumentHttp } = require("./instrument");

let stopBatcher = null;

function startSdk(options = {}) {
    console.log("[AI-PERF-SDK] startSDK called with configuration:", JSON.stringify(options));

    if (!options.endpoint) {
        console.error("[AI-PERF-SDK] CRITICAL ERROR: No endpoint provided. Telemetry will not be sent.");
        return;
    }

    try {
        const batcher = initBatcher(options);
        stopBatcher = batcher.stop;

        instrumentHttp();

        console.log("[AI-PERF-SDK] SDK Start Sequence Complete.");
    } catch (err) {
        console.error("[AI-PERF-SDK] Initialization failed:", err);
    }
}

async function shutdownSdk() {
    console.log("[AI-PERF-SDK] shutdownSDK initiated.");
    if (stopBatcher) {
        await stopBatcher();
    }
}

module.exports = {
    startSDK: startSdk,
    shutdownSDK: shutdownSdk,
    initPerformanceSDK: startSdk,
    shutdownPerformanceSDK: shutdownSdk
};
