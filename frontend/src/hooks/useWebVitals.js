import { useEffect, useState } from 'react';
import { initWebVitals, getCapturedVitals } from '../services/vitalsService';

/**
 * Custom React hook for capturing Web Vitals safely without duplicate listeners.
 */
export const useWebVitals = (sessionId = null) => {
    const [vitals, setVitals] = useState(() => getCapturedVitals());

    useEffect(() => {
        const cleanup = initWebVitals(sessionId, (_newMetric, allMetrics) => {
            setVitals([...allMetrics]);
        });

        return () => {
            if (cleanup && typeof cleanup === 'function') {
                cleanup();
            }
        };
    }, [sessionId]);

    return vitals;
};

export default useWebVitals;
