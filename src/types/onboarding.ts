export interface UserProfile {
    id?: string;
    email: string;
    fullName: string;
    instrument: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    lastLoginDate?: string;
    registrationDate?: string;
  }
  
  export type OnboardingStep = 'welcome' | 'email' | 'instrument' | 'level' | 'complete';