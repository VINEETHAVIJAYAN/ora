import { useEffect, useState } from "react"
import { QRCodeSVG } from "qrcode.react"

// Replace with your UPI ID and business name
const UPI_ID = "vijusasi2020@ibl";
const BUSINESS_NAME = "ORA Fashions"

export default function UpiPay({ amount = 1 }) {
  const [isMobile, setIsMobile] = useState(false);
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
    BUSINESS_NAME
  )}&am=${amount}&cu=INR`;

  useEffect(() => {
    // Simple mobile detection
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-primary-600 mb-2">Pay with UPI</h2>
      {isMobile ? (
        <a
          href={upiLink}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
        >
          Pay with Google Pay / UPI App
        </a>
      ) : (
        <div className="flex flex-col items-center">
          <QRCodeSVG value={upiLink} size={180} />
          <p className="mt-2 text-sm text-gray-700">Scan with any UPI app</p>
        </div>
      )}
      <div className="mt-2 text-xs text-gray-500 text-center">
        After payment, please share your transaction ID or screenshot for order
        confirmation.
      </div>
    </div>
  );
}
