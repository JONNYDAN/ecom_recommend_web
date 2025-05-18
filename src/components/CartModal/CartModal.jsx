import React from 'react';
import { Modal, Button, ButtonGroup, Panel } from 'rsuite';
import { MdAdd, MdRemove, MdClose, MdShoppingCart } from 'react-icons/md';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

const CartModal = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    getCartCount, 
    isCartModalOpen, 
    closeCartModal, 
    lastAddedProduct,
    isMobile
  } = useCart();

  // Don't render the modal at all on mobile devices
  if (isMobile) {
    return null;
  }

  const formatPrice = (price) => {
    if (typeof price === 'string') {
      // If price is already formatted string like "890.000đ"
      return price;
    }
    // Otherwise assume it's a number
    return price.toLocaleString('vi-VN') + 'đ';
  };

  // Format cart total for display
  const formattedTotal = formatPrice(getCartTotal());  

  return (
    <Modal
      open={isCartModalOpen}
      onClose={closeCartModal}
      size="lg"
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title>
            {lastAddedProduct && (
              <>Bạn đã thêm {lastAddedProduct.title} vào giỏ hàng</>
            )}
          <Button appearance="subtle" onClick={closeCartModal} className="p-0">
            <MdClose size={24} />
          </Button>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <p className="mb-4 fw-bold">Giỏ hàng của bạn hiện có {getCartCount()} sản phẩm</p>
        
        {cartItems.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Thông tin sản phẩm</th>
                  <th style={{ width: '20%' }} className="text-center">Đơn giá</th>
                  <th style={{ width: '20%' }} className="text-center">Số lượng</th>
                  <th style={{ width: '20%' }} className="text-end">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={`${item.product.id}-${item.size}`} style={{ height: '120px' }}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="me-3 d-flex align-items-center justify-content-center">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.title}
                            className="img-fluid rounded"
                            width={70}
                            height={70}
                          />
                        </div>
                        <div className="overflow-hidden">
                          <p className="mb-2 text-truncate" title={item.product.title} style={{ maxWidth: '200px' }}>
                            {item.product.title}
                          </p>
                          <p className="small text-muted mb-2">
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
                    </td>
                    <td className="text-center align-middle">
                      <div>
                        <p className="text-decoration-line-through text-muted mb-1">
                          {formatPrice(item.product.originalPrice)}
                        </p>
                        <p className="text-danger fw-bold">
                          {formatPrice(item.product.salePrice)}
                        </p>
                      </div>
                    </td>
                    <td className="text-center align-middle">
                      <ButtonGroup>
                        <Button
                          appearance="default"
                          className="d-flex align-items-center justify-content-center"
                          style={{ width: '30px', height: '30px' }}
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                        >
                          <MdRemove />
                        </Button>
                        <Button
                          appearance="default"
                          disabled
                          className="text-center"
                          style={{ width: '40px', height: '30px' }}
                        >
                          {item.quantity}
                        </Button>
                        <Button
                          appearance="default"
                          className="d-flex align-items-center justify-content-center"
                          style={{ width: '30px', height: '30px' }}
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                        >
                          <MdAdd />
                        </Button>
                      </ButtonGroup>
                    </td>
                    <td className="text-end align-middle">
                      <span className="text-danger fw-bold">
                        {formatPrice(item.product.salePrice * item.quantity)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Panel bordered className="text-center py-5">
            <MdShoppingCart size={48} className="text-muted mb-3" />
            <p>Giỏ hàng của bạn đang trống</p>
          </Panel>
        )}
        
        {cartItems.length > 0 && (
          <div className="d-flex justify-content-end mt-4">
            <div className="text-end">
              <div className="mb-3">
                <span className="me-3 fw-bold">Tổng tiền:</span>
                <span className="text-danger fw-bold h4">{formattedTotal}</span>
              </div>
              <Link href="/cart">
                <Button appearance="primary" color="black" size="lg" onClick={closeCartModal}>
                  Thanh toán
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CartModal;
