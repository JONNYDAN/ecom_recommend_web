import React from 'react';
import Image from "next/image";
import styles from '../styles/ProductGrid.module.css';

const ProductGrid = ({ products }) => {
  return (
    <div className={styles.productGrid}>
      {products.map(product => (
        <div key={product.id} className={styles.productCard}>
          <div className="p-3 bg-white rounded shadow-sm">
            <div className="product-image mb-3">
              <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
                className="w-100 h-auto"
              />
            </div>
            <h5 className="product-name mb-2">{product.name}</h5>
            <div className="price-info">
              <del className="original-price text-muted">
                {product.originalPrice.toLocaleString()}đ
              </del>
              <div className="discount text-danger">
                Giảm {product.discount}%
              </div>
              <div className="remaining-price">
                Chỉ còn {product.remainingPrice.toLocaleString()}đ
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;