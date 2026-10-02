import { onLCP, onCLS, onINP, onFCP, onTTFB } from 'web-vitals';
import api from './api';

// In-memory collection registry to prevent duplicate listener registration across React re-renders
const capturedVitals = new Map();
let isListenersRegistered = false;
let flushTimer = null;
let activeSessionId = null;

/**
 * Formats raw web-vitals metric object into required PerafAI telemetry structure:
 * { name, value, rating, id, navigationType }
 */
export const formatWebVital = (metric) => {
    return {
        name: metric.name,
        value: metric.value,
        rating: metric.rating || 'good',
        id: metric.id || '',
        navigationType: metric.navigationType || (performance?.getEntriesByType?.('navigation')?.[0]?.type || 'navigate')
    };
};

/**
 * Posts collected Web Vitals metrics to the existing PerafAI backend telemetry layer
 */
export const sendWebVitalsTelemetry = async (sessionId, metrics) => {
    if (!sessionId || !metrics || metrics.length === 0) return;

    try {
        console.log(`[PerafAI Telemetry] Sending ${metrics.length} Web Vitals for session ${sessionId}...`, metrics);
        await api.post('/telemetry', metrics, {
            headers: {
                'x-session-id': sessionId,
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.warn(`[PerafAI Telemetry] Telemetry submission notice:`, err.message);
    }
};

/**
 * Initializes browser-side Web Vitals metric collection safely.
 * Prevents registering duplicate event listeners during React component re-renders.
 */
export const initWebVitals = (sessionId = null, callback = null) => {
    if (sessionId) {
        activeSessionId = sessionId;
    }

    const handleMetric = (metric) => {
        if (!metric || !metric.name) return;

        const formatted = formatWebVital(metric);
        capturedVitals.set(metric.name, formatted);
        console.log(`[web-vitals] Captured ${metric.name}:`, formatted);

        const currentMetrics = Array.from(capturedVitals.values());

        if (callback) {
            callback(formatted, currentMetrics);
        }

        // Debounce transmission to backend telemetry endpoint
        if (activeSessionId) {
            if (flushTimer) clearTimeout(flushTimer);
            flushTimer = setTimeout(() => {
                sendWebVitalsTelemetry(activeSessionId, currentMetrics);
            }, 800);
        }
    };

    // Register web-vitals API listeners ONCE
    if (!isListenersRegistered) {
        isListenersRegistered = true;
        try {
            onLCP(handleMetric);
            onCLS(handleMetric);
            onINP(handleMetric);
            onFCP(handleMetric);
            onTTFB(handleMetric);
            console.log('[web-vitals] Registered browser metric listeners (LCP, CLS, INP, FCP, TTFB).');
        } catch (err) {
            console.error('[web-vitals] Failed to register web-vitals listeners:', err);
        }
    }

    // Immediately return current snapshot if metrics were already captured
    if (capturedVitals.size > 0 && callback) {
        callback(null, Array.from(capturedVitals.values()));
    }

    return () => {
        if (flushTimer) {
            clearTimeout(flushTimer);
            if (activeSessionId && capturedVitals.size > 0) {
                sendWebVitalsTelemetry(activeSessionId, Array.from(capturedVitals.values()));
            }
        }
    };
};

/**
 * Returns current snapshot of captured Web Vitals metrics
 */
export const getCapturedVitals = () => Array.from(capturedVitals.values());
