const fetch = global.fetch || (typeof require !== 'undefined' ? require("node-fetch") : null);

async function sendBatch({ endpoint, headers, payload }) {
    console.log(`[AI-PERF-SDK] Sending batch to ${endpoint}... Payload size: ${payload.length}`);

    if (!fetch) {
        throw new Error("Fetch is not available.");
    }

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const text = await response.text();
            console.error(`[AI-PERF-SDK] HTTP Error: ${response.status} - ${text}`);
            throw new Error(`Telemetry send failed: ${response.status} ${text}`);
        }

        console.log(`[AI-PERF-SDK] Batch successfully sent to ${endpoint} (Status: ${response.status})`);
    } catch (err) {
        console.error(`[AI-PERF-SDK] Network Error sending batch:`, err.message);
        throw err;
    }
}

module.exports = { sendBatch };
