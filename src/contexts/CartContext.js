import React, { useCallback, createContext, useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  // Add a ref to track operation timestamps to prevent duplicate operations
  const lastOperationTimestampRef = useRef({});

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('ecom-cart');
      if (storedCart && storedCart !== 'undefined' && storedCart !== 'null') {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setCartItems(parsedCart);
          console.log('Cart restored from localStorage', parsedCart.length);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    setHasMounted(true);
  }, []);

  // Save to localStorage when cart changes
  useEffect(() => {
    if (!hasMounted) return;
    try {
      if (cartItems.length > 0) {
        localStorage.setItem('ecom-cart', JSON.stringify(cartItems));
        console.log('Cart saved to localStorage', cartItems.length);
      } else if (cartItems.length === 0) {
        // Only clear localStorage if cart is intentionally emptied
        // but not during initial component mount
        const storedCart = localStorage.getItem('ecom-cart');
        if (storedCart && storedCart !== 'undefined' && storedCart !== 'null') {
          localStorage.setItem('ecom-cart', JSON.stringify([]));
          console.log('Cart cleared in localStorage');
        }
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);


  // Check if device is mobile on client-side
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const addToCart = useCallback((product, size, quantity, isBuyNow) => {
    // Create operation ID to prevent duplicate operations
    const operationId = `${product.id}-${size}`;
    const now = Date.now();
    
    // Prevent duplicate operations within 500ms (React StrictMode can call functions twice)
    if (lastOperationTimestampRef.current[operationId] && 
        now - lastOperationTimestampRef.current[operationId] < 500) {
      console.log('Preventing duplicate operation', operationId);
      return;
    }
    
    // Record this operation timestamp
    lastOperationTimestampRef.current[operationId] = now;
    
    setLastAddedProduct(product);
    
    // Create a simple version of the product with only necessary data
    const simplifiedProduct = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      images: product.images,
      salePrice: product.salePrice,
      originalPrice: product.originalPrice,
      size: product.size
    };
    
    // Use functional update to ensure we don't depend on stale state
    setCartItems(prevItems => {
      // Check if product already exists with the same size
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === simplifiedProduct.id && item.size === size
      );

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item with simplified product
        return [...prevItems, { product: simplifiedProduct, size, quantity }];
      }
    });
    
    // On mobile, redirect to cart page instead of showing modal
    if (isMobile || isBuyNow) {
      router.push('/cart');
    } else {
      setIsCartModalOpen(true);
    }
    
    console.log(`Added ${product.title} to cart`);
  }, [isMobile, router]); // Only re-create when these dependencies change

  const clearCart = useCallback(() => {
    // Clear cart items state
    setCartItems([]);
    // Explicitly clear localStorage 
    localStorage.setItem('ecom-cart', JSON.stringify([]));
    console.log('Cart cleared completely');
  }, []);

  const removeFromCart = (productId, size) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.product.id === productId && item.size === size)
      )
    );
    console.log(`Removed product ID ${productId} from cart`);
  };

  const updateQuantity = (productId, size, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        (item.product.id === productId && item.size === size)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    console.log(`Updated quantity for product ID ${productId} to ${newQuantity}`);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.salePrice * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const closeCartModal = () => {
    setIsCartModalOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartCount,
        isCartModalOpen,
        closeCartModal,
        lastAddedProduct,
        isMobile,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
