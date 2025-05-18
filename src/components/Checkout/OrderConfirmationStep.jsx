import React, { useState } from 'react';
import { Panel, ButtonToolbar, Button } from 'rsuite';
import { MdArrowBack, MdCheckCircle } from 'react-icons/md';

const OrderConfirmationStep = ({ 
  onSubmit, 
  onBack, 
  shippingInfo, 
  shippingMethod, 
  paymentMethod,
  cartTotal,
  cartItems
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Submit the order
    await onSubmit({
      shippingInfo,
      shippingMethod,
      paymentMethod,
      cartItems,
      cartTotal,
      discountType: 'percent',
      orderId: 'ORD-' + Math.floor(Math.random() * 1000000)
    });
    
    setIsSubmitting(false);
  };

  // Calculate order total
  const orderTotal = (cartTotal || 0) + (shippingMethod?.price || 0);

  return (
    <div>
      <h4 className="mb-4">Xác nhận đơn hàng</h4>
      
      {/* Shipping info summary */}
      <Panel bordered className="mb-4 p-3">
        <h5 className="mb-3">Thông tin giao hàng</h5>
        <p className="mb-1"><strong>{shippingInfo?.fullName}</strong> | {shippingInfo?.phone}</p>
        <p className="mb-0">
          {shippingInfo?.address}, {shippingInfo?.ward}, {shippingInfo?.district}, {shippingInfo?.city}
        </p>
        {shippingInfo?.email && <p className="mb-0">Email: {shippingInfo?.email}</p>}
      </Panel>
      
      {/* Shipping method summary */}
      <Panel bordered className="mb-4 p-3">
        <h5 className="mb-3">Phương thức vận chuyển</h5>
        <p className="mb-1 d-flex justify-content-between">
          <span>{shippingMethod?.name}</span>
          <span className="fw-bold">{shippingMethod?.price?.toLocaleString('vi-VN')}đ</span>
        </p>
      </Panel>
      
      {/* Payment method summary */}
      <Panel bordered className="mb-4 p-3">
        <h5 className="mb-3">Phương thức thanh toán</h5>
        <p className="mb-0">{paymentMethod?.name}</p>
      </Panel>
      
      {/* Order total */}
      <Panel bordered className="mb-4 p-3">
        <h5 className="mb-3">Tổng thanh toán</h5>
        <div className="d-flex justify-content-between align-items-center">
          <span>Tạm tính:</span>
          <span>{(cartTotal || 0).toLocaleString('vi-VN')}đ</span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span>Phí vận chuyển:</span>
          <span>{(shippingMethod?.price || 0).toLocaleString('vi-VN')}đ</span>
        </div>
        <hr />
        <div className="d-flex justify-content-between align-items-center fw-bold">
          <span>Tổng cộng:</span>
          <span>{orderTotal.toLocaleString('vi-VN')}đ</span>
        </div>
      </Panel>
      
      {/* Navigation buttons */}
      <ButtonToolbar className="mt-4 d-flex justify-content-between">
        <Button 
          appearance="subtle" 
          onClick={onBack}
          disabled={isSubmitting}
          className="d-flex align-items-center"
        >
          <MdArrowBack className="me-2" /> Quay lại
        </Button>
        
        <Button 
          appearance="primary" 
          color="green" 
          size="lg" 
          onClick={handleSubmit}
          disabled={isSubmitting}
          loading={isSubmitting}
          className="d-flex align-items-center"
        >
          Xác nhận đặt hàng <MdCheckCircle className="ms-2" />
        </Button>
      </ButtonToolbar>
    </div>
  );
};

export default OrderConfirmationStep;
