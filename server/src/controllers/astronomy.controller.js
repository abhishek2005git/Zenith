import axios from "axios"

export const getAPOD = async (req, res) => {
    try {
        const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
        const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
        const {data} = await axios.get(url);

        res.status(200).json(data);

    } catch (error) {
        console.error("APOD error", error.message);
        res.status(500).json({message: 'Failed to fetch astronomy data'});
    }
}