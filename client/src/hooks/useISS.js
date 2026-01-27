import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../api/axios";

const fetchISS = async () => {
    const {data} = await api.get('/api/iss/location');
    return data;
}

export const useISS = () => {
    return useQuery({
        queryKey: ['ISS'],
        queryFn: fetchISS,
        refetchInterval: 5000,
    })
}