import { ConfigValue } from '@/config';
import Cookies from 'js-cookie';

export const AUTH_TOKEN_KEY = 'authToken'; //ConfigValue.AUTH_TOKEN_KEY;

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
};

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}
export function checkHasAuthToken() {
  if (typeof window !== 'undefined') {
    console.log('Hi');
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return false;
    return true;
  }
}
