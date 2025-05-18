import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Panel,
  Breadcrumb,
  Row,
  Col,
  Pagination,
  Loader,
  Stack,
  Button,
  Message
} from 'rsuite';
import { MdHome, MdStore, MdPhone, MdLocationOn } from "react-icons/md";
import PaginatedProducts from '@/components/Products/PaginatedProducts';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { combineListLocales } from "@/config/localeConfig";
import { productService } from '@/services/productService';

export async function getStaticProps({ locale }) {
  const translation = await serverSideTranslations(
    locale,
    combineListLocales("home")
  );

  return {
    props: {
      ...translation,
    },
    // Re-generate pages at most once every 24 hours
    revalidate: 86400
  };
}

export default function ProductsByCategories() {
  const router = useRouter();
  const { category = 'all' } = router.query;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 12,
    page: 1,
    total: 0
  });

  useEffect(() => {
    if (!router.isReady) return;

    // Reset page when category changes
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
      return;
    }

    // Fetch products based on category
    fetchProducts(category, pagination.page, pagination.limit);
  }, [router.isReady, category, pagination.page]);

  const fetchProducts = async (category, page, limit) => {
    setLoading(true);
    setError(null);

    try {
      const data = await productService.getProductsByCategory(category, page, limit);

      if (data.success) {
        setProducts(productService.formatProductsForDisplay(data.data));
        setPagination(prev => ({
          ...prev,
          total: data.count
        }));
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error loading products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
    // The useEffect will handle the fetch
  };

  // Determine category title for display
  let categoryTitle = "Tất cả sản phẩm";
  if (category === 'labubu-chinh-hang') categoryTitle = "Labubu Chính Hãng";
  if (category === 'baby-three-chinh-hang') categoryTitle = "Baby Three Chính Hãng";
  if (category === 'vali') categoryTitle = "Vali";
  if (category === 'giay') categoryTitle = "Giày";
  if (category === 'balo') categoryTitle = "Balo";

  return (
      <div className="container py-5">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item href="/">
            <Stack spacing={4} alignItems="center">
              <MdHome />
              <span>Trang chủ</span>
            </Stack>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{categoryTitle}</Breadcrumb.Item>
        </Breadcrumb>

        <h2>{categoryTitle}</h2>

        {error && (
          <Message type="error" showIcon className="my-3">
            {error}
          </Message>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Loader size="lg" content="Đang tải sản phẩm..." />
          </div>
        ) : products.length > 0 ? (
          <div>
            <PaginatedProducts
              products={products}
              total={pagination.total}
              limit={pagination.limit}
              page={pagination.page}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">Không tìm thấy sản phẩm nào trong danh mục này.</p>
            <Button appearance="primary" onClick={() => router.push('/products')}>
              Xem tất cả sản phẩm
            </Button>
          </div>
        )}
        </div>
  );
}