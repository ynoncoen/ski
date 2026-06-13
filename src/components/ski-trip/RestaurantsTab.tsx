"use client"

import React, {useEffect, useState} from 'react';
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {ExternalLink, Phone, MapPin} from 'lucide-react';
import {getRestaurantData, type RestaurantData} from '@/lib/restaurant-service';

const RestaurantsTab: React.FC = () => {
    const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getRestaurantData();
                setRestaurantData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load restaurant data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (date: string | undefined) => {
        if (!date?.includes('.')) return date;
        const [day] = date.split('.');
        return `January ${day}`;
    };

    if (isLoading) {
        return (
            <Card className="border-l-4 border-l-yellow-500">
                <CardHeader>
                    <CardTitle>Restaurant Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"/>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error || !restaurantData) {
        return (
            <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                    <CardTitle>Restaurant Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
                        <p className="text-red-500">{error || 'Failed to load restaurant data'}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
                <CardTitle>Restaurant Bookings</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">Reserved Restaurants</h3>
                            {restaurantData.bookings.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p className="text-lg mb-2">🍽️ No restaurant bookings yet</p>
                                    <p>We&apos;ll add restaurant reservations closer to the trip date!</p>
                                </div>
                            ) : (
                                restaurantData.bookings.map((booking) => (
                                <div key={booking.id} className="flex flex-col space-y-4 p-4 rounded-lg bg-muted/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-lg">{booking.name}</h4>
                                            <p className="text-sm text-muted-foreground">{booking.cuisine}</p>
                                        </div>
                                        <a
                                            href={booking.restaurantUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:text-primary/80"
                                        >
                                            <ExternalLink className="h-4 w-4"/>
                                        </a>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        {booking.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4"/>
                                                <a href={`tel:${booking.phone}`} className="hover:underline">
                                                    {booking.phone}
                                                </a>
                                            </div>
                                        )}
                                        {booking.address && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4"/>
                                                <a
                                                    href={`https://maps.google.com/?q=${encodeURIComponent(booking.address)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:underline"
                                                >
                                                    {booking.address}
                                                </a>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 mt-4 pt-2 border-t">
                                            <span className="font-medium">Reservation:</span>
                                            <span>{formatDate(booking.date)} at {booking.time}</span>
                                        </div>
                                        {booking.comment && (
                                            <div className="text-sm text-muted-foreground mt-2">
                                                Note: {booking.comment}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                ))
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">Tignes Restaurant Options</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {restaurantData.additionalRestaurants.map((restaurant) => (
                                    <div key={restaurant.id} className="p-4 rounded-lg bg-muted/50">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-medium">{restaurant.name}</h4>
                                                <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                                            </div>
                                            <a
                                                href={restaurant.restaurantUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:text-primary/80"
                                            >
                                                <ExternalLink className="h-4 w-4"/>
                                            </a>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            {restaurant.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4"/>
                                                    <a href={`tel:${restaurant.phone}`} className="hover:underline">
                                                        {restaurant.phone}
                                                    </a>
                                                </div>
                                            )}
                                            {restaurant.address && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4"/>
                                                    <a
                                                        href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline"
                                                    >
                                                        {restaurant.address}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default RestaurantsTab;