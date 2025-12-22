import axios from "axios"
import { json } from "express";


export const getNextLaunch = async (req, res) => {
    try {
        const response = await axios.get('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1', {
            headers: { 'User-Agent': 'Zenith-Project/1.0' } 
        });
        const launchData = response.data.results[0];

        // SAFETY CHECK: The Space Devs API structure is deep. 
        // We use optional chaining (?.) everywhere to prevent crashes if data is missing.
        const cleanedData = {
        id: launchData.id,
        name: launchData.name,
        net: launchData.net,
        status: launchData.status?.name || 'Unknown',
        statusDescription: launchData.status?.description, // e.g. "Launch is Go"
        agency: launchData.launch_service_provider?.name || 'Unknown',
        agencyLogo: launchData.launch_service_provider?.logo_url, // For fallback UI
        rocketImage: launchData.image, 
        pad: launchData.pad?.name,
        location: launchData.pad?.location?.name,
        
        // NEW FIELDS FOR DRAWER
        missionDescription: launchData.mission?.description || "No mission description declassified for this launch.",
        missionType: launchData.mission?.type || "Classified",
        orbit: launchData.mission?.orbit?.name || "LEO",
        
        // Video: They return a list of objects, we take the first one
        videoUrl: launchData.vidURLs?.[0]?.url || null,
        
        // Rocket Specs
        rocketName: launchData.rocket?.configuration?.name,
        rocketFamily: launchData.rocket?.configuration?.family,
        };

        res.status(200).json(cleanedData);
        
    } catch (error) {
        console.error(`Launch Controller error : ${error.message}`);
        res.status(500).json({message: "Server error : could not fetch the data"})
    }
}

export const getUpcomingLaunches = async (req, res) => {
    try {
        const response = await axios.get('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10&ordering=net', {
            headers: { 'User-Agent': 'Zenith-Project/1.0' } 
        });

        const launches = response.data.results.map((launch) => ({
            id: launch.id,
            name: launch.name,
            net: launch.net,
            status: launch.status.abbrev, // e.g., "Go", "TBC"
            agency: launch.launch_service_provider?.name || 'Unknown',
            location: launch.pad?.location?.name || 'Unknown',
            missionType: launch.mission?.type || 'Resupply',
        }))
        res.status(200).json(launches);

    } catch (error) {
        console.error("Error fetching timelines:", error.message);
        res.status(500).json({message: "Server Error"})
    }
}
