import { useTranslation } from "next-i18next";
import { Container, Loader, Message } from "rsuite";
import { useState, useEffect } from "react";
import PaginatedProducts from '../Products/PaginatedProducts';
import { productService } from "@/services/productService";

const AllProducts = () => {
  const { t } = useTranslation("home");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  useEffect(() => {
    fetchProducts(pagination.page, pagination.limit);
  }, [pagination.page]);

  const fetchProducts = async (page, limit) => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts(page, limit);
      if (data.success) {
        setProducts(productService.formatProductsForDisplay(data.data));
        setPagination(prev => ({ ...prev, total: data.count }));
      } else {
        setError("Failed to load products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("There was a problem loading products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  if (error) {
    return (
      <section className="hot-products mt-4">
        <div className="container">
          <h2 className="text-center mb-4">TẤT CẢ SẢN PHẨM</h2>
          <Message type="error" header="Error" description={error} />
        </div>
      </section>
    );
  }

  return (
    <section className="hot-products mt-4">
      <div className="container">
        <h2 className="text-center mb-4">TẤT CẢ SẢN PHẨM</h2>

        {loading && products.length === 0 ? (
          <div className="text-center py-5">
            <Loader size="lg" content="Đang tải sản phẩm..." vertical />
          </div>
        ) : (
          <PaginatedProducts
            products={products}
            total={pagination.total}
            limit={pagination.limit}
            page={pagination.page}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
};

export default AllProducts;
