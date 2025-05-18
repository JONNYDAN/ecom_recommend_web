import React, { useState, useEffect } from "react";
import { Row, Col, Button, Pagination } from "rsuite";
import Image from "next/image";
import Link from "next/link";
import { MdAddShoppingCart, MdAdd } from "react-icons/md";
import { useCart } from '@/contexts/CartContext';

const PaginatedProducts = ({ products = [], total, limit, onChangePage = () => {} }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(total / limit);

  // Reset to page 1 if products, total, or limit changes
  useEffect(() => {
    setCurrentPage(1);
  }, [total, limit, products.length]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
    onChangePage(page);
  };
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    // Make sure we handle the case where size might not be an array
    const firstSize = Array.isArray(product.size) && product.size.length > 0 
      ? product.size[0] 
      : 'default';
    console.log('log-30 product', product);
    addToCart(product, firstSize, 1);
  };

  // Paginate the products
  const paginatedProducts = products.slice((currentPage - 1) * limit, currentPage * limit);

  return (
    <div className="products-container">
      <div className="product-grid">
        {paginatedProducts.map((product, index) => {
          // Calculate discount percentage
          const discountPercentage = Math.round((1 - product.salePrice / product.originalPrice) * 100);
          return (
            <div className="product-item" key={`${product.id}-${index}`}>
              <div className="product-card bg-white rounded shadow-sm d-flex flex-column">
                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <div className="discount-badge">
                    -{discountPercentage}%
                  </div>
                )}

                {/* Image Container */}
                <Link href={`/products/${product.slug}`} className="text-decoration-none product-image-link">
                  <div className="product-image-container">
                    <Image
                      src={product.images[0] || "/placeholder.jpg"}
                      alt={product.title}
                      width={200}
                      height={200}
                      className="product-image"
                    />
                  </div>
                </Link>

                {/* Product Details */}
                <div className="product-details p-3 flex-grow-1 d-flex flex-column">
                  <Link href={`/products/${product.slug}`} className="text-decoration-none">
                    <h6 className="product-title">{product.title}</h6>
                  </Link>

                  <div className="price-section mt-auto">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <span className="sale-price">{product.salePrice.toLocaleString()}đ</span>
                        {discountPercentage > 0 && (
                          <span className="original-price">
                            <del>{product.originalPrice.toLocaleString()}đ</del>
                          </span>
                        )}
                      </div>
                      <Button
                        className="add-to-cart-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        aria-label="Add to cart"
                      >
                        <MdAddShoppingCart size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="pagination-container d-flex justify-content-center mt-4">
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            maxButtons={5}
            size="md"
            layout={['-', 'pager']}
            total={total}
            limitOptions={[10, 20, 30, 50]}
            limit={limit}
            activePage={currentPage}
            onChangePage={handlePageChange}
          />
        </div>
      )}

      <style jsx>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
          width: 100%;
        }
        
        .product-card {
          position: relative;
          border: 1px solid #eaeaea;
          border-radius: 12px;
          transition: all 0.25s ease;
          overflow: hidden;
          height: 100%;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .product-image-container {
          height: 200px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f9f9f9;
          padding: 1rem;
          border-bottom: 1px solid #eaeaea;
        }
        
        :global(.product-image) {
          object-fit: contain !important;
          width: 100%;
          height: 100%;
          transition: transform 0.3s ease;
        }
        
        .product-image-link:hover :global(.product-image) {
          transform: scale(1.05);
        }
        
        .product-title {
          color: #333;
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 2.8rem;
          line-height: 1.4;
        }
        
        .product-title:hover {
          color: #2ecc71;
        }
        
        .sale-price {
          color: #e74c3c;
          font-weight: 700;
          font-size: 1rem;
          display: block;
        }
        
        .original-price {
          color: #999;
          font-size: 0.8rem;
          margin-left: 0.25rem;
          display: block;
        }
        
        .discount-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background-color: #e74c3c;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          z-index: 2;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        :global(.add-to-cart-btn) {
          background-color: #2ecc71 !important;
          color: white !important;
          border-radius: 50% !important;
          min-width: 36px !important;
          height: 36px !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: none !important;
          transition: all 0.2s ease !important;
        }
        
        :global(.add-to-cart-btn:hover) {
          background-color: #27ae60 !important;
          transform: scale(1.1);
        }
        
        .price-section {
          margin-top: 0.5rem;
        }
        
        .product-details {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        /* Responsive adjustments */
        @media (max-width: 992px) {
          .product-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (max-width: 576px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }
          
          .product-image-container {
            height: 160px;
          }
          
          .product-title {
            font-size: 0.85rem;
            -webkit-line-clamp: 1;
            height: 1.4rem;
          }
          
          .sale-price {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PaginatedProducts;
