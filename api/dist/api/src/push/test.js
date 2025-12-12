"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const push_service_1 = require("../services/push-service");
async function handler(request, response) {
    // Handle CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (request.method === 'OPTIONS') {
        response.status(200).end();
        return;
    }
    if (request.method !== 'GET') {
        response.status(405).json({ error: 'Method not allowed' });
        return;
    }
    try {
        await (0, push_service_1.broadcastNotification)({
            title: '🎉 Test Notification',
            body: 'If you see this, push notifications are working!',
            url: '/ski/#weather',
            icon: '/ski/favicon-192x192.png',
        });
        response.status(200).json({ message: 'Test notification sent' });
    }
    catch (error) {
        console.error('Error sending test notification:', error);
        response.status(500).json({ error: 'Failed to send test notification' });
    }
}
