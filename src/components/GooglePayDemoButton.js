"use client"
import { useEffect } from "react";

export default function GooglePayDemoButton({ amount = 100 }) {
  useEffect(() => {
    if (window.google && window.google.payments) return;
    const script = document.createElement("script");
    script.src = "https://pay.google.com/gp/p/js/pay.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const onGooglePayClick = () => {
    if (!window.google || !window.google.payments) {
      alert("Google Pay SDK not loaded");
      return;
    }
    const paymentsClient = new window.google.payments.api.PaymentsClient({ environment: "TEST" });
    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
            allowedCardNetworks: ["MASTERCARD", "VISA"]
          },
          tokenizationSpecification: {
            type: "PAYMENT_GATEWAY",
            parameters: {
              gateway: "example",
              gatewayMerchantId: "exampleGatewayMerchantId"
            }
          }
        }
      ],
      merchantInfo: {
        merchantId: "12345678901234567890",
        merchantName: "Demo Merchant"
      },
      transactionInfo: {
        totalPriceStatus: "FINAL",
        totalPrice: amount.toString(),
        currencyCode: "INR"
      }
    };
    paymentsClient.loadPaymentData(paymentDataRequest)
      .then(paymentData => {
        alert("Google Pay Demo Success! PaymentData: " + JSON.stringify(paymentData));
      })
      .catch(err => {
        alert("Google Pay Demo Failed: " + err.message);
      });
  };

  return (
    <button
      type="button"
      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
      onClick={onGooglePayClick}
    >
      Google Pay (Demo Mode)
    </button>
  );
}
