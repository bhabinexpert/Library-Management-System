const LoadingSpinner = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      {/* Triple-ring spinner */}
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        {/* Outer ring - slow pulse */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: '6px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '50%',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}></div>
        
        {/* Middle ring - rotation */}
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
          border: '6px solid transparent',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1.2s linear infinite'
        }}></div>
        
        {/* Inner ring - fast rotation */}
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          right: 20,
          bottom: 20,
          border: '6px solid transparent',
          borderBottomColor: '#60a5fa',
          borderRadius: '50%',
          animation: 'spinReverse 0.8s linear infinite'
        }}></div>
        
        {/* Center dot */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 12,
          height: 12,
          backgroundColor: '#3b82f6',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)'
        }}></div>
      </div>
      
      {/* Loading text */}
      <p style={{
        marginTop: 24,
        fontSize: 18,
        fontWeight: 500,
        color: '#334155',
        animation: 'textPulse 1.5s ease-in-out infinite'
      }}>
        Loading your dashboard...
      </p>
      
      {/* Embedded animations */}
      <style>
        {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.7; }
        }
        @keyframes textPulse {
          0%, 100% { opacity: 1; transform: translateY(0); }
          50% { opacity: 0.6; transform: translateY(3px); }
        }
        `}
      </style>
    </div>
  );
};
export default LoadingSpinner;