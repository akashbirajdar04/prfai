const { initPerformanceSDK } = require("../ai-perf-sdk/src/index");

initPerformanceSDK({
    serviceName: "test-service",
    collectorEndpoint: "http://localhost:3001/otel"
});

require("express")().listen(3000);

