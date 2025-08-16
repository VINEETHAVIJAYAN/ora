const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateOrderPayment(orderId, paymentId, paymentStatus) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentId,
      paymentStatus,
    },
  });
  console.log('✅ Updated order:', order.id, 'paymentId:', order.paymentId, 'paymentStatus:', order.paymentStatus);
}

// Usage: node prisma/update-order-payment.js <orderId> <paymentId> <paymentStatus>
const [,, orderId, paymentId, paymentStatus] = process.argv;
if (!orderId || !paymentId || !paymentStatus) {
  console.error('Usage: node prisma/update-order-payment.js <orderId> <paymentId> <paymentStatus>');
  process.exit(1);
}

updateOrderPayment(orderId, paymentId, paymentStatus)
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Error updating order:', e);
    prisma.$disconnect();
    process.exit(1);
  });
