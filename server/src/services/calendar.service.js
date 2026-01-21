import { google } from 'googleapis';
import User from '../models/user.model.js';

const getOAuth2Client = (user) => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "http://localhost:4000/auth/google/callback" 
    );

    oauth2Client.setCredentials({
        access_token: user.accessToken,
        refresh_token: user.refreshToken,
    });

    oauth2Client.on('tokens', async (tokens) => {
        if (tokens.refresh_token) {
            user.refreshToken = tokens.refresh_token;
        }
        user.accessToken = tokens.access_token;
        await user.save();
    });

    return oauth2Client;
};

export const addLaunchToCalendar = async (userId, launchData) => {
    const user = await User.findById(userId);
    if (!user || !user.refreshToken) {
        throw new Error('Refresh Token missing. Please log out and log in again.');
    }

    const auth = getOAuth2Client(user);
    const calendar = google.calendar({ version: 'v3', auth });

    const startTime = new Date(launchData.net);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    const event = {
        summary: `🚀 Zenith Launch: ${launchData.name}`,
        location: launchData.padLocation || 'Orbital Complex',
        description: `${launchData.description}\n\nTracked via Zenith Space Systems.`,
        start: { dateTime: startTime.toISOString(), timeZone: 'UTC' },
        end: { dateTime: endTime.toISOString(), timeZone: 'UTC' },
        reminders: {
            useDefault: false,
            overrides: [{ method: 'popup', minutes: 30 }],
        },
    };

    const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
    });

    return response.data;
};

export const updateCalendarEvent = async (user, googleEventId, newLaunchData) => {
    const auth = getOAuth2Client(user);
    const calendar = google.calendar({ version: 'v3', auth });

    const startTime = new Date(newLaunchData.net);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    await calendar.events.patch({
        calendarId: 'primary',
        eventId: googleEventId,
        resource: {
            start: { dateTime: startTime.toISOString(), timeZone: 'UTC' },
            end: { dateTime: endTime.toISOString(), timeZone: 'UTC' },
        },
    });
};