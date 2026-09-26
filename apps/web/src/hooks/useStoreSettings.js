const currentSettings = { shippingCost: 0 };
export const useSettings = () => ({
  settings: currentSettings,
  loading: false,
  error: null,
  refetch: async () => currentSettings,
  updateSettings: async (data = {}) => ({ ...currentSettings, ...data, shippingCost: 0 }),
});
