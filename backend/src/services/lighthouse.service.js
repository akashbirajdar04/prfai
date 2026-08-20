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
                    "--remote-debugging-port=9222"
                ]
            };
            if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
                launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
            } else if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
                launchOptions.executablePath = process.env.CHROME_PATH;
            }

            try {
                browser = await puppeteer.launch(launchOptions);
            } catch (puppeteerErr) {
                console.warn("[Lighthouse] Puppeteer launch failed, falling back to chrome-launcher:", puppeteerErr.message);
                browser = null;
            }
        }

        if (!browser) {
            console.log(`[Lighthouse] Launching Chrome via chrome-launcher...`);
            const launchOpts = {
                chromeFlags: ['--headless', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
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

        const metrics = {
            performanceScore: Math.round((report.categories?.performance?.score || 0) * 100),
            seoScore: Math.round((report.categories?.seo?.score || 0) * 100),
            lcp: audits['largest-contentful-paint']?.displayValue || 'N/A',
            cls: audits['cumulative-layout-shift']?.displayValue || 'N/A',
            inp: audits['interaction-to-next-paint']?.displayValue || 'N/A',
            ttfb: audits['server-response-time']?.displayValue || 'N/A',
            fcp: audits['first-contentful-paint']?.displayValue || 'N/A',
            si: audits['speed-index']?.displayValue || 'N/A',
            tbt: audits['total-blocking-time']?.displayValue || 'N/A',
        };

        console.log(`[Lighthouse] Extracted Metrics:`, metrics);
        return { rawReport: report, metrics };

    } catch (error) {
        console.error("Lighthouse run failed:", error);
        throw error;
    } finally {
        if (browser) {
            await browser.close().catch(() => {});
            console.log("[Lighthouse] Puppeteer browser closed.");
        }
        if (chromeInstance) {
            await chromeInstance.kill().catch(() => {});
            console.log("[Lighthouse] Chrome launcher instance killed.");
        }
    }
};

module.exports = { runLighthouse };
