# ai-perf-sdk

A lightweight, plug-and-play performance monitoring SDK for Node.js.

## Installation

```bash
npm install ai-perf-sdk
```

## Usage

Initialize the SDK at the very top of your application entry point:

```javascript
const { initPerformanceSDK } = require('ai-perf-sdk');

initPerformanceSDK({
    endpoint: 'https://your-telemetry-endpoint.com/api/telemetry', // Required
    serviceName: 'my-microservice',
    environment: 'production',
    batchSize: 10,
    flushInterval: 5000
});
```

## Configuration Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `endpoint` | String | (Required) | The URL where telemetry data will be sent. |
| `serviceName` | String | `unknown-service` | The name of your service for identification. |
| `environment` | String | `production` | The environment name (e.g., development, staging). |
| `batchSize` | Number | `10` | Number of items to queue before sending a batch. |
| `flushInterval` | Number | `5000` | Time in ms between automatic flushes. |

## How it works

The SDK automatically instruments the `http` and `https` modules to capture:
- HTTP Request Latency
- Response Status Codes
- Outbound and Inbound request metrics

All data is batched and sent asynchronously to your specified endpoint.
