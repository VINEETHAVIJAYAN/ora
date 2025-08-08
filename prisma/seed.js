const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@orafashions.com' },
    update: {},
    create: {
      email: 'admin@orafashions.com',
      password: adminPassword,
      name: 'Admin User',
      phone: '+91 98765 43210',
      role: 'ADMIN',
    },
  })
  console.log('👤 Created admin user:', admin.email)

  // Create sample customer
  const customerPassword = await bcrypt.hash('customer123', 12)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      name: 'John Doe',
      phone: '+91 87654 32109',
      role: 'USER',
    },
  })
  console.log('👤 Created customer user:', customer.email)

  // Create categories
  const categories = [
    {
      name: 'Chains',
      slug: 'chains',
      description: 'Elegant gold and silver chains for every occasion',
      image: '/category-chains.jpg',
    },
    {
      name: 'Earrings',
      slug: 'earrings',
      description: 'Beautiful earrings from traditional to contemporary',
      image: '/category-earrings.jpg',
    },
    {
      name: 'Bangles',
      slug: 'bangles',
      description: 'Traditional and modern bangles in various styles',
      image: '/category-bangles.jpg',
    },
    {
      name: 'Rings',
      slug: 'rings',
      description: 'Stunning rings for engagements, weddings, and fashion',
      image: '/category-rings.jpg',
    },
    {
      name: 'Necklaces',
      slug: 'necklaces',
      description: 'Exquisite necklaces from chokers to long sets',
      image: '/category-necklaces.jpg',
    },
    {
      name: 'Bracelets',
      slug: 'bracelets',
      description: 'Delicate and bold bracelets for every style',
      image: '/category-bracelets.jpg',
    },
  ]

  const createdCategories = []
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
    createdCategories.push(created)
    console.log('📂 Created category:', created.name)
  }

  // Create sample products
  const products = [
    {
      name: 'Gold Chain Necklace',
      slug: 'gold-chain-necklace',
      description: 'Elegant 18k gold chain necklace perfect for daily wear and special occasions. Crafted with precision and finished to perfection.',
      price: 45000.00,
      salePrice: 42000.00,
      sku: 'CHN-001',
      stockQuantity: 25,
      weight: 15.5,
      material: '18K Gold',
      dimensions: '18 inches',
      images: ['/product-1.jpg'],
      tags: ['gold', 'chain', 'necklace', 'jewelry'],
      isFeatured: true,
      metaTitle: 'Gold Chain Necklace - 18K Gold Jewelry',
      metaDescription: 'Premium 18K gold chain necklace. Perfect for daily wear and special occasions.',
      categoryId: 1,
    },
    {
      name: 'Diamond Stud Earrings',
      slug: 'diamond-stud-earrings',
      description: 'Sparkling diamond stud earrings set in 14k white gold. Perfect for adding elegance to any outfit.',
      price: 25000.00,
      sku: 'EAR-001',
      stockQuantity: 15,
      weight: 3.2,
      material: '14K White Gold, Diamond',
      dimensions: '6mm',
      images: ['/product-2.jpg'],
      tags: ['diamond', 'earrings', 'studs', 'white gold'],
      isFeatured: true,
      metaTitle: 'Diamond Stud Earrings - 14K White Gold',
      metaDescription: 'Elegant diamond stud earrings in 14K white gold setting.',
      categoryId: 2,
    },
    {
      name: 'Traditional Gold Bangles',
      slug: 'traditional-gold-bangles',
      description: 'Set of 2 traditional gold bangles with intricate patterns. Handcrafted by skilled artisans.',
      price: 35000.00,
      salePrice: 32000.00,
      sku: 'BAN-001',
      stockQuantity: 12,
      weight: 25.0,
      material: '22K Gold',
      dimensions: '2.4 inches diameter',
      images: ['/product-3.jpg'],
      tags: ['gold', 'bangles', 'traditional', 'handcrafted'],
      isFeatured: false,
      metaTitle: 'Traditional Gold Bangles - 22K Gold Set',
      metaDescription: 'Handcrafted traditional gold bangles with intricate patterns.',
      categoryId: 3,
    },
    {
      name: 'Engagement Ring',
      slug: 'engagement-ring',
      description: 'Stunning solitaire engagement ring with brilliant cut diamond. The perfect symbol of your love.',
      price: 125000.00,
      sku: 'RNG-001',
      stockQuantity: 8,
      weight: 4.5,
      material: '18K White Gold, Diamond',
      dimensions: 'Size 6 (adjustable)',
      images: ['/product-4.jpg'],
      tags: ['engagement', 'ring', 'diamond', 'solitaire'],
      isFeatured: true,
      metaTitle: 'Solitaire Engagement Ring - Diamond Ring',
      metaDescription: 'Beautiful solitaire engagement ring with brilliant cut diamond.',
      categoryId: 4,
    },
    {
      name: 'Pearl Necklace Set',
      slug: 'pearl-necklace-set',
      description: 'Elegant freshwater pearl necklace with matching earrings. Perfect for formal occasions.',
      price: 18000.00,
      sku: 'NCK-001',
      stockQuantity: 20,
      weight: 45.0,
      material: 'Freshwater Pearls, Silver',
      dimensions: '16 inches necklace',
      images: ['/product-5.jpg'],
      tags: ['pearl', 'necklace', 'set', 'formal'],
      isFeatured: false,
      metaTitle: 'Pearl Necklace Set - Freshwater Pearls',
      metaDescription: 'Elegant freshwater pearl necklace set with matching earrings.',
      categoryId: 5,
    },
    {
      name: 'Silver Charm Bracelet',
      slug: 'silver-charm-bracelet',
      description: 'Beautiful sterling silver charm bracelet with customizable charms. Perfect gift for loved ones.',
      price: 8500.00,
      salePrice: 7500.00,
      sku: 'BRC-001',
      stockQuantity: 30,
      weight: 12.0,
      material: 'Sterling Silver',
      dimensions: '7.5 inches (adjustable)',
      images: ['/product-6.jpg'],
      tags: ['silver', 'bracelet', 'charm', 'gift'],
      isFeatured: false,
      metaTitle: 'Silver Charm Bracelet - Sterling Silver',
      metaDescription: 'Customizable sterling silver charm bracelet, perfect gift.',
      categoryId: 6,
    },
  ]

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    product.categoryId = createdCategories[i].id
    
    const created = await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    })
    console.log('💍 Created product:', created.name)
  }

  console.log('✅ Database seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
