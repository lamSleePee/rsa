import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const STORAGE_KEY = 'foodq_cart'

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

const initialState = loadCart() || {
  items: [],
  restaurantId: null,
  restaurantName: null,
  branchId: null,
  branchName: null,
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItem, restaurantId, restaurantName } = action.payload
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        return {
          ...state,
          items: [{ menuItem, quantity: 1 }],
          restaurantId,
          restaurantName,
          branchId: null,
          branchName: null,
        }
      }
      const existing = state.items.find(i => i.menuItem.id === menuItem.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.menuItem.id === menuItem.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
          restaurantId,
          restaurantName,
        }
      }
      return {
        ...state,
        items: [...state.items, { menuItem, quantity: 1 }],
        restaurantId,
        restaurantName,
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.menuItem.id !== action.payload),
        ...(state.items.length <= 1
          ? { restaurantId: null, restaurantName: null, branchId: null, branchName: null }
          : {}),
      }
    case 'UPDATE_QTY': {
      const { itemId, quantity } = action.payload
      if (quantity <= 0) {
        const newItems = state.items.filter(i => i.menuItem.id !== itemId)
        return {
          ...state,
          items: newItems,
          ...(newItems.length === 0
            ? { restaurantId: null, restaurantName: null, branchId: null, branchName: null }
            : {}),
        }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.menuItem.id === itemId ? { ...i, quantity } : i
        ),
      }
    }
    case 'SET_BRANCH':
      return {
        ...state,
        branchId: action.payload.branchId,
        branchName: action.payload.branchName,
      }
    case 'CLEAR':
      return {
        items: [],
        restaurantId: null,
        restaurantName: null,
        branchId: null,
        branchName: null,
      }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addItem = (menuItem, restaurantId, restaurantName) => {
    if (cart.restaurantId && cart.restaurantId !== restaurantId && cart.items.length > 0) {
      if (!window.confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
        return
      }
    }
    dispatch({ type: 'ADD_ITEM', payload: { menuItem, restaurantId, restaurantName } })
  }

  const removeItem = (itemId) => dispatch({ type: 'REMOVE_ITEM', payload: itemId })
  const updateQty = (itemId, quantity) => dispatch({ type: 'UPDATE_QTY', payload: { itemId, quantity } })
  const setBranch = (branchId, branchName) => dispatch({ type: 'SET_BRANCH', payload: { branchId, branchName } })
  const clearCart = () => dispatch({ type: 'CLEAR' })

  const total = cart.items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0)
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, total, itemCount, addItem, removeItem, updateQty, setBranch, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
