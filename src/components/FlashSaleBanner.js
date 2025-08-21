"use client"
import React from "react";

const FlashSaleBanner = () => {
  return (
    <div className="w-full bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400 text-black py-2 flex items-center justify-center">
      <span className="font-semibold text-base animate-blink">
        ❤️ Onam Offer Sale is live now! Get up to 50% off on all products. ❤️
      </span>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-blink {
          animation: blink 1.2s infinite;
        }
      `}</style>
    </div>
  );
};

export default FlashSaleBanner;
