export interface User {
  [prop: string]: any;

  id?: number | string | null;
  name?: string;
  email?: string;
  avatar?: string;
  roles?: any[];
  permissions?: any[];
  role?: string;
  gym?: GymInfo;
}

export interface GymInfo {
  _id: string;
  gymId: string;
  name: string;
  city: string;
  state: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  userId: string;
  gymId: string;
  gymData: GymInfo;
  userEmail: string;
  userRole: string;
}

export interface Token {
  [prop: string]: any;

  access_token: string;
  token_type?: string;
  expires_in?: number;
  exp?: number;
  refresh_token?: string;
}

export interface GymOwnerLoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    gym: GymInfo;
  };
}
