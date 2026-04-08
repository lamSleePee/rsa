import { useNavigate } from 'react-router-dom'

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate()

  return (
    <div className="restaurant-card" onClick={() => navigate(`/restaurant/${restaurant.id}`)}>
      <div
        className="restaurant-card-header"
        style={{ background: restaurant.gradient }}
      >
        <h3>{restaurant.name}</h3>
      </div>
      <div className="restaurant-card-body">
        <div className="restaurant-card-meta">
          <span className="cuisine-badge">{restaurant.cuisine}</span>
          <span className="rating">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {restaurant.rating}
          </span>
          <span className="branch-count">{restaurant.branches.length} branches</span>
        </div>
        <p className="restaurant-card-desc">{restaurant.description}</p>
        <button className="view-menu-btn">View Menu</button>
      </div>
    </div>
  )
}
