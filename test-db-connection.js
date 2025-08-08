// Test database connection script
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@'));
    
    // Test the connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ Database query successful!');
    console.log('PostgreSQL version:', result[0].version);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.code === 'P1000') {
      console.error('Authentication failed - check your credentials');
    } else if (error.code === 'P1001') {
      console.error('Database server unreachable - check your connection string');
    }
    
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
