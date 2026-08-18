import { env } from '../config/env';

const API_BASE_URL = env.apiUrl;

class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    const { cache, ...fetchOptions } = options;

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: 'include',
        cache: cache ?? 'default',
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = data.message
          || (response.status === 413 ? 'Image is too large. Try a smaller photo.' : null)
          || `API Request failed with status ${response.status}`;
        throw new Error(message);
      }

      return data;
    } catch (error) {
      if (endpoint !== '/auth/me') {
        console.error(`❌ API Error [${endpoint}]:`, error.message);
      }
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

  static async verifyEmail(data) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async resendVerificationCode(data) {
    return this.request('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async sendWalletEmail(data) {
    return this.request('/wallet/send-email', {
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
    return this.request('/auth/me', { cache: 'no-store' });
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
      cache: 'no-store',
    });
  }

  static async getAvatarUploadSignature() {
    return this.request('/profiles/avatar-upload-signature', {
      method: 'POST',
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

  static async getAdminStats() {
    return this.request('/admin/stats', { cache: 'no-store' });
  }

  static async getAdminUsers({ page = 1, limit = 20, search = '', status = 'all' } = {}) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    return this.request(`/admin/users?${params.toString()}`, { cache: 'no-store' });
  }

  static async getAdminUser(userId) {
    return this.request(`/admin/users/${encodeURIComponent(userId)}`, { cache: 'no-store' });
  }

  static async getAdminProfiles({ page = 1, limit = 20, search = '' } = {}) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    return this.request(`/admin/profiles?${params.toString()}`, { cache: 'no-store' });
  }

  static async getAdminLinks({ page = 1, limit = 20, search = '', status = 'all' } = {}) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    return this.request(`/admin/links?${params.toString()}`, { cache: 'no-store' });
  }

  static async patchAdminLink(linkId, { isActive, reason }) {
    return this.request(`/admin/links/${encodeURIComponent(linkId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive, reason }),
    });
  }

  static async deleteAdminLink(linkId, { reason }) {
    return this.request(`/admin/links/${encodeURIComponent(linkId)}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason }),
    });
  }

  static async patchAdminProfileSuspension(profileId, { suspended, reason }) {
    return this.request(`/admin/profiles/${encodeURIComponent(profileId)}/suspension`, {
      method: 'PATCH',
      body: JSON.stringify({ suspended, reason }),
    });
  }

  static async getAdminAuditLogs({ page = 1, limit = 20, action = 'all' } = {}) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (action && action !== 'all') params.set('action', action);
    return this.request(`/admin/audit-logs?${params.toString()}`, { cache: 'no-store' });
  }

  static async sendAdminOnboardingReminder(userId) {
    return this.request(`/admin/users/${encodeURIComponent(userId)}/remind-onboarding`, {
      method: 'POST',
    });
  }

  static async sendAdminBulkOnboardingReminders() {
    return this.request('/admin/users/remind-all-onboarding', {
      method: 'POST',
    });
  }
}

export default ApiService;
