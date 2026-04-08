import { useCart } from '../context/CartContext'

function getQueueLevel(count) {
  if (count <= 2) return 'low'
  if (count <= 4) return 'medium'
  return 'high'
}

export default function BranchSelector({ branches, restaurantId }) {
  const { cart, setBranch } = useCart()

  const isThisRestaurant = cart.restaurantId === restaurantId
  const selectedBranchId = isThisRestaurant ? cart.branchId : null
  const selectedBranch = branches.find(b => b.id === selectedBranchId)

  const handleSelect = (branch) => {
    setBranch(branch.id, branch.name)
  }

  return (
    <div className="branch-selector">
      <h3>Select Branch</h3>
      {branches.map(branch => (
        <div
          key={branch.id}
          className={`branch-option ${selectedBranchId === branch.id ? 'selected' : ''}`}
          onClick={() => handleSelect(branch)}
        >
          <h4>{branch.name}</h4>
          <p>{branch.address}</p>
          <div className="branch-queue">
            <span className={`queue-dot ${getQueueLevel(branch.queueCount)}`} />
            <span>
              {branch.queueCount === 0
                ? 'No queue'
                : `${branch.queueCount} order${branch.queueCount > 1 ? 's' : ''} ahead`}
            </span>
          </div>
        </div>
      ))}

      {selectedBranch && (
        <div className="branch-eta">
          <div className="eta-label">Estimated Wait</div>
          <div className="eta-time">
            {selectedBranch.queueCount === 0
              ? `${selectedBranch.avgPrepTime} min`
              : `~${(selectedBranch.queueCount + 1) * selectedBranch.avgPrepTime} min`}
          </div>
        </div>
      )}
    </div>
  )
}
