# ZENITH | Orbital Command Center 🚀

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC.svg)
![Status](https://img.shields.io/badge/Mission_Status-Operational-green.svg)

**Zenith** is a next-generation space dashboard designed for space enthusiasts, mission controllers, and astronomers. It provides a real-time "Command Center" interface to track human spaceflight, monitor cosmic weather, and visualize orbital telemetry in 3D.

> *"The ultimate interface for the modern space age."*

---

## ✨ Key Features

### 1. 🎛️ Main Dashboard (The Bridge)
* **Hero Launch Countdown:** Live T-Minus countdown for the next major rocket launch with dynamic background imagery.
* **Planetary Defense (Cosmic Weather):** Real-time data on Solar Wind, KP Index, and Aurora forecasts.
* **Flight Timeline:** Compact vertical list of the next 10 launches with status indicators (Go, TBD, Hold).
* **2D ISS Map:** Quick-look map showing the current ground track of the International Space Station.

### 2. 🗃️ Mission Archives
* **Searchable Database:** Filter missions by rocket (Falcon 9, Electron), agency (SpaceX, NASA), or mission name.
* **Smart Fallbacks:** Intelligent image selection for missions without official photos (auto-detects Rocket Lab, Soyuz, Long March, etc.).
* **Dual Views:** Toggle between **Upcoming Launches** and **Past Mission History**.
* **Mission Drawer:** Slide-out command panel with telemetry, launch pad location, and embedded live video streams.

### 3. 🌍 Orbital Command (Tracking)
* **3D Interactive Globe:** A stunning, full-screen WebGL Earth visualization using `react-globe.gl`.
* **Real-Time Telemetry:** Live tracking of the ISS with altitude, velocity, and coordinates updated every second.
* **Day/Night Cycle:** Visual representation of the terminator line (day vs. night) on the globe surface.

### 4. 🗓️ Tactical Schedule
* **Monthly Grid:** A "Glassmorphism" calendar view of the entire month's launch window.
* **Status Beacons:** Color-coded indicators for mission status (🟢 Green: Go, 🟡 Yellow: TBD/Hold).
* **Daily Manifest:** Click any date to reveal a detailed manifest of missions scheduled for that specific window.

---

## 🛠️ Tech Stack

**Frontend:**
* **React (Vite):** Blazing fast UI rendering.
* **Tailwind CSS:** Utility-first styling for the "Control Room" dark mode aesthetic.
* **React Router:** Seamless client-side navigation.
* **TanStack Query (React Query):** Robust data fetching, caching, and state management.
* **Framer Motion:** Smooth animations and page transitions.

**Visualization:**
* **React Globe GL:** 3D Earth rendering.
* **Leaflet / React-Leaflet:** 2D mapping solutions.
* **Recharts:** Data visualization (telemetry graphs).
* **Lucide React:** Beautiful, consistent iconography.

**Data Sources:**
* **The Space Devs API:** Launch schedules, rocket data, and agency details.
* **Where The ISS At?:** Real-time orbital coordinates.

---

## 🚀 Installation & Setup

Follow these steps to deploy your own command center locally.

### Prerequisites
* Node.js (v16.0.0 or higher)
* npm or yarn

### Steps
1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/zenith-dashboard.git](https://github.com/your-username/zenith-dashboard.git)
    cd zenith-dashboard
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables**
    *(Optional: If you plan to scale, you might need API keys for The Space Devs, but the free tier works out of the box).*
    ```env
    VITE_API_URL=[https://ll.thespacedevs.com/2.2.0](https://ll.thespacedevs.com/2.2.0)
    ```

4.  **Ignition (Run Locally)**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

---

## 📂 Project Structure

```bash
src/
├── components/
│   ├── dashboard/       # Dashboard widgets (Hero, Weather, Timeline)
│   ├── layout/          # Sidebar, Header, Global Layouts
│   └── ui/              # Reusable UI elements (Cards, Buttons)
├── hooks/               # Custom React Hooks (useLaunches, useISS)
├── pages/               # Main Views (Dashboard, Missions, Tracking, Schedule)
├── assets/              # Static assets (Images, Icons)
└── App.jsx              # Main Router & Layout Logic

🔮 Future Roadmap
[ ] User Accounts: "Commander Profiles" to save favorite missions and launch providers.

[ ] Notification System: Browser push notifications for T-10 minute warnings.

[ ] Multi-Satellite Tracking: Add Hubble, Starlink trains, and Tiangong station to the 3D globe.

[ ] Mobile App: React Native port for pocket command capabilities.

🤝 Contributing
Contributions are welcome, Commander! Please fork the repository and create a pull request for any feature upgrades or bug fixes.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request