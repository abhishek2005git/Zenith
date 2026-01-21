import * as calendarService from '../services/calendar.service.js';
import SyncedEvent from '../models/SyncedEvent.model.js'; // THE MISSING IMPORT

/**
 * @desc    Sync launch to Google Calendar
 * @route   POST /api/calendar/add-launch
 */
export const syncLaunchEvent = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { launchId, name, net, padLocation, description } = req.body;

        // 1. Check if already synced
        const existingSync = await SyncedEvent.findOne({ userId: req.user._id, launchId });
        if (existingSync) {
            return res.status(400).json({ message: 'Launch already in Flight Plan' });
        }

        // 2. Add to Google Calendar
        const result = await calendarService.addLaunchToCalendar(req.user._id, {
            name,
            net,
            padLocation,
            description
        });

        // 3. Save link to DB for Cron Worker
        await SyncedEvent.create({
            userId: req.user._id,
            launchId,
            googleEventId: result.id,
            lastKnownNet: new Date(net)
        });

        res.status(200).json({ success: true, message: 'Sync Successful' });

    } catch (error) {
        console.error('Calendar Sync Error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Internal Server Error' 
        });
    }
};