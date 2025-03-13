import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin): Promise<{ token: string } | null> => {
  try {
    // Make a POST request to the login endpoint
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    // is response successful?
    if (response.ok) {
      const data = await response.json(); // Extract the JSON data from the response
      return data; // should include the token 
    } else {
      console.error('Login failed:', await response.json());
      return null;
    }
  } catch (error) {
    console.error('Error occurred during login:', error);
    return null;
  }
};

export { login };
