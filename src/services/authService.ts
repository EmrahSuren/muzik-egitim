// src/services/authService.ts
interface LoginResponse {
    user: {
      id: string;
      email: string;
      fullName?: string;
    };
    token: string;
  }
  
  export class AuthService {
    private static readonly TOKEN_KEY = 'auth_token';
    private static readonly USER_KEY = 'auth_user';
  
    static async login(email: string, password: string): Promise<LoginResponse> {
      try {
        // TODO: Gerçek API bağlantısı gelecek
        const mockResponse = {
          user: {
            id: Date.now().toString(),
            email,
            fullName: ''
          },
          token: 'mock_token_' + Date.now()
        };
  
        localStorage.setItem(this.TOKEN_KEY, mockResponse.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(mockResponse.user));
  
        return mockResponse;
      } catch (error) {
        throw new Error('Giriş başarısız');
      }
    }
  
    static async register(email: string, password: string, fullName: string): Promise<LoginResponse> {
      try {
        // TODO: Gerçek API bağlantısı gelecek
        const mockResponse = {
          user: {
            id: Date.now().toString(),
            email,
            fullName
          },
          token: 'mock_token_' + Date.now()
        };
  
        localStorage.setItem(this.TOKEN_KEY, mockResponse.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(mockResponse.user));
  
        return mockResponse;
      } catch (error) {
        throw new Error('Kayıt başarısız');
      }
    }
  
    static logout(): void {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  
    static isAuthenticated(): boolean {
      return Boolean(localStorage.getItem(this.TOKEN_KEY));
    }
  
    static getUser() {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
  
    static getToken(): string | null {
      return localStorage.getItem(this.TOKEN_KEY);
    }
  }