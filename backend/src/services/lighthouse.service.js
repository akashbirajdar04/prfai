const fs = require('fs');
const axios = require('axios');

const isLocalUrl = (urlStr) => {
    try {
        const parsed = new URL(urlStr);
        const host = parsed.hostname.toLowerCase();
        return (
            host === 'localhost' ||
            host === '127.0.0.1' ||
            host === '0.0.0.0' ||
            host === '::1' ||
            host.endsWith('.local') ||
            host.startsWith('192.168.') ||
            host.startsWith('10.') ||
            host.startsWith('172.16.')
        );
    } catch {
        return false;
    }
};

const getMetricValue = (audit, unit = '') => {
    if (!audit) return 'N/A';
    if (audit.displayValue) return audit.displayValue;
    if (audit.numericValue !== undefined && audit.numericValue !== null) {
        if (unit === 's') return `${(audit.numericValue / 1000).toFixed(2)} s`;
        if (unit === 'ms') return `${Math.round(audit.numericValue)} ms`;
        if (unit === 'score') return `${audit.numericValue.toFixed(3)}`;
        return `${audit.numericValue}`;
    }
    return 'N/A';
};

const runLighthouse = async (url) => {
    // 1. Primary: Try Google PageSpeed Insights API for public URLs
    if (!isLocalUrl(url)) {
        try {
            console.log(`[Lighthouse] Attempting Google PageSpeed Insights API for ${url}...`);
            const apiKey = process.env.PAGESPEED_API_KEY || process.env.GOOGLE_API_KEY || '';
            const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance&category=seo&category=accessibility&category=best-practices${apiKey ? `&key=${apiKey}` : ''}`;

            const apiResponse = await axios.get(apiUrl, { timeout: 15000 });
            if (apiResponse.data && apiResponse.data.lighthouseResult) {
                const report = apiResponse.data.lighthouseResult;
                const audits = report.audits || {};
                const seoAuditRefs = report.categories?.seo?.auditRefs || [];
                const seoIssues = [];
                const processedIds = new Set();

                for (const ref of seoAuditRefs) {
                    const audit = audits[ref.id];
                    if (!audit) continue;
                    if (audit.score !== null && audit.score < 1) {
                        processedIds.add(ref.id);
                        seoIssues.push({
                            id: ref.id,
                            title: audit.title,
                            description: audit.explanation || audit.description || 'Improve search engine optimization for this check.',
                            score: audit.score,
                            severity: audit.score === 0 ? 'high' : 'medium',
                            displayValue: audit.displayValue || ''
                        });
                    }
                }

                const knownSeoKeys = ['viewport', 'document-title', 'meta-description', 'http-status-code', 'link-text', 'is-crawlable', 'robots-txt', 'canonical', 'font-size', 'tap-targets', 'hreflang', 'structured-data'];
                for (const key of knownSeoKeys) {
                    if (processedIds.has(key)) continue;
                    const audit = audits[key];
                    if (audit && audit.score !== null && audit.score < 1) {
                        processedIds.add(key);
                        seoIssues.push({
                            id: key,
                            title: audit.title,
                            description: audit.explanation || audit.description || 'Improve search engine optimization for this check.',
                            score: audit.score,
                            severity: audit.score === 0 ? 'high' : 'medium',
                            displayValue: audit.displayValue || ''
                        });
                    }
                }

                const metrics = {
                    performanceScore: Math.round((report.categories?.performance?.score || 0) * 100),
                    seoScore: Math.round((report.categories?.seo?.score || 0) * 100),
                    seoIssues,
                    lcp: getMetricValue(audits['largest-contentful-paint'], 's'),
                    cls: getMetricValue(audits['cumulative-layout-shift'], 'score'),
                    inp: getMetricValue(audits['interaction-to-next-paint'], 'ms'),
                    ttfb: getMetricValue(audits['server-response-time'], 'ms'),
                    fcp: getMetricValue(audits['first-contentful-paint'], 's'),
                    si: getMetricValue(audits['speed-index'], 's'),
                    tbt: getMetricValue(audits['total-blocking-time'], 'ms'),
                };

                console.log(`[Lighthouse] PageSpeed API Success! Extracted Metrics (SEO Issues Count: ${seoIssues.length}):`, metrics);
                return { rawReport: report, metrics };
            }
        } catch (apiErr) {
            console.warn(`[Lighthouse] PageSpeed API unavailable (${apiErr.message}), falling back to local Chrome audit...`);
        }
    } else {
        console.log(`[Lighthouse] URL ${url} is local/internal. Skipping PageSpeed API and running local Chrome audit...`);
    }

    // 2. Fallback: Dynamic import for ESM-only lighthouse and chrome-launcher packages
    const { default: lighthouse } = await import('lighthouse');
    const chromeLauncher = await import('chrome-launcher');

    let chromeInstance = null;
    let port = 9222;

    try {
        console.log(`[Lighthouse] Launching Chrome via chrome-launcher...`);
        const chromeFlags = [
            '--headless=new',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-software-rasterizer',
            '--no-zygote',
            '--single-process',
            '--no-first-run',
            '--no-default-browser-check'
        ];

        let chromePath = undefined;
        if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
            chromePath = process.env.CHROME_PATH;
        } else if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
            chromePath = process.env.PUPPETEER_EXECUTABLE_PATH;
        } else if (fs.existsSync('/usr/bin/chromium')) {
            chromePath = '/usr/bin/chromium';
        } else if (fs.existsSync('/usr/bin/chromium-browser')) {
            chromePath = '/usr/bin/chromium-browser';
        }

        const launchOpts = { chromeFlags };
        if (chromePath) {
            launchOpts.chromePath = chromePath;
            console.log(`[Lighthouse] Using Chromium binary at: ${chromePath}`);
        }

        chromeInstance = await chromeLauncher.launch(launchOpts);
        port = chromeInstance.port;

        const options = {
            logLevel: 'info',
            output: 'json',
            onlyCategories: ['performance', 'seo', 'accessibility', 'best-practices'],
            port: port
        };

        console.log(`[Lighthouse] Running analysis for ${url} on port ${port}`);
        const runnerResult = await lighthouse(url, options);

        const report = typeof runnerResult.report === 'string' ? JSON.parse(runnerResult.report) : runnerResult.report;
        const audits = report.audits || {};

        const seoAuditRefs = report.categories?.seo?.auditRefs || [];
        const seoIssues = [];
        const processedIds = new Set();

        for (const ref of seoAuditRefs) {
            const audit = audits[ref.id];
            if (!audit) continue;
            if (audit.score !== null && audit.score < 1) {
                processedIds.add(ref.id);
                seoIssues.push({
                    id: ref.id,
                    title: audit.title,
                    description: audit.explanation || audit.description || 'Improve search engine optimization for this check.',
                    score: audit.score,
                    severity: audit.score === 0 ? 'high' : 'medium',
                    displayValue: audit.displayValue || ''
                });
            }
        }

        const knownSeoKeys = ['viewport', 'document-title', 'meta-description', 'http-status-code', 'link-text', 'is-crawlable', 'robots-txt', 'canonical', 'font-size', 'tap-targets', 'hreflang', 'structured-data'];
        for (const key of knownSeoKeys) {
            if (processedIds.has(key)) continue;
            const audit = audits[key];
            if (audit && audit.score !== null && audit.score < 1) {
                processedIds.add(key);
                seoIssues.push({
                    id: key,
                    title: audit.title,
                    description: audit.explanation || audit.description || 'Improve search engine optimization for this check.',
                    score: audit.score,
                    severity: audit.score === 0 ? 'high' : 'medium',
                    displayValue: audit.displayValue || ''
                });
            }
        }

        const metrics = {
            performanceScore: Math.round((report.categories?.performance?.score || 0) * 100),
            seoScore: Math.round((report.categories?.seo?.score || 0) * 100),
            seoIssues,
            lcp: getMetricValue(audits['largest-contentful-paint'], 's'),
            cls: getMetricValue(audits['cumulative-layout-shift'], 'score'),
            inp: getMetricValue(audits['interaction-to-next-paint'], 'ms'),
            ttfb: getMetricValue(audits['server-response-time'], 'ms'),
            fcp: getMetricValue(audits['first-contentful-paint'], 's'),
            si: getMetricValue(audits['speed-index'], 's'),
            tbt: getMetricValue(audits['total-blocking-time'], 'ms'),
        };

        console.log(`[Lighthouse] Extracted Metrics (SEO Issues Count: ${seoIssues.length}):`, metrics);
        return { rawReport: report, metrics };

    } catch (error) {
        console.error("Lighthouse run failed:", error);
        throw error;
    } finally {
        if (chromeInstance) {
            try {
                await chromeInstance.kill();
                console.log("[Lighthouse] Chrome launcher closed.");
            } catch (err) {
                console.warn("[Lighthouse] Chrome launcher kill error:", err.message);
            }
        }
    }
};

module.exports = { runLighthouse };
