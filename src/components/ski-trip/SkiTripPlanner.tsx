"use client"
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plane, UtensilsCrossed, CloudSun, Luggage, Snowflake } from 'lucide-react';
import TravelDetailsTab from './TravelDetailsTab';
import PackingTab from './PackingTab';
import RestaurantsTab from './RestaurantsTab';
import WeatherTab from './WeatherTab';
import FlightCountdown from "./FlightCountdown";

const validTabs = ['travel', 'restaurants', 'weather', 'packing'];
const defaultTab = 'travel';

const SkiTripPlanner: React.FC = () => {

    // Initialize active tab from URL hash or default
    // Initialize with default tab to avoid hydration mismatch
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showSnowflake, setShowSnowflake] = useState(false);

    // Handle initial tab setting and hash changes after mount
    React.useEffect(() => {
        // Get initial tab from hash after component mounts
        const hash = window.location.hash.slice(1);
        if (validTabs.includes(hash)) {
            setActiveTab(hash);
        } else if (!window.location.hash) {
            window.location.hash = defaultTab;
        }

        const handleHashChange = () => {
            const hash = window.location.hash.slice(1);
            if (validTabs.includes(hash)) {
                setActiveTab(hash);
            } else {
                setActiveTab(defaultTab);
            }
        };

        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        // Update URL hash
        const newUrl = `${window.location.pathname}${window.location.search}#${value}`;
        window.history.replaceState(null, '', newUrl);

        if (value === 'weather') {
            setIsAnimating(true);
            setShowSnowflake(true);
            setTimeout(() => {
                setShowSnowflake(false);
                setIsAnimating(false);
            }, 800);
        } else {
            setIsAnimating(true);
            setTimeout(() => {
                setIsAnimating(false);
            }, 800);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 font-sans">
            <div className="mx-auto max-w-6xl">
                <header className="mb-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                        Ski Trip to Les Arcs
                    </h1>
                    <p className="text-slate-600">January 17-24, 2026</p>
                    <FlightCountdown />
                </header>

                <style jsx global>{`
                    @keyframes flyPlane {
                        0% { transform: translateX(0); }
                        30% { transform: translateX(20px) translateY(-20px); }
                        50% {opacity: 0}
                        60% { transform: translateX(-20px) translateY(20px); opacity: 0; }
                        80% { transform: translateX(0); opacity: 1; }
                    }

                    @keyframes jumpUtensils {
                        0% { transform: translateY(0); }
                        50% { transform: translateY(-15px); }
                        100% { transform: translateY(0); }
                    }

                    @keyframes weatherToSnow {
                        0% { transform: rotate(0deg) scale(1); opacity: 1; }
                        45% { transform: rotate(180deg) scale(0.1); opacity: 0; }
                        55% { transform: rotate(180deg) scale(0.1); opacity: 0; }
                        100% { transform: rotate(360deg) scale(1); opacity: 1; }
                    }

                    @keyframes rollLuggage {
                        0% { transform: rotate(0deg) translateX(0) translateY(0); }
                        10% { transform: rotate(30deg) translateX(0) ; }
                        60% { transform: rotate(30deg) translateX(-40px) translateY(19px); }
                        65% {opacity: 0}
                        90% { transform: translateX(10px) translateY(0); opacity: 0; }
                        95% {opacity: 1}
                        100% { transform: rotate(0deg) translateX(0) translateY(0); }
                    }

                    .animate-plane {
                        animation: flyPlane 0.8s ease-in-out;
                    }

                    .animate-utensils {
                        animation: jumpUtensils 0.8s ease-in-out;
                    }

                    .animate-weather {
                        animation: weatherToSnow 0.8s ease-in-out;
                    }

                    .animate-luggage {
                        animation: rollLuggage 0.8s ease-in-out;
                    }

                    .weather-icon-container {
                        position: relative;
                        width: 16px;
                        height: 16px;
                    }

                    .weather-icon {
                        position: absolute;
                        top: 0;
                        left: 0;
                        transition: opacity 0.4s ease-in-out;
                    }
                `}</style>

                <Tabs defaultValue="travel" value={activeTab} onValueChange={handleTabChange} className="w-full space-y-6">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1 p-1">
                        <TabsTrigger value="travel" className="flex items-center justify-center gap-1 text-xs md:text-sm px-2 py-1.5">
                            <div className="relative">
                                <Plane className={`h-4 w-4 ${isAnimating && activeTab === 'travel' ? 'animate-plane' : ''}`}/>
                            </div>
                            <span className="hidden md:inline">Travel Details</span>
                            <span className="md:hidden">Travel</span>
                        </TabsTrigger>

                        <TabsTrigger value="restaurants" className="flex items-center justify-center gap-1 text-xs md:text-sm px-2 py-1.5">
                            <div className="relative">
                                <UtensilsCrossed className={`h-4 w-4 ${isAnimating && activeTab === 'restaurants' ? 'animate-utensils' : ''}`}/>
                            </div>
                            <span className="hidden md:inline">Restaurants</span>
                            <span className="md:hidden">Food</span>
                        </TabsTrigger>

                        <TabsTrigger value="weather" className="flex items-center justify-center gap-1 text-xs md:text-sm px-2 py-1.5">
                            <div className="weather-icon-container">
                                <CloudSun className={`weather-icon h-4 w-4 ${isAnimating && activeTab === 'weather' ? 'animate-weather' : ''}`}
                                          style={{ opacity: showSnowflake ? 0 : 1 }} />
                                <Snowflake className={`weather-icon h-5 w-5 stroke-2 text-blue-600 ${isAnimating && activeTab === 'weather' ? 'animate-weather' : ''}`}
                                           style={{ opacity: showSnowflake ? 1 : 0, transform: 'translate(-2px, -2px)' }} />
                            </div>
                            <span className="hidden md:inline">Weather</span>
                            <span className="md:hidden">Weather</span>
                        </TabsTrigger>

                        <TabsTrigger value="packing" className="flex items-center justify-center gap-1 text-xs md:text-sm px-2 py-1.5">
                            <div className="relative">
                                <Luggage className={`h-4 w-4 ${isAnimating && activeTab === 'packing' ? 'animate-luggage' : ''}`}/>
                            </div>
                            <span className="hidden md:inline">Packing</span>
                            <span className="md:hidden">Pack</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="travel">
                        <TravelDetailsTab />
                    </TabsContent>
                    <TabsContent value="restaurants">
                        <RestaurantsTab />
                    </TabsContent>
                    <TabsContent value="weather">
                        <WeatherTab />
                    </TabsContent>
                    <TabsContent value="packing">
                        <PackingTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default SkiTripPlanner;