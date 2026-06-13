import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Building2, Calendar } from 'lucide-react';
import { TRIP_CONFIG } from '@/config/trip-dates';

const TravelDetailsTab: React.FC = () => {
    const outboundFlight = {
        flightNumber: 'ISRAIR 6H143',
        departure: 'Tel Aviv (TLV)',
        departureTime: TRIP_CONFIG.OUTBOUND_FLIGHT.TIME,
        arrival: 'Grenoble (GNB)',
        arrivalTime: '13:20'
    };

    const returnFlight = {
        flightNumber: 'ISRAIR 6H144',
        departure: 'Grenoble (GNB)',
        departureTime: TRIP_CONFIG.RETURN_FLIGHT.TIME,
        arrival: 'Tel Aviv (TLV)',
        arrivalTime: '19:30'
    };

    const createGoogleCalendarUrl = (flight: { flightNumber: string; departure: string; departureTime: string; arrival: string; arrivalTime: string }, date: string) => {
        const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
        
        // Parse the date and time
        const flightDate = new Date(date);
        const [hours, minutes] = flight.departureTime.split(':');
        flightDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        // Calculate arrival time (4.5 hours flight duration)
        const arrivalDate = new Date(flightDate.getTime() + (4.5 * 60 * 60 * 1000));
        
        // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
        const formatDate = (date: Date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        const startTime = formatDate(flightDate);
        const endTime = formatDate(arrivalDate);
        
        const title = encodeURIComponent(`${flight.flightNumber} - ${flight.departure} to ${flight.arrival}`);
        const location = encodeURIComponent(`${flight.departure} - ${flight.arrival}`);
        const details = encodeURIComponent(
            `Flight: ${flight.flightNumber}\n` +
            `Departure: ${flight.departure} at ${flight.departureTime}\n` +
            `Arrival: ${flight.arrival}\n` +
            `Estimated Duration: 4.5 hours`
        );
        
        return `${baseUrl}&text=${title}&dates=${startTime}/${endTime}&location=${location}&details=${details}`;
    };

    const handleAddToCalendar = (flight: { flightNumber: string; departure: string; departureTime: string; arrival: string; arrivalTime: string }, date: string) => {
        const url = createGoogleCalendarUrl(flight, date);
        window.open(url, '_blank');
    };

    const createVacationCalendarUrl = () => {
        const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
        
        // All-day event from trip start to end
        const startDate = TRIP_CONFIG.GOOGLE_CALENDAR.START_DATE;
        const endDate = TRIP_CONFIG.GOOGLE_CALENDAR.END_DATE; // End date is exclusive in Google Calendar
        
        const title = encodeURIComponent('Vacation - Skiing in Tignes');
        const location = encodeURIComponent('Tignes, France');
        const details = encodeURIComponent(
            'Skiing vacation in Tignes, France\n' +
            'Staying at Tignes Val Claret\n' +
            'Out of office - skiing in the French Alps'
        );
        
        return `${baseUrl}&text=${title}&dates=${startDate}/${endDate}&location=${location}&details=${details}`;
    };

    const handleAddAllToCalendar = () => {
        // Open outbound flight
        const outboundUrl = createGoogleCalendarUrl(outboundFlight, TRIP_CONFIG.OUTBOUND_FLIGHT.DATE);
        window.open(outboundUrl, '_blank');
        
        // Open return flight with a small delay
        setTimeout(() => {
            const returnUrl = createGoogleCalendarUrl(returnFlight, TRIP_CONFIG.RETURN_FLIGHT.DATE);
            window.open(returnUrl, '_blank');
        }, 500);
        
        // Open vacation event with a small delay
        setTimeout(() => {
            const vacationUrl = createVacationCalendarUrl();
            window.open(vacationUrl, '_blank');
        }, 1000);
    };

    const handleAddVacationToCalendar = () => {
        const url = createVacationCalendarUrl();
        window.open(url, '_blank');
    };

    const accommodation = {
        name: 'Residence Ynycio Val Claret',
        checkIn: TRIP_CONFIG.ACCOMMODATION.CHECK_IN,
        checkOut: TRIP_CONFIG.ACCOMMODATION.CHECK_OUT,
        duration: TRIP_CONFIG.ACCOMMODATION.DURATION,
        roomType: '4-person apartment with spa'
    };

    return (
        <div className="space-y-6">
            <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Plane className="h-6 w-6" />
                        <CardTitle>Flight Details</CardTitle>
                    </div>
                    <Button 
                        onClick={handleAddAllToCalendar}
                        className="flex items-center gap-2 bg-black hover:bg-gray-400 text-white"
                        variant="outline"
                    >
                        <Calendar className="h-4 w-4" />
                        <span className="hidden sm:inline">Add All to Calendar</span>
                        <span className="sm:hidden">Add</span>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="border-b pb-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg">Outbound Flight - {TRIP_CONFIG.ACCOMMODATION.CHECK_IN}</h3>
                                <Button 
                                    onClick={() => handleAddToCalendar(outboundFlight, TRIP_CONFIG.OUTBOUND_FLIGHT.DATE)}
                                    size="sm"
                                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-500"
                                    variant="outline"
                                >
                                    <Calendar className="h-4 w-4" />
                                    <span className="hidden sm:inline">Add to Calendar</span>
                                    <span className="sm:hidden">Add</span>
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span>Flight Number:</span>
                                    <span>{outboundFlight.flightNumber}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Departure:</span>
                                    <span>{outboundFlight.departure} - {outboundFlight.departureTime}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Arrival:</span>
                                    <span>{outboundFlight.arrival} - {outboundFlight.arrivalTime}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg">Return Flight - {TRIP_CONFIG.ACCOMMODATION.CHECK_OUT}</h3>
                                <Button 
                                    onClick={() => handleAddToCalendar(returnFlight, TRIP_CONFIG.RETURN_FLIGHT.DATE)}
                                    size="sm"
                                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-500"
                                    variant="outline"
                                >
                                    <Calendar className="h-4 w-4" />
                                    <span className="hidden sm:inline">Add to Calendar</span>
                                    <span className="sm:hidden">Add</span>
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span>Flight Number:</span>
                                    <span>{returnFlight.flightNumber}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Departure:</span>
                                    <span>{returnFlight.departure} - {returnFlight.departureTime}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Arrival:</span>
                                    <span>{returnFlight.arrival} - {returnFlight.arrivalTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Building2 className="h-6 w-6" />
                        <CardTitle>Accommodation</CardTitle>
                    </div>
                    <Button 
                        onClick={handleAddVacationToCalendar}
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-500"
                        variant="outline"
                    >
                        <Calendar className="h-4 w-4" />
                        <span className="hidden sm:inline">Add Vacation to Calendar</span>
                        <span className="sm:hidden">Add</span>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">{accommodation.name}</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span>Check-in:</span>
                                <span>{accommodation.checkIn}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Check-out:</span>
                                <span>{accommodation.checkOut}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Duration:</span>
                                <span>{accommodation.duration}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Room Type:</span>
                                <span>{accommodation.roomType}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center space-x-2">
                    <Building2 className="h-6 w-6" />
                    <CardTitle>Destination Info</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Tignes</h3>
                        <div className="space-y-3 text-sm">
                            <p>
                                <strong>Resort:</strong> Combining the rugged, high-altitude glacier skiing of Tignes with the traditional alpine charm and sophisticated luxury of Val d&#39;Is&grave;re, 
                                this legendary combined resort offers an unparalleled 300 kilometers of interconnected winter playground. Seamlessly linking two of the world&#39;s most iconic ski destinations, 
                                it serves up a flawless mix of world-class high-consequence terrain, guaranteed snow conditions, and an unforgettable après-ski atmosphere.
                            </p>
                            <p>
                                <strong>Tignes Val Claret:</strong> Perched at an ultra-high altitude of 2,150 meters, Tignes Val Claret is the 
                                ultimate ski-in/ski-out hub offering instant access to 300 kilometers of snow-sure slopes across the world-class Tignes-Val Val d&#39;Is&grave;re domain. 
                                By day, carve your way down the iconic Grande Motte glacier, and by night, immerse yourself in the village's legendary aprés-ski scene and vibrant 
                                alpine nightlife.
                            </p>
                            <p>
                                <strong>Skiing:</strong> Access to 200km+ of slopes in Tignes plus connection to Val d&#39;Is&grave;re. 
                                Suitable for all levels with excellent off-piste opportunities.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TravelDetailsTab;