import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Steps, Panel, ButtonGroup, Button, Loader } from 'rsuite';
import { MdArrowBack, MdCheck, MdShoppingCart } from 'react-icons/md';
import { useCart } from '@/contexts/CartContext';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { combineListLocales } from "@/config/localeConfig";
import { API_URL } from '@/config/constants';
import { useSelector } from "react-redux";

// Step Components
import ShippingInfoStep from '@/components/Checkout/ShippingInfoStep';
import ShippingMethodStep from '@/components/Checkout/ShippingMethodStep';
import PaymentMethodStep from '@/components/Checkout/PaymentMethodStep';
import OrderConfirmationStep from '@/components/Checkout/OrderConfirmationStep';
import OrderSummary from '@/components/Checkout/OrderSummary';

// Custom hook for mobile detection
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  return isMobile;
};

// Initial state for checkout data
const initialCheckoutData = {
  shippingInfo: {
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: '',
  },
  shippingMethod: {
    id: '',
    name: '',
    price: 0,
  },
  paymentMethod: {
    id: '',
    name: '',
  },
};

// Utility function to sanitize data before JSON stringify
const sanitizeDataForStorage = (data) => {
  // Create a deep copy without circular references
  const sanitizedData = JSON.parse(JSON.stringify({
    shippingInfo: data.shippingInfo || {},
    shippingMethod: {
      id: data.shippingMethod?.id || '',
      name: data.shippingMethod?.name || '', 
      price: data.shippingMethod?.price || 0
    },
    paymentMethod: {
      id: data.paymentMethod?.id || '',
      name: data.paymentMethod?.name || ''
    }
  }));
  return sanitizedData;
};

export async function getStaticProps({ locale }) {
  const translation = await serverSideTranslations(
    locale,
    combineListLocales("checkout")
  );

  return {
    props: {
      ...translation,
    },
    revalidate: 60
  };
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [checkoutData, setCheckoutData] = useState(initialCheckoutData);
  const [isValidatingCart, setIsValidatingCart] = useState(true);
  const [localCartItems, setLocalCartItems] = useState([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  // Add state trackers for pending updates
  const [pendingShippingInfoUpdate, setPendingShippingInfoUpdate] = useState(false);
  const [pendingShippingMethodUpdate, setPendingShippingMethodUpdate] = useState(false);
  const [pendingPaymentMethodUpdate, setPendingPaymentMethodUpdate] = useState(false);
  const isMobile = useIsMobile();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  // const { orderId } = router.query;
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    const savedCheckoutData = localStorage.getItem('checkoutData');
    const savedStep = localStorage.getItem('checkoutStep');
    
    if (savedCheckoutData) {
      setCheckoutData(JSON.parse(savedCheckoutData));
    }
    
    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10));
    }

    // If there's an orderId in the URL, go to confirmation step
    // if (orderId) {
    //   setCurrentStep(3); // Order confirmation step
    // }
  }, []);

  // Directly check localStorage as a fallback
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setLocalCartItems(parsedCart);
        }
      }
    } catch (err) {
      console.error('Error loading cart from localStorage:', err);
    }
    setHasMounted(true);
  }, []);

  // Check if cart is empty, redirect to cart page if it is
  useEffect(() => {
    setIsValidatingCart(true);
    
    // Add a small delay to ensure context has time to load
    const timer = setTimeout(() => {
      // First check context cartItems, then fall back to localStorage if needed
      if (cartItems.length === 0 && localCartItems.length === 0) {
        console.log('Cart is empty, redirecting to cart page');
        router.push('/cart');
      } else {
        console.log('Cart has items, proceeding with checkout');
      }
      setIsValidatingCart(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [cartItems, localCartItems, router]);

  // Save checkout data to localStorage when it changes
  useEffect(() => {
    try {
    if (!hasMounted) return;
      // Sanitize the data to prevent circular references
      const sanitizedData = sanitizeDataForStorage(checkoutData);
      console.log('Saving checkout data to localStorage:', sanitizedData);
      localStorage.setItem('checkoutData', JSON.stringify(sanitizedData));
    } catch (error) {
      console.error('Error saving checkout data to localStorage:', error);
    }
  }, [checkoutData]);

  // Save current step to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('checkoutStep', currentStep.toString());
  }, [currentStep]);

  // Add useEffects to watch for state updates and trigger next step
  useEffect(() => {
    console.log('checkoutData.shippingInfo:', checkoutData.shippingInfo);
    if (pendingShippingInfoUpdate) {
      console.log('log-182: pendingShippingInfoUpdate:', pendingShippingInfoUpdate);
      setPendingShippingInfoUpdate(false);
      goToNextStep();
    }
  }, [checkoutData.shippingInfo]);

  useEffect(() => {
    if (pendingShippingMethodUpdate) {
      setPendingShippingMethodUpdate(false);
      goToNextStep();
    }
  }, [checkoutData.shippingMethod]);

  useEffect(() => {
    if (pendingPaymentMethodUpdate) {
      setPendingPaymentMethodUpdate(false);
      goToNextStep();
    }
  }, [checkoutData.paymentMethod]);

  // Handle step navigation with validation
  const goToNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prevStep => Math.min(prevStep + 1, 3));
    }
  };

  const goToPrevStep = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 0));
  };

  // Validate the current step data
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        // Updated validation to handle the new code fields
        const { fullName, phone, email, address, city, district, ward, cityCode, districtCode, wardCode } = checkoutData.shippingInfo;
        return (
          fullName && typeof fullName === 'string' && fullName.trim() !== '' &&
          phone && typeof phone === 'string' && phone.trim() !== '' &&
          (email === '' || (typeof email === 'string')) &&
          address && typeof address === 'string' && address.trim() !== '' &&
          city && typeof city === 'string' && city.trim() !== '' &&
          district && typeof district === 'string' && district.trim() !== '' &&
          ward && typeof ward === 'string' && ward.trim() !== '' &&
          cityCode && (typeof cityCode === 'string' || typeof cityCode === 'number') &&
          districtCode && (typeof districtCode === 'string' || typeof districtCode === 'number') &&
          wardCode && (typeof wardCode === 'string' || typeof wardCode === 'number')
        );
      case 1:
        return checkoutData.shippingMethod && checkoutData.shippingMethod.id;
      case 2:
        return checkoutData.paymentMethod && checkoutData.paymentMethod.id;
      default:
        return true;
    }
  };

  // Handle data updates for each step
  const updateShippingInfo = (shippingInfo) => {
    // Ensure we only store plain data objects
    const plainShippingInfo = { ...shippingInfo };
    setCheckoutData(prev => ({
      ...prev,
      shippingInfo: plainShippingInfo
    }));
    setPendingShippingInfoUpdate(true);
    // Don't call goToNextStep() here, it will be called by the useEffect
  };

  const updateShippingMethod = (shippingMethod) => {
    // Ensure we only store plain data objects
    const plainShippingMethod = {
      id: shippingMethod.id || '',
      name: shippingMethod.name || '',
      price: shippingMethod.price || 0
    };
    setCheckoutData(prev => ({
      ...prev,
      shippingMethod: plainShippingMethod
    }));
    setPendingShippingMethodUpdate(true);
    // Don't call goToNextStep() here, it will be called by the useEffect
  };

  const updatePaymentMethod = (paymentMethod) => {
    // Ensure we only store plain data objects
    const plainPaymentMethod = {
      id: paymentMethod.id || '',
      name: paymentMethod.name || ''
    };
    setCheckoutData(prev => ({
      ...prev,
      paymentMethod: plainPaymentMethod
    }));
    setPendingPaymentMethodUpdate(true);
    // Don't call goToNextStep() here, it will be called by the useEffect
  };

  // Submit order and navigate to order result page
  const handlePlaceOrder = async (orderData) => {
    try {
      if(!isLoggedIn) throw new Error('Bạn cần đăng nhập để thực hiện đơn hàng');
      if(!user) throw new Error('Không tìm thấy thông tin người dùng');
      setIsPlacingOrder(true);
      
      // Prepare cart items for the request - ensure all required fields exist
      const items = (cartItems.length > 0 ? cartItems : localCartItems)
        .filter(item => item && item.product && item.product.id) // Filter out items without product ID
        .map(item => {
          // Ensure price is a valid number
          let itemPrice = parseFloat(item.product.salePrice);
          if (isNaN(itemPrice)) {
            itemPrice = 0;
          }
          
          // Ensure quantity is a valid number
          let itemQuantity = parseInt(item.quantity, 10);
          if (isNaN(itemQuantity) || itemQuantity < 1) {
            itemQuantity = 1;
          }
          
          return {
            productId: item.product.id, // Get ID from product object
            name: item.product.title || "Unnamed Product",
            price: itemPrice, 
            quantity: itemQuantity,
            image: item.product.images && item.product.images.length > 0 
              ? item.product.images[0] 
              : "",
            size: item.size || "" // Include size if available
          };
        });
      
      console.log("Prepared items for order:", items);
      
      // Calculate total amount
      const cartTotalValue = typeof getCartTotal === 'function' ? getCartTotal() : 0;
      const shippingCost = checkoutData.shippingMethod?.price || 0;
      
      // Get shipping and payment info
      const { shippingInfo, paymentMethod } = checkoutData;
      
      // Build the request payload according to the required structure
      const requestBody = {
        user: user.id, // Use guest if no user ID available
        customerInfo: {
          email: shippingInfo.email || "",
          name: shippingInfo.fullName || "",
          phoneNumber: shippingInfo.phone || "",
          address: shippingInfo.address || "",
          province: shippingInfo.city || "",
          district: shippingInfo.district || "",
          ward: shippingInfo.ward || ""
        },
        shippingInfo: {
          name: shippingInfo.fullName || "",
          phoneNumber: shippingInfo.phone || "",
          address: shippingInfo.address || "",
          province: shippingInfo.city || "",
          district: shippingInfo.district || "",
          ward: shippingInfo.ward || ""
        },
        note: orderData.note || "",
        amount: cartTotalValue,
        voucherCode: orderData.voucherCode || "",
        discountType: orderData.discountType || "",
        discountValue: orderData.discountValue || 0,
        totalAmount: (cartTotalValue + shippingCost) - (orderData.discountAmount || 0),
        shippingType: checkoutData.shippingMethod?.id || "standard",
        shippingCost: shippingCost,
        paymentMethod: paymentMethod?.id || "cod",
        items: items
      };
      
      console.log("Sending order request:", requestBody);
      
      // Make the checkout API request
      const response = await fetch(`${API_URL}/api/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to place order');
      }
      
      // Clear checkout data from local storage
      localStorage.removeItem('checkoutData');
      localStorage.removeItem('checkoutStep');
      
      // Use the clearCart function from context to properly clear the cart
      clearCart();

      // Pass complete order response data to order-result page
      router.push({
        pathname: '/order-result',
        query: { 
          orderData: JSON.stringify(result)
        }
      });
      
    } catch (error) {
      console.error("Failed to place order:", error);
      // Show alert with error message
      alert(`Đã xảy ra lỗi khi đặt hàng: ${error.message}`);
      
      // Navigate to error result page
      // router.push({
      //   pathname: '/order-result',
      //   query: { 
      //     success: false,
      //     error: error.message
      //   }
      // });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Render current step component
  const renderStepContent = () => {
    const cartTotalValue = typeof getCartTotal === 'function' ? getCartTotal() : 0;
    
    switch (currentStep) {
      case 0:
        return (
          <ShippingInfoStep 
            onSubmit={updateShippingInfo}
            initialValues={checkoutData.shippingInfo}
          />
        );
      case 1:
        return (
          <ShippingMethodStep
            onSubmit={updateShippingMethod}
            initialSelection={checkoutData.shippingMethod}
            shippingInfo={checkoutData.shippingInfo}
            onBack={goToPrevStep}
          />
        );
      case 2:
        return (
          <PaymentMethodStep
            onSubmit={updatePaymentMethod}
            initialSelection={checkoutData.paymentMethod}
            shippingInfo={checkoutData.shippingInfo}
            shippingMethod={checkoutData.shippingMethod}
            onBack={goToPrevStep}
          />
        );
      case 3:
        return (
          <OrderConfirmationStep
            onSubmit={handlePlaceOrder}
            onBack={goToPrevStep}
            shippingInfo={checkoutData.shippingInfo}
            shippingMethod={checkoutData.shippingMethod}
            paymentMethod={checkoutData.paymentMethod}
            cartTotal={cartTotalValue}
            cartItems={cartItems.length > 0 ? cartItems : localCartItems}
            isLoading={isPlacingOrder}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  // Step titles for the stepper
  const stepTitles = [
    "Thông tin mua hàng",
    "Phương thức vận chuyển",
    "Phương thức thanh toán",
    "Xác nhận đơn hàng"
  ];

  return (
    <Container className="mt-5 mb-5">
      <Row className="mx-md-5">
        <Col xs={24}>
          <Panel bordered>
            <h2 className="fw-bold mb-4">Thanh toán</h2>
            
            {/* Stepper */}
            <div className="mb-4">
              <Steps current={currentStep} className="mb-4">
                {stepTitles.map((title, index) => (
                  <Steps.Item key={index} title={isMobile ? "" : title} />
                ))}
              </Steps>
              
              {/* Show step titles on mobile */}
              {isMobile && (
                <h4 className="text-center mb-4">{stepTitles[currentStep]}</h4>
              )}
            </div>
            
            {/* Main content area */}
            <Row>
              {/* Left column: Step content */}
              <Col xs={24} md={15} className="mb-4 mb-md-0">
                <Panel shaded className="p-md-4">
                  {isValidatingCart ? (
                    <Loader center content="Đang kiểm tra giỏ hàng..." />
                  ) : (
                    renderStepContent()
                  )}
                </Panel>
              </Col>
              
              {/* Right column: Order summary */}
              <Col xs={24} md={8} mdOffset={1}>
                <OrderSummary 
                  cartItems={cartItems.length > 0 ? cartItems : localCartItems}
                  shippingMethod={checkoutData.shippingMethod}
                />
                
                {/* Back to cart button (desktop) */}
                {!isMobile && currentStep === 0 && (
                  <Button 
                    appearance="link" 
                    onClick={() => router.push('/cart')}
                    className="mt-3 d-flex align-items-center"
                  >
                    <MdArrowBack className="me-2" /> Quay lại giỏ hàng
                  </Button>
                )}
              </Col>
            </Row>
            
            {/* Back to cart button (mobile) */}
            {isMobile && currentStep === 0 && (
              <div className="text-center mt-4">
                <Button 
                  appearance="link" 
                  onClick={() => router.push('/cart')}
                  className="d-flex align-items-center justify-content-center mx-auto"
                >
                  <MdArrowBack className="me-2" /> Quay lại giỏ hàng
                </Button>
              </div>
            )}
          </Panel>
        </Col>
      </Row>
    </Container>
  );
}