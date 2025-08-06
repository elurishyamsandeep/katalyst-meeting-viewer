import { User } from '../../types/auth';

export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/calendar.readonly'
];

export const decodeGoogleJWT = (credential: string): any => {
  const base64Url = credential.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  
  return JSON.parse(jsonPayload);
};

export const createUserFromGoogleResponse = (userInfo: any, accessToken: string): User => {
  return {
    email: userInfo.email,
    name: userInfo.name,
    picture: userInfo.picture?.split('=')[0] || userInfo.picture, // Remove size parameters
    accessToken: accessToken
  };
};

export const storeUserCredentials = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('google_access_token', user.accessToken);
    localStorage.setItem('user_info', JSON.stringify(user));
  }
};

export const clearUserCredentials = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('user_info');
  }
};
