import { useQuery } from '@tanstack/react-query';
import { getStats } from '../services/api';

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
};
