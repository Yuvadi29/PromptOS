// app/loading.tsx
export default function Loading() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="loader" />
        <style jsx>{`
          .loader {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #6366f1; /* Indigo */
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1s linear infinite;
          }
  
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  