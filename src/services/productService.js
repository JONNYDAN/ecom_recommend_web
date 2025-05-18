import api, { customReponseTypeApi } from "./api";
import Product from "@/models/Product";

const productService = {
  // Get all products with pagination and optional category filter
  getAllProducts: async (page = 1, limit = 20, category = null) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (category && category !== 'all') queryParams.append('category', category);
      
      const response = await api.get(`/api/products?${queryParams.toString()}`);

      if (response.success) {
        return {
          success: true,
          data: Array.isArray(response.data) ? response.data.map(item => Product.fromJson(item)) : [],
          count: response.count
        };
      }
    } catch (error) {
      console.log("Cannot get products:", error.message);
    }

    return { success: false, data: [], count: 0 };
  },

  // Get products by category
  getProductsByCategory: async (category, page = 1, limit = 20) => {
    return productService.getAllProducts(page, limit, category);
  },

  // Get a product by its slug
  getProductBySlug: async (slug) => {
    try {
      const response = await api.get(`/api/products/${slug}`);

      if (response.success) {
        return {
          success: true,
          data: Product.fromJson(response.data)
        };
      }
    } catch (error) {
      console.log("Cannot get product details:", error.message);
    }

    return { success: false, data: null };
  },

  // Calculate discount percentage
  calculateDiscount: (originalPrice, salePrice) => {
    if (originalPrice > salePrice) {
      return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    }
    return 0;
  },

  // Format products for display
  formatProductsForDisplay: (products) => {
    if (!products || !Array.isArray(products)) return [];
    
    return products.map(product => {
      // If product is already a Product instance, use its properties
      if (product instanceof Product) {
        return {
          id: product.id,
          title: product.title,
          images: product.images,
          originalPrice: product.originalPrice,
          size: product.size,
          salePrice: product.salePrice,
          remainingPrice: product.salePrice || product.originalPrice,
          discount: product.discount,
          slug: product.slug
        };
      }
      
      // Otherwise, use the old format
      return {
        id: product._id,
        title: product.title,
        images: product.images,
        originalPrice: product.originalPrice,
        size: product.size,
        salePrice: product.salePrice,
        remainingPrice: product.salePrice || product.originalPrice,
        discount: productService.calculateDiscount(product.originalPrice, product.salePrice),
        slug: product.slug
      };
    });
  }
};

export { productService };
export default productService;