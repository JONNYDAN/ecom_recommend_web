import React, { useState, useEffect } from 'react';
import { Panel, RadioGroup, Radio, ButtonToolbar, Button, Col, Row, FlexboxGrid } from 'rsuite';
import { MdArrowBack, MdArrowForward, MdLocalShipping } from 'react-icons/md';

const ShippingMethodStep = ({ onSubmit, initialSelection = {}, shippingInfo, onBack }) => {
  const [selectedMethod, setSelectedMethod] = useState(initialSelection.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Available shipping methods (in a real app, these might come from an API)
  const shippingMethods = [
    { id: 'standard', name: 'Giao hàng tiêu chuẩn', price: 30000, time: '3-5 ngày' },
    { id: 'express', name: 'Giao hàng nhanh', price: 55000, time: '1-2 ngày' },
  ];

  // Log initial selection for debugging
  useEffect(() => {
    console.log('Initial shipping method:', initialSelection);
  }, [initialSelection]);

  // Format price
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };
  
  const handleSubmit = async () => {
    if (isSubmitting || !selectedMethod) return;
    
    setIsSubmitting(true);
    
    console.log('Submitting selected method:', selectedMethod);
    const method = shippingMethods.find(m => m.id === selectedMethod);
    console.log('Found method:', method);
    
    await onSubmit(method);
    setIsSubmitting(false);
  };

  const handleMethodChange = (value) => {
    console.log('Selected shipping method:', value);
    setSelectedMethod(value);
  };

  return (
    <div>
      <h4 className="mb-4">Chọn phương thức vận chuyển</h4>
      
      {/* Shipping info summary */}
      <Panel bordered className="mb-4 p-3">
        <h5 className="mb-3">Địa chỉ giao hàng</h5>
        <p className="mb-1"><strong>{shippingInfo.fullName}</strong> | {shippingInfo.phone}</p>
        <p className="mb-0">
          {shippingInfo.address}, {shippingInfo.ward}, {shippingInfo.district}, {shippingInfo.city}
        </p>
      </Panel>
      
      {/* Shipping method selection */}
      <div className="mb-4">
        <h5 className="mb-3">Phương thức vận chuyển</h5>
        
        <RadioGroup 
          name="shippingMethod" 
          value={selectedMethod}
          onChange={handleMethodChange}
        >
          <Row>
            {shippingMethods.map(method => (
              <Col xs={24} md={24} key={method.id} className="mb-3">
                <Panel 
                  bordered 
                  className={`p-3 cursor-pointer shipping-method-panel ${selectedMethod === method.id ? 'selected-shipping-method' : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
                  shaded
                >
                  <FlexboxGrid align="middle">
                    <FlexboxGrid.Item colspan={2}>
                      <Radio 
                        value={method.id} 
                        checked={selectedMethod === method.id}
                        className="shipping-radio"
                      />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={22}>
                      <FlexboxGrid justify="space-between" align="middle">
                        <FlexboxGrid.Item colspan={16}>
                          <p className="mb-1 d-flex align-items-center fw-bold">
                            <MdLocalShipping className="me-2 text-primary" size={20} /> {method.name}
                          </p>
                          <p className="small text-muted mb-0">
                            Thời gian giao hàng: {method.time}
                          </p>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={8} className="text-end">
                          <p className="fw-bold mb-0 fs-5">{formatPrice(method.price)}</p>
                        </FlexboxGrid.Item>
                      </FlexboxGrid>
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </Panel>
              </Col>
            ))}
          </Row>
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
          Tiếp tục chọn phương thức thanh toán <MdArrowForward className="ms-2" />
        </Button>
      </ButtonToolbar>

      <style jsx>{`
        .shipping-method-panel {
          transition: all 0.2s ease;
          border-radius: 8px;
        }
        .shipping-method-panel:hover {
          border-color: #aaa;
        }
        .selected-shipping-method {
          border-color: #000;
          border-width: 2px;
          background-color: rgba(0, 0, 0, 0.02);
        }
        .shipping-radio {
          transform: scale(1.2);
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ShippingMethodStep;
