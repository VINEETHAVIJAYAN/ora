"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Link from "next/link";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/admin/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        setQuantity(data.product.stockQuantity);
        setLoading(false);
      })
      .catch(() => {
        setError("Product not found");
        setLoading(false);
      });
  }, [productId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockQuantity: quantity }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setProduct((prev) => ({ ...prev, stockQuantity: quantity }));
      } else {
        setError(data.message || "Update failed");
      }
    } catch {
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto p-8 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Edit Product Quantity</h2>
        <div className="mb-4">
          <strong>Product:</strong> {product.name}
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Stock Quantity</label>
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded"
            disabled={loading}
          >
            Update
          </button>
          {success && (
            <div className="mt-2 text-green-600">Quantity updated successfully!</div>
          )}
        </form>
        <Link href="/admin/products" className="mt-6 inline-block text-primary-600 underline">Back to Products</Link>
      </div>
    </>
  );
}
