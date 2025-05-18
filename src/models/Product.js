import get from 'lodash/get';

class Product {
  constructor({
    id,
    code,
    title,
    slug,
    size,
    originalPrice,
    salePrice,
    images,
    description,
    createdAt,
    updatedAt,
    category
  }) {
    this.id = id;
    this.code = code;
    this.title = title;
    this.slug = slug;
    this.size = size || [];
    this.originalPrice = originalPrice || 0;
    this.salePrice = salePrice || 0;
    this.images = images || [];
    this.description = description || '';
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.category = category;
  }

  static fromJson(json) {
    if (!json) return null;
    
    return new Product({
      id: get(json, '_id', ''),
      code: get(json, 'code', ''),
      title: get(json, 'title', ''),
      slug: get(json, 'slug', ''),
      size: get(json, 'size', []),
      originalPrice: get(json, 'originalPrice', 0),
      salePrice: get(json, 'salePrice', 0),
      images: get(json, 'images', []),
      description: get(json, 'description', ''),
      createdAt: get(json, 'createdAt', null),
      updatedAt: get(json, 'updatedAt', null),
      category: get(json, 'category', null)
    });
  }

  // Utility methods
  get discount() {
    if (this.originalPrice === this.salePrice || this.originalPrice === 0) return 0;
    return Math.round(((this.originalPrice - this.salePrice) / this.originalPrice) * 100);
  }

  get hasDiscount() {
    return this.originalPrice > this.salePrice;
  }

  get displayImage() {
    return this.images && this.images.length > 0 
      ? this.images[0] 
      : '/placeholder-product.jpg';
  }

  get formattedOriginalPrice() {
    return this.originalPrice.toLocaleString('vi-VN') + 'đ';
  }

  get formattedSalePrice() {
    return this.salePrice.toLocaleString('vi-VN') + 'đ';
  }

  isSizeAvailable(size) {
    return this.size && this.size.includes(size);
  }
}

export default Product;