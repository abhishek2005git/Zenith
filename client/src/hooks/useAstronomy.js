import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchAPOD = async () => {
    const {data} = await axios.get('http://localhost:4000/api/astronomy/apod');
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