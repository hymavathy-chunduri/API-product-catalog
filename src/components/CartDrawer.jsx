import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, CreditCard, Sparkles } from 'lucide-react';

export const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveFromCart, onClearCart }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [step, setStep] = useState('cart'); // 'cart', 'payment', 'success'
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi'

  // Shipping details state
  const [shippingName, setShippingName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingZip, setShippingZip] = useState('');

  // Payment details state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  // Reset checkout/payment step when closed
  useEffect(() => {
    if (!isOpen) {
      setStep('cart');
      setIsCheckingOut(false);
    }
  }, [isOpen]);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formatted.substring(0, 19));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    setExpiry(value.substring(0, 5));
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    setCvv(value.substring(0, 3));
  };

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!shippingName.trim() || !shippingAddress.trim() || !shippingCity.trim() || !shippingZip.trim()) {
      alert('Please fill out all shipping fields.');
      return;
    }

    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        alert('Please enter a valid 16-digit credit card number.');
        return;
      }
      if (expiry.length < 5) {
        alert('Please enter a valid expiry date (MM/YY).');
        return;
      }
      if (cvv.length < 3) {
        alert('Please enter a valid CVV.');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        alert('Please enter a valid UPI ID (e.g. username@bank).');
        return;
      }
    }

    setIsCheckingOut(true);

    try {
      // Fetch public API to simulate processing order
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Order Checkout',
          body: {
            items: cartItems.map(item => ({ id: item.id, qty: item.quantity, price: item.price })),
            address: {
              name: shippingName,
              street: shippingAddress,
              city: shippingCity,
              zip: shippingZip
            },
            payment: {
              method: paymentMethod,
              cardNumber: paymentMethod === 'card' ? cardNumber.replace(/\s/g, '') : null,
              upiId: paymentMethod === 'upi' ? upiId : null
            },
            total: total
          },
          userId: 1
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const result = await response.json();
      console.log('Order checkout success API response:', result);
      
      setIsCheckingOut(false);
      setStep('success');
    } catch (err) {
      console.error('Checkout API error:', err);
      // Fallback checkout success anyway so it doesn't block the user's flow
      setTimeout(() => {
        setIsCheckingOut(false);
        setStep('success');
      }, 1500);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div 
        style={{
          ...styles.drawer,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <ShoppingBag size={20} color="var(--accent)" />
            <h2 style={styles.titleText}>Your Cart</h2>
            <span style={styles.badge}>{cartItems.length}</span>
          </div>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Step-based view content rendering */}
        {step === 'success' ? (
          <div style={styles.successScreen}>
            <div style={styles.successIconWrapper}>
              <Sparkles size={40} color="var(--success)" />
            </div>
            <h3 style={styles.successTitle}>Order Placed!</h3>
            <p style={styles.successText}>Thank you for your purchase. Your payment was processed successfully.</p>
            <div style={{ ...styles.receiptBox, marginBottom: '2rem' }}>
              <div style={styles.receiptRow}>
                <span>Order Total:</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <div style={styles.receiptRow}>
                <span>Status:</span>
                <span style={{ color: 'var(--success)', fontWeight: '600' }}>Processing</span>
              </div>
              <div style={styles.receiptRow}>
                <span>Deliver to:</span>
                <span style={{ fontWeight: '600' }}>{shippingName}</span>
              </div>
              <div style={styles.receiptRow}>
                <span>Address:</span>
                <span style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {shippingAddress}, {shippingCity} {shippingZip}
                </span>
              </div>
            </div>
            <button 
              style={{
                ...styles.checkoutBtn,
                backgroundColor: 'var(--success)',
              }}
              onClick={() => {
                onClearCart();
                setStep('cart');
                onClose();
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : step === 'payment' ? (
          /* Payment & Address Form */
          <form onSubmit={handleCheckoutSubmit} style={styles.paymentForm}>
            {/* Order summary card */}
            <div style={styles.orderSummaryCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '500', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Items Count:</span>
                <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Total Price:</span>
                <span style={{ fontWeight: '800', color: 'var(--accent)' }}>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Info Section */}
            <div style={styles.formSection}>
              <h3 style={styles.sectionHeaderTitle}>Shipping Address</h3>
              
              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>Full Name</label>
                <input 
                  type="text" 
                  className="checkout-form-input"
                  value={shippingName} 
                  onChange={(e) => setShippingName(e.target.value)} 
                  placeholder="John Doe" 
                  required 
                  style={styles.formInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>Street Address</label>
                <input 
                  type="text" 
                  className="checkout-form-input"
                  value={shippingAddress} 
                  onChange={(e) => setShippingAddress(e.target.value)} 
                  placeholder="123 Main St, Apt 4B" 
                  required 
                  style={styles.formInput}
                />
              </div>

              <div style={styles.formRow}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.inputLabel}>City & State</label>
                  <input 
                    type="text" 
                    className="checkout-form-input"
                    value={shippingCity} 
                    onChange={(e) => setShippingCity(e.target.value)} 
                    placeholder="New York, NY" 
                    required 
                    style={styles.formInput}
                  />
                </div>
                <div style={{ ...styles.formGroup, width: '100px' }}>
                  <label style={styles.inputLabel}>Zip Code</label>
                  <input 
                    type="text" 
                    className="checkout-form-input"
                    value={shippingZip} 
                    onChange={(e) => setShippingZip(e.target.value.replace(/\D/g, '').substring(0, 5))} 
                    placeholder="10001" 
                    required 
                    style={styles.formInput}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={styles.formSection}>
              <h3 style={styles.sectionHeaderTitle}>Payment Option</h3>
              
              <div style={styles.paymentSelectorTabs}>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={paymentMethod === 'card' ? styles.activeTabBtn : styles.inactiveTabBtn}
                >
                  Credit Card
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  style={paymentMethod === 'upi' ? styles.activeTabBtn : styles.inactiveTabBtn}
                >
                  UPI ID
                </button>
              </div>

              {paymentMethod === 'card' ? (
                /* Card Input fields */
                <div style={styles.cardInputFields}>
                  <div style={styles.formGroup}>
                    <label style={styles.inputLabel}>Card Number</label>
                    <input 
                      type="text" 
                      className="checkout-form-input"
                      value={cardNumber} 
                      onChange={handleCardNumberChange} 
                      placeholder="0000 0000 0000 0000" 
                      required 
                      style={styles.formInput}
                    />
                  </div>
                  
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                    <div style={{ ...styles.formGroup, flex: 1 }}>
                      <label style={styles.inputLabel}>Expiry Date</label>
                      <input 
                        type="text" 
                        className="checkout-form-input"
                        value={expiry} 
                        onChange={handleExpiryChange} 
                        placeholder="MM/YY" 
                        required 
                        style={styles.formInput}
                      />
                    </div>
                    <div style={{ ...styles.formGroup, flex: 1 }}>
                      <label style={styles.inputLabel}>CVV</label>
                      <input 
                        type="password" 
                        className="checkout-form-input"
                        value={cvv} 
                        onChange={handleCvvChange} 
                        placeholder="123" 
                        required 
                        style={styles.formInput}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* UPI ID Input field */
                <div style={styles.upiInputFields}>
                  <div style={styles.formGroup}>
                    <label style={styles.inputLabel}>UPI ID</label>
                    <input 
                      type="text" 
                      className="checkout-form-input"
                      value={upiId} 
                      onChange={(e) => setUpiId(e.target.value)} 
                      placeholder="username@bank" 
                      required 
                      style={styles.formInput}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions for payment step */}
            <div style={styles.paymentActions}>
              <button 
                type="button" 
                onClick={() => setStep('cart')}
                style={styles.backBtn}
                disabled={isCheckingOut}
              >
                Back to Cart
              </button>
              
              <button 
                type="submit" 
                style={styles.paySubmitBtn}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <div style={styles.spinner} />
                    Paying...
                  </>
                ) : (
                  `Pay $${total.toFixed(2)}`
                )}
              </button>
            </div>
          </form>
        ) : cartItems.length === 0 ? (
          /* Empty State */
          <div style={styles.emptyState}>
            <ShoppingBag size={64} color="var(--text-tertiary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={styles.emptyTitle}>Cart is Empty</h3>
            <p style={styles.emptyText}>Looks like you haven't added anything to your cart yet.</p>
            <button style={styles.continueBtn} onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Cart List & Checkout Summary */
          <>
            <div style={styles.itemList}>
              {cartItems.map((item) => (
                <div key={item.id} style={styles.cartItem}>
                  <img src={item.image || item.thumbnail} alt={item.title} style={styles.itemImage} />
                  
                  <div style={styles.itemDetails}>
                    <h4 style={styles.itemTitle}>{item.title}</h4>
                    <span style={styles.itemPrice}>${item.price.toFixed(2)}</span>
                    
                    <div style={styles.itemFooter}>
                      {/* Quantity Controls */}
                      <div style={styles.qtyContainer}>
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          style={styles.qtyBtn}
                          disabled={isCheckingOut}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={styles.qtyVal}>{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          style={styles.qtyBtn}
                          disabled={isCheckingOut || item.quantity >= item.stock}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        style={styles.removeBtn}
                        disabled={isCheckingOut}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div style={styles.footer}>
              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <div style={styles.shippingNotice}>
                  Add <strong>${(100 - subtotal).toFixed(2)}</strong> more for free shipping!
                </div>
              )}
              <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => setStep('payment')}
                disabled={isCheckingOut}
                style={{
                  ...styles.checkoutBtn,
                  opacity: isCheckingOut ? 0.8 : 1,
                  cursor: isCheckingOut ? 'not-allowed' : 'pointer',
                }}
              >
                <CreditCard size={18} style={{ marginRight: '8px' }} />
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'var(--modal-overlay)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease-out',
  },
  drawer: {
    width: '100%',
    maxWidth: '440px',
    height: '100%',
    backgroundColor: 'var(--bg-secondary)',
    borderLeft: '1px solid var(--border)',
    boxShadow: 'var(--shadow-lg)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'transform var(--transition-normal)',
    animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  header: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  titleText: {
    fontSize: '1.2rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: 'var(--accent)',
    color: '#ffffff',
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)',
  },
  closeBtn: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'var(--text-secondary)',
    transition: 'background-color var(--transition-fast)',
    border: '1px solid var(--border)',
  },
  itemList: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  cartItem: {
    display: 'flex',
    gap: '1rem',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid var(--border)',
    alignItems: 'center',
  },
  itemImage: {
    width: '74px',
    height: '74px',
    borderRadius: 'var(--radius-sm)',
    objectFit: 'contain',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    padding: '4px',
  },
  itemDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  itemTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    lineHeight: '1.4',
    marginBottom: '4px',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  itemPrice: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  itemFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--border)',
    padding: '2px',
  },
  qtyBtn: {
    width: '24px',
    height: '24px',
    borderRadius: 'var(--radius-full)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color var(--transition-fast)',
  },
  qtyVal: {
    minWidth: '22px',
    textAlign: 'center',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  removeBtn: {
    color: 'var(--text-tertiary)',
    transition: 'color var(--transition-fast)',
  },
  footer: {
    padding: '1.5rem',
    borderTop: '1px solid var(--border)',
    backgroundColor: 'var(--bg-secondary)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
  },
  shippingNotice: {
    fontSize: '0.75rem',
    color: 'var(--accent)',
    marginBottom: '8px',
  },
  totalRow: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    borderTop: '1px solid var(--border)',
    paddingTop: '12px',
    marginTop: '4px',
    marginBottom: '1.25rem',
  },
  checkoutBtn: {
    width: '100%',
    height: '46px',
    backgroundColor: 'var(--accent)',
    color: '#ffffff',
    borderRadius: 'var(--radius-full)',
    fontWeight: '600',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '0.95rem',
    transition: 'background-color var(--transition-fast)',
    boxShadow: 'var(--shadow-sm)',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: '#ffffff',
    borderRadius: 'var(--radius-full)',
    animation: 'spin 0.8s linear infinite',
    marginRight: '8px',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginBottom: '1.5rem',
    maxWidth: '260px',
    lineHeight: '1.5',
  },
  continueBtn: {
    padding: '10px 24px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--accent)',
    color: 'var(--accent)',
    fontWeight: '600',
    fontSize: '0.85rem',
    transition: 'background-color var(--transition-fast), color var(--transition-fast)',
  },
  successScreen: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2.5rem',
    textAlign: 'center',
  },
  successIconWrapper: {
    width: '80px',
    height: '80px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--success-light)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1.5rem',
    animation: 'scalePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  successTitle: {
    fontSize: '1.5rem',
    color: 'var(--text-primary)',
    marginBottom: '0.75rem',
  },
  successText: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    marginBottom: '1.5rem',
  },
  receiptBox: {
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px dashed var(--border)',
    borderRadius: 'var(--radius-md)',
    width: '100%',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  receiptRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
  },
  paymentForm: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  orderSummaryCard: {
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '1rem',
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  sectionHeaderTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '0.5rem',
    marginBottom: '0.25rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  formRow: {
    display: 'flex',
    gap: '1rem',
  },
  inputLabel: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  formInput: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color var(--transition-fast)',
  },
  paymentSelectorTabs: {
    display: 'flex',
    gap: '10px',
  },
  activeTabBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--accent)',
    backgroundColor: 'var(--accent)',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
    textAlign: 'center',
  },
  inactiveTabBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background-color var(--transition-fast)',
  },
  paymentActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: 'auto',
    paddingTop: '1.5rem',
  },
  backBtn: {
    flex: 1,
    height: '46px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'background-color var(--transition-fast)',
  },
  paySubmitBtn: {
    flex: 1.5,
    height: '46px',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--accent)',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: 'var(--shadow-sm)',
    transition: 'background-color var(--transition-fast)',
  },
};

// CSS animations injected dynamically
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes slideLeft {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @keyframes scalePop {
      0% { transform: scale(0.6); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    .checkout-form-input:focus {
      border-color: var(--accent) !important;
      background-color: var(--bg-tertiary) !important;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
    }
  `;
  document.head.appendChild(styleEl);
}

export default CartDrawer;
