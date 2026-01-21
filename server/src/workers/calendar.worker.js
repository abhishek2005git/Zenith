import cron from 'node-cron';
import axios from 'axios';
import SyncedEvent from '../models/SyncedEvent.model.js';
import User from '../models/user.model.js';
import { updateCalendarEvent } from '../services/calendar.service.js';

/**
 * Zenith Orbital Sync Worker
 * Runs every hour (0 * * * *)
 * Why: To ensure user calendars stay in sync with shifting launch windows.
 */
export const initCalendarWorker = () => {
    // Schedule: Runs at minute 0 of every hour
    cron.schedule('0 * * * *', async () => {
        console.log('⚙️ [CRON] Starting Orbital Audit: Checking for schedule shifts...');
        
        try {
            // 1. Fetch all missions that users have added to their calendars
            // We use .populate('userId') to get the Refresh Tokens we saved earlier
            const syncedEvents = await SyncedEvent.find().populate('userId');

            if (syncedEvents.length === 0) {
                console.log('⚙️ [CRON] No active syncs found. Worker returning to standby.');
                return;
            }

            for (const event of syncedEvents) {
                // 2. Fetch the LATEST telemetry for this specific launch
                const response = await axios.get(`https://ll.thespacedevs.com/2.2.0/launch/${event.launchId}/`);
                const latestNet = new Date(response.data.net);

                // 3. Compare: Did the date change since we last synced?
                const hasShifted = latestNet.getTime() !== event.lastKnownNet.getTime();

                if (hasShifted) {
                    console.log(`🕒 [SHIFT DETECTED] Launch ${event.launchId} has moved. Updating User ${event.userId.displayName}...`);
                    
                    // 4. Use our "Power of Attorney" (Refresh Token) to update Google
                    await updateCalendarEvent(event.userId, event.googleEventId, {
                        net: latestNet,
                        description: `UPDATED: ${response.data.mission?.description || 'Schedule shifted by agency.'}`
                    });

                    // 5. Update our internal record so we don't repeat this until it moves again
                    event.lastKnownNet = latestNet;
                    await event.save();
                    
                    console.log(`✅ [SYNC COMPLETE] Calendar updated for ${event.launchId}`);
                }
            }
        } catch (error) {
            console.error('❌ [CRON ERROR]:', error.message);
        }
    });
};