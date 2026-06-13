# Test Suite

This directory contains test scripts for the ski trip planning application using Vitest as the testing framework.

## Test Framework

We use **Vitest** with TypeScript for modern, fast testing:
- Native TypeScript support
- Jest-compatible API
- Fast execution with Vite
- Built-in test runner with watch mode

## Test Files

### `restaurant-notification.test.ts`
Tests the restaurant notification system that sends daily reminders about dinner reservations.

**What it tests:**
- Notification timing (Jan 10-24, 2026)
- Restaurant booking lookup logic
- "No restaurant" notifications when no booking exists
- Proper formatting of restaurant reminder messages
- Date-based notification filtering

### `travel-details-google-calendar.test.ts`
Tests the Google Calendar integration functionality for adding flight and vacation events.

**What it tests:**
- Google Calendar URL generation for outbound/return flights
- Vacation event creation (7-day, all-day event)
- Flight duration calculation (4.5 hours)
- URL parameter encoding and formatting
- Date/time conversion for Google Calendar format
- "Add All to Calendar" button functionality

### `weather-notification-timing.test.ts`
Tests the weather notification timing system that sends daily snow reports.

**What it tests:**
- Notification window timing (1 month before trip until trip end)
- Daily weather notification content
- Proper date range validation (Dec 17, 2025 - Jan 24, 2026)
- Edge case handling for notification boundaries
- Weather data formatting and snow condition reporting

### `test-date-logic.test.ts`
Validates the core date logic used by the notification systems.

**What it tests:**
- Notification period boundaries
- Date comparison logic
- Trip date configuration validation
- Edge cases for notification timing

## Running Tests

### Development Commands

```bash
# Run all tests once
npm run test:run

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with UI interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run tests (interactive mode)
npm test
```

### Individual Test Files

```bash
# Run specific test file
npx vitest run tests/restaurant-notification.test.ts

# Run tests matching pattern
npx vitest run --grep "notification"
```

## Test Coverage

The current test suite covers:
- ✅ Restaurant notification system (8 tests)
- ✅ Weather notification timing (21 tests)
- ✅ Google Calendar integration (13 tests)
- ✅ Date logic validation (16 tests)
- ✅ Trip configuration validation
- ✅ URL parameter formatting
- ✅ Flight duration calculations
- ✅ Edge cases and boundary conditions

**Total: 58 tests**

## CI/CD Integration

Tests are automatically run on:
- Every push to main branch
- Every pull request
- Before deployment via GitHub Actions

The CI pipeline will:
1. Run all tests
2. Run linter
3. Build the project
4. Deploy only if all tests pass

## Test Approach

These tests use modern testing practices with:
- TypeScript for type safety
- Vitest for fast execution
- Describe/it blocks for organized test structure
- Expect assertions for validation
- Mock functions for isolated testing
- Comprehensive edge case coverage

The tests validate core functionality without external dependencies and provide detailed feedback on failures.

## Trip Configuration

**Trip Dates:** January 17-24, 2026  
**Notification Period:** January 10-24, 2026 (1 week before until trip end)  
**Weather Notifications:** December 17, 2025 - January 24, 2026 (1 month before until trip end)  
**Destination:** Tignes