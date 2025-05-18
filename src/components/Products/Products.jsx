import React from "react";
import { Row, Col } from "rsuite";
import Image from "next/image";

const Products = ({ products }) => {
  return (
    <div className="products-container">
      <Row>
        {products.map((product) => (
          <Col xs={12} sm={6} md={6} lg={4} className="product-col" key={product.id}>
            <div className="product-card mx-1 my-2 p-3 bg-white rounded shadow-sm">
              <div className="product-image mb-3 d-flex justify-content-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-80 h-auto"
                  style={{ objectFit: 'contain' }}
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
          </Col>
        ))}
      </Row>

      <style jsx>{`
        .product-card {
          transition: all 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .price-info {
          font-size: 0.9rem;
        }
        .remaining-price {
          font-weight: 600;
          color: #2ecc71;
        }
        .original-price {
          font-size: 0.85rem;
        }
        .products-container {
          width: 100%;
        }
        :global(.product-image img) {
          object-fit: contain !important;
          max-width: 100%;
          height: auto;
        }
        /* Custom CSS for 5 items per row */
        :global(.product-col) {
          width: 20%;
          flex: 0 0 20%;
          max-width: 20%;
        }
        /* Responsive adjustments */
        @media (max-width: 992px) {
          :global(.product-col) {
            width: 25%;
            flex: 0 0 25%;
            max-width: 25%;
          }
        }
        @media (max-width: 768px) {
          :global(.product-col) {
            width: 33.333%;
            flex: 0 0 33.333%;
            max-width: 33.333%;
          }
        }
        @media (max-width: 576px) {
          :global(.product-col) {
            width: 50%;
            flex: 0 0 50%;
            max-width: 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default Products;