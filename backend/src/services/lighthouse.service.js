const fs = require('fs');

const runLighthouse = async (url) => {
    // Dynamic import for ESM-only lighthouse and chrome-launcher packages
    const { default: lighthouse } = await import('lighthouse');
    const chromeLauncher = await import('chrome-launcher');

    let puppeteer = null;
    try {
        puppeteer = require('puppeteer');
    } catch (e) {
        try {
            puppeteer = require('puppeteer-core');
        } catch (e2) {
            puppeteer = null;
        }
    }

    let browser = null;
    let chromeInstance = null;
    let port = 9222;

    try {
        if (puppeteer) {
            console.log(`[Lighthouse] Launching Puppeteer browser...`);
            const launchOptions = {
                headless: "new",
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu",
                    "--no-zygote",
                    "--remote-debugging-port=0"
                ]
            };
            if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
                launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
            } else if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
                launchOptions.executablePath = process.env.CHROME_PATH;
            }

            try {
                browser = await puppeteer.launch(launchOptions);
                try {
                    const wsEndpoint = browser.wsEndpoint();
                    const urlObj = new URL(wsEndpoint);
                    port = parseInt(urlObj.port, 10);
                } catch (wsErr) {
                    port = 9222;
                }
            } catch (puppeteerErr) {
                console.warn("[Lighthouse] Puppeteer launch failed, falling back to chrome-launcher:", puppeteerErr.message);
                browser = null;
            }
        }

        if (!browser) {
            console.log(`[Lighthouse] Launching Chrome via chrome-launcher...`);
            const launchOpts = {
                chromeFlags: ['--headless', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
            };
            if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
                launchOpts.chromePath = process.env.CHROME_PATH;
            }
            chromeInstance = await chromeLauncher.launch(launchOpts);
            port = chromeInstance.port;
        }

        const options = {
            logLevel: 'info',
            output: 'json',
            onlyCategories: ['performance', 'seo', 'accessibility', 'best-practices'],
            port: port
        };

        console.log(`[Lighthouse] Running analysis for ${url} on port ${port}`);
        const runnerResult = await lighthouse(url, options);

        const report = JSON.parse(runnerResult.report);
        const audits = report.audits || {};

        const seoAuditRefs = report.categories?.seo?.auditRefs || [];
        const seoIssues = [];

        for (const ref of seoAuditRefs) {
            const audit = audits[ref.id];
            if (!audit) continue;
            if (audit.score !== null && audit.score < 1) {
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

        const metrics = {
            performanceScore: Math.round((report.categories?.performance?.score || 0) * 100),
            seoScore: Math.round((report.categories?.seo?.score || 0) * 100),
            seoIssues,
            lcp: audits['largest-contentful-paint']?.displayValue || 'N/A',
            cls: audits['cumulative-layout-shift']?.displayValue || 'N/A',
            inp: audits['interaction-to-next-paint']?.displayValue || 'N/A',
            ttfb: audits['server-response-time']?.displayValue || 'N/A',
            fcp: audits['first-contentful-paint']?.displayValue || 'N/A',
            si: audits['speed-index']?.displayValue || 'N/A',
            tbt: audits['total-blocking-time']?.displayValue || 'N/A',
        };

        console.log(`[Lighthouse] Extracted Metrics (SEO Issues Count: ${seoIssues.length}):`, metrics);
        return { rawReport: report, metrics };

    } catch (error) {
        console.error("Lighthouse run failed:", error);
        throw error;
    } finally {
        if (browser) {
            try {
                await browser.close();
                console.log("[Lighthouse] Puppeteer browser closed.");
            } catch (err) {
                console.warn("[Lighthouse] Browser close error:", err.message);
            }
        }
        if (chromeInstance) {
            try {
                await chromeInstance.kill();
                console.log("[Lighthouse] Chrome launcher kill error:", err.message);
            } catch (err) {
                console.warn("[Lighthouse] Chrome launcher kill error:", err.message);
            }
        }
    }
};

module.exports = { runLighthouse };
