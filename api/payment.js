import { apiGet, apiPost } from "./client";

export async function getQrConfigApi() {
  return apiGet("/api/payment/qr");
}

export async function checkTransactionApi(transactionId) {
  return apiPost("/api/auth/check-transaction", {
    transaction_id: transactionId,
  });
}
