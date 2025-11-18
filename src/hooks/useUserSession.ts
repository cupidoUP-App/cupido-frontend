import { useQuery } from '@tanstack/react-query';
import { authAPI } from '@/lib/api';
import { useAppStore } from '@/store/appStore';
import { useEffect } from 'react';

export const useUserSession = () => {
  const { login, user: storedUser } = useAppStore();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      // Only fetch if we have a token.
      if (!localStorage.getItem('access_token')) {
        return null;
      }
      try {
        const profileData = await authAPI.getUserProfile();
        return profileData;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // This might happen if the token is invalid/expired.
        // The API interceptor should handle logging out.
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 1, // Retry once on failure
  });

  // Effect to synchronize the fresh data from react-query into the zustand store.
  useEffect(() => {
    if (data?.user) {
      login(data.user);
    }
  }, [data, login]);

  // The hook returns a consistent user object, prioritizing fresh data.
  return { 
    user: data?.user || storedUser, 
    estado: data?.estado,
    isLoading,
    isError,
    refetchUser: refetch,
  };
};
