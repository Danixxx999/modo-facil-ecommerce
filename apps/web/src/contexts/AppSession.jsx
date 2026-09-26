import pb from "@/lib/pocketbaseClient.js";

export function AuthProvider({ children }) {
  return children;
}

export function useAuth() {
  return {
    currentAdmin: pb.authStore.model || null,
    isAuthenticated: Boolean(pb.authStore.isValid),
    initialLoading: false,
    logout() {
      pb.authStore.clear();
    },
  };
}
