"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const weather_1 = __importDefault(require("./weather/weather"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Enable CORS for all routes
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://ynoncoen.github.io',
    ],
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
}));
// Convert Express request/response to Vercel-compatible format
app.get('/api/weather', async (req, res) => {
    try {
        // Create a minimal VercelRequest-like object
        const vercelReq = {
            query: req.query,
            cookies: req.cookies,
            headers: req.headers,
            body: req.body,
            method: req.method,
        };
        // Create a minimal VercelResponse-like object
        const vercelRes = {
            status: (statusCode) => ({
                json: (data) => res.status(statusCode).json(data),
                end: () => res.status(statusCode).end(),
            }),
            setHeader: (name, value) => res.setHeader(name, value),
        };
        // Call the Vercel handler with our adapted request/response objects
        await (0, weather_1.default)(vercelReq, vercelRes);
    }
    catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Handle preflight requests
app.options('/api/weather', (req, res) => {
    res.status(200).end();
});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Weather API endpoint: http://localhost:${port}/api/weather`);
});
