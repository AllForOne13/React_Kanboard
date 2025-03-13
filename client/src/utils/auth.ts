import { JwtPayload, jwtDecode } from 'jwt-decode';
 

class AuthService {
  // Decode and return the user's profile from the token
  getProfile(): JwtPayload | null {
    const token = this.getToken();
    if (token) {
      return jwtDecode<JwtPayload>(token); // default `jwtDecode` function
    }
    return null;
  }

  // Check if the user is logged in
  loggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); 
  }
  
  // see if the token has expired
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token); 
      if (decoded && decoded.exp) {
        const currentTime = Date.now() / 1000; 
        return decoded.exp < currentTime; 
      }
      return true; 
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; 
    }
  }

  // Retrieve the token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // store the token in localstorage / redirect to the home page
  login(idToken: string): void {
    localStorage.setItem('token', idToken); // save token
    window.location.assign('/'); 
  }

  // remove token from localstorage/ redirect to the login page
  logout(): void {
    localStorage.removeItem('token'); 
    window.location.assign('/login'); 
  }
}

export default new AuthService();
