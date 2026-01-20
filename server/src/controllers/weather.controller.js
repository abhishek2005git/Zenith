import axios from 'axios';
import getOrSetCache from '../utils/cache.js';

// @desc    Get Cosmic Weather (Solar & Geomagnetic)
// @route   GET /api/weather
const getCosmicWeather = async (req, res) => {
  try {
    const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
    
    // 2. Define Cache Key
    const key = 'weather:cosmic';

    // 3. Wrap logic in getOrSetCache
    const weatherData = await getOrSetCache(key, async () => {
        console.log("Fetching fresh weather data from NASA...");

        // --- DATE LOGIC ---
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        const startDate = thirtyDaysAgo.toISOString().split('T')[0];
        
        // --- API CALLS ---
        const gstUrl = `https://api.nasa.gov/DONKI/GST?startDate=${startDate}&api_key=${API_KEY}`;
        const flrUrl = `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&api_key=${API_KEY}`;

        // Execute requests in parallel
        const [gstRes, flrRes] = await Promise.all([
            axios.get(gstUrl),
            axios.get(flrUrl)
        ]);

        // --- DATA PROCESSING ---
        // Process Geomagnetic Storm (GST)
        const latestStorm = gstRes.data.length > 0 ? gstRes.data[gstRes.data.length - 1] : null;
        // Default to 1 (Calm) if empty
        const kpIndex = latestStorm ? latestStorm.linkedEvents?.[0]?.kpIndex || 2 : 1; 

        // Process Solar Flare
        const latestFlare = flrRes.data.length > 0 ? flrRes.data[flrRes.data.length - 1] : null;
        
        // Construct the clean object
        const cleanData = {
            geomagnetic: {
                kpIndex: Math.round(kpIndex),
                id: latestStorm?.gstID || 'nom-signal',
                startTime: latestStorm?.startTime || new Date(),
            },
            solar: {
                class: latestFlare?.classType || 'B1.0',
                note: latestFlare?.note || 'Solar activity is nominal.',
            },
            status: kpIndex >= 5 ? 'STORM ALERT' : 'NOMINAL',
            color: kpIndex >= 5 ? 'red' : 'green' 
        };

        // CRITICAL: Return the CLEAN object, not the Axios response
        return cleanData;

    }, 3600); // 4. Cache for 1 Hour (3600 seconds)

    res.status(200).json(weatherData);

  } catch (error) {
    console.error("NASA API Error:", error.message);
    // Fallback data
    res.status(200).json({
      geomagnetic: { kpIndex: 1, id: 'offline' },
      solar: { class: 'A0.0' },
      status: 'OFFLINE',
      color: 'gray'
    });
  }
};

export default getCosmicWeather;