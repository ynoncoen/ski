"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const push_service_1 = require("../services/push-service");
async function handler(request, response) {
    // Handle CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (request.method === 'OPTIONS') {
        response.status(200).end();
        return;
    }
    if (request.method !== 'POST') {
        response.status(405).json({ error: 'Method not allowed' });
        return;
    }
    try {
        const subscription = request.body;
        await (0, push_service_1.saveSubscription)(subscription);
        response.status(201).json({ message: 'Subscription saved' });
    }
    catch (error) {
        console.error('Error saving subscription:', error);
        response.status(500).json({ error: 'Failed to save subscription' });
    }
}
