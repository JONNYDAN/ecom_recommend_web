import api from "./api";

export const recommendService = {
  getRecommendedProducts: async (page = 1, limit = 15) => {
    try {
      const response = await api.get("/api/recommendations", {
        params: { limit, page }
      });
      
      if (response.success) {
        return {
          success: true,
          data: response.data, // Giữ nguyên dữ liệu từ API
          count: response.pagination?.total || response.data?.length || 0
        };
      }
    } catch (error) {
      console.log("Cannot get recommendations:", error.message);
    }
    return { success: false, data: [], count: 0 };
  },

  getUserRecommendations: async (userId, page = 1, limit = 15) => {
    try {
      const response = await api.get(`/api/recommendations/user/${userId}`, {
        params: { limit, page }
      });
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          count: response.pagination?.total || response.data?.length || 0
        };
      }
    } catch (error) {
      console.log("Cannot get user recommendations:", error.message);
    }
    return { success: false, data: [], count: 0 };
  },

  // Thêm các phương thức mới
  // Lấy sản phẩm liên quan dựa trên productId
  getProductRecommendations: async (productId, limit = 15) => {
    try {
      const response = await api.get(`/api/recommendations/product/${productId}`, {
        params: { limit }
      });
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          count: response.data?.length || 0
        };
      }
    } catch (error) {
      console.log("Cannot get product recommendations:", error.message);
    }
    return { success: false, data: [], count: 0 };
  },

  // Lấy sản phẩm gợi ý dựa trên cả userId và productId
  getHybridRecommendations: async (userId, productId, limit = 15) => {
    try {
      const response = await api.get(`/api/recommendations/user/${userId}/product/${productId}`, {
        params: { limit }
      });
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          count: response.data?.length || 0
        };
      }
    } catch (error) {
      console.log("Cannot get hybrid recommendations:", error.message);
    }
    return { success: false, data: [], count: 0 };
  }
};