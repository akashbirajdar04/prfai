const Session = require('../models/sessionmodel');
const aiService = require('./ai.service');
const { uploadFile } = require('./cloudinary.service');

/**
 * Service for processing and aggregating OpenTelemetry telemetry data
 */
const telemetryService = {
    /**
     * Process a batch of traces for a session
     */
    processTraces: async (sessionId, traces) => {
        const session = await Session.findById(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        const existingMetrics = session.metrics?.api || [];
        const endpoints = {};

        // 1. Load existing metrics
        existingMetrics.forEach(m => {
            const key = `${m.method} ${m.endpoint}`;
            endpoints[key] = {
                count: m.hitCount || m.count || 1,
                successCount: Math.round(((m.successRate || 100) / 100) * (m.hitCount || m.count || 1)),
                totalDuration: (m.avgLatency || 0) * (m.hitCount || m.count || 1),
                minLatency: m.bestLatency || Infinity,
                maxLatency: m.p95 || 0,
                method: m.method,
                route: m.endpoint
            };
        });

        // 2. Process NEW events from this batch
        const events = Array.isArray(traces) ? traces : (traces.payload || traces.metrics || []);
        const vitalsCaptured = {};

        events.forEach(event => {
            if (!event) return;

            // Process browser Web Vitals metric events
            if (event.name && ['LCP', 'CLS', 'INP', 'FCP', 'TTFB'].includes(String(event.name).toUpperCase())) {
                const metricName = String(event.name).toLowerCase();
                let displayVal = event.value;
                if (['lcp', 'fcp', 'ttfb', 'inp'].includes(metricName) && typeof event.value === 'number') {
                    displayVal = event.value > 10 ? `${(event.value / 1000).toFixed(2)} s` : `${Math.round(event.value)} ms`;
                } else if (metricName === 'cls' && typeof event.value === 'number') {
                    displayVal = event.value.toFixed(3);
                }
                vitalsCaptured[metricName] = String(displayVal);
                return;
            }

            // Process HTTP tracing events
            const isHttp = event.type && event.type.startsWith('http');
            if (!isHttp) return;

            const method = event.method || 'GET';
            let url = event.url || 'unknown';
            const durationMs = event.duration || 0;
            const status = event.status || 0;

            try {
                const urlObj = new URL(url, 'http://localhost');
                url = urlObj.pathname;
            } catch (e) { }

            const key = `${method} ${url}`;

            if (!endpoints[key]) {
                endpoints[key] = {
                    count: 0,
                    successCount: 0,
                    totalDuration: 0,
                    minLatency: Infinity,
                    maxLatency: 0,
                    method: method,
                    route: url
                };
            }

            endpoints[key].count++;
            endpoints[key].totalDuration += durationMs;
            endpoints[key].minLatency = Math.min(endpoints[key].minLatency, durationMs);
            endpoints[key].maxLatency = Math.max(endpoints[key].maxLatency, durationMs);
            if (status >= 200 && status < 400) endpoints[key].successCount++;
        });

        // 3. Finalize Aggregation
        const aggregated = Object.values(endpoints).map(e => ({
            endpoint: e.route,
            method: e.method,
            avgLatency: Math.round(e.totalDuration / e.count),
            bestLatency: e.minLatency === Infinity ? 0 : Math.round(e.minLatency),
            p95: Math.round(e.maxLatency),
            hitCount: e.count,
            successRate: Math.round((e.successCount / e.count) * 100),
            isSlow: (e.totalDuration / e.count) > 200
        }));

        // 4. Persistence
        const updateObj = {};

        if (aggregated.length > 0) {
            const filePath = aiService.storeLatencyForRAG(sessionId, aggregated);
            const cloudinaryUrl = await uploadFile(filePath, 'telemetry_data');
            updateObj['artifacts.endpointsUrl'] = cloudinaryUrl;
            updateObj['metrics.api'] = aggregated;
        }

        if (Object.keys(vitalsCaptured).length > 0) {
            if (vitalsCaptured.lcp) updateObj['metrics.performance.lcp'] = vitalsCaptured.lcp;
            if (vitalsCaptured.cls) updateObj['metrics.performance.cls'] = vitalsCaptured.cls;
            if (vitalsCaptured.inp) updateObj['metrics.performance.inp'] = vitalsCaptured.inp;
            if (vitalsCaptured.fcp) updateObj['metrics.performance.fcp'] = vitalsCaptured.fcp;
            if (vitalsCaptured.ttfb) updateObj['metrics.performance.ttfb'] = vitalsCaptured.ttfb;

            if (session.status === 'pending' || session.status === 'running') {
                updateObj.status = 'waiting_for_telemetry';
            }
        }

        if (Object.keys(updateObj).length > 0) {
            await Session.findByIdAndUpdate(sessionId, updateObj);
        }

        return { url: updateObj['artifacts.endpointsUrl'] || '', count: aggregated.length };
    }
};

module.exports = telemetryService;
