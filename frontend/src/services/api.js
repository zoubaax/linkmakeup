import { env } from '../config/env';

const API_BASE_URL = env.apiUrl;

class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `API Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`❌ API Error [${endpoint}]:`, error.message);
      throw error;
    }
  }

  // 🏥 System Health Check
  static async checkHealth() {
    return this.request('/health');
  }

  // 🔐 Authentication Endpoints
  static async signupWithEmail(data) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async loginWithEmail(data) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getGoogleAuthUrl() {
    return this.request('/auth/google');
  }

  static async mockLogin() {
    return this.request('/auth/mock-login', {
      method: 'POST',
    });
  }

  static async getCurrentUser() {
    return this.request('/auth/me');
  }

  static async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // 🔍 Profile & Username Onboarding
  static async checkUsernameAvailability(username) {
    return this.request(`/profiles/check-availability?username=${encodeURIComponent(username)}`);
  }

  static async createProfile(profileData) {
    return this.request('/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  static async updateProfile(profileData) {
    return this.request('/profiles/me', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  static async getPublicProfile(username) {
    return this.request(`/profiles/${encodeURIComponent(username)}`);
  }

  // 🔗 Link Management (Protected)
  static async getUserLinks() {
    return this.request('/links');
  }

  static async createLink(linkData) {
    return this.request('/links', {
      method: 'POST',
      body: JSON.stringify(linkData),
    });
  }

  static async updateLink(id, updateData) {
    return this.request(`/links/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  }

  static async deleteLink(id) {
    return this.request(`/links/${id}`, {
      method: 'DELETE',
    });
  }

  static async reorderLinks(linkIds) {
    return this.request('/links/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ linkIds }),
    });
  }
}

export default ApiService;
