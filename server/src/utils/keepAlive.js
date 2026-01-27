import axios from 'axios';

/**
 * Operation: Keep-Warm
 * This utility pings the server's own URL every 14 minutes
 * to prevent Render's free tier from spinning down.
 */
const startKeepAlive = (url) => {
  if (!url) {
    console.error("⚠️ Keep-Alive failed: No URL provided.");
    return;
  }

  console.log(`🛰️ Heartbeat initialized for: ${url}`);

  // Ping every 14 minutes (840,000 ms)
  // Render free tier sleeps after 15 mins of inactivity.
  setInterval(async () => {
    try {
      const response = await axios.get(url);
      console.log(`📡 Heartbeat Sent: Server status ${response.status}`);
    } catch (error) {
      console.error("⚠️ Heartbeat Error:", error.message);
    }
  }, 14 * 60 * 1000); 
};

export default startKeepAlive;