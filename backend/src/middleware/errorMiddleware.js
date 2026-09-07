/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    const origin = req.headers.origin || '*';
    res.setHeader("Access-Control-Allow-Origin", origin);
    if (origin !== '*') {
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-session-id, X-Requested-With, Accept, Origin");

    console.error(`[Error] ${req.method} ${req.url} - ${err.message}`);
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

/**
 * 404 Not Found Middleware
 */
const notFound = (req, res, next) => {
    const origin = req.headers.origin || '*';
    res.setHeader("Access-Control-Allow-Origin", origin);
    if (origin !== '*') {
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { errorHandler, notFound };
