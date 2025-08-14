import ProductsClient from "./ProductsClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

// Enable ISR - revalidate every 30 minutes
export const revalidate = 1800;

async function getProducts() {
  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20, // Initial load
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),
    ]);

    const totalProducts = await prisma.product.count({
      where: { isActive: true },
    });

    return {
      products,
      categories,
      total: totalProducts,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      categories: [],
      total: 0,
    };
  }
}

// Dynamic metadata for SEO
export async function generateMetadata() {
  const data = await getProducts();

  return {
    title:
      "All Jewelry Products - Traditional & Contemporary Collection | ORA Fashions",
    description: `Browse our complete jewelry collection featuring ${data.total} exquisite pieces. From traditional to contemporary designs, handcrafted with premium quality materials.`,
    keywords:
      "jewelry collection, traditional jewelry, contemporary jewelry, handcrafted jewelry, chains, earrings, necklaces, rings, bracelets, ORA Fashions",
    openGraph: {
      title: "All Jewelry Products - ORA Fashions",
      description: "Discover our exquisite range of handcrafted jewelry pieces",
      url: "/products",
      images: [
        {
          url: "/logo.jpeg",
          width: 1200,
          height: 630,
          alt: "ORA Fashions Jewelry Collection",
        },
      ],
    },
    alternates: {
      canonical: "/products",
    },
  };
}

export default async function ProductsPage() {
  const data = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProductsClient
        initialProducts={data.products}
        categories={data.categories}
        initialTotal={data.total}
      />
      <Footer />
    </div>
  );
}
