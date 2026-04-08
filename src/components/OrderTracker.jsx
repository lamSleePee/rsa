const STEPS = [
  { key: 'pending', label: 'Order Placed', desc: 'Your order has been received' },
  { key: 'confirmed', label: 'Confirmed', desc: 'Restaurant confirmed your order' },
  { key: 'preparing', label: 'Preparing', desc: 'Your food is being prepared' },
  { key: 'ready', label: 'Ready', desc: 'Your order is ready for pickup' },
  { key: 'delivered', label: 'Delivered', desc: 'Order has been delivered' },
]

export default function OrderTracker({ status, estimatedMinutes, createdAt }) {
  const currentIdx = STEPS.findIndex(s => s.key === status)

  const elapsed = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000)
  const remaining = Math.max(0, estimatedMinutes - elapsed)

  return (
    <div className="tracker-card">
      <h2>Order Status</h2>
      <div className="timeline">
        {STEPS.map((step, idx) => {
          let className = 'timeline-step'
          if (idx < currentIdx) className += ' completed'
          else if (idx === currentIdx) className += ' active'

          return (
            <div key={step.key} className={className}>
              <div className="timeline-dot">
                {idx < currentIdx ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : idx === currentIdx ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="6" />
                  </svg>
                ) : null}
              </div>
              <h4>{step.label}</h4>
              <p>{step.desc}</p>
            </div>
          )
        })}
      </div>

      {status !== 'delivered' && (
        <div className="eta-card">
          <div className="eta-label">Estimated Time Remaining</div>
          <div className="eta-time">
            {remaining > 0 ? `${remaining} min` : 'Any moment now'}
          </div>
        </div>
      )}
    </div>
  )
}
