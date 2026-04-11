const { Nodesdk } = require("@opentelemetry/sdk-node")
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
const defualt = require("./config")

let sdkInstance = null

function startsdk(option = {}) {
   if (sdkInstance) return;
   const config = {
      ...defualt,
      ...option
   }

   const exporter = new OTLPTraceExporter({
      url: config.collectorUrl
   })
   sdkInstance = new Nodesdk({
      serviceName: config.serviceName,
      traceExporter: exporter,
      instrumentations: [getNodeAutoInstrumentations()]
   })
   sdkInstance.start()
   console.log("sdk started")
}
function shutdownsdk() {
   if (!sdkInstance) return;
   sdkInstance.shutdown()
   console.log("sdk shutdown")
   sdkInstance = null
}

module.exports = {
   startsdk,
   shutdownsdk
}
