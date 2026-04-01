# RescueMap | Real-Time Disaster Coordination Platform

RescueMap is a full-stack emergency response system designed to prioritize life-saving efforts during disasters.

## Features
- **Victim Interface**: One-tap SOS with GPS, severity triage, and situation reporting.
- **Coordinator Dashboard**: Interactive Mapbox-powered view with real-time distress markers, priority-sorted rescue lists, and team assignment.
- **Volunteer Portal**: Localized alerts for nearby citizens to provide immediate aid.
- **AI Triage**: Automated priority scoring based on severity, population, and time elapsed.
- **Real-Time Integration**: Instant updates via WebSockets for all roles.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Mapbox GL JS, Socket.io-client.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a Cloud Atlas URI)
- Mapbox Access Token (for the interactive map)

### Backend Setup
1. `cd rescue-map-server`
2. `npm install`
3. Create a `.env` file with:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/rescuemap
   ```
4. Seed test data: `node seed.js`
5. Start development server: `npm run dev`

### Frontend Setup
1. `cd rescue-map-client`
2. `npm install`
3. Update `mapboxgl.accessToken` in `src/pages/CoordinatorDashboard.jsx` with your key.
4. Start development server: `npm run dev`

## AI Scoring Algorithm
The prioritization score is calculated using the following weights:
- **Severity**: 50% (Critical = 100pts, Trapped = 80pts, etc.)
- **Affected People**: 30% (Up to 10pts per person, capped at 30)
- **Time Elapsed**: 20% (Increases over time to prevent neglect of older alerts)
