import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/v1/auth.v1';
import { useAuthStore } from '@/store/auth.store';

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
  });
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth({ accessToken: data.accessToken, refreshToken: data.refreshToken }, data.user);
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
};

export const useAuthUser = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: authApi.me,
    staleTime: 5 * 60 * 1000,
  });
};
