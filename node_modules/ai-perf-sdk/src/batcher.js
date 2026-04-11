const { sendBatch } = require("./client");

let queue = [];
let timer = null;
let config = {};

function initBatcher(opts) {
    config = {
        endpoint: opts.endpoint,
        batchSize: opts.batchSize || 10,
        flushInterval: opts.flushInterval || 5000,
        headers: opts.headers || {}
    };

    console.log("[AI-PERF-SDK] Batcher initialized with:", JSON.stringify(config));

    if (timer) clearInterval(timer);
    timer = setInterval(flush, config.flushInterval);

    return {
        stop: () => {
            console.log("[AI-PERF-SDK] Stopping batcher...");
            if (timer) clearInterval(timer);
            return flush();
        }
    };
}

function enqueue(data) {
    queue.push(data);
    console.log(`[AI-PERF-SDK] Item enqueued. Current queue size: ${queue.length}`);

    if (queue.length >= config.batchSize) {
        console.log("[AI-PERF-SDK] Batch size reached. Triggering flush.");
        flush();
    }
}

async function flush() {
    if (queue.length === 0) {
        // console.log("[AI-PERF-SDK] Flush called, but queue is empty.");
        return;
    }

    const payload = queue.splice(0, queue.length);
    console.log(`[AI-PERF-SDK] 🚀 Flushing ${payload.length} items to ${config.endpoint}...`);

    try {
        await sendBatch({
            endpoint: config.endpoint,
            headers: config.headers,
            payload: payload
        });
        console.log(`[AI-PERF-SDK] ✅ Batch delivered successfully.`);
    } catch (err) {
        console.error("[AI-PERF-SDK] ❌ Flush failed. Returning items to queue.");
        queue.unshift(...payload);
    }
}

module.exports = {
    initBatcher,
    enqueue,
    flush
};
