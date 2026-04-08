import { useState } from 'react'

export default function PaymentModal({ amount, onSuccess, onClose }) {
  const [stage, setStage] = useState('form') // form | processing | success
  const [card, setCard] = useState({
    number: '4242 4242 4242 4242',
    expiry: '12/28',
    cvv: '123',
    name: 'Demo User',
  })

  const handlePay = (e) => {
    e.preventDefault()
    setStage('processing')
    setTimeout(() => {
      setStage('success')
      setTimeout(() => {
        onSuccess()
      }, 1500)
    }, 2000)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {stage === 'form' && (
          <>
            <h2>Payment</h2>
            <div className="text-center">
              <span className="demo-badge">Demo Mode - No Real Charges</span>
            </div>
            <form onSubmit={handlePay}>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  value={card.name}
                  onChange={e => setCard({ ...card, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Card Number</label>
                <input
                  value={card.number}
                  onChange={e => setCard({ ...card, number: e.target.value })}
                  required
                />
              </div>
              <div className="card-row">
                <div className="form-group">
                  <label>Expiry</label>
                  <input
                    value={card.expiry}
                    onChange={e => setCard({ ...card, expiry: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    value={card.cvv}
                    onChange={e => setCard({ ...card, cvv: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="order-summary-row total" style={{ marginTop: 20, marginBottom: 20 }}>
                <span>Total</span>
                <span>${amount.toFixed(2)}</span>
              </div>
              <button type="submit" className="pay-btn">
                Pay ${amount.toFixed(2)}
              </button>
            </form>
          </>
        )}

        {stage === 'processing' && (
          <div className="processing-state">
            <div className="spinner" />
            <h3>Processing Payment...</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
              Please wait while we process your demo payment
            </p>
          </div>
        )}

        {stage === 'success' && (
          <div className="success-state">
            <div className="success-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3>Payment Successful!</h3>
            <p>Redirecting to order tracking...</p>
          </div>
        )}
      </div>
    </div>
  )
}
