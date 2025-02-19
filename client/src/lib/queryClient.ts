import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Disable network-related features since we're using mock data
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: Infinity,
    },
    mutations: {
      retry: false,
    },
  },
});

// Mock API request function for frontend-only development
export async function mockApiRequest<T>(
  _method: string,
  _url: string,
  _data?: unknown
): Promise<T> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {} as T;
}