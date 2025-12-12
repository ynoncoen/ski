"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const restaurant_data_json_1 = __importDefault(require("../data/restaurant-data.json"));
async function handler(request, response) {
    // Handle CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (request.method === 'OPTIONS') {
        response.status(200).end();
        return;
    }
    try {
        // Set cache control headers to cache the response for 1 hour
        response.setHeader('Cache-Control', 's-maxage=3600');
        response.status(200).json(restaurant_data_json_1.default);
    }
    catch (error) {
        console.error('Error serving restaurant data:', error);
        response.status(500).json({ error: 'Failed to fetch restaurant data' });
    }
}
