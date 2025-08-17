import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ORA Fashions - Exquisite Traditional Jewelry',
  description: 'Discover the finest collection of traditional jewelry including chains, earrings, bangles, and more at ORA Fashions. Authentic craftsmanship meets modern elegance.',
  keywords: 'jewelry, traditional jewelry, chains, earrings, bangles, gold jewelry, silver jewelry, fashion jewelry',
  authors: [{ name: 'ORA Fashions' }],
  creator: 'ORA Fashions',
  publisher: 'ORA Fashions',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://orafashions.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ORA Fashions - Exquisite Traditional Jewelry',
    description: 'Discover the finest collection of traditional jewelry including chains, earrings, bangles, and more.',
    url: 'https://orafashions.com',
    siteName: 'ORA Fashions',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ORA Fashions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ORA Fashions - Exquisite Traditional Jewelry',
    description: 'Discover the finest collection of traditional jewelry including chains, earrings, bangles, and more.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#c48902" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                }}
              />
              <WhatsAppFloatingButton />
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
