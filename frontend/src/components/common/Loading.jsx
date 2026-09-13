const Loading = ({ text = 'Loading...', fullPage = false }) => {
  if (fullPage) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)' }}>
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-3" />
          <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-loading">
      <div className="loading-spinner" />
      <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>{text}</p>
    </div>
  );
};

export default Loading;
