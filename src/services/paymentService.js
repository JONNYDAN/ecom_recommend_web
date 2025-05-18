import api from "./api";

export function generateSingleOrder({
  id,
  quantity,
  paymentType,
  voucherCode,
}) {
  const payload = {
    items: [
      {
        product_id: id,
        quantity: quantity || 1,
      },
    ],
    payment_type: paymentType || "QR_CODE",
    voucher_code: voucherCode || "",
  };
  return payload;
}

const paymentService = {
  createOrder: async (productId) => {
    if (!productId) {
      return {
        error: "Invalid order",
      };
    }

    try {
      const payload = generateSingleOrder({
        id: productId,
      });
      return await api.post(`/api/orders`, payload);
    } catch (error) {
      console.log("Can not create order ", error.message);
      return {
        error: error.message || "Some errors occured!",
      };
    }
  },
};

export default paymentService;
