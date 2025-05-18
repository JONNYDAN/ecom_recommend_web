import React, { useState, useEffect } from "react";
import Products from "../Products/Products";
import PaginatedProducts from "../Products/PaginatedProducts";
import { productService } from "@/services/productService";
import { Message } from "rsuite";

const HotProducts = () => {
  const [products, setProducts] = useState([]);

  const [productLimit, setProductLimit] = useState(30);

  const [pagination, setPagination] = useState({
    limit: 12,
    page: 1,
    total: 0,
  });

  const [error, setError] = useState(null);

  const handlePageChange = () => {
    window.scrollTo({
      top: document.querySelector(".hot-products h2").offsetTop - 100,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setProductLimit(window.innerWidth < 768 ? 6 : 30);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await productService.getProductsByCategory(
      "hot",
      pagination.page,
      pagination.limit
    );

    if (data.success) {
      setProducts(productService.formatProductsForDisplay(data.data));
      setPagination((prev) => ({ ...prev, total: data.count }));
    } else {
      setError("Failed to load products");
    }
  };

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
    <section className="hot-products">
      <div className="container">
        <h2 className="text-left mb-4">HÀNG HOT</h2>
        <PaginatedProducts
          products={products}
          total={products.length}
          limit={productLimit}
          onChangePage={handlePageChange}
        />
      </div>
    </section>
  );
};

export default HotProducts;
