import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req, { params }) {
  const awaitedParams = await params;
  const { id } = awaitedParams;
  const { transactionId } = await req.json();
  try {
    const order = await prisma.order.findUnique({ where: { id: String(id) } });
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    if (order.paymentId === transactionId && order.paymentStatus === 'COMPLETED') {
      return NextResponse.json({ message: 'Transaction verified and payment complete.' });
    } else {
      return NextResponse.json({ message: 'Transaction ID or payment status incorrect.' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ message: 'Error verifying transaction.' }, { status: 500 });
  }
}
