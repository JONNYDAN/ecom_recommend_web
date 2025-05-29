import React, { useState, useEffect } from "react";
import PaginatedProducts from "../Products/PaginatedProducts";
import { productService } from "@/services/productService";
import { recommendService } from "@/services/recommendService";
import { Message } from "rsuite";
import { useSelector } from "react-redux";

const RelatedProducts = ({ productId }) => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    total: 0,
  });

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
    scrollToSection("related-products");
  };

  const scrollToSection = (sectionClass) => {
    window.scrollTo({
      top: document.querySelector(`.${sectionClass}`).offsetTop - 100,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!productId) return;

      setLoading(true);
      try {
        let data;

        if (isLoggedIn && user?.id) {
          data = await recommendService.getHybridRecommendations(
            user.id,
            productId,
            pagination.limit,
            pagination.page
          );
        } else {
          data = await recommendService.getProductRecommendations(
            productId,
            pagination.limit,
            pagination.page
          );
        }

        if (data.success) {
          setRelatedProducts(productService.formatProductsForDisplay(data.data));
          setPagination((prev) => ({ ...prev, total: data.count }));
        }
      } catch (err) {
        console.error("Error fetching related products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, user?.id, isLoggedIn, pagination.page]);

  if (error) {
    return (
      <section className="related-products">
        <div className="container">
          <h2 className="text-left mb-4">SẢN PHẨM LIÊN QUAN</h2>
          <Message type="error" header="Error" description={error} />
        </div>
      </section>
    );
  }

  return (
    <section className="related-products">
      <div className="container">
        <h2 className="text-left mb-4">SẢN PHẨM LIÊN QUAN</h2>
        {loading ? (
          <div>Loading...</div>
        ) : relatedProducts.length > 0 ? (
          <PaginatedProducts
            products={relatedProducts}
            total={pagination.total}
            limit={pagination.limit}
            activePage={pagination.page}
            onChangePage={handlePageChange}
          />
        ) : (
          <Message type="info" header="Thông báo">
            Không tìm thấy sản phẩm liên quan
          </Message>
        )}
      </div>
    </section>
  );
};

export default RelatedProducts;
