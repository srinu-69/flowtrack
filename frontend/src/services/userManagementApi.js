const API_URL = "http://localhost:8000";

// Create or update user profile in users_management table
export async function saveUserProfile(profileData) {
  try {
    // First check if user already exists
    const checkResponse = await fetch(
      `${API_URL}/users-management/email/${encodeURIComponent(profileData.email)}`
    );
    
    if (checkResponse.ok) {
      // User exists, update them
      const existingUser = await checkResponse.json();
      const response = await fetch(
        `${API_URL}/users-management/${existingUser.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileData),
        }
      );
      if (!response.ok) throw new Error('Failed to update user profile');
      return await response.json();
    } else {
      // User doesn't exist, create new
      const response = await fetch(`${API_URL}/users-management`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) throw new Error('Failed to create user profile');
      return await response.json();
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
}

// Get user profile by email
export async function getUserProfile(email) {
  try {
    const response = await fetch(
      `${API_URL}/users-management/email/${encodeURIComponent(email)}`
    );
    if (!response.ok) {
      if (response.status === 404) {
        return null; // User not found - this is normal for new users
      }
      throw new Error('Failed to fetch user profile');
    }
    return await response.json();
  } catch (error) {
    // If it's a network error or the fetch itself failed
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      console.log('Network error fetching profile (server may be starting):', error.message);
      return null; // Return null instead of throwing for network errors
    }
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

// Get all users (for admin viewing)
export async function getAllUsers() {
  try {
    const response = await fetch(`${API_URL}/users-management`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}

