'use client';
import { useState, useEffect } from 'react';
import { Apple, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export default function SignUp() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state eklendi
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ // Validasyon için errors state'i
    email: '',
    password: ''
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
      />
    </svg>
  );

  const validateForm = () => { // Validasyon fonksiyonu eklendi
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email adresi gerekli';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Geçerli bir email adresi girin';
      isValid = false;
    }

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
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      window.location.href = '/onboarding';
    } catch (error) {
      console.error('Kayıt hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-900 overflow-hidden">
      <div className={`max-w-4xl mx-auto pt-8 px-4 transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        {/* AI Teacher Section ve Stats bölümü aynı kalacak */}
        
        {/* Sign Up Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Müzik Yolculuğuna Başla
            </h1>
            <p className="text-gray-600">
              İlk dersiniz ücretsiz
            </p>
          </div>

          {/* Email Form */}
          {showEmailForm ? (
  <form className="space-y-4 mb-6" onSubmit={handleSubmit}>
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-posta adresiniz"
        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Şifre"
        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>
    <button
      type="submit"
      className="w-full bg-indigo-600 text-white rounded-xl p-4 hover:bg-indigo-700 transition-all flex items-center justify-center"
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"/>
      ) : (
        'Kayıt Ol'
      )}
    </button>
    <button
      type="button"
      onClick={() => setShowEmailForm(false)}
      className="w-full text-gray-500 text-sm hover:text-gray-700"
    >
      Geri Dön
    </button>
  </form>
) : (

            
            <>
              {/* Social Login Buttons */}
              <div className="space-y-4 mb-6">
                <button className="w-full bg-black text-white rounded-xl p-4 flex items-center justify-center gap-3 hover:bg-gray-800 transition-all">
                  <Apple className="w-5 h-5" />
                  Apple ile devam edin
                </button>

                <button className="w-full bg-white border border-gray-300 text-gray-700 rounded-xl p-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all">
                  <GoogleIcon />
                  Google ile devam edin
                </button>

                <button
                  onClick={() => setShowEmailForm(true)}
                  className="w-full bg-gray-100 text-gray-700 rounded-xl p-4 flex items-center justify-center gap-3 hover:bg-gray-200 transition-all"
                >
                  <Mail className="w-5 h-5" />
                  E-posta ile devam edin
                </button>
              </div>
            </>
          )}

          {/* Social Media Links */}
          <div className="border-t pt-6">
            <p className="text-center text-gray-600 mb-4">Bizi takip edin</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-8 text-center text-sm text-gray-500">
            Kaydolarak, <a href="#" className="text-blue-600 hover:underline">Kullanım Koşullarını</a> ve{' '}
            <a href="#" className="text-blue-600 hover:underline">Gizlilik Politikasını</a> kabul etmiş olursunuz.
          </div>
        </div>
      </div>
    </main>
  );
}