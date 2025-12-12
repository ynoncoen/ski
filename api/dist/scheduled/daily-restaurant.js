"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const push_service_1 = require("../services/push-service");
const restaurant_data_json_1 = __importDefault(require("../data/restaurant-data.json"));
const trip_dates_1 = require("../../../src/config/trip-dates");
function getTodayBooking() {
    const today = new Date();
    const dateStr = `${today.getDate()}.${today.getMonth() + 1}`;
    return restaurant_data_json_1.default.bookings.find(booking => booking.date === dateStr) || null;
}
function isWithinNotificationPeriod() {
    const today = new Date();
    const { startDate, endDate } = (0, trip_dates_1.getRestaurantNotificationDates)();
    return today >= startDate && today <= endDate;
}
async function handler(request, response) {
    // Handle CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.setHeader('Access-Control-Max-Age', '86400');
    // Handle preflight request
    if (request.method === 'OPTIONS') {
        response.status(200).end();
        return;
    }
    try {
        // Only allow cron job requests
        const authHeader = request.headers.authorization;
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            response.status(401).json({ error: 'Unauthorized' });
            return;
        }
        // Check if we're within the notification period (1 week before trip until end of trip)
        if (!isWithinNotificationPeriod()) {
            response.status(200).json({
                message: 'Outside notification period - no notification sent',
                type: 'outside_period',
                currentDate: new Date().toISOString(),
                notificationPeriod: {
                    start: '2026-01-10',
                    end: '2026-01-24'
                }
            });
            return;
        }
        const booking = getTodayBooking();
        // Send notification regardless of whether there's a booking or not
        if (!booking) {
            await (0, push_service_1.broadcastNotification)({
                title: '🍽️ No Restaurant Today',
                body: 'No restaurant for today. Are we going hungry? 😅',
                url: '/ski/#restaurants',
                icon: '/ski/favicon-192x192.png'
            });
            response.status(200).json({
                message: 'No restaurant notification sent',
                type: 'no_booking'
            });
            return;
        }
        // Create notification message for booked restaurant
        const message = `🍽️ Tonight's Dinner at ${booking.name}\n` +
            `Time: ${booking.time}\n` +
            `Location: ${booking.address}` +
            (booking.comment ? `\nNote: ${booking.comment}` : '');
        // Send notification
        await (0, push_service_1.broadcastNotification)({
            title: '🍽️ Restaurant Reminder',
            body: message,
            url: '/ski/#restaurants',
            icon: '/ski/favicon-192x192.png'
        });
        response.status(200).json({
            message: 'Restaurant notification sent successfully',
            booking
        });
    }
    catch (error) {
        console.error('Error in daily restaurant handler:', error);
        response.status(500).json({ error: 'Failed to send restaurant notification' });
    }
}
