
function extractMetrics(lhr) {
  const seoAuditRefs = lhr.categories?.seo?.auditRefs || [];
  const seoIssues = seoAuditRefs
    .map(ref => lhr.audits[ref.id])
    .filter(a => a && a.score !== null && a.score < 1)
    .map(a => ({
      id: a.id,
      title: a.title,
      description: a.explanation || a.description || '',
      severity: a.score === 0 ? 'high' : 'medium'
    }));

  return {
    performance: {
      lcp: lhr.audits["largest-contentful-paint"]?.numericValue || 0, // ms
      cls: lhr.audits["cumulative-layout-shift"]?.numericValue || 0,
      inp: lhr.audits["interaction-to-next-paint"]?.numericValue || 0,
      ttfb: lhr.audits["server-response-time"]?.numericValue || 0, // ms
      unusedJavascript: lhr.audits["unused-javascript"],
      renderBlockingResources: lhr.audits["render-blocking-resources"],
    },
    seo: {
      score: Math.round((lhr.categories?.seo?.score || 0) * 100),
      issues: seoIssues
    }
  };
}

module.exports = extractMetrics;
