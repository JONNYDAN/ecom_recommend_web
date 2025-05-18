import React, { useState } from 'react';
import { Panel, RadioGroup, Radio, ButtonToolbar, Button } from 'rsuite';
import { MdArrowBack, MdArrowForward, MdMoneyOff, MdPayment, MdQrCode } from 'react-icons/md';

const PaymentMethodStep = ({ 
  onSubmit, 
  initialSelection = {}, 
  shippingInfo, 
  shippingMethod, 
  onBack 
}) => {
  const [selectedMethod, setSelectedMethod] = useState(initialSelection.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Available payment methods
  const paymentMethods = [
    { 
      id: 'cod', 
      name: 'Thanh toán khi nhận hàng (COD)', 
      description: 'Thanh toán bằng tiền mặt khi nhận hàng',
      icon: <MdMoneyOff size={24} className="text-success" />
    },
    { 
      id: 'bank', 
      name: 'Chuyển khoản ngân hàng', 
      description: 'Chuyển khoản qua VietQR hoặc Internet Banking',
      icon: <MdQrCode size={24} className="text-primary" />
    },
  ];
  
  const handleSubmit = async () => {
    if (isSubmitting || !selectedMethod) return;
    
    setIsSubmitting(true);
    
    const method = paymentMethods.find(m => m.id === selectedMethod);
    await onSubmit(method);
    
    setIsSubmitting(false);
  };

  return (
    <div>
      <h4 className="mb-4">Chọn phương thức thanh toán</h4>
      
      {/* Shipping info summary */}
      <Panel bordered className="mb-4 p-3">
        <h5 className="mb-3">Thông tin giao hàng</h5>
        <p className="mb-1"><strong>{shippingInfo.fullName}</strong> | {shippingInfo.phone}</p>
        <p className="mb-0">
          {shippingInfo.address}, {shippingInfo.ward}, {shippingInfo.district}, {shippingInfo.city}
        </p>
      </Panel>
      
      {/* Shipping method summary */}
      <Panel bordered className="mb-4 p-3">
        <h5 className="mb-3">Phương thức vận chuyển</h5>
        <p className="mb-1 d-flex justify-content-between">
          <span>{shippingMethod.name}</span>
          <span className="fw-bold">{shippingMethod.price.toLocaleString('vi-VN')}đ</span>
        </p>
      </Panel>
      
      {/* Payment method selection */}
      <div className="mb-4">
        <h5 className="mb-3">Phương thức thanh toán</h5>
        
        <RadioGroup 
          name="paymentMethod" 
          value={selectedMethod}
          onChange={setSelectedMethod}
        >
          {paymentMethods.map(method => (
            <Panel bordered className="mb-3 p-3" key={method.id}>
              <Radio value={method.id} className="w-100">
                <div className="d-flex align-items-center">
                  <div className="me-3">{method.icon}</div>
                  <div>
                    <p className="mb-1 fw-bold">{method.name}</p>
                    <p className="small text-muted mb-0">{method.description}</p>
                  </div>
                </div>
              </Radio>
            </Panel>
          ))}
        </RadioGroup>
      </div>
      
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
          color="black" 
          size="lg" 
          onClick={handleSubmit}
          disabled={!selectedMethod || isSubmitting}
          loading={isSubmitting}
          className="d-flex align-items-center"
        >
          Tiếp tục xác nhận đơn hàng <MdArrowForward className="ms-2" />
        </Button>
      </ButtonToolbar>
    </div>
  );
};

export default PaymentMethodStep;
