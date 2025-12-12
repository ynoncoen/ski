"use strict";
// api/src/scheduled/daily-weather.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const push_service_1 = require("../services/push-service");
const cheerio = __importStar(require("cheerio"));
const trip_dates_1 = require("../../../src/config/trip-dates");
async function getDailyWeatherSummary() {
    try {
        const response = await fetch('https://www.snow-forecast.com/resorts/Les-Arcs/6day/top');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const $ = cheerio.load(html);
        // Get today's forecasts
        const todayData = {
            temps: [],
            snowfall: [],
            conditions: []
        };
        // Process temperature data for today (first three columns)
        $('.forecast-table__row[data-row="temperature-max"] .forecast-table__cell').slice(0, 3).each((_, elem) => {
            const temp = $(elem).find('.temp-value').data('value');
            todayData.temps.push(typeof temp === 'number' ? temp : 0);
        });
        // Process snowfall data for today
        $('.forecast-table__row[data-row="snow"] .forecast-table__cell').slice(0, 3).each((_, elem) => {
            const snow = parseFloat($(elem).find('.snow-amount__value').text() || '0');
            todayData.snowfall.push(snow);
        });
        // Process weather conditions for today
        $('.forecast-table__row[data-row="weather"] .forecast-table__cell').slice(0, 3).each((_, elem) => {
            const weather = $(elem).find('img').attr('alt') || '';
            todayData.conditions.push(weather);
        });
        return {
            maxTemp: Math.max(...todayData.temps),
            minTemp: Math.min(...todayData.temps),
            snowfall: {
                morning: todayData.snowfall[0] || 0,
                afternoon: todayData.snowfall[1] || 0,
                night: todayData.snowfall[2] || 0
            },
            conditions: todayData.conditions
        };
    }
    catch (error) {
        console.error('Error fetching weather summary:', error);
        throw error;
    }
}
function shouldSendWeatherNotification() {
    const now = new Date();
    const { startDate, endDate } = (0, trip_dates_1.getWeatherNotificationDates)();
    // Send notifications starting one month before trip until the end of the last day of trip
    return now >= startDate && now <= endDate;
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
        // Check if we should send weather notifications based on trip timing
        if (!shouldSendWeatherNotification()) {
            response.status(200).json({
                message: 'Weather notifications not active - outside of notification window',
                notificationWindow: {
                    start: 'One month before trip (December 17, 2025)',
                    end: 'Last day of trip (January 24, 2026)'
                }
            });
            return;
        }
        const summary = await getDailyWeatherSummary();
        // Create notification message
        let message = `Today's Weather at Les Arcs (2000m):\n`;
        message += `Temperature: ${summary.minTemp}°C to ${summary.maxTemp}°C\n`;
        const { morning, afternoon, night } = summary.snowfall;
        const hasSnow = morning > 0 || afternoon > 0 || night > 0;
        if (hasSnow) {
            message += '🌨️ Expected snowfall:\n';
            if (morning > 0)
                message += `Morning: ${morning}cm\n`;
            if (afternoon > 0)
                message += `Afternoon: ${afternoon}cm\n`;
            if (night > 0)
                message += `Evening: ${night}cm\n`;
        }
        else {
            message += 'No snowfall expected today\n';
        }
        // Send notification
        await (0, push_service_1.broadcastNotification)({
            title: '⛷️ Daily Snow Report',
            body: message,
            url: '/ski/#weather',
            icon: '/ski/favicon-192x192.png'
        });
        response.status(200).json({
            message: 'Daily weather notification sent successfully',
            summary
        });
    }
    catch (error) {
        console.error('Error in daily weather handler:', error);
        response.status(500).json({ error: 'Failed to send daily weather notification' });
    }
}
