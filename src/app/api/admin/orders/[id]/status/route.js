import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(req, { params }) {
  const awaitedParams = await params;
  const { id } = awaitedParams;
  const { status } = await req.json();
  try {
    const order = await prisma.order.update({
      where: { id: String(id) },
      data: { status },
    });
    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ error: 'Error updating status' }, { status: 500 });
  }
}
