import axios from 'axios';

export const getISSLocation = async (req, res) => {
  try {
    const { data } = await axios.get('https://api.wheretheiss.at/v1/satellites/25544');
    res.status(200).json(data);
  } catch (error) {
    console.error("ISS Error:", error.message);
    res.status(500).json({ message: 'Failed to track ISS' });
  }
};