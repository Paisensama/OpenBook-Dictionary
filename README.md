# OpenBook-Dictionary

Expo React Native app for the OpenBook dictionary project.

## Features

- Dictionary lookup flow with tab-based navigation
- Word history and favorites
- Word-play and benchmark screens
- Local persistence for dictionary state
- Unit tests for core algorithms and reducers

## Tech Stack

- Expo SDK 54
- React Native
- Expo Router
- TypeScript
- Jest (`jest-expo`)

## Get Started

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npx expo start
```

## Scripts

```bash
npm run lint
npm test
```

## Build (Android)

Run diagnostics before building:

```bash
npx expo-doctor
```

Build with EAS:

```bash
eas build -p android --profile preview --clear-cache
```
