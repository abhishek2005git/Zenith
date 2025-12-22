import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchWeather = async () => {
    const {data} = await axios.get('http://localhost:4000/api/weather');
    return data;
}

export const useWeather = () => {
    return useQuery({
        queryKey: ["cosmicWeather"],
        queryFn: fetchWeather,
        refetchInterval: 1000 * 60 * 15
    });
}