import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import { prisma } from "@/lib/prisma";

export default async function ProductPage({ params }) {
  const { slug } = params;
  // Fetch product from database
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: true,
    },
  });

  if (!product) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link href="/products" className="text-primary-600 hover:underline">Back to Products</Link>
      </div>
    );
  }

  return (
    <>
      <Header />
      <section className="py-12 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          <Image
            src={product.images?.[0] || "/placeholder-product.jpg"}
            alt={product.name}
            width={600}
            height={600}
            className="object-cover w-full h-full"
            priority
          />
        </div>
        {/* Product Details */}
        <ProductDetailsClient product={product} />
      </div>
    </section>
    </>
  );
}
