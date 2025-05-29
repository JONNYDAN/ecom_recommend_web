import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Button, 
   Loader, 
  Message, IconButton, Nav, Whisper, 
  Tooltip, Modal
} from 'rsuite';
import { 
  MdShield, MdLocalShipping, MdAdd, MdRemove, 
  MdFavorite, MdFavoriteBorder,
  MdOutlineShoppingCart,
  MdCheck, MdOutlineDescription, MdStar, MdInfo
} from 'react-icons/md';
import { FaFacebook, FaTwitter, FaLink } from 'react-icons/fa';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { combineListLocales } from "@/config/localeConfig";
import ReviewSection from '@/components/ReviewSection/ReviewSection';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/router';
import { productService } from '@/services/productService';
import Breadcrumb, { breadcrumbItems } from "@/components/Navigation/Breadcrumb";
import { CategoryContent } from '@/components/common/CategoryContent';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import RelatedProducts from '@/components/sections/RelatedProducts';

// Add this function to specify which paths to pre-render
export async function getStaticPaths() {
  return {
    paths: [],
    // 'blocking' means pages not generated at build time will still be server-rendered
    // and then cached for future requests (rather than showing a 404)
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params, locale }) {
  const { slug } = params;
  
  try {
    // Updated: Fetch product data using service
    const productData = await productService.getProductBySlug(slug);

    const translation = await serverSideTranslations(
      locale,
      combineListLocales("home")
    );

    if (!productData.success || !productData.data) {
      return {
        notFound: true // This will show a 404 page
      };
    }

    return {
      props: {
        initialProduct: JSON.parse(JSON.stringify(productData.data)),
        ...translation,
      },
      // Re-generate pages at most once every 24 hours
      revalidate: 86400
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      notFound: true
    };
  }
}

export default function ProductDetailPage({ initialProduct }) {
  // State management
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(() => {
    return initialProduct?.size && initialProduct.size.length > 0 ? initialProduct.size[0] : "";
  });
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const {  user } = useSelector((state) => state.auth);
  console.log('log-84', user)
  // Refs
  const mainImageRef = useRef(null);
  const thumbsRef = useRef(null);
  
  const { addToCart } = useCart();
  const router = useRouter();
  const { category } = router.query;

  // Create dynamic breadcrumbs
  const breadcrumbs = [
    {
      name: breadcrumbItems.home,
      url: "/",
      isActive: false,
    },
    {
      name: breadcrumbItems.products,
      url: "/products",
      isActive: false,
    },
    {
      name: product?.title || "",
      url: `/products/${product?.slug || ""}`,
      isActive: true,
    },
  ];

  // Fetch product data based on category if present
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (category) {
        try {
          setLoading(true);
          const data = await productService.getProductsByCategory(category);
          
          if (data.success && data.count > 0) {
            setProduct(data.data[0]);
            setSelectedOption(data.data[0].size && data.data[0].size.length > 0 ? 
              data.data[0].size[0] : "");
          } else {
            setError("Không tìm thấy sản phẩm trong danh mục này");
          }
        } catch (err) {
          setError("Lỗi tải sản phẩm: " + err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    if (category) {
      fetchProductsByCategory();
    }
  }, [category]);

  // Reset "added to cart" notification after delay
  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [addedToCart]);

  // Selling points data
  const sellingPoints = [
    {
      icon: <MdShield size={24} />,
      title: "BẢO HIỂM HÀNG CHÍNH HÃNG 100%",
      description: "Cam kết chính hãng 100% trọn đời sản phẩm. Phát hiện hàng giả được đền FULL GIÁ TRỊ"
    },
    {
      icon: <MdLocalShipping size={24} />,
      title: "GIAO HÀNG NHANH 2H",
      description: "Miễn phí giao hàng hỏa tốc trong 2h, nội thành TPHCM (áp dụng khi thanh toán chuyển khoản)"
    }
  ];

  // Handler functions
  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    console.log("Selected size:", option); // For debugging
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedOption, quantity);
    setAddedToCart(true);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedOption, quantity, true);
    window.location.href = '/checkout';
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const openZoomModal = () => {
    setShowZoomModal(true);
  };

  const closeZoomModal = () => {
    setShowZoomModal(false);
  };

  const scrollThumbs = (direction) => {
    if (thumbsRef.current) {
      const scrollAmount = direction === 'left' ? -100 : 100;
      thumbsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Format price as VND currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = () => {
    if (product?.originalPrice && product?.salePrice && product.originalPrice > product.salePrice) {
      const discount = ((product.originalPrice - product.salePrice) / product.originalPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const discountPercentage = calculateDiscountPercentage();

  // Share product functionality
  const shareProduct = (platform) => {
    const productTitle = encodeURIComponent(product?.title || 'Xem sản phẩm này');
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '');
    
    let shareLink = '';
    
    switch(platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${productTitle}&url=${url}`;
        break;
      case 'pinterest':
        const img = encodeURIComponent(product?.images?.[0] || '');
        shareLink = `https://pinterest.com/pin/create/button/?url=${url}&media=${img}&description=${productTitle}`;
        break;
      case 'copy':
        if (typeof navigator !== 'undefined') {
          navigator.clipboard.writeText(window.location.href);
          // Would show a toast notification here
        }
        return;
    }
    
    if (shareLink && typeof window !== 'undefined') {
      window.open(shareLink, '_blank');
    }
  };

  // Early returns for loading and error states
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Loader size="lg" content="Đang tải sản phẩm..." />
        </div>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="my-5">
        <div className="card p-4 border-0 shadow-sm">
          <div className="text-center mb-4">
            <MdInfo size={48} className="text-danger" />
            <h3 className="mt-3 text-danger">Lỗi</h3>
          </div>
          <Message type="error" className="mb-4">
            {error || "Không thể tìm thấy sản phẩm. Vui lòng thử lại sau."}
          </Message>
          <div className="text-center">
            <Button appearance="primary" onClick={() => router.push('/products')} className="px-4">
              Xem các sản phẩm khác
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  // Parse product description as an array of content blocks
  const productDetails = {
    name: product.title,
    contents: product.description ? 
      [{ type: "text", content: product.description }] : 
      [{ type: "text", content: "Chưa có mô tả chi tiết cho sản phẩm này." }]
  };

  // Add images to content blocks if available
  if (product.images && product.images.length > 0) {
    product.images.forEach((image, index) => {
      if (index > 0) { // Skip the first image as it's already shown in the main display
        productDetails.contents.push({
          type: "image",
          src: image,
          alt: `${product.title} - Hình ${index + 1}`
        });
      }
    });
  }
  console.log('log-312', product.images)
  return (
    <>
      <Head>
        <title>{product.title} | BAOO STORE</title>
        <meta name="description" content={product.description || `Chi tiết sản phẩm ${product.title}`} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description || `Chi tiết sản phẩm ${product.title}`} />
        {product.images && product.images.length > 0 && (
          <meta property="og:image" content={product.images[0]} />
        )}
      </Head>

      <div className="container my-4 py-2">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb items={breadcrumbs} />
        </div>
        
        {/* Main Product Content */}
        <div className="card border-0 shadow-sm overflow-hidden mb-5">
          <div className="row g-0">
            {/* Product Images Section */}
            <div className="col-lg-6 position-relative">
              {/* Discount badge */}
              {discountPercentage > 0 && (
                <div className="position-absolute badge bg-danger p-2 fs-6 fw-bold rounded-pill" style={{ top: '15px', left: '15px', zIndex: 10 }}>
                  -{discountPercentage}%
                </div>
              )}
              
              {/* Main image */}
              <div 
                className="product-main-image d-flex align-items-center justify-content-center bg-light p-3 position-relative"
                style={{ height: '500px', cursor: 'zoom-in' }}
                onClick={openZoomModal}
                ref={mainImageRef}
              >
                <img 
                  src={product.images && product.images.length > 0 ? product.images[selectedImageIndex] : "/images/placeholder.png"} 
                  alt={product.title}
                  className="img-fluid"
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
              </div>
              
              {/* Image thumbnails */}
              <div className="position-relative mt-3 px-4">
                {product.images && product.images.length > 4 && (
                  <>
                    <Button 
                      className="position-absolute start-0 top-50 translate-middle-y bg-white rounded-circle border-0 shadow-sm"
                      onClick={() => scrollThumbs('left')}
                      style={{ width: '32px', height: '32px', zIndex: 5, padding: 0 }}
                      aria-label="Hình trước"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </Button>
                    <Button 
                      className="position-absolute end-0 top-50 translate-middle-y bg-white rounded-circle border-0 shadow-sm"
                      onClick={() => scrollThumbs('right')}
                      style={{ width: '32px', height: '32px', zIndex: 5, padding: 0 }}
                      aria-label="Hình sau"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </Button>
                  </>
                )}
                
                <div 
                  className="d-flex gap-2 overflow-auto pb-1 px-2 thumbnails-container"
                  style={{ scrollbarWidth: 'none' }}
                  ref={thumbsRef}
                >
                  {product.images && product.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`thumbnail-container flex-shrink-0 border overflow-hidden rounded ${selectedImageIndex === index ? 'border-primary border-2' : 'border-light'}`}
                      style={{ width: '80px', height: '80px', cursor: 'pointer' }}
                      onClick={() => handleImageSelect(index)}
                      tabIndex="0"
                      aria-label={`Hình sản phẩm ${index + 1}`}
                      onKeyDown={(e) => e.key === 'Enter' && handleImageSelect(index)}
                    >
                      <img 
                        src={image} 
                        alt={`${product.title} - Hình ${index + 1}`}
                        className="w-100 h-100 object-fit-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="col-lg-6">
              <div className="p-4 p-lg-5">
                {/* Product Name & Status */}
                <div className="mb-4">
                  <h1 className="fw-bold mb-2 fs-2">{product.title}</h1>
                  
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    {product.code && (
                      <p className="text-muted mb-0">Mã: <span className="fw-semibold">{product.code}</span></p>
                    )}
                    
                    <div className="badge bg-success-subtle text-success d-flex align-items-center p-2">
                      <MdCheck size={16} className="me-1" />
                      Còn hàng
                    </div>
                  </div>
                </div>
                
                {/* Product Price */}
                <div className="mb-4">
                  <div className="d-flex align-items-baseline flex-wrap">
                    <span className="fs-1 fw-bold text-danger me-3">
                      {formatPrice(product.salePrice || product.originalPrice)}
                    </span>
                    
                    {product.originalPrice > product.salePrice && (
                      <div className="d-flex align-items-center">
                        <span className="text-decoration-line-through text-muted fs-5 me-3">
                          {formatPrice(product.originalPrice)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <hr className="my-4" />
                
                {/* Product Options */}
                {product.size && product.size.length > 0 && (
                  <div className="mb-4">
                    <h2 className="fs-5 fw-semibold mb-3">Kích cỡ:</h2>
                    <div className="d-flex flex-wrap gap-2">
                      {product.size.map((size, index) => (
                        <Button 
                          key={index}
                          appearance={selectedOption === size ? "primary" : "default"}
                          className={`px-3 py-2 rounded-2`}
                          onClick={() => handleOptionSelect(size)}
                          tabIndex="0"
                          aria-pressed={selectedOption === size}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Quantity Selector */}
                <div className="mb-4">
                  <h2 className="fs-5 fw-semibold mb-3">Số lượng:</h2>
                  <div className="d-flex align-items-center">
                    <div className="input-group d-flex align-items-center" style={{ width: '140px' }}>
                      <Button 
                        appearance="default"
                        className="d-flex align-items-center justify-content-center border"
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        aria-label="Giảm số lượng"
                        style={{ width: '40px', height: '40px', padding: 0 }}
                      >
                        <MdRemove />
                      </Button>
                      <div className="form-control text-center fw-medium border d-flex align-items-center justify-content-center" 
                           style={{ width: '60px', height: '40px', borderRadius: 0 }}>
                        {quantity}
                      </div>
                      <Button 
                        appearance="default"
                        className="d-flex align-items-center justify-content-center border"
                        onClick={incrementQuantity}
                        aria-label="Tăng số lượng"
                        style={{ width: '40px', height: '40px', padding: 0 }}
                      >
                        <MdAdd />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Add to Cart & Buy Now Buttons */}
                <div className="mb-4">
                  <div className="row g-2">
                    <div className="col-12 col-md-6">
                      <Button 
                        appearance="primary" 
                        color="red"
                        block
                        size="lg"
                        onClick={handleBuyNow}
                        className="py-3 fw-bold fs-5"
                        tabIndex="0"
                        aria-label="Mua ngay"
                      >
                        MUA NGAY
                      </Button>
                    </div>
                    <div className="col-12 col-md-6">
                      <Button 
                        appearance="ghost"
                        block
                        size="lg"
                        onClick={handleAddToCart}
                        className="py-3 d-flex align-items-center justify-content-center gap-2"
                        tabIndex="0"
                        aria-label="Thêm vào giỏ hàng"
                      >
                        <MdOutlineShoppingCart size={20} />
                        THÊM VÀO GIỎ
                      </Button>
                    </div>
                  </div>
                  
                  {/* Added to cart notification */}
                  {addedToCart && (
                    <div className="mt-3 alert alert-success d-flex align-items-center" role="alert">
                      <MdCheck className="me-2" size={20} />
                      <div>Đã thêm sản phẩm vào giỏ hàng!</div>
                    </div>
                  )}
                </div>
                
                {/* Wishlist & Share */}
                <div className="d-flex align-items-center gap-3 mb-4">
                  <Button 
                    appearance="subtle"
                    className="d-flex align-items-center gap-2"
                    onClick={toggleFavorite}
                    tabIndex="0"
                    aria-pressed={isFavorite}
                    aria-label="Thêm vào yêu thích"
                  >
                    {isFavorite ? (
                      <MdFavorite size={20} className="text-danger" />
                    ) : (
                      <MdFavoriteBorder size={20} />
                    )}
                    Yêu thích
                  </Button>
                  
                  <div className="border-start ps-3 d-flex align-items-center gap-2">
                    <span className="text-muted">Chia sẻ:</span>
                    <div className="d-flex gap-2">
                      <Whisper placement="top" trigger="hover" speaker={<Tooltip>Facebook</Tooltip>}>
                        <IconButton 
                          icon={<FaFacebook />} 
                          circle 
                          size="sm"
                          onClick={() => shareProduct('facebook')}
                          className="btn-primary"
                          tabIndex="0"
                          aria-label="Chia sẻ lên Facebook"
                        />
                      </Whisper>
                      <Whisper placement="top" trigger="hover" speaker={<Tooltip>Twitter</Tooltip>}>
                        <IconButton 
                          icon={<FaTwitter />} 
                          circle 
                          size="sm"
                          onClick={() => shareProduct('twitter')}
                          className="btn-info"
                          tabIndex="0"
                          aria-label="Chia sẻ lên Twitter"
                        />
                      </Whisper>
                      <Whisper placement="top" trigger="hover" speaker={<Tooltip>Sao chép liên kết</Tooltip>}>
                        <IconButton 
                          icon={<FaLink />} 
                          circle 
                          size="sm"
                          onClick={() => shareProduct('copy')}
                          className="btn-dark"
                          tabIndex="0"
                          aria-label="Sao chép liên kết"
                        />
                      </Whisper>
                    </div>
                  </div>
                </div>
                
                <hr className="my-4" />
                
                {/* Selling Points */}
                <div className="mt-4">
                  {sellingPoints.map((point, index) => (
                    <div className="d-flex gap-3 mb-3" key={index}>
                      <div className="flex-shrink-0 text-danger">
                        {point.icon}
                      </div>
                      <div>
                        <h3 className="fs-6 fw-bold mb-1">{point.title}</h3>
                        <p className="text-muted small mb-0">{point.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tab Section */}
        <div className="card border-0 shadow-sm overflow-hidden mb-5">
          <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
            <Nav appearance="tabs" activeKey={activeTab} onSelect={setActiveTab} className="border-bottom-0">
              <Nav.Item 
                eventKey="description" 
                icon={<MdOutlineDescription />}
                tabIndex="0"
                aria-selected={activeTab === 'description'}
              >
                Mô tả sản phẩm
              </Nav.Item>
              <Nav.Item 
                eventKey="specifications" 
                icon={<MdInfo />}
                tabIndex="0"
                aria-selected={activeTab === 'specifications'}
              >
                Thông số
              </Nav.Item>
              <Nav.Item 
                eventKey="reviews" 
                icon={<MdStar />}
                tabIndex="0"
                aria-selected={activeTab === 'reviews'}
              >
                Đánh giá
              </Nav.Item>
            </Nav>
          </div>
          
          <div className="card-body p-4">
            {activeTab === 'description' && (
              <div className="product-description">
                <h2 className="fs-4 fw-bold mb-4 pb-2 border-bottom">{product.title}</h2>
                
                <div className="description-content">
                  {productDetails.contents.map((item, index) => (
                    <div key={index} className="mb-4">
                      {item.type === "text" ? (
                        <p className="mb-3 fs-6 lh-lg"
                          dangerouslySetInnerHTML={{ __html: item.content }}></p>
                      ) : (
                        <div className="text-center my-4">
                          <img 
                            src={item.src} 
                            alt={item.alt}
                            className="img-fluid rounded shadow-sm"
                            style={{ maxWidth: '100%' }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div className="product-specifications">
                <h2 className="fs-4 fw-bold mb-4 pb-2 border-bottom">Thông số kỹ thuật</h2>
                
                <div className="table-responsive">
                  <table className="table table-hover border">
                    <tbody>
                      <tr>
                        <th className="bg-light text-dark" style={{ width: '30%' }}>Thương hiệu</th>
                        <td>BAOO</td>
                      </tr>
                      <tr>
                        <th className="bg-light text-dark">Xuất xứ</th>
                        <td>Việt Nam</td>
                      </tr>
                      {product.size && product.size.length > 0 && (
                        <tr>
                          <th className="bg-light text-dark">Kích thước</th>
                          <td>{product.size.join(', ')}</td>
                        </tr>
                      )}
                      {product.code && (
                        <tr>
                          <th className="bg-light text-dark">Mã sản phẩm</th>
                          <td>{product.code}</td>
                        </tr>
                      )}
                      <tr>
                        <th className="bg-light text-dark">Bảo hành</th>
                        <td>12 tháng</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="product-reviews">
                <ReviewSection productName={product.title} user={user} />
              </div>
            )}
          </div>
        </div>

        {/* Category Content */}
        <div className="mb-5">
          <CategoryContent categoryName={product.title} />
        </div>

        {/* Thêm RelatedProducts component */}
        <RelatedProducts 
          productId={product.id} 
        />
      </div>
      
      {/* Zoom Modal */}
      <Modal 
        open={showZoomModal} 
        onClose={closeZoomModal}
        size="lg"
        backdrop="static"
        aria-labelledby="zoom-modal-title"
      >
        <Modal.Header>
          <Modal.Title id="zoom-modal-title">{product.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <img 
              src={product.images?.[selectedImageIndex]} 
              alt={product.title}
              className="img-fluid"
              style={{ maxHeight: '70vh' }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeZoomModal} appearance="subtle">
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      
      <style jsx global>{`
        .thumbnails-container::-webkit-scrollbar {
          display: none;
        }
        
        .thumbnail-container {
          transition: all 0.2s ease;
        }
        
        .thumbnail-container:hover {
          opacity: 0.85;
          transform: translateY(-2px);
        }
        
        .product-main-image {
          transition: all 0.3s ease;
        }
        
        .product-main-image:hover {
          opacity: 0.95;
        }
        
        /* Make sure form controls have proper height */
        .form-control, .btn {
          line-height: 1.5;
        }
        
        /* Improve responsive behavior */
        @media (max-width: 768px) {
          .product-main-image {
            height: 350px !important;
          }
        }
      `}</style>
    </>
  );
}