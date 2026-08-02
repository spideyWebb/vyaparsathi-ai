export interface User {
  id: string;
  phone: string;
  businessName: string;
  ownerName?: string;
  gstin?: string;
  pan?: string;
  businessType?: string;
  gstRegType?: string;
  languagePref: 'hi' | 'en' | 'hinglish';
  isVerified: boolean;
  whatsappEnabled?: boolean;
  upiAutoReconcile?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}
