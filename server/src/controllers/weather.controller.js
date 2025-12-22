import axios from 'axios';

// @desc    Get Cosmic Weather (Solar & Geomagnetic)
// @route   GET /api/weather
// @access  Public
const getCosmicWeather = async (req, res) => {
  try {
    const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

    // 1. DYNAMIC DATE LOGIC (Fixes the speed issue)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    // Format to YYYY-MM-DD for NASA API
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];
    
    // 2. Updated URLs with dynamic date
    const gstUrl = `https://api.nasa.gov/DONKI/GST?startDate=${startDate}&api_key=${API_KEY}`;
    const flrUrl = `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&api_key=${API_KEY}`;

    // ... (Keep the rest of your Promise.all and processing logic the same) ...
    const [gstRes, flrRes] = await Promise.all([
      axios.get(gstUrl),
      axios.get(flrUrl)
    ]);

    // --- DATA PROCESSING ---
    // NASA returns generic arrays. We need to find the *most recent* relevant event.
    
    // Process Geomagnetic Storm (GST)
    const latestStorm = gstRes.data.length > 0 ? gstRes.data[gstRes.data.length - 1] : null;
    const kpIndex = latestStorm ? latestStorm.linkedEvents?.[0]?.kpIndex || 2 : 1; // Default to 1 (Calm) if empty

    // Process Solar Flare
    const latestFlare = flrRes.data.length > 0 ? flrRes.data[flrRes.data.length - 1] : null;
    
    // Clean up the data for the Frontend
    const weatherData = {
      // 1. Geomagnetic Status
      geomagnetic: {
        kpIndex: Math.round(kpIndex), // Round to nearest integer (0-9)
        id: latestStorm?.gstID || 'nom-signal',
        startTime: latestStorm?.startTime || new Date(),
      },
      
      // 2. Solar Status
      solar: {
        class: latestFlare?.classType || 'B1.0', // e.g., "M1.2" or default calm "B1.0"
        note: latestFlare?.note || 'Solar activity is nominal.',
      },
      
      // 3. Derived "System Status" (Logic for the UI Text)
      status: kpIndex >= 5 ? 'STORM ALERT' : 'NOMINAL',
      color: kpIndex >= 5 ? 'red' : 'green' 
    };

    res.status(200).json(weatherData);

  } catch (error) {
    console.error("NASA API Error:", error.message);
    // Fallback data so the UI doesn't crash if NASA is down
    res.status(200).json({
      geomagnetic: { kpIndex: 1, id: 'offline' },
      solar: { class: 'A0.0' },
      status: 'OFFLINE',
      color: 'gray'
    });
  }
};

export default getCosmicWeather