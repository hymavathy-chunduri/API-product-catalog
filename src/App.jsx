import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SidebarFilters from './components/SidebarFilters';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import SkeletonLoader from './components/SkeletonLoader';
import { AlertCircle, RefreshCw, Info, CheckCircle2 } from 'lucide-react';

function App() {
  // Data Fetching States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Sorting Drawer States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');

  // Shopping Cart State
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Details Modal State
  const [activeProduct, setActiveProduct] = useState(null);

  // Custom Toasts State
  const [toasts, setToasts] = useState([]);

  // Synchronize Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch Products & Categories from DummyJSON API
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch products
      const productsRes = await fetch('https://dummyjson.com/products?limit=100');
      if (!productsRes.ok) throw new Error('Failed to retrieve products from API.');
      const data = await productsRes.json();
      
      const productsData = data.products.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        category: p.category,
        image: p.thumbnail,
        rating: {
          rate: p.rating || 0,
          count: p.reviews ? p.reviews.length : Math.round((p.rating || 4) * 8)
        },
        stock: 99 // all products should be available
      }));
      setProducts(productsData);

      // Fetch categories
      const categoriesRes = await fetch('https://dummyjson.com/products/categories');
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        // DummyJSON categories returns objects with slug, name, url. We map to slugs.
        setCategories(categoriesData.map(c => c.slug) || []);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong while connecting to the catalog server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Toast Trigger Helper
  const triggerToast = (message, type = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Add Item to Cart
  const handleAddToCart = (product, quantityToAdd = 1) => {
    const stock = 99; // All products should be available
    const existing = cartItems.find((item) => item.id === product.id);

    if (existing) {
      const updatedQty = Math.min(stock, existing.quantity + quantityToAdd);
      if (updatedQty === existing.quantity) {
        triggerToast(`Reached stock limit of ${stock} items for this product`, 'info');
        return;
      }
      triggerToast(`Updated quantity of ${product.title} in cart`);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: updatedQty } : item
        )
      );
    } else {
      triggerToast(`Added ${product.title} to cart`);
      setCartItems((prevItems) => [
        ...prevItems,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          thumbnail: product.image,
          stock: stock,
          quantity: quantityToAdd,
        },
      ]);
    }
  };

  // Modify Quantity in Cart Drawer
  const handleUpdateQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove Item from Cart
  const handleRemoveFromCart = (productId) => {
    const item = cartItems.find((t) => t.id === productId);
    if (item) {
      triggerToast(`Removed ${item.title} from cart`, 'info');
    }
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Clear Cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange(2000);
    setMinRating(0);
    setSortBy('featured');
    triggerToast('All filters have been reset', 'info');
  };

  // Filter & Sort Computations
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    const matchesPrice = product.price <= priceRange;

    const ratingVal = product.rating ? product.rating.rate : 0;
    const matchesRating = ratingVal >= minRating;

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    
    const aRating = a.rating ? a.rating.rate : 0;
    const bRating = b.rating ? b.rating.rate : 0;
    if (sortBy === 'rating-desc') return bRating - aRating;
    return 0; // Default Featured (API output sequence)
  });

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={styles.appContainer}>
      {/* Header component */}
      <Header
        searchQuery={searchQuery}
        onChangeSearchQuery={setSearchQuery}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onToggleFilter={() => setIsFilterOpen(true)}
      />

      {/* Main layout container */}
      <main style={styles.mainContainer} className="container">
        {error ? (
          /* Error State UI Banner */
          <div style={styles.errorBanner}>
            <AlertCircle size={40} color="var(--error)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '0.5rem' }}>Failed to Fetch Catalog</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px' }}>{error}</p>
            <button style={styles.retryBtn} onClick={fetchData}>
              <RefreshCw size={16} style={{ marginRight: '8px' }} />
              Retry Fetching
            </button>
          </div>
        ) : (
          <div style={styles.layoutGrid}>
            {/* Products Column */}
            <section style={styles.productsColumn}>
              {/* Results status */}
              <div style={styles.resultsBar}>
                <div style={styles.resultsCount}>
                  {isLoading ? (
                    'Searching catalog...'
                  ) : (
                    <>
                      Found <strong>{sortedProducts.length}</strong> products
                      {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                    </>
                  )}
                </div>
              </div>

              {isLoading ? (
                /* Skeleton cards loader */
                <SkeletonLoader count={8} />
              ) : sortedProducts.length === 0 ? (
                /* Empty state matching criteria */
                <div style={styles.emptyState}>
                  <Info size={48} color="var(--text-tertiary)" style={{ marginBottom: '1.25rem' }} />
                  <h3>No Products Match Filters</h3>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '340px' }}>
                    Try adjusting your search criteria, widening the price range slider, or changing categories.
                  </p>
                  <button style={styles.resetFiltersBtn} onClick={handleResetFilters}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                /* Rendered products grid (Home page shows all products in grid order) */
                <div className="products-grid">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={setActiveProduct}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Footer component */}
      <footer style={styles.appFooter}>
        <div className="container" style={styles.footerContainer}>
          <p>© 2026 Product Catalog. All rights reserved.</p>
          <div style={styles.footerLinks}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>API Docs</span>
          </div>
        </div>
      </footer>

      {/* Filter Sidebar Drawer */}
      <SidebarFilters
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setIsFilterOpen(false); // Auto close left drawer on selecting category
        }}
        priceRange={priceRange}
        onChangePriceRange={setPriceRange}
        minRating={minRating}
        onChangeMinRating={setMinRating}
        sortBy={sortBy}
        onChangeSortBy={(sort) => {
          setSortBy(sort);
          setIsFilterOpen(false); // Auto close left drawer on selecting sort option
        }}
        onResetFilters={handleResetFilters}
      />

      {/* Detail Modal Overlay */}
      {activeProduct && (
        <ProductDetailModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Drawer Slide Out */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Toast Alert Notifications Popups */}
      <div style={styles.toastContainer}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              ...styles.toast,
              borderLeftColor:
                toast.type === 'error'
                  ? 'var(--error)'
                  : toast.type === 'info'
                  ? 'var(--warning)'
                  : 'var(--success)',
            }}
          >
            <CheckCircle2
              size={18}
              color={
                toast.type === 'error'
                  ? 'var(--error)'
                  : toast.type === 'info'
                  ? 'var(--warning)'
                  : 'var(--success)'
              }
              style={{ marginRight: '8px', flexShrink: 0 }}
            />
            <span style={styles.toastText}>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  mainContainer: {
    flex: 1,
    paddingTop: '2.5rem',
    paddingBottom: '4rem',
  },
  layoutGrid: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  productsColumn: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  resultsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '1rem',
  },
  resultsCount: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5rem 2rem',
    textAlign: 'center',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border)',
  },
  resetFiltersBtn: {
    marginTop: '1.5rem',
    backgroundColor: 'var(--accent)',
    color: '#ffffff',
    padding: '10px 24px',
    borderRadius: 'var(--radius-full)',
    fontWeight: '600',
    fontSize: '0.9rem',
    boxShadow: 'var(--shadow-sm)',
    transition: 'background-color var(--transition-fast)',
  },
  errorBanner: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4rem 2rem',
    textAlign: 'center',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border)',
    margin: '2rem auto',
    maxWidth: '600px',
    boxShadow: 'var(--shadow-md)',
  },
  retryBtn: {
    backgroundColor: 'var(--accent)',
    color: '#ffffff',
    padding: '10px 24px',
    borderRadius: 'var(--radius-full)',
    fontWeight: '600',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    boxShadow: 'var(--shadow-sm)',
  },
  appFooter: {
    backgroundColor: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border)',
    padding: '2rem 0',
    marginTop: 'auto',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  footerLinks: {
    display: 'flex',
    gap: '12px',
    color: 'var(--text-tertiary)',
  },
  toastContainer: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 9999,
  },
  toast: {
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    padding: '12px 20px',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    borderLeft: '4px solid transparent',
    display: 'flex',
    alignItems: 'center',
    animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    fontSize: '0.9rem',
    fontWeight: '500',
    maxWidth: '320px',
  },
  toastText: {
    lineHeight: '1.4',
  },
};

// Add App global responsive and keyframe styles
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes toastSlideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(styleEl);
}

export default App;
