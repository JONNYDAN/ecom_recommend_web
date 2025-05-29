import React, { useState, useEffect } from "react";
import Products from "../Products/Products";
import PaginatedProducts from "../Products/PaginatedProducts";
import { productService } from "@/services/productService";
import { recommendService } from "@/services/recommendService";
import { Message } from "rsuite";
import { useSelector } from "react-redux"; // Thêm import này

const HotProducts = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth); // Sử dụng Redux state
  const [hotProducts, setHotProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    total: 0,
  });
  const [recommendPagination, setRecommendPagination] = useState({
    limit: 10,
    page: 1,
    total: 0,
  });

  const [error, setError] = useState(null);

  const handleHotPageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
    scrollToSection("hot-products");
  };

  const handleRecommendPageChange = (page) => {
    setRecommendPagination((prev) => ({ ...prev, page }));
    scrollToSection("recommended-products");
  };

  const scrollToSection = (sectionClass) => {
    window.scrollTo({
      top: document.querySelector(`.${sectionClass}`).offsetTop - 100,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchHotProducts = async () => {
      setLoading(true);
      try {
        const data = await recommendService.getRecommendedProducts(
          pagination.page,
          pagination.limit
        );

        if (data.success) {
          setHotProducts(productService.formatProductsForDisplay(data.data));
          setPagination((prev) => ({ ...prev, total: data.count }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRecommendations = async () => {
      if (!isLoggedIn || !user?.id) return; // Kiểm tra cả isLoggedIn

      setLoading(true);
      try {
        const data = await recommendService.getUserRecommendations(
          user.id,
          recommendPagination.page,
          recommendPagination.limit
        );

        if (data.success) {
          setRecommendedProducts(productService.formatProductsForDisplay(data.data));
          setRecommendPagination((prev) => ({ ...prev, total: data.count }));
        }
      } catch (err) {
        console.error("Error fetching user recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotProducts();
    fetchUserRecommendations();
  }, [pagination.page, recommendPagination.page, user?.id, isLoggedIn]);

  if (error) {
    return (
      <section className="hot-products">
        <div className="container">
          <h2 className="text-left mb-4">HÀNG HOT</h2>
          <Message type="error" header="Error" description={error} />
        </div>
      </section>
    );
  }

  return (
    <section className="products-section">
      <div className="container hot-products">
        <h2 className="text-left mb-4">HÀNG HOT</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <PaginatedProducts
            products={hotProducts}
            total={pagination.total}
            limit={pagination.limit}
            activePage={pagination.page}
            onChangePage={handleHotPageChange}
          />
        )}
      </div>

      <div className="container recommended-products pt-3">
        <h2 className="text-left mb-4">HÀNG GỢI Ý</h2>
        {loading ? (
          <div>Loading...</div>
        ) : isLoggedIn && user ? ( // Kiểm tra cả isLoggedIn
          <PaginatedProducts
            products={recommendedProducts}
            total={recommendPagination.total}
            limit={recommendPagination.limit}
            activePage={recommendPagination.page}
            onChangePage={handleRecommendPageChange}
          />
        ) : (
          <Message type="info" header="Thông báo">
            Vui lòng đăng nhập để xem các sản phẩm được gợi ý cho bạn
          </Message>
        )}
      </div>
    </section>
  );
};

export default HotProducts;
