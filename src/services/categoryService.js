import { API_URL } from '@/config/constants';

export const categoryService = {
  // Get all categories
  async getAllCategories() {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { success: false, message: error.message };
    }
  }
};
