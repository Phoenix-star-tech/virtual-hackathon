import { apiPost } from "./client";

export async function createOrderApi(formData) {
  return apiPost("/api/payment/create-order", {
    full_name: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    college: formData.college,
    password: formData.password,
  });
}

export async function verifyPaymentApi(params) {
  return apiPost("/api/payment/verify", {
    razorpay_order_id: params.razorpay_order_id,
    razorpay_payment_id: params.razorpay_payment_id,
    razorpay_signature: params.razorpay_signature,
  });
}
