import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { seedRestaurants } from '../data/seedData'
import MenuItemCard from '../components/MenuItemCard'
import BranchSelector from '../components/BranchSelector'

const STORAGE_KEY = 'foodq_restaurants'

function loadRestaurants() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export default function RestaurantPage() {
  const { id } = useParams()
  const allRestaurants = [...seedRestaurants, ...loadRestaurants()]
  const restaurant = allRestaurants.find(r => r.id === id)

  const categories = useMemo(() => {
    if (!restaurant) return []
    return [...new Set(restaurant.menu.map(m => m.category))]
  }, [restaurant])

  const [activeCategory, setActiveCategory] = useState(null)

  if (!restaurant) {
    return (
      <div className="empty-state">
        <h2>Restaurant not found</h2>
        <p>The restaurant you are looking for does not exist</p>
        <Link to="/" className="back-home-btn">Back to Home</Link>
      </div>
    )
  }

  const displayCategory = activeCategory || categories[0] || null
  const filteredMenu = displayCategory
    ? restaurant.menu.filter(m => m.category === displayCategory)
    : restaurant.menu

  return (
    <div>
      <div className="restaurant-hero" style={{ background: restaurant.gradient }}>
        <div className="container">
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          <div className="restaurant-hero-meta">
            <span className="cuisine-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
              {restaurant.cuisine}
            </span>
            <span className="rating" style={{ color: '#fff' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {restaurant.rating}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
              {restaurant.branches.length} branches
            </span>
          </div>
        </div>
      </div>

      <div className="container restaurant-content">
        <div className="restaurant-layout">
          <BranchSelector branches={restaurant.branches} restaurantId={restaurant.id} />

          <div className="menu-section">
            <div className="category-tabs">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-tab ${displayCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="menu-items-list">
              {filteredMenu.map(item => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  restaurantId={restaurant.id}
                  restaurantName={restaurant.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
