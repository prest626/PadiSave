// src/services/api.js

// For Android Emulator, use 10.0.2.2. For iOS Simulator, use localhost.
// Once deployed, you will replace this with your https://api-padisave.azurewebsites.net
const API_URL = 'http://localhost:7071/api'; 

export const fetchUserData = async (userId) => {
  try {
    if (!userId) throw new Error("No User ID provided to API"); // Safety check

    console.log(`Fetching data for User ID: ${userId}`); // Debug log

    const response = await fetch(`${API_URL}/GetUserData?userId=${userId}`);
    
    if (!response.ok) throw new Error('Failed to fetch user data');
    
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 401) {
      return { success: false, error: "Invalid email or password" };
    }
    
    if (!response.ok) {
        throw new Error('Login failed');
    }

    const data = await response.json();
    return { success: true, user: data }; // Returns user ID and Name
    
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, error: "Network error. Is the backend running?" };
  }
};

export const signupUser = async (fullName, email, password) => {
  try {
    const response = await fetch(`${API_URL}/Signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await response.json();

    if (response.status === 409) {
      return { success: false, error: "This email is already registered." };
    }

    if (!response.ok) {
      throw new Error(data || 'Signup failed');
    }

    return { success: true, user: data }; 

  } catch (error) {
    console.error("Signup Error:", error);
    return { success: false, error: "Network error. Is the backend running?" };
  }
};

export const createCircle = async (userId, name, amount, frequency) => {
  try {
    const response = await fetch(`${API_URL}/CreateCircle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name, amount, frequency }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data || 'Failed to create circle');

    return { success: true, circle: data };
  } catch (error) {
    console.error("Create Circle Error:", error);
    return { success: false, error: "Network error" };
  }
};