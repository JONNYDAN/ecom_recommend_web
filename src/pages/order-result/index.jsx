import React, { useState, useEffect } from 'react';
import {
  Container,
  Content,
  FlexboxGrid,
  Panel,
  Divider,
  Button,
  Row,
  Col,
  Stack,
  IconButton,
  Message,
  Whisper,
  Tooltip
} from 'rsuite';
import {
  MdCheckCircle,
  MdError,
  MdPending,
  MdPerson,
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdLocalShipping,
  MdPayment,
  MdReceipt,
  MdArrowBack,
  MdRefresh,
  MdTracking,
  MdContentCopy,
  MdOutlineMoneyOff,
  MdCreditCard,
  MdQrCode
} from 'react-icons/md';
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { combineListLocales } from "@/config/localeConfig";

export async function getServerSideProps({ locale, params }) {
  
  const translation = await serverSideTranslations(
    locale,
    combineListLocales("checkout")
  );
  
  return {
    props: {
      ...translation,
    },
  };
}

export default function OrderResultPage() {
  const [orderStatus, setOrderStatus] = useState('pending'); // 'success', 'failure', 'pending'
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod', 'vietqr', 'credit_card'
  const router = useRouter();
  const [orderData, setOrderData] = useState({
    orderId: '',
    date: new Date().toLocaleDateString('vi-VN'),
    customer: {
      name: '',
      phone: '',
      email: '',
      address: ''
    },
    shipping: {
      method: '',
      cost: 0
    },
    payment: {
      method: '',
      cardNumber: '',
      bankName: 'Vietcombank',
      accountNumber: '1234567890',
      accountName: 'NGUYEN VAN A'
    },
    totals: {
      subtotal: 0,
      shipping: 0,
      total: 0
    }
  });

  // Process data from checkout page
  useEffect(() => {
    try {
      // Check if we have order data from checkout
      if (router.query.orderData) {
        const parsedData = JSON.parse(router.query.orderData);
        
        if (parsedData.success === true && parsedData.data) {
          const apiOrderData = parsedData.data;
          console.log('log-94', apiOrderData)
          // Map API response data to our orderData structure
          setOrderData({
            orderId: apiOrderData.code || '',
            date: new Date(apiOrderData.createdAt).toLocaleDateString('vi-VN'),
            customer: {
              name: apiOrderData.customerInfo?.name || '',
              phone: apiOrderData.customerInfo?.phoneNumber || '',
              email: apiOrderData.customerInfo?.email || '',
              address: formatAddress(apiOrderData.customerInfo)
            },
            shipping: {
              method: apiOrderData.shippingType === 'standard' ? 'Giao Hàng Tiêu Chuẩn' : 'Giao Hàng Nhanh',
              cost: apiOrderData.shippingCost || 0
            },
            payment: {
              method: apiOrderData.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 
                      apiOrderData.paymentMethod === 'vietqr' ? 'Chuyển khoản VietQR' : 'Thẻ tín dụng',
              cardNumber: '**** **** **** 1234',
              bankName: 'Vietcombank',
              accountNumber: '1234567890',
              accountName: 'NGUYEN VAN A'
            },
            totals: {
              subtotal: apiOrderData.amount || 0,
              shipping: apiOrderData.shippingCost || 0,
              total: apiOrderData.totalAmount || 0
            }
          });

          // Set the order status based on API response
          setOrderStatus(apiOrderData.status === 'completed' ? 'success' : 
                         apiOrderData.status === 'failed' ? 'failure' : 'pending');
          
          // Set the payment method
          setPaymentMethod(apiOrderData.paymentMethod || 'cod');
        } else if (router.query.success === 'false') {
          // Handle error
          setOrderStatus('failure');
        }
      } else if (router.query.success === 'false') {
        // Handle error from direct query params
        setOrderStatus('failure');
      }
    } catch (error) {
      console.error("Error processing order data:", error);
      setOrderStatus('failure');
    }
  }, [router.query]);

  // Helper function to format complete address
  const formatAddress = (customerInfo) => {
    if (!customerInfo) return '';
    
    const addressParts = [
      customerInfo.address,
      customerInfo.ward,
      customerInfo.district,
      customerInfo.province
    ].filter(part => part && part.trim() !== '');
    
    return addressParts.join(', ');
  };

  // Format currency for VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Status-specific configurations
  const statusConfig = {
    success: {
      icon: <MdCheckCircle size={48} className="text-success" />,
      title: 'Đặt hàng thành công',
      message: `Cảm ơn bạn đã đặt hàng! Đơn hàng #${orderData.orderId} đã được xác nhận.`,
      buttonText: 'Theo dõi đơn hàng',
      buttonIcon: MdTracking,
      buttonAppearance: 'primary',
      buttonAction: () => console.log('Navigate to tracking page'),
      headerClassName: 'bg-success text-white'
    },
    failure: {
      icon: <MdError size={48} className="text-danger" />,
      title: 'Thanh toán thất bại',
      message: `Chúng tôi rất tiếc, đã có lỗi xảy ra khi xử lý đơn hàng #${orderData.orderId}.`,
      buttonText: 'Thử lại',
      buttonIcon: MdRefresh,
      buttonAppearance: 'primary',
      buttonAction: () => console.log('Retry payment'),
      headerClassName: 'bg-danger text-white'
    },
    pending: {
      icon: <MdPending size={48} className="text-warning" />,
      title: 'Đang xử lý đơn hàng',
      message: `Chúng tôi đang xử lý đơn hàng #${orderData.orderId}. Vui lòng đợi trong giây lát.`,
      buttonText: 'Kiểm tra trạng thái',
      buttonIcon: MdRefresh,
      buttonAppearance: 'primary',
      buttonAction: () => console.log('Refresh status'),
      headerClassName: 'bg-warning'
    }
  };

  const currentStatus = statusConfig[orderStatus];

  // Payment method specific rendering
  const renderPaymentDetails = () => {
    switch(paymentMethod) {
      case 'cod':
        return (
          <Row>
            <Col xs={24} md={24}>
              <p className="text-muted mb-1">Phương thức</p>
              <Stack spacing={8} alignItems="center">
                <MdOutlineMoneyOff size={24} className="text-success" />
                <p className="fw-bold mb-0">Thanh toán khi nhận hàng</p>
              </Stack>
            </Col>
          </Row>
        );
      case 'vietqr':
        return (
          <div>
            <Row className="mb-3">
              <Col xs={24} md={24}>
                <p className="text-muted mb-1">Phương thức</p>
                <Stack spacing={8} alignItems="center">
                  <MdQrCode size={24} className="text-primary" />
                  <p className="fw-bold mb-0">Chuyển khoản VietQR</p>
                </Stack>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col xs={24} md={12} className="text-center mb-3">
                <img 
                  src="https://via.placeholder.com/200x200?text=QR+Code" 
                  alt="VietQR Code" 
                  className="img-fluid" 
                  style={{ maxWidth: '200px', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </Col>
              
              <Col xs={24} md={12}>
                <div className="mb-3 p-3 bg-light" style={{ borderRadius: '8px' }}>
                  <Stack direction="column" spacing={10}>
                    <div>
                      <p className="text-muted mb-1">Ngân hàng</p>
                      <Stack spacing={8} alignItems="center" className="mb-2">
                        <p className="fw-bold mb-0">{orderData.payment.bankName}</p>
                        <Whisper
                          placement="top"
                          trigger="click"
                          speaker={<Tooltip>Đã sao chép!</Tooltip>}
                        >
                          <IconButton 
                            icon={<MdContentCopy />} 
                            size="sm" 
                            onClick={() => copyToClipboard(orderData.payment.bankName)}
                          />
                        </Whisper>
                      </Stack>
                    </div>
                    
                    <div>
                      <p className="text-muted mb-1">Số tài khoản</p>
                      <Stack spacing={8} alignItems="center" className="mb-2">
                        <p className="fw-bold mb-0">{orderData.payment.accountNumber}</p>
                        <Whisper
                          placement="top"
                          trigger="click"
                          speaker={<Tooltip>Đã sao chép!</Tooltip>}
                        >
                          <IconButton 
                            icon={<MdContentCopy />} 
                            size="sm" 
                            onClick={() => copyToClipboard(orderData.payment.accountNumber)}
                          />
                        </Whisper>
                      </Stack>
                    </div>
                    
                    <div>
                      <p className="text-muted mb-1">Chủ tài khoản</p>
                      <Stack spacing={8} alignItems="center" className="mb-2">
                        <p className="fw-bold mb-0">{orderData.payment.accountName}</p>
                        <Whisper
                          placement="top"
                          trigger="click"
                          speaker={<Tooltip>Đã sao chép!</Tooltip>}
                        >
                          <IconButton 
                            icon={<MdContentCopy />} 
                            size="sm" 
                            onClick={() => copyToClipboard(orderData.payment.accountName)}
                          />
                        </Whisper>
                      </Stack>
                    </div>
                    
                    <div>
                      <p className="text-muted mb-1">Số tiền</p>
                      <Stack spacing={8} alignItems="center">
                        <p className="fw-bold mb-0 text-danger">{formatCurrency(orderData.totals.total)}</p>
                        <Whisper
                          placement="top"
                          trigger="click"
                          speaker={<Tooltip>Đã sao chép!</Tooltip>}
                        >
                          <IconButton 
                            icon={<MdContentCopy />} 
                            size="sm" 
                            onClick={() => copyToClipboard(orderData.totals.total.toString())}
                          />
                        </Whisper>
                      </Stack>
                    </div>
                  </Stack>
                </div>
                
                <Message type="info" className="mb-3">
                  <b>Nội dung chuyển khoản:</b> {orderData.orderId}
                </Message>
              </Col>
            </Row>
            
            <Message type="warning">
              Vui lòng hoàn tất thanh toán trong vòng 24 giờ. Đơn hàng sẽ tự động hủy nếu không nhận được thanh toán.
            </Message>
          </div>
        );
      case 'credit_card':
        return (
          <Row>
            <Col xs={24} md={12}>
              <p className="text-muted mb-1">Phương thức</p>
              <Stack spacing={8} alignItems="center">
                <MdCreditCard size={24} className="text-primary" />
                <p className="fw-bold mb-0">Thẻ tín dụng</p>
              </Stack>
            </Col>
            <Col xs={24} md={12}>
              <p className="text-muted mb-1">Số thẻ</p>
              <p className="fw-bold mb-0">{orderData.payment.cardNumber}</p>
            </Col>
          </Row>
        );
      default:
        return null;
    }
  };

  const handleGoHome = () => {
    // Navigate to home page
    router.replace('/');

  };

  return (
    <Container>
      <Content className="py-5">
        {/* For demo purposes only */}
        {/* <StatusToggle /> */}
        
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item as={Col} xs={24} md={20} lg={18}>
            {/* Status Header */}
            <Panel 
              className={currentStatus.headerClassName} 
              bodyFill
              style={{ borderRadius: '12px', overflow: 'hidden' }}
            >
              <Stack spacing={10} className="p-4" alignItems="center">
                {currentStatus.icon}
                <Stack direction="column" alignItems="flex-start" className="flex-grow-1">
                  <h3 className="fw-bold mb-0">{currentStatus.title}</h3>
                  <p className="mb-0">{currentStatus.message}</p>
                </Stack>
              </Stack>
            </Panel>

            {/* Order Details */}
            <Panel bordered className="mt-4" style={{ borderRadius: '12px' }}>
              <h4 className="mb-3">Thông tin đơn hàng</h4>
              <Row>
                <Col xs={24} md={12}>
                  <p className="text-muted mb-1">Mã đơn hàng</p>
                  <p className="mb-3 fw-bold">{orderData.orderId}</p>
                </Col>
                <Col xs={24} md={12}>
                  <p className="text-muted mb-1">Ngày đặt hàng</p>
                  <p className="mb-3 fw-bold">{orderData.date}</p>
                </Col>
              </Row>
            </Panel>

            {/* Customer Information */}
            <Panel bordered className="mt-4" style={{ borderRadius: '12px' }}>
              <h4 className="mb-3">Thông tin khách hàng</h4>
              <Stack direction="column" spacing={15} alignItems="flex-start">
                <Stack spacing={8} alignItems="flex-start">
                  <MdPerson className="text-muted" size={20} />
                  <div>
                    <p className="text-muted mb-1">Họ tên</p>
                    <p className="fw-bold mb-0">{orderData.customer.name}</p>
                  </div>
                </Stack>
                
                <Stack spacing={8} alignItems="flex-start">
                  <MdPhone className="text-muted" size={20} />
                  <div>
                    <p className="text-muted mb-1">Số điện thoại</p>
                    <p className="fw-bold mb-0">{orderData.customer.phone}</p>
                  </div>
                </Stack>
                
                <Stack spacing={8} alignItems="flex-start">
                  <MdEmail className="text-muted" size={20} />
                  <div>
                    <p className="text-muted mb-1">Email</p>
                    <p className="fw-bold mb-0">{orderData.customer.email}</p>
                  </div>
                </Stack>
                
                <Stack spacing={8} alignItems="flex-start">
                  <MdLocationOn className="text-muted" size={20} />
                  <div>
                    <p className="text-muted mb-1">Địa chỉ</p>
                    <p className="fw-bold mb-0">{orderData.customer.address}</p>
                  </div>
                </Stack>
              </Stack>
            </Panel>

            {/* Shipping Method */}
            <Panel bordered className="mt-4" style={{ borderRadius: '12px' }}>
              <h4 className="mb-3">
                <MdLocalShipping className="me-2" /> Phương thức vận chuyển
              </h4>
              <Row>
                <Col xs={24} md={12}>
                  <p className="text-muted mb-1">Phương thức</p>
                  <p className="fw-bold mb-3">{orderData.shipping.method}</p>
                </Col>
                <Col xs={24} md={12}>
                  <p className="text-muted mb-1">Chi phí</p>
                  <p className="fw-bold mb-3">{formatCurrency(orderData.shipping.cost)}</p>
                </Col>
              </Row>
            </Panel>

            {/* Payment Method */}
            <Panel bordered className="mt-4" style={{ borderRadius: '12px' }}>
              <h4 className="mb-3">
                <MdPayment className="me-2" /> Phương thức thanh toán
              </h4>
              {renderPaymentDetails()}
            </Panel>

            {/* Order Total */}
            <Panel bordered className="mt-4" style={{ borderRadius: '12px' }}>
              <h4 className="mb-3">
                <MdReceipt className="me-2" /> Tổng giá trị đơn hàng
              </h4>
              <div className="mb-2 pb-2 border-bottom">
                <Row>
                  <Col xs={12}>
                    <p className="text-muted">Tạm tính</p>
                  </Col>
                  <Col xs={12} className="text-end">
                    <p className="fw-bold">{formatCurrency(orderData.totals.subtotal)}</p>
                  </Col>
                </Row>
              </div>
              
              <div className="mb-2 pb-2 border-bottom">
                <Row>
                  <Col xs={12}>
                    <p className="text-muted">Phí vận chuyển</p>
                  </Col>
                  <Col xs={12} className="text-end">
                    <p className="fw-bold">{formatCurrency(orderData.totals.shipping)}</p>
                  </Col>
                </Row>
              </div>
              
              <div className="mb-2 pt-2">
                <Row className="bg-light p-3 rounded">
                  <Col xs={12}>
                    <p className="h4">Tổng cộng</p>
                  </Col>
                  <Col xs={12} className="text-end">
                    <p className="h4 fw-bold text-danger">{formatCurrency(orderData.totals.total)}</p>
                  </Col>
                </Row>
              </div>
            </Panel>

            {/* Action Buttons */}
            <Panel className="mt-4" style={{ borderRadius: '12px' }}>
              <Stack spacing={10} justifyContent="center">
                <Button appearance="subtle" onClick={handleGoHome}>
                  <MdArrowBack /> Trang chủ
                </Button>
                <Button 
                  appearance={currentStatus.buttonAppearance}
                  onClick={currentStatus.buttonAction}
                  className={`${orderStatus === 'success' ? 'bg-success' : orderStatus === 'failure' ? 'bg-danger' : 'bg-warning'} fw-bold`}
                  size="lg"
                >
                  {currentStatus.buttonIcon && <currentStatus.buttonIcon />} {currentStatus.buttonText}
                </Button>
              </Stack>
            </Panel>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Content>
    </Container>
  );
}