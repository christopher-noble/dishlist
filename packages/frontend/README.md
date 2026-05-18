# Dishlist Mobile Client

Track your meals, discover new dishes, and never think about dinner again.

This is a React Native mobile application built with Expo, serving both Android and iOS platforms.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the development server:

   ```bash
   pnpm start
   ```

3. Run on your preferred platform:
   - **Android**: Press `a` to open Android emulator
   - **iOS**: Press `i` to open iOS simulator
   - **Physical Device**: Scan the QR code with Expo Go app

## Architecture

This project follows a feature-based architecture pattern with high separation of concerns:

- **Feature-Based Structure**: Each feature is self-contained in `src/features/`
- **Shared Code**: Common utilities and components in `src/shared/`
- **TypeScript**: Fully typed with strict mode enabled
- **Expo Router**: File-based routing for navigation

## Development

The app uses Expo Router for navigation and follows React Native best practices. All business logic is organized into feature modules with clear boundaries and public APIs.

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Router** for navigation
- **Feature-based architecture** for scalability
