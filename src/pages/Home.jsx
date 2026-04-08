import { useState, useEffect } from 'react'
import { seedRestaurants } from '../data/seedData'
import RestaurantCard from '../components/RestaurantCard'

const STORAGE_KEY = 'encaveman_restaurants'

function loadRestaurants() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export default function Home() {
  const [search, setSearch] = useState('')
  const [cuisine, setCuisine] = useState('All')

  const customRestaurants = loadRestaurants()
  const allRestaurants = [...seedRestaurants, ...customRestaurants]

  const cuisines = ['All', ...new Set(allRestaurants.map(r => r.cuisine))]

  const filtered = allRestaurants.filter(r => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase())
    const matchCuisine = cuisine === 'All' || r.cuisine === cuisine
    return matchSearch && matchCuisine
  })

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>Delicious Food, Delivered Fast</h1>
          <p>Order from the best local restaurants with real-time queue tracking</p>
          <div className="search-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="container">
        <div className="filters">
          {cuisines.map(c => (
            <button
              key={c}
              className={`filter-chip ${cuisine === c ? 'active' : ''}`}
              onClick={() => setCuisine(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <h2>No restaurants found</h2>
            <p>Try a different search term or filter</p>
          </div>
        ) : (
          <div className="restaurant-grid">
            {filtered.map(r => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
