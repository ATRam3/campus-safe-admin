import api from "./api";

export const dangerZonesService = {
  // Get all danger zones
  getAllZones: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/danger-area?${queryParams}`);
  },

  // Create new danger zone
  createZone: (zoneData) => {
    return api.post("/danger-area", zoneData);
  },

  // Update danger zone (Note: Your API doesn't have update, we'll need to add it or work around)
  updateZone: (zoneId, data) => {
    return api.put(`/danger-area/${zoneId}`, data);
  },

  // Delete danger zone
  deleteZone: (zoneId) => {
    return api.delete(`/danger-area/${zoneId}`);
  },

  // Get zone by ID (if needed)
  getZoneById: (zoneId) => {
    return api.get(`/danger-area/${zoneId}`);
  },
};
