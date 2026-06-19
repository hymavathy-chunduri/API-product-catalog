import React from 'react';

const CardSkeleton = () => {
  return (
    <div style={styles.card}>
      <div className="skeleton" style={styles.image} />
      <div style={styles.content}>
        <div className="skeleton" style={styles.category} />
        <div className="skeleton" style={styles.title} />
        <div className="skeleton" style={styles.titleSecondLine} />
        <div style={styles.ratingRow}>
          <div className="skeleton" style={styles.ratingStars} />
          <div className="skeleton" style={styles.ratingText} />
        </div>
        <div style={styles.footer}>
          <div className="skeleton" style={styles.price} />
          <div className="skeleton" style={styles.button} />
        </div>
      </div>
    </div>
  );
};

export const SkeletonLoader = ({ count = 8 }) => {
  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
    width: '100%',
  },
  card: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '420px',
  },
  image: {
    width: '100%',
    height: '200px',
  },
  content: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  category: {
    width: '35%',
    height: '16px',
    borderRadius: 'var(--radius-full)',
    marginBottom: '0.75rem',
  },
  title: {
    width: '90%',
    height: '20px',
    marginBottom: '0.4rem',
  },
  titleSecondLine: {
    width: '60%',
    height: '20px',
    marginBottom: '1rem',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: 'auto',
  },
  ratingStars: {
    width: '80px',
    height: '14px',
  },
  ratingText: {
    width: '30px',
    height: '14px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1.25rem',
  },
  price: {
    width: '70px',
    height: '24px',
  },
  button: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-full)',
  },
};

export default SkeletonLoader;
