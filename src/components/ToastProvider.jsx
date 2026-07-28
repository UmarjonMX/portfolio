import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      gutter={12}
      toastOptions={{
        duration: 3000,
        style: {
          background: 'rgba(28, 28, 29, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: '#FAFAFA',
          borderRadius: '14px',
          border: '1px solid rgba(250, 250, 250, 0.08)',
          padding: '14px 20px',
          fontSize: '14px',
          fontFamily: '"Host Grotesk", sans-serif',
          fontWeight: 600,
          letterSpacing: '0.01em',
          boxShadow: '0 8px 32px -8px rgba(0,0,0,0.5), 0 0 0 1px rgba(224,122,95,0.08)',
        },
        success: {
          iconTheme: {
            primary: '#E07A5F',
            secondary: '#FAFAFA',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#FAFAFA',
          },
        },
      }}
    />
  );
}
