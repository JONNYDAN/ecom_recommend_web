import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Container, Form, InputGroup, Button, Loader, Message } from 'rsuite';
import { MdSearch, MdClear } from 'react-icons/md';
import PaginatedProducts from '@/components/Products/PaginatedProducts';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { combineListLocales } from "@/config/localeConfig";

const PRODUCTS_PER_PAGE = 10;

export default function SearchPage({ initialProducts, totalCount, searchQuery, errorMessage }) {
  const router = useRouter();
  
  // Initialize state with server props to prevent hydration mismatch
  const [searchTerm, setSearchTerm] = useState(searchQuery || '');
  const [products, setProducts] = useState(initialProducts || []);
  const [total, setTotal] = useState(totalCount || 0);
  const [page, setPage] = useState(parseInt(router.query.page) || 1);
  const [limit] = useState(PRODUCTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after initial render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update search term when URL query changes
  useEffect(() => {
    if (router.query.q !== undefined) {
      setSearchTerm(router.query.q || '');
      // Set loading state when query changes
      setIsLoading(true);
      
      // Simulate API loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
    if (router.query.page !== undefined) {
      setPage(parseInt(router.query.page) || 1);
    }
  }, [router.query]);

  // Handle search submission
  const handleSearch = (formValue, e) => {
    e?.preventDefault();
    if (searchTerm.trim()) {
      router.push({
        pathname: '/search',
        query: { q: searchTerm.trim(), page: 1 }
      });
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    router.push({
      pathname: '/search',
      query: { 
        ...router.query,
        page: newPage 
      }
    });
  };

  // Clear search - enhanced for better UX
  const clearSearch = () => {
    setSearchTerm('');
    // Focus the input field after clearing
    document.querySelector('.search-input')?.focus();
    // Keep user on search page but clear the query
    router.push('/search', undefined, { shallow: true });
  };

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return (
    <>
      <Head>
        <title>{searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Tìm Kiếm Sản Phẩm'} | BAOO STORE</title>
        <meta name="description" content={`Tìm kiếm trong danh mục sản phẩm${searchQuery ? ` - kết quả cho "${searchQuery}"` : ''}`} />
        <meta name="robots" content="index, follow" />
      </Head>
      <Container className="search-page p-3 p-lg-5">
        <div className="search-content">
          <div className="search-layout">
            {searchQuery && (
              <div className="search-sidebar">
                <div className="sidebar-section">
                  <h3 className="sidebar-title">Danh Mục</h3>
                  <div className="category-list">
                    <div className="category-item active">Tất cả sản phẩm</div>
                    <div className="category-item">Labubu chính hãng</div>
                    <div className="category-item">Babythree chính hãng</div>
                    <div className="category-item">Vali</div>
                    <div className="category-item">Giày</div>
                    <div className="category-item">Balo</div>
                  </div>
                </div>

                <div className="sidebar-section">
                  <h3 className="sidebar-title">Khoảng Giá</h3>
                  <div className="price-range">
                    <div className="price-option">Dưới 500K</div>
                    <div className="price-option">500K - 1 triệu</div>
                    <div className="price-option">1 - 2 triệu</div>
                    <div className="price-option">2 - 5 triệu</div>
                    <div className="price-option">Trên 5 triệu</div>
                  </div>
                </div>
              </div>
            )}

            <div className="search-results-area">
              {/* Display error message if present */}
              {errorMessage && (
                <div className="error-container">
                  <Message type="error" className="error-message">
                    <h4>Lỗi tìm kiếm</h4>
                    <p>{errorMessage}</p>
                  </Message>
                </div>
              )}
              
              {/* Search metadata */}
              {searchQuery && !errorMessage && (
                <div className="search-metadata">
                  <h2 className="search-results-title">
                    {isLoading ? 'Đang tìm kiếm...' : `Kết quả tìm kiếm cho "${searchQuery}"`}
                  </h2>
                  {!isLoading && (
                    <p className="search-results-count">
                      {total === 0 ? 'Không tìm thấy sản phẩm nào' : `Tìm thấy ${total} sản phẩm`}
                    </p>
                  )}
                </div>
              )}

              {/* Loading state - skeleton */}
              {mounted && isLoading && (
                <div className="loading-container">
                  <div className="skeleton-grid">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="skeleton-product">
                        <div className="skeleton-image"></div>
                        <div className="skeleton-title"></div>
                        <div className="skeleton-price"></div>
                        <div className="skeleton-button"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No results message */}
              {!isLoading && searchQuery && products.length === 0 && !errorMessage && (
                <div className="no-results-container">
                  <Message type="info" className="no-results-message">
                    <h4>Không tìm thấy sản phẩm</h4>
                    <p>Không tìm thấy sản phẩm nào phù hợp với từ khóa "{searchQuery}"</p>
                    <p>Hãy thử điều chỉnh từ khóa tìm kiếm hoặc duyệt qua danh mục sản phẩm</p>
                    <div className="suggestions-container">
                      <h5>Tìm kiếm phổ biến:</h5>
                      <div className="suggestion-tags">
                        <Button appearance="ghost" size="sm" onClick={() => { 
                          setSearchTerm('labubu'); 
                          router.push('/search?q=labubu&page=1'); 
                        }}>
                          Labubu
                        </Button>
                        <Button appearance="ghost" size="sm" onClick={() => { 
                          setSearchTerm('vali'); 
                          router.push('/search?q=vali&page=1'); 
                        }}>
                          Vali
                        </Button>
                        <Button appearance="ghost" size="sm" onClick={() => { 
                          setSearchTerm('giày'); 
                          router.push('/search?q=giày&page=1'); 
                        }}>
                          Giày
                        </Button>
                        <Button appearance="ghost" size="sm" onClick={() => { 
                          setSearchTerm('balo'); 
                          router.push('/search?q=balo&page=1'); 
                        }}>
                          Balo
                        </Button>
                      </div>
                    </div>
                  </Message>
                </div>
              )}

              {/* Display search results */}
              {!isLoading && products && products.length > 0 && (
                <div className="product-results-container">
                  <PaginatedProducts 
                    products={products}
                    total={total}
                    limit={limit}
                    currentPage={page}
                    onChangePage={handlePageChange}
                  />
                </div>
              )}

              {/* Empty initial state */}
              {mounted && !isLoading && !searchQuery && !errorMessage && (
                <div className="empty-search-state">
                  <h3>Bắt đầu tìm kiếm</h3>
                  <p>Nhập từ khóa vào ô tìm kiếm phía trên để tìm sản phẩm</p>
                  <div className="popular-searches">
                    <h4>Tìm kiếm phổ biến:</h4>
                    <div className="popular-tags">
                      <Button appearance="ghost" size="sm" onClick={() => { 
                        setSearchTerm('labubu'); 
                        router.push('/search?q=labubu&page=1'); 
                      }}>
                        Labubu
                      </Button>
                      <Button appearance="ghost" size="sm" onClick={() => { 
                        setSearchTerm('vali'); 
                        router.push('/search?q=vali&page=1'); 
                      }}>
                        Vali
                      </Button>
                      <Button appearance="ghost" size="sm" onClick={() => { 
                        setSearchTerm('giày'); 
                        router.push('/search?q=giày&page=1'); 
                      }}>
                        Giày
                      </Button>
                      <Button appearance="ghost" size="sm" onClick={() => { 
                        setSearchTerm('balo'); 
                        router.push('/search?q=balo&page=1'); 
                      }}>
                        Balo
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>

      <style jsx>{`
        .search-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 1.5rem 5rem;
          font-family: 'Roboto', sans-serif;
        }
        
        .search-header {
          text-align: center;
          margin-bottom: 3rem;
          padding-top: 1.5rem;
        }
        
        .search-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #222;
        }
        
        .search-subtitle {
          color: #555;
          font-size: 1.25rem;
          margin-bottom: 2rem;
          font-weight: 500;
        }
        
        .search-form-wrapper {
          margin-bottom: 2.5rem;
        }
        
        .search-form {
          max-width: 700px;
          margin: 0 auto;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
          transition: all 0.3s ease;
        }
        
        .search-form:focus-within {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
          transform: translateY(-2px);
        }
        
        :global(.search-input) {
          padding: 1.2rem 1rem !important;
          font-size: 1.1rem !important;
        }
        
        :global(.search-button) {
          background-color: #2ecc71 !important;
          color: white !important;
          width: 60px !important;
          font-size: 1.2rem !important;
        }
        
        :global(.clear-search) {
          color: #777 !important;
          transition: color 0.2s ease !important;
        }
        
        :global(.clear-search:hover) {
          color: #333 !important;
        }
        
        /* Layout with sidebar */
        .search-content {
          margin-top: 1rem;
        }
        
        .search-layout {
          display: flex;
          gap: 2rem;
        }
        
        .search-sidebar {
          width: 250px;
          flex-shrink: 0;
        }
        
        .search-results-area {
          flex-grow: 1;
        }
        
        .sidebar-section {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .sidebar-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #333;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e9ecef;
        }
        
        .category-list, .price-range {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .category-item, .price-option {
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.95rem;
        }
        
        .category-item:hover, .price-option:hover {
          background: #e9ecef;
        }
        
        .category-item.active {
          background: #e2f8ee;
          color: #2ecc71;
          font-weight: 500;
        }
        
        /* Search results */
        .search-metadata {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eaeaea;
        }
        
        .search-results-title {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 0.8rem;
          color: #333;
        }
        
        .search-results-count {
          color: #666;
          font-size: 1.1rem;
          margin-bottom: 0;
        }
        
        /* Skeleton loading */
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 2rem;
        }
        
        .skeleton-product {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .skeleton-image {
          height: 180px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        
        .skeleton-title {
          height: 20px;
          width: 80%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }
        
        .skeleton-price {
          height: 16px;
          width: 40%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }
        
        .skeleton-button {
          height: 36px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
          margin-top: 0.5rem;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .loading-container {
          padding: 2rem 0;
        }
        
        /* Error and no results */
        .error-container, .no-results-container {
          margin: 2rem auto;
          max-width: 800px;
        }
        
        :global(.error-message), :global(.no-results-message) {
          padding: 2.5rem 2rem !important;
          text-align: center !important;
          border: none !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05) !important;
        }
        
        :global(.error-message) {
          background-color: #fff8f8 !important;
        }
        
        :global(.no-results-message) {
          background-color: #f8f9fa !important;
        }
        
        .suggestions-container, .popular-searches {
          margin-top: 1.5rem;
          text-align: center;
        }
        
        .suggestion-tags, .popular-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          margin-top: 0.75rem;
        }
        
        /* Product results */
        .product-results-container {
          margin-top: 1.5rem;
        }
        
        /* Empty state */
        .empty-search-state {
          text-align: center;
          padding: 4rem 2rem;
          background-color: #f9f9f9;
          border-radius: 14px;
          margin: 2rem auto;
          max-width: 850px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        }
        
        .empty-search-state h3 {
          font-size: 2rem;
          margin-bottom: 1.2rem;
          color: #333;
        }
        
        /* Responsive styles */
        @media (max-width: 992px) {
          .search-layout {
            flex-direction: column;
          }
          
          .search-sidebar {
            width: 100%;
            margin-bottom: 2rem;
          }
          
          .sidebar-section {
            padding: 1.2rem;
          }
        }
        
        @media (max-width: 768px) {
          .search-page {
            padding: 2rem 1rem 3rem;
          }
          
          .search-title {
            font-size: 2rem;
            margin-bottom: 0.8rem;
          }
          
          .search-subtitle {
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
          }
          
          .search-form-wrapper {
            margin-bottom: 2rem;
            padding: 0 1rem;
          }
          
          :global(.search-input) {
            padding: 1rem 0.8rem !important;
            font-size: 1rem !important;
          }
          
          .search-results-title {
            font-size: 1.5rem;
          }
          
          .empty-search-state {
            padding: 3rem 1rem;
          }
          
          .empty-search-state h3 {
            font-size: 1.8rem;
          }
          
          .skeleton-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 1.5rem;
          }
          
          .skeleton-image {
            height: 140px;
          }
        }
        
        @media (max-width: 480px) {
          .search-page {
            padding: 1.5rem 0.8rem 2.5rem;
          }
          
          .search-title {
            font-size: 1.8rem;
          }
          
          .search-subtitle {
            font-size: 1rem;
            margin-bottom: 1.2rem;
          }
          
          :global(.search-button) {
            width: 50px !important;
          }
          
          .empty-search-state {
            padding: 2.5rem 1rem;
          }
          
          .skeleton-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 1.2rem;
          }
          
          .skeleton-image {
            height: 120px;
          }
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps({ query, locale }) {
  const searchQuery = query.q || '';
  const page = parseInt(query.page) || 1;
  const limit = PRODUCTS_PER_PAGE;
  
  try {
    const translation = await serverSideTranslations(
      locale,
      combineListLocales()
    );
    
    // If no search query, return empty results with translations
    if (!searchQuery) {
      return {
        props: {
          initialProducts: [],
          totalCount: 0,
          searchQuery: '',
          ...translation
        }
      };
    }

    // Replace this with your actual API call
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com'}/products/search`;
    
    try {
      const response = await fetch(`${apiUrl}?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        props: {
          initialProducts: data.products || [],
          totalCount: data.total || 0,
          searchQuery,
          ...translation
        }
      };
    } catch (apiError) {
      console.error('API Error:', apiError);
      
      // Return a specific API error with translations
      return {
        props: {
          initialProducts: [],
          totalCount: 0,
          searchQuery,
          errorMessage: 'Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.',
          ...translation
        }
      };
    }
  } catch (error) {
    console.error('General error fetching search results:', error);
    
    // Return empty results on error with translations
    return {
      props: {
        initialProducts: [],
        totalCount: 0,
        searchQuery,
        errorMessage: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.',
        ...(await serverSideTranslations(locale, combineListLocales()))
      }
    };
  }
}