"use strict";
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
const cheerio = __importStar(require("cheerio"));
async function handler(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.setHeader('Access-Control-Max-Age', '86400');
    if (request.method === 'OPTIONS') {
        response.status(200).end();
        return;
    }
    try {
        const [weatherData, snowConditions] = await Promise.all([
            scrapeWeatherData(),
            scrapeSnowConditions()
        ]);
        // Cache the response for 30 minutes
        response.setHeader('Cache-Control', 's-maxage=1800');
        response.status(200).json({
            data: weatherData,
            snowConditions
        });
    }
    catch (error) {
        console.error('Error in weather API:', error);
        response.status(500).json({ error: 'Failed to fetch weather data' });
    }
}
async function scrapeSnowConditions() {
    try {
        const response = await fetch('https://www.snow-forecast.com/resorts/Les-Arcs/6day/top');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const $ = cheerio.load(html);
        // Find the snow-depths-table
        const snowDepths = {
            topDepth: 0,
            bottomDepth: 0,
            freshSnowfall: 0,
            lastSnowfall: ''
        };
        $('.snow-depths-table__table tbody tr').each((_, row) => {
            const label = $(row).find('th').text().toLowerCase();
            const valueCell = $(row).find('td');
            if (label.includes('top snow depth')) {
                const match = valueCell.text().match(/(\d+)/);
                if (match) {
                    snowDepths.topDepth = parseInt(match[1]);
                }
            }
            else if (label.includes('bottom snow depth')) {
                const match = valueCell.text().match(/(\d+)/);
                if (match) {
                    snowDepths.bottomDepth = parseInt(match[1]);
                }
            }
            else if (label.includes('fresh snowfall')) {
                const match = valueCell.text().match(/(\d+)/);
                if (match) {
                    snowDepths.freshSnowfall = parseInt(match[1]);
                }
            }
            else if (label.includes('last snowfall')) {
                snowDepths.lastSnowfall = valueCell.text().trim();
            }
        });
        return snowDepths;
    }
    catch (error) {
        console.error('Error scraping snow conditions:', error);
        throw error;
    }
}
async function scrapeWeatherData() {
    try {
        const response = await fetch('https://www.snow-forecast.com/resorts/Les-Arcs/6day/top', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const $ = cheerio.load(html);
        const weatherData = [];
        // Extract dates and weekdays
        const dates = [];
        $('.forecast-table-days__cell').each((_, elem) => {
            const dateStr = $(elem).data('date');
            if (typeof dateStr === 'string') {
                dates.push(dateStr);
            }
        });
        // Process data for each day
        for (let i = 0; i < dates.length; i++) {
            const dayForecast = {
                date: dates[i],
                periods: []
            };
            // Calculate indices for AM, PM, and night periods
            const baseIndex = i * 3;
            const timeSlots = ['AM', 'PM', 'night'];
            // Process each time period
            for (let j = 0; j < 3; j++) {
                const currentIndex = baseIndex + j;
                // Extract weather icon and description
                const weatherCell = $(`.forecast-table__row[data-row="weather"] .forecast-table__cell`).eq(currentIndex);
                const weatherIcon = weatherCell.find('img').attr('alt') || '';
                // Extract temperature
                const tempCell = $(`.forecast-table__row[data-row="temperature-max"] .forecast-table__cell`).eq(currentIndex);
                const tempValue = tempCell.find('.temp-value').data('value');
                const temp = parseInt(typeof tempValue === 'string' || typeof tempValue === 'number' ? String(tempValue) : '0');
                // Extract wind speed
                const windCell = $(`.forecast-table__row[data-row="wind"] .forecast-table__cell`).eq(currentIndex);
                const windSpeedText = windCell.find('.wind-icon__val').text();
                const windSpeed = parseInt(windSpeedText || '0');
                const windDir = windCell.find('.wind-icon__tooltip').text() || '';
                // Extract snowfall
                const snowCell = $(`.forecast-table__row[data-row="snow"] .forecast-table__cell`).eq(currentIndex);
                const snowValue = snowCell.find('.snow-amount__value').text();
                const snowfall = parseFloat(snowValue || '0');
                // Extract rain
                const rainCell = $(`.forecast-table__row[data-row="rain"] .forecast-table__cell`).eq(currentIndex);
                const rainValue = rainCell.find('.rain-amount').text();
                const rain = parseFloat(rainValue || '0');
                // Extract freezing level
                const freezeCell = $(`.forecast-table__row[data-row="freezing-level"] .forecast-table__cell`).eq(currentIndex);
                const freezeValue = freezeCell.find('.level-value').data('value');
                const freezeLevel = parseInt(typeof freezeValue === 'string' || typeof freezeValue === 'number' ? String(freezeValue) : '0');
                dayForecast.periods.push({
                    time: timeSlots[j],
                    temp,
                    weather: parseWeatherType(weatherIcon),
                    windSpeed,
                    windDir,
                    snowfall,
                    rain,
                    freezeLevel
                });
            }
            weatherData.push(dayForecast);
        }
        return weatherData;
    }
    catch (error) {
        console.error('Error scraping weather data:', error);
        throw new Error('Failed to fetch weather data');
    }
}
function parseWeatherType(weatherIcon) {
    const iconMapping = {
        'clear': 'clear',
        'part cloud': 'partlyCloudy',
        'light snow': 'lightSnow',
        'mod snow': 'moderateSnow',
        'heavy snow': 'heavySnow',
        'snow shwrs': 'snowShowers',
        'light rain': 'lightRain',
        'mod. rain': 'moderateRain',
        'heavy rain': 'heavyRain',
        'cloud': 'cloudy'
    };
    for (const [key, value] of Object.entries(iconMapping)) {
        if (weatherIcon.toLowerCase().includes(key)) {
            return value;
        }
    }
    return 'unknown';
}
