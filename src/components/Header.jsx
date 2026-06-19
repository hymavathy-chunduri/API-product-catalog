import React from 'react';
import { Search, ShoppingBag, SlidersHorizontal } from 'lucide-react';

export const Header = ({
  searchQuery,
  onChangeSearchQuery,
  cartCount,
  onOpenCart,
  onToggleFilter,
}) => {
  return (
    <header style={styles.header}>
      <div style={styles.container} className="container">
        {/* Left section: Filter trigger & Branding */}
        <div style={styles.leftSection}>
          <button 
            style={styles.filterBtn} 
            onClick={onToggleFilter}
            aria-label="Open filter sidebar"
          >
            <SlidersHorizontal size={20} color="var(--text-primary)" />
          </button>
          
          <h1 style={styles.title}>Product Catalog</h1>
        </div>

        {/* Center section: Search Bar */}
        <div style={styles.searchSection}>
          <div style={styles.searchWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onChangeSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Right section: Actions */}
        <div style={styles.rightSection}>
          <button 
            style={styles.cartBtn} 
            onClick={onOpenCart}
            aria-label={`Open shopping cart. ${cartCount} items inside.`}
          >
            <ShoppingBag size={22} color="var(--text-primary)" />
            {cartCount > 0 && (
              <span style={styles.cartBadge}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 900,
    backgroundColor: 'var(--bg-secondary-glass, rgba(255, 255, 255, 0.85))',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
    transition: 'background-color var(--transition-normal)',
  },
  container: {
    height: '70px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'background-color var(--transition-fast), border-color var(--transition-fast)',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: 0,
    whiteSpace: 'nowrap',
    letterSpacing: '-0.02em',
    fontFamily: 'var(--font-display)',
  },
  searchSection: {
    flex: 1,
    maxWidth: '480px',
    display: 'flex',
    justifyContent: 'center',
  },
  searchWrapper: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-tertiary)',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '10px 14px 10px 42px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color var(--transition-fast), background-color var(--transition-fast), box-shadow var(--transition-fast)',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
  },
  cartBtn: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '42px',
    height: '42px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'background-color var(--transition-fast), transform var(--transition-fast)',
  },
  cartBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: 'var(--accent)',
    color: '#ffffff',
    fontSize: '0.7rem',
    fontWeight: '700',
    minWidth: '18px',
    height: '18px',
    borderRadius: 'var(--radius-full)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
};

export default Header;
