import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

const fetchWeather = async () => {
    const {data} = await api.get('/api/weather');
    return data;
}

export const useWeather = () => {
    return useQuery({
        queryKey: ["cosmicWeather"],
        queryFn: fetchWeather,
        refetchInterval: 1000 * 60 * 15
    });
}