import { Toaster } from 'react-hot-toast';
import './globals.css';
import { LessonProvider } from '@/contexts/LessonContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <LessonProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
            }}
          />
        </LessonProvider>
      </body>
    </html>
  );
}