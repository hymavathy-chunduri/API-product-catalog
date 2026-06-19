import React, { useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';

export const ProductCard = ({ product, onViewDetails, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);

  const {
    id,
    title,
    category,
    price,
    rating,
    image
  } = product;

  // Adapt FakeStore schema
  const ratingVal = rating ? rating.rate : 0;
  const ratingCount = rating ? rating.count : 0;
  
  const stock = 99; // All products should be available

  // Helper for rendering rating stars
  const renderStars = (ratingVal) => {
    const stars = [];
    const floor = Math.floor(ratingVal);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<Star key={i} size={14} fill="var(--warning)" color="var(--warning)" />);
      } else if (i - 0.5 <= ratingVal) {
        stars.push(
          <div key={i} style={{ position: 'relative', display: 'inline-block', width: '14px', height: '14px' }}>
            <Star size={14} color="var(--border)" />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden' }}>
              <Star size={14} fill="var(--warning)" color="var(--warning)" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} size={14} color="var(--text-tertiary)" />);
      }
    }
    return stars;
  };

  return (
    <div
      style={{
        ...styles.card,
        transform: isHovered ? 'translateY(-6px)' : 'none',
        boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        borderColor: isHovered ? 'var(--accent)' : 'var(--border)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsCartHovered(false);
      }}
      onClick={() => onViewDetails({ ...product, stock })}
    >
      {/* Badge container */}
      <div style={styles.badgeContainer}>
      </div>

      {/* Image container */}
      <div style={styles.imageWrapper}>
        <img
          src={image}
          alt={title}
          style={{
            ...styles.image,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
          loading="lazy"
        />
      </div>

      {/* Details container */}
      <div style={styles.details}>
        <div style={styles.category}>{category.toUpperCase()}</div>
        <h3 style={styles.title} title={title}>{title}</h3>
        
        {/* Rating row */}
        <div style={styles.ratingRow}>
          <div style={styles.stars}>{renderStars(ratingVal)}</div>
          <span style={styles.ratingNum}>{ratingVal.toFixed(1)} ({ratingCount})</span>
        </div>

        {/* Footer price / action */}
        <div style={styles.footer}>
          <span style={styles.currentPrice}>${price.toFixed(2)}</span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (stock > 0) onAddToCart({ ...product, stock });
            }}
            disabled={stock === 0}
            style={{
              ...styles.cartButton,
              backgroundColor: stock === 0 
                ? 'var(--border)' 
                : isCartHovered 
                  ? 'var(--accent-hover)' 
                  : 'var(--accent)',
              cursor: stock === 0 ? 'not-allowed' : 'pointer',
              transform: isCartHovered ? 'scale(1.05)' : 'scale(1)',
            }}
            onMouseEnter={() => setIsCartHovered(true)}
            onMouseLeave={() => setIsCartHovered(false)}
            aria-label="Add to cart"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '420px',
    cursor: 'pointer',
    position: 'relative',
    transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)',
  },
  badgeContainer: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    zIndex: 2,
  },
  stockBadge: {
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.75rem',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
  },
  imageWrapper: {
    width: '100%',
    height: '210px',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    padding: '1rem',
    borderBottom: '1px solid var(--border)',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    transition: 'transform var(--transition-normal)',
  },

  details: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  category: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: 'var(--accent)',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    lineHeight: '1.45',
    marginBottom: '0.5rem',
    height: '42px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: 'auto',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  ratingNum: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
  },
  currentPrice: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-display)',
  },
  cartButton: {
    padding: '8px 16px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: 'var(--shadow-sm)',
    transition: 'background-color var(--transition-fast), transform var(--transition-fast)',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#ffffff',
    border: 'none',
  },
};

export default ProductCard;
