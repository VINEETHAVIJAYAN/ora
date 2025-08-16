"use client"
import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import { useParams } from 'next/navigation'
import Link from 'next/link'


import React from 'react';

const AdminOrderDetailsPage = () => {
  const params = useParams();
  const orderId = params?.id;

  const fetchOrder = async (orderId) => {
    const res = await fetch(`/api/admin/orders/${orderId}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  };

  const updateOrderStatus = async (orderId, status) => {
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  };

  const verifyTransaction = async (orderId, transactionId) => {
    const res = await fetch(`/api/admin/orders/${orderId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId })
    });
    return res.json();
  };

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    fetchOrder(orderId)
      .then((data) => {
        setOrder(data);
        setStatus(data.status);
        setLoading(false);
      })
      .catch((err) => {
        setError('Order not found');
        setLoading(false);
      });
  }, [orderId]);

  const handleStatusChange = async () => {
    await updateOrderStatus(orderId, status);
    setOrder((prev) => ({ ...prev, status }));
  };

  const handleVerify = async () => {
    const result = await verifyTransaction(orderId, transactionId);
    setVerifyResult(result);
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto p-8 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
        <div className="mb-4">
          <strong>Order ID:</strong> {order.id}<br />
          <strong>User:</strong> {order.user?.name} ({order.user?.email})<br />
          <strong>Status:</strong> {order.status}<br />
          <strong>Transaction ID:</strong> {order.transactionId || 'N/A'}<br />
          <strong>Payment Status:</strong> {order.paymentStatus || 'N/A'}<br />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Change Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded px-3 py-2">
            <option value="PENDING">Pending</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button onClick={handleStatusChange} className="ml-2 px-4 py-2 bg-primary-600 text-white rounded">Update</button>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Verify Transaction</label>
          <input type="text" value={transactionId} onChange={e => setTransactionId(e.target.value)} placeholder="Enter Transaction ID" className="border rounded px-3 py-2" />
          <button onClick={handleVerify} className="ml-2 px-4 py-2 bg-primary-600 text-white rounded">Verify</button>
          {verifyResult && (
            <div className="mt-2 text-sm text-green-600">{verifyResult.message}</div>
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Order Items</h3>
          <ul className="list-disc pl-6">
            {order.items?.map(item => (
              <li key={item.id}>
                {item.product?.name} x {item.quantity} - ₹{item.price}
              </li>
            ))}
          </ul>
        </div>
        <Link href="/admin/orders" className="mt-6 inline-block text-primary-600 underline">Back to Orders</Link>
      </div>
    </>
  );
};

export default AdminOrderDetailsPage;
