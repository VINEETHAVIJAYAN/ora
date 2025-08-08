'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const FavoritesContext = createContext()

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

export const FavoritesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch favorites when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites()
    } else {
      setFavorites([])
    }
  }, [isAuthenticated])

  const fetchFavorites = async () => {
    if (!isAuthenticated) return
    
    try {
      setLoading(true)
      const response = await fetch('/api/favorites', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites)
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = async (productId, productName) => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites')
      return { success: false, error: 'Please login to add favorites' }
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId }),
      })

      const data = await response.json()

      if (response.ok) {
        setFavorites(prev => [...prev, data.favorite])
        if (productName) {
          toast.success(`${productName} added to favorites!`)
        }
        return { success: true, favorite: data.favorite }
      } else {
        if (productName) {
          toast.error(data.message || 'Failed to add to favorites')
        }
        return { success: false, error: data.message }
      }
    } catch (error) {
      const errorMessage = 'Failed to add to favorites'
      if (productName) {
        toast.error(errorMessage)
      }
      return { success: false, error: errorMessage }
    }
  }

  const removeFromFavorites = async (productId, productName) => {
    if (!isAuthenticated) return { success: false, error: 'Not authenticated' }

    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav.productId !== productId))
        if (productName) {
          toast.success(`${productName} removed from favorites`)
        }
        return { success: true }
      } else {
        const data = await response.json()
        if (productName) {
          toast.error(data.message || 'Failed to remove from favorites')
        }
        return { success: false, error: data.message }
      }
    } catch (error) {
      const errorMessage = 'Failed to remove from favorites'
      if (productName) {
        toast.error(errorMessage)
      }
      return { success: false, error: errorMessage }
    }
  }

  const isFavorite = (productId) => {
    return favorites.some(fav => fav.productId === productId)
  }

  const toggleFavorite = async (productId, productName) => {
    if (isFavorite(productId)) {
      return await removeFromFavorites(productId, productName)
    } else {
      return await addToFavorites(productId, productName)
    }
  }

  const getFavoritesCount = () => {
    return favorites.length
  }

  const value = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesCount,
    fetchFavorites
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}
