import { Toaster } from 'react-hot-toast';
import './globals.css'; // Stilleri geri getirmek için

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}