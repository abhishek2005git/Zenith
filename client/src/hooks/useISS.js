import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchISS = async () => {
    const {data} = await axios.get('http://localhost:4000/api/iss/location');
    return data;
}

export const useISS = () => {
    return useQuery({
        queryKey: ['ISS'],
        queryFn: fetchISS,
        refetchInterval: 5000,
    })
}