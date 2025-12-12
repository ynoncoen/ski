"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSubscription = saveSubscription;
exports.deleteSubscription = deleteSubscription;
exports.sendNotification = sendNotification;
exports.broadcastNotification = broadcastNotification;
exports.sendWeatherAlert = sendWeatherAlert;
exports.sendRestaurantReminder = sendRestaurantReminder;
const web_push_1 = __importDefault(require("web-push"));
const redis_1 = __importDefault(require("../lib/redis"));
// Configure web-push with your VAPID keys
const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY || '',
    privateKey: process.env.VAPID_PRIVATE_KEY || '',
};
web_push_1.default.setVapidDetails('mailto:ynoncoen@gmail.com', vapidKeys.publicKey, vapidKeys.privateKey);
async function saveSubscription(subscription) {
    try {
        // Use subscription.endpoint as a unique identifier
        // Set expiration to 1 year (in seconds)
        await redis_1.default.set(`push:${subscription.endpoint}`, JSON.stringify(subscription), {
            ex: 365 * 24 * 60 * 60
        });
    }
    catch (error) {
        console.error('Error saving push subscription:', error);
        throw error;
    }
}
async function deleteSubscription(endpoint) {
    try {
        await redis_1.default.del(`push:${endpoint}`);
    }
    catch (error) {
        console.error('Error deleting push subscription:', error);
        throw error;
    }
}
async function sendNotification(subscription, payload) {
    try {
        await web_push_1.default.sendNotification(subscription, JSON.stringify(payload));
        return true;
    }
    catch (error) {
        if (error.statusCode === 404 || error.statusCode === 410) {
            // Subscription has expired or is invalid
            await deleteSubscription(subscription.endpoint);
            return false;
        }
        throw error;
    }
}
async function broadcastNotification(payload) {
    try {
        // Get all subscription keys
        const [_, keys] = await redis_1.default.scan(0, {
            match: 'push:*',
            count: 100
        });
        if (keys.length > 0) {
            // Get all subscriptions
            const subscriptionStrings = await redis_1.default.mget(...keys);
            // Process and send notifications
            await Promise.all(subscriptionStrings
                .filter((sub) => sub !== null)
                .map(async (subscription) => {
                try {
                    console.log('Sending notification to: ', subscription);
                    // Parse the subscription string into a PushSubscription object
                    return sendNotification(subscription, payload);
                }
                catch (parseError) {
                    console.error('Error parsing subscription:', parseError);
                    // If we can't parse the subscription, we should delete it
                    return false;
                }
            }));
        }
    }
    catch (error) {
        console.error('Error broadcasting notification:', error);
        throw error;
    }
}
// Function to send weather alerts
async function sendWeatherAlert(snowAmount, date) {
    if (snowAmount >= 10) {
        await broadcastNotification({
            title: '❄️ Fresh Powder Alert!',
            body: `${snowAmount}cm of fresh snow expected on ${date}! Get ready for perfect conditions!`,
            url: '/ski/#weather',
            icon: '/ski/favicon-192x192.png',
        });
    }
}
// Function to send restaurant reminders
async function sendRestaurantReminder(restaurantName, time) {
    await broadcastNotification({
        title: '🍽️ Restaurant Reminder',
        body: `Don't forget your reservation at ${restaurantName} at ${time} today!`,
        url: '/ski/#restaurants',
        icon: '/ski/favicon-192x192.png',
    });
}
