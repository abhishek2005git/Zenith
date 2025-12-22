import { useQuery } from "@tanstack/react-query";
import axios from "axios"

const fetchNextLaunch = async () => {
    const { data } = await axios.get('http://localhost:4000/api/launches/next');
    return data;
}

export const useNextLaunch = () => {
    return useQuery({
        queryKey: ['nextLaunch'],
        queryFn: fetchNextLaunch
    })
}

const fetchUpcoming = async () => {
    const {data} = await axios.get('http://localhost:4000/api/launches/upcoming')
    return data
}

export const useUpcomingLaunches = () => {
    return useQuery({
        queryKey: ['upcomingLaunches'],
        queryFn: fetchUpcoming,
        refetchInterval: 1000 * 60 * 15
    });
}


export const usePastLaunches = () => {
  return useQuery({
    queryKey: ['launches', 'past'],
    queryFn: async () => {
      const { data } = await axios.get('https://ll.thespacedevs.com/2.2.0/launch/previous/?limit=20');
      return data.results;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour (history doesn't change often)
  });
};

const fetchLaunchSchedule = async () => {
    const {data} = await axios.get('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=30');
    return Array.isArray(data.results) ? data.results : [];
}

export const useLaunchSchedule = () => {
    return useQuery({
        queryKey: ['launches', 'schedule'],
        queryFn: fetchLaunchSchedule,
        staleTime: 1000 * 60 * 30,
    })
}