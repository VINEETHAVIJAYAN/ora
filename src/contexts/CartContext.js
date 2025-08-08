'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext({})

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    console.log('CartContext - Auth changed:', isAuthenticated, 'User:', user?.email)
    
    // Add a small delay to ensure auth is properly loaded
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        console.log('CartContext - Fetching cart after auth confirmed')
        fetchCart()
      } else {
        console.log('CartContext - Loading guest cart')
        // Load cart from localStorage for guest users and fetch product details
        loadGuestCart()
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [isAuthenticated])

  const loadGuestCart = async () => {
    try {
      setLoading(true)
      const savedCart = localStorage.getItem('guestCart')
      if (savedCart) {
        const cartItems = JSON.parse(savedCart)
        // Fetch product details for guest cart items
        const itemsWithProducts = await Promise.all(
          cartItems.map(async (item) => {
            try {
              // Try to find the product by ID in the existing products
              const response = await fetch('/api/products')
              if (response.ok) {
                const data = await response.json()
                const product = data.products.find(p => p.id === item.productId)
                if (product) {
                  return {
                    id: `guest_${item.productId}`,
                    productId: item.productId,
                    quantity: item.quantity,
                    product: product
                  }
                }
              }
            } catch (error) {
              console.error('Error fetching product details:', error)
            }
            return null
          })
        )
        setItems(itemsWithProducts.filter(item => item !== null))
      }
    } catch (error) {
      console.error('Error loading guest cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCart = async () => {
    if (!isAuthenticated) return
    
    try {
      console.log('CartContext - Fetching cart for authenticated user')
      setLoading(true)
      const response = await fetch('/api/cart', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        console.log('CartContext - Cart fetched:', data.items.length, 'items')
        setItems(data.items)
      } else {
        console.log('CartContext - Cart fetch failed:', response.status)
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true)
      
      if (isAuthenticated) {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ productId, quantity }),
        })
        
        if (response.ok) {
          await fetchCart()
          return { success: true }
        } else {
          const error = await response.json()
          return { success: false, error: error.message }
        }
      } else {
        // Handle guest cart
        try {
          // First fetch the product details from the products list
          const response = await fetch('/api/products')
          if (!response.ok) {
            return { success: false, error: 'Failed to fetch products' }
          }
          const data = await response.json()
          const product = data.products.find(p => p.id === productId)
          
          if (!product) {
            return { success: false, error: 'Product not found' }
          }
          
          const existingItem = items.find(item => item.productId === productId)
          let updatedItems
          
          if (existingItem) {
            updatedItems = items.map(item =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          } else {
            const newItem = { 
              id: `guest_${productId}`,
              productId, 
              quantity,
              product 
            }
            updatedItems = [...items, newItem]
          }
          
          setItems(updatedItems)
          // Save simplified version to localStorage
          const cartForStorage = updatedItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
          localStorage.setItem('guestCart', JSON.stringify(cartForStorage))
          return { success: true }
        } catch (error) {
          return { success: false, error: 'Failed to add to cart' }
        }
      }
    } catch (error) {
      return { success: false, error: 'Failed to add to cart' }
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId)
    }

    try {
      setLoading(true)
      
      if (isAuthenticated) {
        const response = await fetch('/api/cart', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ productId, quantity }),
        })
        
        if (response.ok) {
          await fetchCart()
          return { success: true }
        }
      } else {
        const updatedItems = items.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        )
        setItems(updatedItems)
        // Save simplified version to localStorage
        const cartForStorage = updatedItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
        localStorage.setItem('guestCart', JSON.stringify(cartForStorage))
        return { success: true }
      }
    } catch (error) {
      return { success: false, error: 'Failed to update quantity' }
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId) => {
    try {
      setLoading(true)
      
      if (isAuthenticated) {
        const response = await fetch('/api/cart', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ productId }),
        })
        
        if (response.ok) {
          await fetchCart()
          return { success: true }
        }
      } else {
        const updatedItems = items.filter(item => item.productId !== productId)
        setItems(updatedItems)
        // Save simplified version to localStorage
        const cartForStorage = updatedItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
        localStorage.setItem('guestCart', JSON.stringify(cartForStorage))
        return { success: true }
      }
    } catch (error) {
      return { success: false, error: 'Failed to remove from cart' }
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setLoading(true)
      
      if (isAuthenticated) {
        const response = await fetch('/api/cart/clear', {
          method: 'POST',
          credentials: 'include',
        })
        
        if (response.ok) {
          setItems([])
          return { success: true }
        }
      } else {
        setItems([])
        localStorage.removeItem('guestCart')
        return { success: true }
      }
    } catch (error) {
      return { success: false, error: 'Failed to clear cart' }
    } finally {
      setLoading(false)
    }
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => {
      const price = item.product?.salePrice || item.product?.price || 0
      return total + (price * item.quantity)
    }, 0)
  }

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    items,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    fetchCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
