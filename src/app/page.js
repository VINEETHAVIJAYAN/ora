import HeroClient from "@/components/HeroClient";
import FeaturedCategories from "@/components/FeaturedCategories";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewArrivals from "@/components/NewArrivals";
import Newsletter from "@/components/Newsletter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

// Enable ISR (Incremental Static Regeneration) - revalidate every hour
export const revalidate = 3600;

// Dynamic metadata for SEO
export async function generateMetadata() {
  const totalProducts = await prisma.product.count({
    where: { isActive: true },
  });
  const totalCategories = await prisma.category.count({
    where: { isActive: true },
  });

  return {
    title:
      "ORA Fashions - Premium Traditional & Contemporary Jewelry Collection",
    description: `Discover exquisite handcrafted jewelry at ORA Fashions. Shop from ${totalProducts}+ premium products across ${totalCategories} categories including chains, earrings, necklaces, rings, bangles & bracelets. Traditional & contemporary designs with free shipping.`,
    keywords:
      "jewelry, traditional jewelry, contemporary jewelry, handcrafted jewelry, gold jewelry, silver jewelry, chains, earrings, necklaces, rings, bangles, bracelets, ORA Fashions",
    openGraph: {
      title: "ORA Fashions - Premium Jewelry Collection",
      description:
        "Discover exquisite handcrafted jewelry with traditional and contemporary designs",
      url: "https://orafashionz.com",
      siteName: "ORA Fashions",
      images: [
        {
          url: "/logo.jpeg",
          width: 1200,
          height: 630,
          alt: "ORA Fashions - Premium Jewelry Collection",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "ORA Fashions - Premium Jewelry Collection",
      description:
        "Discover exquisite handcrafted jewelry with traditional and contemporary designs",
      images: ["/logo.jpeg"],
    },
    alternates: {
      canonical: "https://orafashionz.com",
    },
  };
}

// Fetch all data on the server for better SEO
async function getHomePageData() {
  try {
    // Fetch hero slides
    const heroSlides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    // Fetch featured categories
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    // Fetch featured products
    const featuredProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
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
      take: 8,
    });

    // Fetch latest products for New Arrivals
    const latestProducts = await prisma.product.findMany({
      where: {
        isActive: true,
      },
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
      take: 8,
    });

    return {
      heroSlides: heroSlides.map((slide) => ({
        id: slide.id,
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description,
        image: slide.image,
        ctaText: slide.ctaText,
        ctaLink: slide.ctaLink,
      })),
      categories,
      featuredProducts,
      latestProducts,
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return {
      heroSlides: [],
      categories: [],
      featuredProducts: [],
    };
  }
}

export default async function Home() {
  const { heroSlides, categories, featuredProducts, latestProducts } = await getHomePageData();

  return (
    <div className="min-h-screen font-figtree">
      <Header className="font-roboto" />
      <main>
        <HeroClient initialSlides={heroSlides} />
        <FeaturedCategories categories={categories} />
        <FeaturedProducts products={featuredProducts} />
        <NewArrivals products={latestProducts} />
        {/* <Newsletter /> */}
      </main>
      <Footer />
    </div>
  );
}
