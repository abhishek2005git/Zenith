import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../api/axios";

const fetchAPOD = async () => {
    const {data} = await api.get('/api/astronomy/apod');
    return data
}

export const useAPOD = () => {
    return useQuery({
        queryKey: ['apod'],
        queryFn: fetchAPOD,
        refetchInterval: 1000 * 60 * 60 * 24,
        retry: 1
    });
}