"use client"

import { useState } from "react";
import Image from "next/image";
import { useCart } from '@/contexts/CartContext';
import toast from 'react-hot-toast';

export default function ProductDetailsClient({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">{product.name}</h1>
      <p className="text-lg text-gray-700 mb-4">{product.description}</p>
      <p className="text-2xl font-bold text-primary-600 mb-6">₹{product.price}</p>
      <div className="mb-6">
        <span className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full font-medium">
          {product.category?.name}
        </span>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button
            type="button"
            className="px-4 py-2 text-xl text-gray-700 bg-gray-100 hover:bg-gray-200"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
          >
            &minus;
          </button>
          <span className="px-4 py-2 text-lg font-semibold bg-white">{quantity}</span>
          <button
            type="button"
            className="px-4 py-2 text-xl text-gray-700 bg-gray-100 hover:bg-gray-200"
            onClick={() => setQuantity(q => q + 1)}
          >
            &#43;
          </button>
        </div>
        <button
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors w-full md:w-auto"
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            try {
              const result = await addToCart(product.id, quantity);
              if (result.success) {
                toast.success('Added to cart!');
              } else {
                toast.error(result.error || 'Failed to add to cart');
              }
            } catch (error) {
              toast.error('Something went wrong');
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {isLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
      {/* Reviews */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Reviews</h2>
        {product.reviews?.length > 0 ? (
          <ul className="space-y-4">
            {product.reviews.map((review) => (
              <li key={review.id} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 mb-2">{review.comment}</p>
                <span className="text-sm text-gray-500">By {review.userName}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
