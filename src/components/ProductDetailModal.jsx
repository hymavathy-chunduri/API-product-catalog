import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingCart, Truck, ShieldCheck, RefreshCw, Box } from 'lucide-react';

export const ProductDetailModal = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' or 'reviews'

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const {
    id,
    title,
    description,
    category,
    price,
    rating,
    image,
    stock = 99
  } = product;

  // Adapt FakeStore schema
  const ratingVal = rating ? rating.rate : 0;
  const ratingCount = rating ? rating.count : 0;

  // Generate realistic mock details for a premium look
  const sku = `FS-${id}-${category.slice(0, 3).toUpperCase()}`;
  const dimensionsText = category.includes('clothing') ? 'Fits True to Size' : 'Standard Dimensions';
  const shippingInfo = price > 100 ? 'Free Express Delivery' : 'Standard Delivery ($4.99)';
  const warrantyInfo = category.includes('electronics') ? '2 Years manufacturer warranty' : '1 Year domestic warranty';
  const returnPolicyText = '7 Days replacement policy';
  
  const mockReviews = [
    {
      reviewerName: 'Aarav Mehta',
      comment: 'Superb quality. Exceeded my expectations. Packaging was great too!',
      rating: Math.min(5, Math.ceil(ratingVal)),
      date: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      reviewerName: 'Neha Sharma',
      comment: 'Good product for daily use. Recommended.',
      rating: Math.max(1, Math.floor(ratingVal)),
      date: new Date(Date.now() - 12 * 86400000).toISOString()
    }
  ];

  const renderStars = (val) => {
    const stars = [];
    const floor = Math.floor(val);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<Star key={i} size={16} fill="var(--warning)" color="var(--warning)" />);
      } else if (i - 0.5 <= val) {
        stars.push(
          <div key={i} style={{ position: 'relative', display: 'inline-block', width: '16px', height: '16px' }}>
            <Star size={16} color="var(--border)" />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden' }}>
              <Star size={16} fill="var(--warning)" color="var(--warning)" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} size={16} color="var(--text-tertiary)" />);
      }
    }
    return stars;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAddToCart = () => {
    if (stock > 0) {
      onAddToCart(product, quantity);
      onClose();
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button style={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div style={styles.grid}>
          {/* Left Column: Image Section */}
          <div style={styles.mediaSection}>
            <div style={styles.mainImageWrapper}>
              <img src={image} alt={title} style={styles.mainImage} />
            </div>
          </div>

          {/* Right Column: Information Section */}
          <div style={styles.infoSection}>
            <span style={styles.categoryBadge}>{category.toUpperCase()}</span>
            <h2 style={styles.productTitle}>{title}</h2>

            {/* Rating */}
            <div style={styles.ratingContainer}>
              <div style={styles.stars}>{renderStars(ratingVal)}</div>
              <span style={styles.ratingVal}>{ratingVal.toFixed(1)}</span>
              <span style={styles.dot}>•</span>
              <span style={styles.reviewCount}>{ratingCount} ratings</span>
            </div>

            {/* Pricing Section */}
            <div style={styles.priceRow}>
              <span style={styles.priceVal}>${price.toFixed(2)}</span>
            </div>

            <p style={styles.description}>{description}</p>

            {/* Tabs Selector */}
            <div style={styles.tabsHeader}>
              <button
                onClick={() => setActiveTab('specs')}
                style={{
                  ...styles.tabLink,
                  color: activeTab === 'specs' ? 'var(--accent)' : 'var(--text-secondary)',
                  borderBottomColor: activeTab === 'specs' ? 'var(--accent)' : 'transparent',
                }}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                style={{
                  ...styles.tabLink,
                  color: activeTab === 'reviews' ? 'var(--accent)' : 'var(--text-secondary)',
                  borderBottomColor: activeTab === 'reviews' ? 'var(--accent)' : 'transparent',
                }}
              >
                Reviews ({mockReviews.length})
              </button>
            </div>

            {/* Tabs Content */}
            <div style={styles.tabContent}>
              {activeTab === 'specs' ? (
                <div style={styles.specsGrid}>
                  <div style={styles.specItem}>
                    <Box size={16} color="var(--accent)" />
                    <div>
                      <div style={styles.specLabel}>SKU / Dimensions</div>
                      <div style={styles.specValue}>{sku} • {dimensionsText}</div>
                    </div>
                  </div>
                  <div style={styles.specItem}>
                    <Truck size={16} color="var(--accent)" />
                    <div>
                      <div style={styles.specLabel}>Shipping Information</div>
                      <div style={styles.specValue}>{shippingInfo}</div>
                    </div>
                  </div>
                  <div style={styles.specItem}>
                    <ShieldCheck size={16} color="var(--accent)" />
                    <div>
                      <div style={styles.specLabel}>Warranty Details</div>
                      <div style={styles.specValue}>{warrantyInfo}</div>
                    </div>
                  </div>
                  <div style={styles.specItem}>
                    <RefreshCw size={16} color="var(--accent)" />
                    <div>
                      <div style={styles.specLabel}>Return Policy</div>
                      <div style={styles.specValue}>{returnPolicyText}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={styles.reviewsList}>
                  {mockReviews.map((rev, index) => (
                    <div key={index} style={styles.reviewCard}>
                      <div style={styles.reviewHeader}>
                        <div style={styles.reviewerAvatar}>
                          {getInitials(rev.reviewerName)}
                        </div>
                        <div>
                          <div style={styles.reviewerName}>{rev.reviewerName}</div>
                          <div style={styles.reviewDate}>
                            {new Date(rev.date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                        <div style={styles.reviewStars}>{renderStars(rev.rating)}</div>
                      </div>
                      <p style={styles.reviewComment}>"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buy/Cart Section */}
            <div style={styles.purchaseSection}>
              {stock > 0 ? (
                <>
                  <div style={styles.quantityWidget}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={styles.qtyBtn}
                    >
                      -
                    </button>
                    <span style={styles.qtyVal}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                      style={styles.qtyBtn}
                      disabled={quantity >= stock}
                    >
                      +
                    </button>
                  </div>

                  <button onClick={handleAddToCart} style={styles.buyBtn}>
                    Add to Cart
                  </button>
                </>
              ) : (
                <button style={styles.soldOutBtn} disabled>
                  Out of Stock
                </button>
              )}


            </div>
          </div>
        </div>
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
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.25s ease-out',
    padding: '2rem 1rem',
  },
  modal: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-lg)',
    width: '100%',
    maxWidth: '920px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--bg-tertiary)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color var(--transition-fast), color var(--transition-fast)',
    zIndex: 10,
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(320px, 1fr) 1.2fr',
    gap: '2.5rem',
    padding: '2.5rem',
  },
  mediaSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  mainImageWrapper: {
    width: '100%',
    height: '360px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1.5rem',
    overflow: 'hidden',
    border: '1px solid var(--border)',
  },
  mainImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  categoryBadge: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--accent)',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
  },
  productTitle: {
    fontSize: '1.6rem',
    color: 'var(--text-primary)',
    lineHeight: '1.3',
    marginBottom: '0.75rem',
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.25rem',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  ratingVal: {
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  dot: {
    color: 'var(--text-tertiary)',
  },
  reviewCount: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.25rem',
  },
  priceVal: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-display)',
  },
  description: {
    fontSize: '0.92rem',
    lineHeight: '1.65',
    color: 'var(--text-secondary)',
    marginBottom: '1.5rem',
  },
  tabsHeader: {
    display: 'flex',
    borderBottom: '1px solid var(--border)',
    marginBottom: '1rem',
  },
  tabLink: {
    padding: '10px 16px',
    fontSize: '0.9rem',
    fontWeight: '600',
    borderBottom: '2px solid transparent',
    transition: 'color var(--transition-fast), border-bottom-color var(--transition-fast)',
    marginRight: '8px',
  },
  tabContent: {
    minHeight: '140px',
    marginBottom: '1.5rem',
  },
  specsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  specItem: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start',
    padding: '10px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--bg-tertiary)',
  },
  specLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    fontWeight: '600',
  },
  specValue: {
    fontSize: '0.82rem',
    color: 'var(--text-primary)',
    fontWeight: '500',
    marginTop: '2px',
    lineHeight: '1.3',
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxHeight: '220px',
    overflowY: 'auto',
    paddingRight: '6px',
  },
  reviewCard: {
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
  },
  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  reviewerAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--accent-light)',
    color: 'var(--accent)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '700',
    fontSize: '0.85rem',
  },
  reviewerName: {
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  reviewDate: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
  },
  reviewStars: {
    marginLeft: 'auto',
    display: 'flex',
    gap: '1px',
  },
  reviewComment: {
    fontSize: '0.85rem',
    fontStyle: 'italic',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  purchaseSection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    alignItems: 'center',
    borderTop: '1px solid var(--border)',
    paddingTop: '1.5rem',
    marginTop: 'auto',
  },
  quantityWidget: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--border)',
    padding: '2px',
  },
  qtyBtn: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.2rem',
    fontWeight: '600',
  },
  qtyVal: {
    minWidth: '28px',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '0.95rem',
  },
  buyBtn: {
    flex: 1,
    minWidth: '150px',
    backgroundColor: 'var(--accent)',
    color: '#ffffff',
    height: '42px',
    borderRadius: 'var(--radius-full)',
    fontWeight: '600',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: 'var(--shadow-sm)',
    transition: 'background-color var(--transition-fast)',
  },
  soldOutBtn: {
    flex: 1,
    minWidth: '150px',
    backgroundColor: 'var(--border)',
    color: 'var(--text-tertiary)',
    height: '42px',
    borderRadius: 'var(--radius-full)',
    fontWeight: '600',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'not-allowed',
  },
  stockStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    marginTop: '0.5rem',
  },
  statusIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: 'var(--radius-full)',
  },
  statusText: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
};

export default ProductDetailModal;
