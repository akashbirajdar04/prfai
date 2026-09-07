const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const protobufParser = require("./middleware/protobuf-parser");

dotenv.config();
connectDB();

const app = express();

// Universal CORS Middleware (Always first)
app.use((req, res, next) => {
    const origin = req.headers.origin || '*';
    res.setHeader("Access-Control-Allow-Origin", origin);
    if (origin !== '*') {
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-session-id, X-Requested-With, Accept, Origin");

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    next();
});

const corsOptions = {
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-session-id", "X-Requested-With", "Accept", "Origin"],
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Parse Protobuf data before JSON parser
app.use(protobufParser);
app.use(express.json());

// Request logger with timing
app.use((req, res, next) => {
    console.log(`[INCOMING] ${req.method} ${req.url}`);
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    });
    next();
});

const { errorHandler, notFound } = require("./middleware/errorMiddleware");

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/analysis", require("./routes/analysis.routes"));
app.use("/api/telemetry", require("./routes/telemetry.routes"));

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running"
  });
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Professional Error Handling Mix
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});