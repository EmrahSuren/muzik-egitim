'use client'; // Bu duplicate 'use client' satırını silebiliriz
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthService } from '@/services/authService';
import { ProgressService } from '@/services/progressService';
import { UserService } from '@/services/userService';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        setIsPageLoaded(true);
    }, []);

    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: '', password: '' };

        // Email validasyonu
        if (!email) {
            newErrors.email = 'Email adresi gerekli';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Geçerli bir email adresi girin';
            isValid = false;
        }

        // Şifre validasyonu
        if (!password) {
            newErrors.password = 'Şifre gerekli';
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Şifre en az 6 karakter olmalı';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateForm()) return;
      setIsLoading(true);
  
      try {
          // Giriş işlemi
          const loginResponse = await AuthService.login(email, password);
          
          // Kullanıcı progress'i kontrol et
          let userProgress = ProgressService.getProgress();
          if (!userProgress) {
              userProgress = ProgressService.initializeProgress(loginResponse.user.id);
          }
  
          // Kullanıcı profili kontrol et
          const userProfile = await UserService.getUserProfile(loginResponse.user.id);
  
          // Yönlendirme
          if (!userProfile?.isOnboardingComplete) {
              window.location.href = '/onboarding';
          } else {
              window.location.href = '/dashboard';
          }
  
      } catch (error: any) {
          console.error('Login error:', error);
          setErrors({
              ...errors,
              email: error.message || 'Giriş bilgileri hatalı'
          });
      } finally {
          setIsLoading(false);
      }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
        // Google login implementasyonu gelecek
        console.log('Google login clicked');
    } catch (error) {
        console.error('Google login error:', error);
    } finally {
        setIsLoading(false);
    }
};

const handleAppleLogin = async () => {
    setIsLoading(true);
    try {
        // Apple login implementasyonu gelecek
        console.log('Apple login clicked');
    } catch (error) {
        console.error('Apple login error:', error);
    } finally {
        setIsLoading(false);
    }
};


  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-900 flex items-center justify-center p-4">
  <div className={`bg-white rounded-2xl p-8 shadow-xl max-w-md w-full transform transition-all duration-500 ${
    isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
  }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Hoş Geldiniz</h1>
          <p className="text-gray-600 mt-2">Müzik yolculuğunuza devam edin</p>
        </div>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className={`w-full px-4 py-3 rounded-lg border 
      ${errors.email ? 'border-red-500' : 'border-gray-300'}
      focus:ring-2 focus:ring-indigo-500 focus:border-transparent
      transform transition-all duration-300 
      hover:shadow-md focus:scale-[1.01]
      placeholder:text-gray-400
      bg-gray-50 text-gray-900 font-medium`}
    placeholder="ornek@email.com"
  />
  {errors.email && (
    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
  )}
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className={`w-full px-4 py-3 rounded-lg border 
      ${errors.password ? 'border-red-500' : 'border-gray-300'}
      focus:ring-2 focus:ring-indigo-500 focus:border-transparent
      transform transition-all duration-300 
      hover:shadow-md focus:scale-[1.01]
      placeholder:text-gray-400
      bg-gray-50 text-gray-900 font-medium`}
    placeholder="********"
  />
  {errors.password && (
    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
  )}
</div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-indigo-600" />
              <label className="ml-2 text-sm text-gray-600">Beni hatırla</label>
            </div>
            <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
              Şifremi unuttum
            </Link>
          </div>

          <button
  type="submit"
  className="w-full bg-indigo-600 text-white py-3 rounded-lg 
    hover:bg-indigo-700 transition-all duration-300 
    transform hover:scale-[1.02] hover:shadow-lg
    flex items-center justify-center"
  disabled={isLoading}
>
  {isLoading ? (
    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"/>
  ) : (
    'Giriş Yap'
  )}
</button>
        </form>
        
        {/* Social Login */}
<div className="mt-8">
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gray-300"></div>
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-2 bg-white text-gray-500">veya</span>
    </div>
  </div>

  <div className="mt-6 space-y-4">
  <button 
    onClick={handleAppleLogin}
    disabled={isLoading}
    className="w-full bg-black text-white rounded-lg p-3 
      flex items-center justify-center gap-2 
      transform transition-all duration-300
      hover:bg-gray-800 hover:scale-[1.02] hover:shadow-lg"
  >
    {isLoading ? (
      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"/>
    ) : (
      <>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
        Apple ile devam et
      </>
    )}
  </button>

  <button 
    onClick={handleGoogleLogin}
    disabled={isLoading}
    className="w-full bg-white border border-gray-300 text-gray-700 
      rounded-lg p-3 flex items-center justify-center gap-2 
      transform transition-all duration-300
      hover:bg-gray-50 hover:scale-[1.02] hover:shadow-lg"
  >
    {isLoading ? (
      <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"/>
    ) : (
      <>
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
          <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"/>
          <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
          <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
        </svg>
        Google ile devam et
      </>
    )}
  </button>
 </div>
</div>

        {/* Sign Up Link */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Hesabınız yok mu?{' '}
          <Link href="/signup" className="text-indigo-600 hover:underline font-medium">
            Ücretsiz Başla
          </Link>
        </div>
      </div>
    </main>
  );
}