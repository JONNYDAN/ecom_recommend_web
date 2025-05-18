import React, { useState } from 'react';
import { Panel, List, Input, InputGroup, Button, Divider } from 'rsuite';
import { MdLocalShipping, MdDiscount } from 'react-icons/md';
import Link from 'next/link';

const OrderSummary = ({ cartItems = [], shippingMethod = { price: 0 } }) => {
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product.salePrice * item.quantity);
  }, 0);

  // Calculate total with shipping and discount
  const total = subtotal + shippingMethod.price - discount;

  // Format price
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  // Apply discount code
  const handleApplyDiscount = () => {
    if (discountCode && !discountApplied) {
      // In a real app, you'd validate the discount code with an API
      // For now, we'll just apply a fixed 10% discount
      const discountAmount = subtotal * 0.1;
      setDiscount(discountAmount);
      setDiscountApplied(true);
    }
  };

  return (
    <Panel bordered className="p-4">
      <h4 className="fw-bold mb-3">Đơn hàng của bạn</h4>
      
      {/* Item list */}
      <List className="mb-4">
        {cartItems.map((item) => (
          <List.Item key={`${item.product.id}-${item.size}`} className="py-2">
            <div className="d-flex">
              <div className="me-3">
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.title}
                  className="img-fluid rounded"
                  width={50}
                  height={50}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="flex-grow-1">
                <p className="mb-1 fw-bold small">
                  {item.product.title} <span className="text-muted">x{item.quantity}</span>
                </p>
                <p className="small text-muted mb-0">
                  Kích thước: {item.size}
                </p>
              </div>
              <div className="ms-2 text-end">
                <p className="text-danger fw-bold small mb-0">
                  {formatPrice(item.product.salePrice * item.quantity)}
                </p>
              </div>
            </div>
          </List.Item>
        ))}
      </List>
      
      {/* Discount code */}
      <div className="mb-4">
        <p className="mb-2 fw-bold">Mã giảm giá</p>
        <InputGroup>
          <Input 
            value={discountCode}
            onChange={setDiscountCode}
            disabled={discountApplied}
            placeholder="Nhập mã giảm giá"
          />
          <InputGroup.Button 
            onClick={handleApplyDiscount}
            disabled={!discountCode || discountApplied}
          >
            <MdDiscount /> Áp dụng
          </InputGroup.Button>
        </InputGroup>
        {discountApplied && (
          <p className="text-success small mt-1">
            Đã áp dụng mã giảm giá!
          </p>
        )}
      </div>
      
      <Divider />
      
      {/* Order totals */}
      <div>
        <div className="d-flex justify-content-between mb-2">
          <span>Tạm tính:</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        <div className="d-flex justify-content-between mb-2">
          <span>Phí vận chuyển:</span>
          <span>{shippingMethod.price ? formatPrice(shippingMethod.price) : 'Chọn ở bước tiếp'}</span>
        </div>
        
        {discount > 0 && (
          <div className="d-flex justify-content-between mb-2 text-success">
            <span>Giảm giá:</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        
        <Divider className="my-3" />
        
        <div className="d-flex justify-content-between mb-2 fw-bold">
          <span>Tổng cộng:</span>
          <span className="text-danger h5 mb-0">{formatPrice(total)}</span>
        </div>
      </div>
    </Panel>
  );
};

export default OrderSummary;
