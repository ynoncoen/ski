import { describe, it, expect } from 'vitest'
import { getRestaurantNotificationDates } from '../src/config/trip-dates'

function isWithinNotificationPeriod(testDate: Date): boolean {
    const today = testDate || new Date();
    const { startDate, endDate } = getRestaurantNotificationDates();
    
    return today >= startDate && today <= endDate;
}

describe('Notification Date Logic', () => {
    const testDates = [
        { date: new Date('2026-12-12T12:00:00Z'), expected: false, description: 'Day before notification period starts' },
        { date: new Date('2027-01-01T00:00:00Z'), expected: true, description: 'First day of notification period' },
        { date: new Date('2027-01-02T12:00:00Z'), expected: true, description: 'Trip start date' },
        { date: new Date('2027-01-05T12:00:00Z'), expected: true, description: 'During trip' },
        { date: new Date('2027-01-09T23:59:59Z'), expected: true, description: 'Trip end date' },
        { date: new Date('2027-01-25T00:00:00Z'), expected: false, description: 'Day after trip ends' },
    ];

    describe('Notification Period Logic', () => {
        testDates.forEach(({ date, expected, description }) => {
            it(`should ${expected ? 'send' : 'not send'} notifications: ${description}`, () => {
                const result = isWithinNotificationPeriod(date);
                expect(result).toBe(expected);
            });
        });
    });

    describe('Date Configuration', () => {
        it('should have valid notification dates configuration', () => {
            const { startDate, endDate } = getRestaurantNotificationDates();
            
            expect(startDate).toBeDefined();
            expect(endDate).toBeDefined();
            expect(startDate.getTime()).toBeLessThan(endDate.getTime());
        });

        it('should cover the expected notification period', () => {
            const { startDate, endDate } = getRestaurantNotificationDates();
            
            // Should start on January 10, 2026
            expect(startDate.getFullYear()).toBe(2026);
            expect(startDate.getMonth()).toBe(0); // January (0-indexed)
            expect(startDate.getDate()).toBe(10);
            
            // Should end on January 24, 2026
            expect(endDate.getFullYear()).toBe(2026);
            expect(endDate.getMonth()).toBe(0); // January (0-indexed)
            expect(endDate.getDate()).toBe(24);
        });
    });

    describe('Edge Cases', () => {
        it('should handle start of notification period correctly', () => {
            const startOfPeriod = new Date('2026-01-10T00:00:00Z');
            expect(isWithinNotificationPeriod(startOfPeriod)).toBe(true);
        });

        it('should handle end of notification period correctly', () => {
            const endOfPeriod = new Date('2026-01-24T23:59:59Z');
            expect(isWithinNotificationPeriod(endOfPeriod)).toBe(true);
        });

        it('should handle time just before notification period', () => {
            const beforePeriod = new Date('2026-01-09T23:59:59Z');
            expect(isWithinNotificationPeriod(beforePeriod)).toBe(false);
        });

        it('should handle time just after notification period', () => {
            const afterPeriod = new Date('2026-01-25T00:00:00Z');
            expect(isWithinNotificationPeriod(afterPeriod)).toBe(false);
        });
    });

    describe('Notification Coverage', () => {
        it('should cover the full trip duration', () => {
            const tripStart = new Date('2026-01-17T12:00:00Z');
            const tripEnd = new Date('2026-01-24T12:00:00Z');
            
            expect(isWithinNotificationPeriod(tripStart)).toBe(true);
            expect(isWithinNotificationPeriod(tripEnd)).toBe(true);
        });

        it('should include pre-trip notification period', () => {
            const preTripDate = new Date('2026-01-15T12:00:00Z');
            expect(isWithinNotificationPeriod(preTripDate)).toBe(true);
        });

        it('should have 15 days total notification period', () => {
            const { startDate, endDate } = getRestaurantNotificationDates();
            const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            
            expect(daysDiff).toBe(15); // Jan 10-24 is 15 days inclusive
        });
    });
});
