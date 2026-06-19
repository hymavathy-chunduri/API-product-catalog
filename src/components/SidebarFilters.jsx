import React, { useEffect } from 'react';
import { X, SlidersHorizontal, RotateCcw, ChevronDown, Award } from 'lucide-react';

export const SidebarFilters = ({
  isOpen,
  onClose,
  categories = [],
  selectedCategory,
  onSelectCategory,
  priceRange,
  onChangePriceRange,
  minRating,
  onChangeMinRating,
  sortBy,
  onChangeSortBy,
  onResetFilters,
}) => {
  // Lock body scroll when filters drawer is open
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

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={{
          ...styles.drawer,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.titleGroup}>
            <SlidersHorizontal size={18} color="var(--accent)" />
            <h3 style={styles.headerTitle}>Filters</h3>
          </div>
          
          <div style={styles.actions}>
            <button style={styles.resetBtn} onClick={onResetFilters} aria-label="Reset all filters">
              <RotateCcw size={14} style={{ marginRight: '4px' }} />
              Reset
            </button>
            <button style={styles.closeBtn} onClick={onClose} aria-label="Close filters">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Sorting widget */}
          <div style={styles.filterSection}>
            <label style={styles.sectionLabel}>Sort By</label>
            <div style={styles.selectWrapper}>
              <select
                value={sortBy}
                onChange={(e) => onChangeSortBy(e.target.value)}
                style={styles.select}
              >
                <option value="featured">Featured (Default)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Customer Rating</option>
              </select>
              <ChevronDown size={16} style={styles.selectIcon} />
            </div>
          </div>

          {/* Categories widget */}
          <div style={styles.filterSection}>
            <label style={styles.sectionLabel}>Category</label>
            <div style={styles.selectWrapper}>
              <select
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value)}
                style={styles.select}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => {
                  const name = typeof cat === 'object' ? cat.name : cat;
                  const slug = typeof cat === 'object' ? cat.slug : cat;
                  return (
                    <option key={slug} value={slug}>
                      {name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')}
                    </option>
                  );
                })}
              </select>
              <ChevronDown size={16} style={styles.selectIcon} />
            </div>
          </div>

          {/* Price filter widget */}
          <div style={styles.filterSection}>
            <div style={styles.sectionHeader}>
              <label style={styles.sectionLabel}>Max Price</label>
              <span style={styles.rangeVal}>${priceRange}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="20"
              value={priceRange}
              onChange={(e) => onChangePriceRange(Number(e.target.value))}
              style={styles.rangeInput}
            />
            <div style={styles.rangeBounds}>
              <span>$0</span>
              <span>$2000</span>
            </div>
          </div>

          {/* Rating filter widget */}
          <div style={styles.filterSection}>
            <label style={styles.sectionLabel}>Minimum Rating</label>
            <div style={styles.ratingGrid}>
              {[0, 3, 4, 4.5].map((ratingVal) => (
                <button
                  key={ratingVal}
                  onClick={() => onChangeMinRating(ratingVal)}
                  style={{
                    ...styles.ratingBtn,
                    backgroundColor: minRating === ratingVal ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                    borderColor: minRating === ratingVal ? 'var(--accent)' : 'var(--border)',
                    color: minRating === ratingVal ? 'var(--accent)' : 'var(--text-primary)',
                  }}
                >
                  {ratingVal === 0 ? (
                    'Any Rating'
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{ratingVal}+</span>
                      <Award size={14} fill={minRating === ratingVal ? 'var(--accent)' : 'none'} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button style={styles.viewBtn} onClick={onClose}>
            View Products
          </button>
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
    justifyContent: 'flex-start',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease-out',
  },
  drawer: {
    width: '100%',
    maxWidth: '380px',
    height: '100%',
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border)',
    boxShadow: 'var(--shadow-lg)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'transform var(--transition-normal)',
    animation: 'slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  header: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  headerTitle: {
    fontSize: '1.15rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  resetBtn: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
  },
  closeBtn: {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-full)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-tertiary)',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  sectionLabel: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  rangeVal: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--accent)',
    fontFamily: 'var(--font-display)',
  },
  selectWrapper: {
    position: 'relative',
    width: '100%',
  },
  select: {
    width: '100%',
    height: '42px',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '0 2.5rem 0 1rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
    transition: 'border-color var(--transition-fast)',
  },
  selectIcon: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-tertiary)',
    pointerEvents: 'none',
  },
  rangeInput: {
    width: '100%',
    height: '6px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--border)',
    outline: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
    accentColor: 'var(--accent)',
  },
  rangeBounds: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    fontWeight: '500',
  },
  ratingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  ratingBtn: {
    height: '38px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
    fontSize: '0.85rem',
    fontWeight: '600',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  footer: {
    padding: '1.25rem 1.5rem',
    borderTop: '1px solid var(--border)',
    backgroundColor: 'var(--bg-secondary)',
  },
  viewBtn: {
    width: '100%',
    height: '44px',
    backgroundColor: 'var(--accent)',
    color: '#ffffff',
    borderRadius: 'var(--radius-full)',
    fontWeight: '600',
    fontSize: '0.95rem',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default SidebarFilters;
