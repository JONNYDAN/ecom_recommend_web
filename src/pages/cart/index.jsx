import React, { useState, useEffect } from 'react';
import { Container, Content, Row, Col, Panel, Button, ButtonGroup, Divider, List } from 'rsuite';
import { MdAdd, MdRemove, MdShoppingCart } from 'react-icons/md';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { combineListLocales } from "@/config/localeConfig";
import { useRouter } from 'next/router';

// Remove Table-related imports
// const { Column, HeaderCell, Cell } = Table;

export async function getStaticProps({ locale }) {
  const translation = await serverSideTranslations(
    locale,
    combineListLocales("home")
  );

  return {
    props: {
      ...translation,
    },
    revalidate: 60
  };
}

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [deviceType, setDeviceType] = useState('desktop');

  const router = useRouter();

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 992) { // iPad Mini and iPad Air typically fall in this range
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Initial check
    checkDeviceType();

    // Add event listener for window resize
    window.addEventListener('resize', checkDeviceType);

    // Clean up
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';

  const formatPrice = (price) => {
    if (typeof price === 'string') {
      return price;
    }
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const handleCheckout = () => {
    // Redirect to checkout page
    window.location.href = '/checkout';
  };

  const formattedTotal = formatPrice(getCartTotal());

  // Render product quantity control buttons with responsive sizes
  const renderQuantityControls = (product, size, quantity) => {
    const btnWidth = isTablet ? '32px' : '36px';
    const btnHeight = isTablet ? '32px' : '36px';
    const qtyWidth = isTablet ? '40px' : '50px';

    return (
      <ButtonGroup>
        <Button
          appearance="default"
          className="d-flex align-items-center justify-content-center"
          style={{ width: btnWidth, height: btnHeight }}
          onClick={() => quantity === 1 ? removeFromCart(product.id, size) : updateQuantity(product.id, size, quantity - 1)}
        >
          <MdRemove />
        </Button>
        <Button
          appearance="default"
          disabled
          className="text-center"
          style={{ width: qtyWidth, height: btnHeight }}
        >
          {quantity}
        </Button>
        <Button
          appearance="default"
          className="d-flex align-items-center justify-content-center"
          style={{ width: btnWidth, height: btnHeight }}
          onClick={() => updateQuantity(product.id, size, quantity + 1)}
        >
          <MdAdd />
        </Button>
      </ButtonGroup>
    );
  };

  // Calculate subtotal for an item
  const calculateSubtotal = (product, quantity) => {
    // const price = parseFloat(product.discountedPrice.replace('.', '').replace('đ', ''));
    const price = product.salePrice;
    return formatPrice(price * quantity);
  };

  // Add this function in your component, before the return statement
  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Container className="mt-5 mb-5">
      <Content>
        <Row>
          <Col xs={24}>
            <Panel>
              <h2 className="fw-bold mb-4 mx-md-5">Giỏ hàng của bạn</h2>

              {cartItems.length > 0 ? (
                <>
                  {isMobile ? (
                    <div className="mb-4 pb-5">
                      {cartItems.map((item, index) => (
                        <Panel 
                          key={`${item.product.id}-${item.size}`} 
                          bordered 
                          className="mb-3 position-relative rounded-3 shadow-sm"
                          bodyClassName="p-0"
                        >
                          <div className="py-3">
                            {/* Product image and info */}
                            <div className="d-flex">
                              <div className="me-3">
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.title}
                                  className="rounded-3"
                                  width={100}
                                  height={100}
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                              <div className="flex-grow-1 overflow-hidden">
                                <Link href={`/products/${item.product.slug}`}>
                                  <p className="mb-1 fw-bold">{item.product.title}</p>
                                </Link>
                                <p className="small text-muted mb-2">
                                  Kích thước: <span className="fw-medium">{item.size}</span>
                                </p>
                                
                                {/* Price section */}
                                <div className="d-flex align-items-baseline">
                                  <p className="text-danger fw-bold mb-0 me-2 fs-6">
                                    {formatPrice(item.product.salePrice)}
                                  </p>
                                </div>
                                <p className="text-decoration-line-through text-muted small mb-0">
                                    {formatPrice(item.product.originalPrice)}
                                  </p>
                              </div>
                              
                              {/* Remove button */}
                              {/* <div className="ms-2">
                                <Button
                                  appearance="subtle"
                                  className="p-1 text-muted rounded-circle"
                                  onClick={() => removeFromCart(item.product.id, item.size)}
                                >
                                  <MdRemove className="fs-5" />
                                </Button>
                              </div> */}
                            </div>

                            <Divider className="my-3" />
                            
                            {/* Quantity and subtotal */}
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <span className="me-3 text-muted">Số lượng:</span>
                                <ButtonGroup size="sm" className="shadow-sm rounded-3">
                                  <Button
                                    appearance="default"
                                    className="d-flex align-items-center justify-content-center rounded-start-3"
                                    style={{ width: '32px', height: '32px' }}
                                    onClick={() => item.quantity === 1 ? removeFromCart(item.product.id,   item.size) : updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                  >
                                    <MdRemove />
                                  </Button>
                                  <Button
                                    appearance="default"
                                    disabled
                                    className="text-center bg-white"
                                    style={{ width: '40px', height: '32px' }}
                                  >
                                    {item.quantity}
                                  </Button>
                                  <Button
                                    appearance="default"
                                    className="d-flex align-items-center justify-content-center rounded-end-3"
                                    style={{ width: '32px', height: '32px' }}
                                    onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                                  >
                                    <MdAdd />
                                  </Button>
                                </ButtonGroup>
                              </div>
                              <div>
                                <span className="fw-bold text-danger fs-6">
                                  {calculateSubtotal(item.product, item.quantity)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Panel>
                      ))}
                      
                      {/* Fixed checkout bar at bottom */}
                      <div className="position-fixed bottom-0 start-0 end-0 bg-white p-3 shadow-lg" style={{ zIndex: 1000 }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="fw-bold">Tổng tiền:</span>
                          <span className="text-danger fw-bold fs-4">{formattedTotal}</span>
                        </div>
                        <Button 
                          appearance="primary" 
                          color="black" 
                          size="lg" 
                          block 
                          onClick={handleCheckout}
                          className="rounded-3"
                        >
                          Tiến hành thanh toán
                        </Button>
                        <div className="d-flex justify-content-center mt-3">
                          <Link href="/">
                            <Button appearance="link">Tiếp tục mua sắm</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 mx-md-5">
                      {/* Header row */}
                      <Row className="d-none d-md-flex mb-3 fw-bold">
                        <Col xs={24} md={10} lg={12} className="text-start">
                          <span className={isTablet ? "fs-6" : "fs-5"}>Thông tin sản phẩm</span>
                        </Col>
                        <Col xs={24} md={4} lg={4} className="text-center">
                          <span className={isTablet ? "fs-6" : "fs-5"}>Đơn giá</span>
                        </Col>
                        <Col xs={24} md={6} lg={4} className="text-center">
                          <span className={isTablet ? "fs-6" : "fs-5"}>Số lượng</span>
                        </Col>
                        <Col xs={24} md={4} lg={4} className="text-end">
                          <span className={isTablet ? "fs-6" : "fs-5"}>Thành tiền</span>
                        </Col>
                      </Row>
                      
                      {/* Cart items */}
                      {cartItems.map((item, index) => (
                        <Row key={`${item.product.id}-${item.size}`} className="mb-4 py-2 align-items-center">
                          {/* Product information */}
                          <Col xs={24} md={10} lg={12}>
                            <div className="d-flex align-items-center">
                              <div className={`${isTablet ? 'me-2' : 'me-3'} d-flex align-items-center justify-content-center`}>
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.title}
                                  className="img-fluid rounded"
                                  width={isTablet ? 60 : 80}
                                  height={isTablet ? 60 : 80}
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                              <div className="overflow-hidden">
                                <Link href={`/products/${item.product.slug}`}>
                                  <p className={`mb-2 fw-bold text-truncate ${isTablet ? 'fs-6' : ''}`} title={truncateText(item.product.title)}>
                                    {truncateText(item.product.title)}
                                  </p>
                                </Link>
                                <p className={`${isTablet ? 'mb-1' : 'mb-2'} small text-muted`}>
                                  Kích thước: {item.size}
                                </p>
                                <Button
                                  appearance="link"
                                  className="p-0 text-danger"
                                  onClick={() => removeFromCart(item.product.id, item.size)}
                                >
                                  Xóa
                                </Button>
                              </div>
                            </div>
                          </Col>
                          
                          {/* Price */}
                          <Col xs={8} md={4} lg={4} className="text-center mt-3 mt-md-0">
                            <div>
                              <p className={`text-danger fw-bold ${isTablet ? 'mb-1 fs-6' : 'mb-2'}`}>
                                {formatPrice(item.product.salePrice)}
                              </p>
                              <p className="text-decoration-line-through text-muted mb-1 small">
                                {formatPrice(item.product.originalPrice)}
                              </p>
                            </div>
                          </Col>
                          
                          {/* Quantity */}
                          <Col xs={8} md={6} lg={4} className="text-center mt-3 mt-md-0">
                            {renderQuantityControls(item.product, item.size, item.quantity)}
                          </Col>
                          
                          {/* Subtotal */}
                          <Col xs={8} md={4} lg={4} className="text-end mt-3 mt-md-0">
                            <span className={`text-danger fw-bold ${isTablet ? 'fs-6' : ''}`}>
                              {calculateSubtotal(item.product, item.quantity)}
                            </span>
                          </Col>
                          
                          {index < cartItems.length - 1 && (
                            <Col xs={24}>
                              <Divider className="my-3 d-md-none" />
                            </Col>
                          )}
                        </Row>
                      ))}
                    </div>
                  )}

                  <Divider className='d-none d-sm-block' />

                  <div className="d-none d-sm-flex justify-content-end mt-4">
                    <div className={`${isMobile || isTablet ? 'w-100' : ''} text-end`}>
                      <div className="mb-3">
                        <span className="me-3 fw-bold">Tổng tiền:</span>
                        <span className="text-danger fw-bold h4">{formattedTotal}</span>
                      </div>
                      <Button
                        onClick={handleCheckout}
                        appearance="primary"
                        color="black"
                        size={isTablet ? "md" : "lg"}
                        className={`${isMobile || isTablet ? 'w-100' : ''}`}
                      >
                        Tiến hành thanh toán
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <Panel bordered className="text-center py-5">
                  <MdShoppingCart size={64} className="text-muted mb-3" />
                  <h4 className="fw-bold mb-3">Giỏ hàng của bạn đang trống</h4>
                  <p className="mb-4">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
                  <Link href="/">
                    <Button appearance="primary" color="black" size="lg">
                      Tiếp tục mua sắm
                    </Button>
                  </Link>
                </Panel>
              )}
            </Panel>
          </Col>
        </Row>
      </Content>
    </Container>
  );
}
